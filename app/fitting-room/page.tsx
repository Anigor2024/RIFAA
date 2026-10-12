import type { Metadata } from 'next';
import { FittingRoom } from '@/components/fitting/FittingRoom';
import { LOCAL_GARMENTS } from '@/lib/fitting-room';
export const metadata: Metadata = {
 title: 'غرفة القياس الافتراضية | RIFAA Fitting Room',
 description: 'معاينة بصرية خاصة على صورتك، واختيار المقاس واللون قبل الإضافة للحقيبة.',
 robots: { index: false, follow: true },
};
export default async function FittingRoomPage({searchParams}:{searchParams:Promise<{product?:string}>}) {
 const params=await searchParams;
 const initialProduct=LOCAL_GARMENTS.some(g=>g.productId===params.product)?params.product!:'m-01';
 const aiAvailable=process.env.TRYON_AI_ENABLED==='true' && Boolean(process.env.FASHN_API_KEY) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
 return <FittingRoom initialProduct={initialProduct} aiAvailable={aiAvailable}/>;
}
