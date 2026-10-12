import type { CartItem, Product, ProductColor } from '@/types';
export const MAX_ITEM_QUANTITY=20;
export interface BagSelection { product: Product; color: ProductColor; size: string; quantity?: number }
export function normalizeBag(raw: unknown, catalog: readonly Product[]): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const rows=new Map<string,CartItem>();
  for(const item of raw.slice(0,100)) {
    if(!item || typeof item!=='object') continue;
    const product=catalog.find(p=>p.id===item.product?.id);
    if(!product?.inStock || !product.sizes.includes(item.selectedSize)) continue;
    const color=product.colors.find(c=>c.nameEn===item.selectedColor?.nameEn);
    if(!color || typeof item.quantity!=='number' || !Number.isFinite(item.quantity) || item.quantity<1) continue;
    const id=[product.id,color.nameEn,item.selectedSize].map(encodeURIComponent).join('::');
    const quantity=Math.min(MAX_ITEM_QUANTITY,Math.floor(item.quantity)+(rows.get(id)?.quantity||0));
    rows.set(id,{id,product,selectedColor:color,selectedSize:item.selectedSize,quantity});
  }
  return [...rows.values()];
}
export function addSelections(items: CartItem[], selections: BagSelection[], catalog: readonly Product[]) {
  return normalizeBag([...items,...selections.map(s=>({product:s.product,selectedColor:s.color,selectedSize:s.size,quantity:s.quantity??1}))],catalog);
}
export function changeVariant(items: CartItem[], id: string, colorName: string, size: string, catalog: readonly Product[]) {
  const item=items.find(i=>i.id===id); if(!item) return items;
  const color=item.product.colors.find(c=>c.nameEn===colorName);
  if(!color || !item.product.sizes.includes(size)) return items;
  return normalizeBag(items.map(i=>i.id===id?{...i,selectedColor:color,selectedSize:size}:i),catalog);
}
