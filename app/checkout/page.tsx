import { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'إتمام الطلب | Checkout — رِفْعة RIFAA',
  description: 'إتمام طلبك لدى دار رِفْعة للأزياء المعاصرة في المملكة العربية السعودية. Secure checkout for contemporary Saudi fashion.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
