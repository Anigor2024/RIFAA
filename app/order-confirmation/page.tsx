import { Metadata } from 'next';
import { OrderConfirmationClient } from '@/components/checkout/OrderConfirmationClient';

export const metadata: Metadata = {
  title: 'تأكيد استلام الطلب | Order Confirmation — رِفْعة RIFAA',
  description: 'تم توثيق طلبك بنجاح لدى دار رِفْعة للأزياء المعاصرة. Order confirmation receipt.',
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}
