import type { Metadata } from 'next';
import { HomeFinder } from '@/components/atheeldar/HomeFinder';

export const metadata: Metadata = {
  title: 'دليلك إلى المنزل',
  description: 'أربعة أسئلة عن هدفك ومدينتك وميزانيتك واحتياجاتك، لتكتشف العقارات التي تحقق شروطك مع أسباب واضحة لكل اقتراح.',
};

export default function HomeFinderPage() {
  return <HomeFinder variant="page" />;
}
