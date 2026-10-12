import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createRequire } from 'node:module';
// Compile isolated TS domain modules with the same TS compiler as the build.
// No browser, network or provider calls are made by this test command.
const root=process.cwd();const cache=new Map();const nodeRequire=createRequire(import.meta.url);
function load(relative){const file=path.resolve(root,relative);if(cache.has(file))return cache.get(file);const source=fs.readFileSync(file,'utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};const req=id=>id.startsWith('@/')?load(id.slice(2)+'.ts'):id.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),id))+'.ts'):nodeRequire(id);new Function('require','module','exports',code)(req,module,module.exports);cache.set(file,module.exports);return module.exports;}
const bag=load('lib/bag-rules.ts');const fitting=load('lib/fitting-room.ts');const{DEMO_PRODUCTS:catalog}=load('data/products.ts');
let passed=0;function test(name,fn){fn();passed++;console.log('PASS '+name);}
const p=catalog[0],color=p.colors[0],size=p.sizes[0];
const row=(quantity=1)=>({product:p,selectedColor:color,selectedSize:size,quantity});
test('rejects corrupted/non-array bag',()=>{assert.deepEqual(bag.normalizeBag({price:1},catalog),[]);assert.deepEqual(bag.normalizeBag([null,1,{},'x'],catalog),[]);});
test('restores catalog price and image after storage tampering',()=>{const value=row();value.product={...p,price:0.01,image:'https://evil.invalid/pixel'};const normalized=bag.normalizeBag([value],catalog)[0];assert.equal(normalized.product.price,p.price);assert.equal(normalized.product.image,p.image);});
test('rejects unknown product/color/size',()=>{assert.equal(bag.normalizeBag([{...row(),product:{id:'unknown'}},{...row(),selectedSize:'bad'},{...row(),selectedColor:{nameEn:'fake'}}],catalog).length,0);});
test('clamps and merges repeated variants at 20',()=>{const out=bag.normalizeBag([row(12),row(19)],catalog);assert.equal(out.length,1);assert.equal(out[0].quantity,20);});
test('rejects invalid numeric quantities',()=>{assert.equal(bag.normalizeBag([row(NaN),row(Infinity),row(-3),row('2')],catalog).length,0);});
test('bulk add preserves distinct selections and latest state',()=>{const selections=catalog.slice(0,5).map(product=>({product,color:product.colors[0],size:product.sizes[0]}));let values=bag.addSelections([],selections,catalog);assert.equal(values.length,5);values=bag.addSelections(values,[selections[0]],catalog);assert.equal(values[0].quantity,2);});
test('variant edit validates and merges rather than duplicating',()=>{const second=p.sizes[1];let items=bag.normalizeBag([row(),{...row(2),selectedSize:second}],catalog);items=bag.changeVariant(items,items[0].id,color.nameEn,second,catalog);assert.equal(items.length,1);assert.equal(items[0].quantity,3);});
test('all local masks resolve real products and bounded polygons',()=>{for(const mask of fitting.LOCAL_GARMENTS){assert.ok(catalog.some(p=>p.id===mask.productId));assert.ok(mask.outline.length>=8);for(const point of mask.outline)assert.ok(point.every(v=>v>=0&&v<=1));}});
test('shoulder calibration handles reversed points',()=>{const first={x:.3,y:.3},second={x:.65,y:.31};assert.deepEqual(fitting.calibrateShoulders(first,second),fitting.calibrateShoulders(second,first));assert.equal(fitting.calibrateShoulders(first,first),null);});
test('photo limits reject SVG and oversized files',()=>{assert.equal(fitting.photoValidation({type:'image/svg+xml',size:1000}),'format');assert.equal(fitting.photoValidation({type:'image/jpeg',size:9*1024*1024}),'size');assert.equal(fitting.photoValidation({type:'image/png',size:3000}),null);});
test('initial AI catalog excludes kids and accessories',()=>{for(const p of catalog.filter(p=>p.department==='kids'||p.categoryKey==='accessories'||p.categoryKey==='shoes'))assert.equal(fitting.aiEligible(p),false);});
test('try-on stays opt-in with fixed provider sample/moderation',()=>{const api=fs.readFileSync('app/api/try-on/route.ts','utf8');assert.ok(api.includes("TRYON_AI_ENABLED==='true'"));assert.ok(api.includes("moderation_level:'conservative'"));assert.ok(api.includes('num_samples:1'));assert.ok(api.includes('reserve_tryon_attempt'));assert.ok(api.includes('timingSafeEqual'));});
test('no photo persistence in fitting runtime',()=>{for(const file of ['components/fitting/FittingRoom.tsx','lib/fitting-image.ts','app/api/try-on/route.ts']){const content=fs.readFileSync(file,'utf8');assert.ok(!/(localStorage|sessionStorage)\.setItem/.test(content));assert.ok(!/console\.(log|error|debug)/.test(content));}});
console.log('\n'+passed+' fitting-room and commerce checks passed.');
