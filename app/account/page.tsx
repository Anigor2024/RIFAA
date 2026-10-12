import type { Metadata } from 'next';
import { ClientWorkspace } from '@/components/atheeldar/ClientWorkspace';

export const metadata: Metadata = {
  title: 'مساحتي | المفضلة والمقارنة والملاحظات',
  description: 'مساحتك في أثيلدار: اجمع عقاراتك المفضلة، وقارن اختياراتك، ورتّب معايناتك، واحتفظ بالبحث والملاحظات في مكان واحد.',
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return <ClientWorkspace />;
}
