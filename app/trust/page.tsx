import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { TrustCenter } from '@/components/atheeldar/Phase07Suite';
export const metadata:Metadata={title:'مركز الثقة'};
export default function Page(){return <><PageHero eyebrow="TRUST BEFORE TRANSACTION" title="مركز الثقة" copy="إطار واضح يفرّق بين اكتمال بيانات العرض، فحص الأصل، وجاهزية الصفقة — حتى لا تختلط التجربة البصرية بالتحقق الرسمي." actions={<Link href="/briefs" className="lightOutline">اقرأ موجز أثيلدار <ArrowLeft/></Link>}/><section className="section shell"><TrustCenter/></section></>}