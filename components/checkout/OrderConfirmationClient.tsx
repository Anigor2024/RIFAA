'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DemoOrder } from '@/lib/commerce';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

const emptySubscribe = () => () => {};

function getSessionOrderJson(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('rifaa_last_order');
  } catch {
    return null;
  }
}

function getServerSnapshot(): null {
  return null;
}

export function OrderConfirmationClient() {
  const { language, isRtl, t } = useLanguage();
  const rawOrderJson = React.useSyncExternalStore(emptySubscribe, getSessionOrderJson, getServerSnapshot);

  const order: DemoOrder | null = React.useMemo(() => {
    if (!rawOrderJson) return null;
    try {
      return JSON.parse(rawOrderJson);
    } catch {
      return null;
    }
  }, [rawOrderJson]);

  const formatPrice = (val: number) => val.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Fallback if visited directly without an active order
  if (!order) {
    return (
      <div className="pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#511D24] mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#111111]">
              {language === 'ar' ? 'لا يوجد طلب حديث للعرض' : 'No Recent Order Found'}
            </h1>
            <p className="text-xs text-[#242220]/70 font-light leading-relaxed">
              {language === 'ar'
                ? 'يبدو أنك لم تقم بإجراء أي طلب مؤخراً في هذه الجلسة، أو تم مسح بيانات التصفح المؤقتة.'
                : 'You have not submitted an order in this browsing session, or session data was cleared.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/new"
              className="inline-flex items-center gap-2 py-3 px-8 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#511D24] transition-colors"
            >
              <span>{language === 'ar' ? 'استكشف تشكيلات رِفْعة' : 'Explore Collections'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header Badge */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-10 shadow-xs mb-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#511D24]/10 text-[#511D24] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#511D24] font-semibold block">
              {language === 'ar' ? 'تم استلام وتوثيق طلبك' : 'ORDER CONFIRMED & RECEIVED'}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">
              {language === 'ar'
                ? `شكراً لك، ${order.customer.firstName}`
                : `Thank You, ${order.customer.firstName}`}
            </h1>
            <p className="text-xs sm:text-sm text-[#242220]/75 max-w-md mx-auto font-light leading-relaxed pt-1">
              {language === 'ar'
                ? 'تم تسجيل طلبك بنجاح وسيتواصل معك فريق كونسيرج رِفْعة في الرياض لتنسيق تفاصيل التسليم.'
                : 'Your order has been recorded. Our Riyadh concierge desk will coordinate delivery arrangements with you.'}
            </p>
          </div>

          {/* Reference Pill (Unboxed text) */}
          <div className="pt-2 inline-flex items-center gap-2 bg-[#F7F4EF] px-4 py-2 border border-[#242220]/15 text-xs text-[#111111]">
            <span className="text-[#242220]/60">{language === 'ar' ? 'رقم مرجع الطلب:' : 'Order Reference:'}</span>
            <span className="font-bold tracking-wider tabular-nums font-mono text-[#511D24]">
              {order.orderReference}
            </span>
          </div>

          {/* Demonstration Notice */}
          <div className="pt-3 max-w-lg mx-auto">
            <div className="p-3 bg-[#FAF7F2] border border-[#B59A73]/30 text-[11px] text-[#242220]/75 leading-relaxed">
              <span className="font-semibold text-[#111111]">
                {language === 'ar' ? 'إشعار استعراض المنصة: ' : 'Portfolio Demonstration Notice: '}
              </span>
              {language === 'ar'
                ? 'هذه المعاملة تمثل محاكاة واقعية لرحلة العميل في دار رِفْعة. لم يتم خصم مبالغ مالية حقيقية.'
                : 'This transaction is a realistic demonstration of the RIFAA ecommerce journey. No real funds were charged.'}
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Destination & Contact */}
          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] pb-2 border-b border-[#242220]/10">
              <MapPin className="w-4 h-4 text-[#511D24]" />
              <span>{language === 'ar' ? 'تفاصيل التوصيل والعميل' : 'Delivery & Client Details'}</span>
            </div>

            <div className="text-xs text-[#242220]/80 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-[#111111]">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p>{order.customer.email}</p>
              <p dir="ltr" className="text-start tabular-nums">{order.customer.phone}</p>
              <div className="pt-2 border-t border-[#242220]/05">
                <p>{order.deliveryAddress.city}، {order.deliveryAddress.district}</p>
                <p>{order.deliveryAddress.street}{order.deliveryAddress.building ? `، ${order.deliveryAddress.building}` : ''}</p>
                {order.deliveryAddress.postalCode && (
                  <p className="text-[11px] text-[#242220]/60">
                    {language === 'ar' ? 'الرمز البريدي:' : 'Postal Code:'} {order.deliveryAddress.postalCode}
                  </p>
                )}
                <p className="text-[#511D24] font-medium mt-1">{order.deliveryAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] pb-2 border-b border-[#242220]/10">
              <CreditCard className="w-4 h-4 text-[#511D24]" />
              <span>{language === 'ar' ? 'الشحن وطريقة الدفع' : 'Shipping & Payment Mode'}</span>
            </div>

            <div className="text-xs text-[#242220]/80 space-y-3 leading-relaxed">
              <div>
                <span className="text-[11px] text-[#242220]/50 block">
                  {language === 'ar' ? 'طريقة الشحن المختارة' : 'Selected Shipping Method'}
                </span>
                <span className="font-semibold text-[#111111]">
                  {language === 'ar' ? order.deliveryMethod.nameAr : order.deliveryMethod.nameEn}
                </span>
                <span className="text-[11px] text-[#511D24] block mt-0.5">
                  {language === 'ar' ? 'الوقت التقديري:' : 'Estimated Arrival:'}{' '}
                  {language === 'ar' ? order.deliveryMethod.estimatedDaysAr : order.deliveryMethod.estimatedDaysEn}
                </span>
              </div>

              <div className="pt-2 border-t border-[#242220]/05">
                <span className="text-[11px] text-[#242220]/50 block">
                  {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                </span>
                <span className="font-semibold text-[#111111]">
                  {language === 'ar' ? order.paymentMethod.labelAr : order.paymentMethod.labelEn}
                  {order.paymentMethod.lastFour ? ` (•••• ${order.paymentMethod.lastFour})` : ''}
                </span>
                <span className="text-[11px] text-[#242220]/60 block mt-0.5">
                  {language === 'ar' ? 'حالة المعاملة: تم التوثيق تجريبياً' : 'Status: Simulated & Recorded'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Order Receipt Table */}
        <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 shadow-xs mb-8 space-y-6">
          <h2 className="text-base font-bold text-[#111111] pb-3 border-b border-[#242220]/10">
            {language === 'ar' ? 'القطع المشتراة' : 'Purchased Silhouettes'}
          </h2>

          <div className="divide-y divide-[#242220]/10">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-18 bg-[#EBE5DA] shrink-0 overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.productNameEn} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#111111]">
                      {language === 'ar' ? item.productNameAr : item.productNameEn}
                    </h3>
                    <p className="text-[#242220]/60 mt-0.5">
                      {language === 'ar' ? item.colorNameAr : item.colorNameEn} · {item.size} · {language === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                    </p>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <span className="font-semibold text-sm text-[#111111] tabular-nums">
                    {formatPrice(item.lineTotal)} {t.actions.sar}
                  </span>
                  <span className="text-[11px] text-[#242220]/50 block tabular-nums">
                    ({formatPrice(item.unitPrice)} {t.actions.sar} / {language === 'ar' ? 'قطعة' : 'pc'})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-[#242220]/10 space-y-2 text-xs text-[#242220]/80">
            <div className="flex justify-between">
              <span>{t.actions.subtotal}</span>
              <span className="font-semibold text-[#111111] tabular-nums">
                {formatPrice(order.subtotal)} {t.actions.sar}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
              <span className="font-semibold text-[#111111] tabular-nums">
                {order.deliveryFee === 0 ? (
                  <span className="text-[#511D24] font-bold">
                    {language === 'ar' ? 'مجاني' : 'Free'}
                  </span>
                ) : (
                  `${formatPrice(order.deliveryFee)} ${t.actions.sar}`
                )}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-[#511D24] font-medium">
                <span>
                  {language === 'ar' ? 'الخصم الترويجي' : 'Promotional Discount'}
                  {order.promoCodeApplied ? ` (${order.promoCodeApplied})` : ''}
                </span>
                <span className="tabular-nums">
                  -{formatPrice(order.discount)} {t.actions.sar}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-[#242220]/10 flex justify-between items-baseline text-base font-bold text-[#111111]">
              <span>{language === 'ar' ? 'المجموع الكلي' : 'Final Total'}</span>
              <span className="text-xl tabular-nums">
                {formatPrice(order.total)} {t.actions.sar}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            <span>{language === 'ar' ? 'متابعة استكشاف التشكيلات' : 'Continue Shopping'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white border border-[#242220]/20 hover:border-[#111111] text-[#111111] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'ar' ? 'طباعة إيصال الطلب' : 'Print Order Receipt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
