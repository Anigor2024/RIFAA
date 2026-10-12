import { PHOTO_PIXEL_LIMIT, AI_PHOTO_LIMIT, type GarmentMask, type Placement, photoValidation } from './fitting-room';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('decode'));
    image.src = src;
  });
}
export async function preparePhoto(file: File): Promise<HTMLImageElement> {
  const error = photoValidation(file);
  if (error) throw new Error(error);
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    if (image.naturalWidth * image.naturalHeight > PHOTO_PIXEL_LIMIT) throw new Error('pixels');
    if (image.naturalWidth < 240 || image.naturalHeight < 320) throw new Error('small');
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1440 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.fillStyle = '#f7f4ef'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    // Re-encoding removes EXIF and prevents retaining the original file/metadata.
    let data = canvas.toDataURL('image/jpeg',0.86);
    if (data.length > AI_PHOTO_LIMIT * 1.33) data = canvas.toDataURL('image/jpeg',0.68);
    return await loadImage(data);
  } finally { URL.revokeObjectURL(url); }
}
export function drawPhoto(ctx: CanvasRenderingContext2D, photo: HTMLImageElement, width: number, height: number) {
  const scale = Math.min(width / photo.naturalWidth, height / photo.naturalHeight);
  const w = photo.naturalWidth * scale, h = photo.naturalHeight * scale;
  ctx.drawImage(photo,(width-w)/2,(height-h)/2,w,h);
}
export function renderFitting(canvas: HTMLCanvasElement, photo: HTMLImageElement,
  garment: HTMLImageElement | null, mask: GarmentMask | undefined,
  placement: Placement, reveal = 1, aiResult?: HTMLImageElement | null) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h); ctx.fillStyle = '#e9e4db'; ctx.fillRect(0,0,w,h);
  drawPhoto(ctx,photo,w,h);
  ctx.save(); ctx.beginPath(); ctx.rect(0,0,w*reveal,h); ctx.clip();
  if (aiResult) { ctx.fillStyle = '#e9e4db';ctx.fillRect(0,0,w,h);drawPhoto(ctx,aiResult,w,h); }
  else if (garment && mask) {
    const gw=garment.naturalWidth, gh=garment.naturalHeight;
    const sourceSpan=(mask.shoulders[1]-mask.shoulders[0])*gw;
    const scale=(placement.width*w)/sourceSpan;
    ctx.translate(placement.x*w,placement.y*h);
    ctx.rotate(placement.angle*Math.PI/180);
    ctx.scale(scale,scale*placement.length);
    ctx.translate(-(mask.shoulders[0]+mask.shoulders[1])*gw/2,-mask.top*gh);
    ctx.beginPath(); mask.outline.forEach(([x,y],i)=> i ? ctx.lineTo(x*gw,y*gh) : ctx.moveTo(x*gw,y*gh));
    ctx.closePath();ctx.clip();ctx.drawImage(garment,0,0);
  }
  ctx.restore();
  if (reveal>0 && reveal<1) {ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(w*reveal,0);ctx.lineTo(w*reveal,h);ctx.stroke();}
}
export function exportFitting(source: HTMLCanvasElement, label: string, ai: boolean): string {
  const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height+88;
  const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('canvas');
  ctx.drawImage(source,0,0);ctx.fillStyle='#171615';ctx.fillRect(0,source.height,canvas.width,88);
  ctx.fillStyle='#fff';ctx.font='20px Arial';ctx.textAlign='center';
  ctx.fillText('RIFAA · '+label,canvas.width/2,source.height+33);
  ctx.fillStyle='#d9d0c4';ctx.font='16px Arial';
  ctx.fillText(ai?'AI visualization — not a size or fit guarantee':'2D photo composition — not a size or fit guarantee',canvas.width/2,source.height+63);
  return canvas.toDataURL('image/jpeg',0.9);
}
