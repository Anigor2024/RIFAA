import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Starting Media & Saudi Identity Integrity Check...');

const errors = [];

// 1. Read data/products.ts
const productsFile = fs.readFileSync(path.join(rootDir, 'data/products.ts'), 'utf-8');
const storiesFile = fs.readFileSync(path.join(rootDir, 'data/stories.ts'), 'utf-8');
const mediaFile = fs.readFileSync(path.join(rootDir, 'data/media.ts'), 'utf-8');

// Parse products using regex
const productBlocks = productsFile.split(/\{\s*id:\s*['"]([wmk]-\d+)['"]/g);
// productBlocks will alternate: [preamble, id, body, id, body, ...]
const parsedProducts = [];

for (let i = 1; i < productBlocks.length; i += 2) {
  const id = productBlocks[i];
  const block = productBlocks[i + 1];

  const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
  const deptMatch = block.match(/department:\s*['"]([^'"]+)['"]/);
  const imageMatch = block.match(/image:\s*['"]([^'"]+)['"]/);
  const nameEnMatch = block.match(/nameEn:\s*['"]([^'"]+)['"]/);

  parsedProducts.push({
    id,
    slug: slugMatch ? slugMatch[1] : null,
    department: deptMatch ? deptMatch[1] : null,
    image: imageMatch ? imageMatch[1] : null,
    nameEn: nameEnMatch ? nameEnMatch[1] : null,
  });
}

console.log(`📦 Found ${parsedProducts.length} products parsed.`);

// Check product count is 36
if (parsedProducts.length !== 36) {
  errors.push(`Expected 36 products, but found ${parsedProducts.length}`);
}

const womenCount = parsedProducts.filter((p) => p.department === 'women').length;
const menCount = parsedProducts.filter((p) => p.department === 'men').length;
const kidsCount = parsedProducts.filter((p) => p.department === 'kids').length;

if (womenCount !== 12) errors.push(`Expected 12 Women products, found ${womenCount}`);
if (menCount !== 12) errors.push(`Expected 12 Men products, found ${menCount}`);
if (kidsCount !== 12) errors.push(`Expected 12 Kids products, found ${kidsCount}`);

const seenImages = new Map();

for (const p of parsedProducts) {
  if (!p.image) {
    errors.push(`Product ${p.id} (${p.slug}) has no primary image!`);
    continue;
  }

  // Check remote image
  if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
    errors.push(`Product ${p.id} (${p.slug}) uses remote image: ${p.image}`);
  }

  // Check department path matching
  const expectedPrefix = `/images/products/${p.department}/`;
  if (!p.image.startsWith(expectedPrefix)) {
    errors.push(
      `Product ${p.id} (${p.slug}) image path "${p.image}" does not match department prefix "${expectedPrefix}"`
    );
  }

  // Check unique primary image
  if (seenImages.has(p.image)) {
    errors.push(
      `Duplicate primary image: Product ${p.id} shares "${p.image}" with Product ${seenImages.get(p.image)}`
    );
  } else {
    seenImages.set(p.image, p.id);
  }

  // Check physical file existence
  const localFilePath = path.join(rootDir, 'public', p.image.replace(/^\//, ''));
  if (!fs.existsSync(localFilePath)) {
    errors.push(`Referenced local product image does not exist on disk: ${localFilePath}`);
  }
}

// 2. Parse Journal stories
const storyImages = [...storiesFile.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
console.log(`📰 Found ${storyImages.length} journal stories.`);

for (const img of storyImages) {
  if (img.startsWith('http://') || img.startsWith('https://')) {
    errors.push(`Journal story uses remote image: ${img}`);
  }
  const localStoryPath = path.join(rootDir, 'public', img.replace(/^\//, ''));
  if (!fs.existsSync(localStoryPath)) {
    errors.push(`Referenced local journal image does not exist on disk: ${localStoryPath}`);
  }
}

// 3. Parse Campaign Manifest
const mediaManifestImages = [...mediaFile.matchAll(/src:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
console.log(`🎨 Found ${mediaManifestImages.length} media manifest campaign assets.`);

for (const img of mediaManifestImages) {
  if (img.startsWith('http://') || img.startsWith('https://')) {
    errors.push(`Campaign manifest uses remote image: ${img}`);
  }
  const localCampaignPath = path.join(rootDir, 'public', img.replace(/^\//, ''));
  if (!fs.existsSync(localCampaignPath)) {
    errors.push(`Referenced local campaign image does not exist on disk: ${localCampaignPath}`);
  }
}

// 4. Check for any remaining Unsplash / Picsum references in runtime code
const runtimeDirectories = ['app', 'components', 'data'];
for (const dir of runtimeDirectories) {
  const fullDir = path.join(rootDir, dir);
  if (!fs.existsSync(fullDir)) continue;

  function scanDir(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(tsx|ts|jsx|js|mjs)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('images.unsplash.com')) {
          errors.push(`File ${fullPath.replace(rootDir, '')} still contains "images.unsplash.com"`);
        }
        if (content.includes('picsum.photos')) {
          errors.push(`File ${fullPath.replace(rootDir, '')} still contains "picsum.photos"`);
        }
      }
    }
  }
  scanDir(fullDir);
}

if (errors.length > 0) {
  console.error('\n❌ Media Validation Failed with the following errors:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('\n✅ All Media Integrity Checks Passed:');
  console.log(`  - 36/36 Products are 100% project-owned local assets.`);
  console.log(`  - Women: 12/12 verified local in /images/products/women/`);
  console.log(`  - Men: 12/12 verified local in /images/products/men/`);
  console.log(`  - Kids: 12/12 verified local in /images/products/kids/`);
  console.log(`  - 0 Duplicate product primary images.`);
  console.log(`  - 0 Remote stock photography references.`);
  console.log(`  - All campaign & journal images verified on disk.`);
  process.exit(0);
}
