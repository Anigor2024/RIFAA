import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { DEMO_PRODUCTS } from '@/data/products';
import { AI_PHOTO_LIMIT, CONSENT_VERSION, aiEligible } from '@/lib/fitting-room';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const HEADERS={'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};
function reply(body:unknown,status=200){return NextResponse.json(body,{status,headers:HEADERS});}
function enabled(){return process.env.TRYON_AI_ENABLED==='true'&&Boolean(process.env.FASHN_API_KEY)&&Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)&&Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);}
function client(request:Request){const token=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!token||token.length>4096)return null;return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:'Bearer '+token}}});}
function signature(payload:string){return createHmac('sha256',process.env.FASHN_API_KEY!).update('rifaa-tryon-v1:'+payload).digest();}
function ticket(job:string,uid:string){const payload=Buffer.from(JSON.stringify({job,uid,expires:Date.now()+10*60_000})).toString('base64url');return payload+'.'+signature(payload).toString('base64url');}
function verifyTicket(value:string,uid:string):string|null{try{if(value.length>1500)return null;const[p,s]=value.split('.');if(!p||!s)return null;const supplied=Buffer.from(s,'base64url'),expected=signature(p);if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return null;const claim=JSON.parse(Buffer.from(p,'base64url').toString('utf8'));return claim.uid===uid&&claim.expires>Date.now()&&/^[A-Za-z0-9-]{8,150}$/.test(claim.job)?claim.job:null;}catch{return null;}}
async function limitedJson(request:Request){const reader=request.body?.getReader();if(!reader)throw new Error('payload');let size=0;const chunks:Uint8Array[]=[];try{while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>2_100_000){await reader.cancel();throw new Error('payload');}chunks.push(value);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}finally{reader.releaseLock();}}
function validPhoto(value:unknown):value is string{if(typeof value!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(value)||value.length>2_000_000)return false;const bytes=Buffer.from(value.slice(value.indexOf(',')+1),'base64');return bytes.length<=AI_PHOTO_LIMIT&&bytes.length>500&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;}
export async function POST(request:Request){
 if(!enabled())return reply({code:'not_configured'},503);
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return reply({code:'origin'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({code:'payload'},415);
 const supabase=client(request);if(!supabase)return reply({code:'authentication'},401);
 try{
  const {data:{user},error}=await supabase.auth.getUser();if(error||!user?.email_confirmed_at)return reply({code:'authentication'},401);
  const body=await limitedJson(request);
  if(body.consent!==CONSENT_VERSION||body.adult!==true)return reply({code:'consent'},400);
  const product=DEMO_PRODUCTS.find(p=>p.id===body.productId);
  if(!product||!aiEligible(product)||!product.inStock||!validPhoto(body.photo))return reply({code:'payload'},400);
  // This transaction is durable across serverless workers; do not replace with in-memory limits.
  const reservation=await supabase.rpc('reserve_tryon_attempt');
  if(reservation.error)return reply({code:'quota_unavailable'},503);
  if(reservation.data!==true)return reply({code:'quota'},429);
  const category=['bottoms','trousers'].includes(product.categoryKey)?'bottoms':['abayas','thobes','coords','bishts'].includes(product.categoryKey)?'one-pieces':'tops';
  const provider=await fetch('https://api.fashn.ai/v1/run',{method:'POST',signal:AbortSignal.timeout(25000),headers:{Authorization:'Bearer '+process.env.FASHN_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model_name:'tryon-v1.6',inputs:{model_image:body.photo,garment_image:new URL(product.image,process.env.NEXT_PUBLIC_SITE_URL||'https://rifaa-ashy.vercel.app').href,category,garment_photo_type:'auto',moderation_level:'conservative',mode:'quality',num_samples:1,output_format:'jpeg',return_base64:true}})});
  if(!provider.ok)return reply({code:'provider'},502);
  const job=await provider.json();if(typeof job.id!=='string'||job.error||!/^[A-Za-z0-9-]{8,150}$/.test(job.id))return reply({code:'provider'},502);
  return reply({ticket:ticket(job.id,user.id),status:'processing'},202);
 }catch(error){return reply({code:error instanceof Error&&error.message==='payload'?'payload':'provider'},error instanceof Error&&error.message==='payload'?413:502);}
}
export async function GET(request:Request){
 if(!enabled())return reply({code:'not_configured'},503);
 const supabase=client(request);if(!supabase)return reply({code:'authentication'},401);
 try{
  const{data:{user},error}=await supabase.auth.getUser();if(error||!user)return reply({code:'authentication'},401);
  const job=verifyTicket(new URL(request.url).searchParams.get('ticket')||'',user.id);if(!job)return reply({code:'ticket'},403);
  const response=await fetch('https://api.fashn.ai/v1/status/'+encodeURIComponent(job),{headers:{Authorization:'Bearer '+process.env.FASHN_API_KEY},signal:AbortSignal.timeout(15000),cache:'no-store'});
  if(!response.ok)return reply({code:'provider'},502);
  const value=await response.json();
  if(value.status==='completed'){
   const image=value.output?.[0];
   if(typeof image!=='string'||image.length>10_000_000||!/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+=*$/.test(image))return reply({code:'output_expired',status:'failed'},502);
   return reply({status:'completed',image});
  }
  if(value.status==='failed'||value.error)return reply({status:'failed',code:'provider'},502);
  return reply({status:'processing'});
 }catch{return reply({code:'provider'},502);}
}
