import type { ReactNode } from 'react';
import { DEMO_PRODUCTS } from '@/data/products';
import { getMask } from '@/lib/fitting-room';
import { FittingRoomCommerceLink } from '@/components/fitting/FittingRoomCommerceLink';
export default async function ProductExperienceLayout({children,params}:{children:ReactNode;params:Promise<{slug:string}>}){
 const{slug}=await params;const product=DEMO_PRODUCTS.find(item=>item.slug===slug);
 return <>{children}{product&&getMask(product.id)?<FittingRoomCommerceLink productId={product.id}/>:null}</>;
}
