'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  AlertCircle,
  Sparkles,
  Package,
} from 'lucide-react';
import { useBag } from '@/context/BagContext';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import {
  COMMERCE_CONFIG,
  DeliveryOption,
  PromoCode,
  DemoOrder,
  calculateDeliveryFee,
  calculateDiscount,
  generateOrderReference,
  formatPrice,
  formatNumber,
} from '@/lib/commerce';

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, bagCount, clearBag, isHydrated } = useBag();
  const { language, isRtl, t } = useLanguage();

  // Form Fields State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    country: 'المملكة العربية السعودية',
    city: 'riyadh',
    district: '',
    street: '',
    building: '',
    postalCode: '',
    additionalInfo: '',
  });

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Delivery Method state
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(
    COMMERCE_CONFIG.deliveryOptions[0]
  );

  // Payment Method state
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'card' | 'apple_pay'>('mada');

  // Card fields (Never persisted!)
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Promo Code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Unique IDs for accessibility
  const emailId = useId();
  const phoneId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const cityId = useId();
  const districtId = useId();
  const streetId = useId();
  const buildingId = useId();
  const postalCodeId = useId();
  const cardNameId = useId();
  const cardNumberId = useId();
  const expiryId = useId();
  const cvvId = useId();

  // Calculations & Promo Edge Cases
  const isPromoApplicable = appliedPromo ? (!appliedPromo.minOrder || subtotal >= appliedPromo.minOrder) : true;
  const discountAmount = isPromoApplicable ? calculateDiscount(subtotal, appliedPromo) : 0;
  const deliveryFee = calculateDeliveryFee(subtotal, selectedDelivery);
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);
  const formatMoney = (val: number) => formatPrice(val, language);

  // Available delivery options based on selected city (Riyadh Same-Day only for Riyadh)
  const availableDeliveryOptions = COMMERCE_CONFIG.deliveryOptions.filter(
    (opt) => opt.id !== 'riyadh_same_day' || formData.city === 'riyadh'
  );

  // Field change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Requirement 9: If city changes away from Riyadh while Same-Day is selected, automatically switch
      if (name === 'city' && value !== 'riyadh' && selectedDelivery.id === 'riyadh_same_day') {
        setSelectedDelivery(COMMERCE_CONFIG.deliveryOptions[0]);
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Card formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.cardNumber;
        return u;
      });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardData((prev) => ({ ...prev, expiry: raw }));
    if (errors.expiry) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.expiry;
        return u;
      });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData((prev) => ({ ...prev, cvv: raw }));
    if (errors.cvv) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.cvv;
        return u;
      });
    }
  };

  // Validation function
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Email
    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'صيغة البريد الإلكتروني غير صالحة' : 'Invalid email address';
    }

    // Phone (Accepts Saudi 05xxxxxxxx, +9665xxxxxxxx, or international)
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'ar' ? 'يرجى إدخال رقم الجوال للتوصيل' : 'Phone number is required for delivery';
    } else if (!/^(?:\+?966|0)?5\d{8}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone =
        language === 'ar'
          ? 'يرجى إدخال رقم جوال سعودي صالح (مثال: 05xxxxxxxx)'
          : 'Please enter a valid Saudi phone number (e.g. 05xxxxxxxx)';
    }

    // First & Last Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'ar' ? 'يرجى إدخال الاسم الأول' : 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'ar' ? 'يرجى إدخال اسم العائلة' : 'Last name is required';
    }

    // District & Street
    if (!formData.district.trim()) {
      newErrors.district = language === 'ar' ? 'يرجى تحديد الحي' : 'District is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = language === 'ar' ? 'يرجى إدخال اسم الشارع' : 'Street address is required';
    }

    // Postal Code (Saudi 5-digit postal code)
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = language === 'ar' ? 'الرمز البريدي مطلوب' : 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode =
        language === 'ar' ? 'الرمز البريدي يتكون من 5 أرقام' : 'Postal code must be 5 digits';
    }

    // Card validation if card/mada selected (demo fields only; never persisted)
    if (paymentMethod === 'card' || paymentMethod === 'mada') {
      if (cardData.cardholderName.trim().length < 2) {
        newErrors.cardholderName = language === 'ar' ? 'أدخل اسماً تجريبياً لحامل البطاقة' : 'Enter a demo cardholder name';
      }
      const rawNumber = cardData.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(rawNumber)) {
        newErrors.cardNumber = language === 'ar' ? 'استخدم رقماً تجريبياً من 16 خانة' : 'Use a 16-digit demo card number';
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
        newErrors.expiry = language === 'ar' ? 'استخدم تاريخاً تجريبياً بصيغة MM/YY' : 'Use a demo expiry in MM/YY format';
      }
      if (!/^\d{3,4}$/.test(cardData.cvv)) {
        newErrors.cvv = language === 'ar' ? 'استخدم رمزاً تجريبياً من 3 أو 4 أرقام' : 'Use a 3 or 4 digit demo CVV';
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Promo code apply handler
  const handleApplyPromo = () => {
    setPromoError(null);
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;

    const found = COMMERCE_CONFIG.promoCodes.find((p) => p.code === clean);
    if (!found) {
      setPromoError(
        language === 'ar'
          ? 'رمز الخصم غير صالح أو منتهي الصلاحية'
          : 'Invalid or expired promotional code'
      );
      return;
    }

    if (found.minOrder && subtotal < found.minOrder) {
      setPromoError(
        language === 'ar'
          ? `هذا الرمز يتطلب طلباً بقيمة ${formatPrice(found.minOrder, language)} على الأقل`
          : `This code requires a minimum order of ${formatPrice(found.minOrder, language)}`
      );
      return;
    }

    setAppliedPromo(found);
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  // Submission handler
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const targetElement =
        (document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null) ||
        document.getElementById(firstKey);
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 150, behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);

    const cityObj = COMMERCE_CONFIG.saudiCities.find((c) => c.id === formData.city);
    const cityName = language === 'ar' ? cityObj?.nameAr || formData.city : cityObj?.nameEn || formData.city;

    const orderRef = generateOrderReference();

    const demoOrder: DemoOrder = {
      orderReference: orderRef,
      createdAt: new Date().toISOString(),
      customer: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      },
      deliveryAddress: {
        country: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
        city: cityName,
        district: formData.district.trim(),
        street: formData.street.trim(),
        building: formData.building.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        additionalInfo: formData.additionalInfo.trim() || undefined,
      },
      deliveryMethod: selectedDelivery,
      paymentMethod: {
        type: paymentMethod,
        labelAr:
          paymentMethod === 'mada'
            ? 'بطاقة مدى البنكية'
            : paymentMethod === 'card'
            ? 'بطاقة ائتمانية (فيزا / ماستركارد)'
            : 'آبل باي (Apple Pay)',
        labelEn:
          paymentMethod === 'mada'
            ? 'Mada Debit Card'
            : paymentMethod === 'card'
            ? 'Credit Card (Visa / Mastercard)'
            : 'Apple Pay',
        lastFour:
          paymentMethod !== 'apple_pay'
            ? cardData.cardNumber.replace(/\s/g, '').slice(-4) || '4242'
            : undefined,
      },
      items: items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productNameAr: item.product.nameAr,
        productNameEn: item.product.nameEn,
        image: item.product.image,
        size: item.selectedSize,
        colorNameAr: item.selectedColor.nameAr,
        colorNameEn: item.selectedColor.nameEn,
        unitPrice: item.product.price,
        quantity: item.quantity,
        lineTotal: item.product.price * item.quantity,
      })),
      subtotal,
      deliveryFee,
      discount: discountAmount,
      promoCodeApplied: appliedPromo ? appliedPromo.code : undefined,
      total,
    };

    // Store in sessionStorage for order confirmation page
    try {
      sessionStorage.setItem('rifaa_last_order', JSON.stringify(demoOrder));
    } catch {
      // fallback
    }

    // Clear active bag
    clearBag();

    // Navigate to confirmation page
    setTimeout(() => {
      router.push('/order-confirmation');
    }, 600);
  };

  // Wait for persisted bag state before deciding whether checkout is empty.
  if (!isHydrated) {
    return (
      <div className="pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div
            role="status"
            aria-live="polite"
            className="bg-[#FFFDFC] border border-[#242220]/10 p-8 sm:p-10 space-y-3 shadow-xs"
          >
            <ShoppingBag className="w-7 h-7 text-[#511D24] mx-auto" />
            <p className="text-sm font-semibold text-[#111111]">
              {language === 'ar' ? 'جاري تجهيز تجربة إتمام الطلب...' : 'Preparing your checkout experience...'}
            </p>
            <p className="text-xs text-[#242220]/60 font-light">
              {language === 'ar' ? 'نستعيد محتويات حقيبتك المحفوظة محلياً.' : 'Restoring your locally saved shopping bag.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 1. EMPTY BAG STATE
  if (items.length === 0) {
    return (
      <div className="pt-28 pb-24 bg-[#F7F4EF] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#511D24] mx-auto shadow-xs">
            <ShoppingBag className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block">
              {t.brandSentiment}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              {language === 'ar' ? 'حقيبة التسوق خالية' : 'Your Shopping Bag is Empty'}
            </h1>
            <p className="text-sm text-[#242220]/70 font-light max-w-md mx-auto leading-relaxed">
              {language === 'ar'
                ? 'لم تقم بإضافة أي قطع إلى حقيبة التسوق بعد. استكشف مجموعاتنا الراقية من العبايات، الثياب، والأطقم المختارة.'
                : 'You have not added any pieces to your shopping bag yet. Explore our curated collections of abayas, bespoke thobes, and tailored coordinates.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              <span>{language === 'ar' ? 'اكتشف ما وصل حديثاً' : 'Explore New Arrivals'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
            <Link
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-8 bg-transparent border border-[#242220]/30 hover:border-[#111111] text-[#111111] text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              {language === 'ar' ? 'التشكيلات الموسمية' : 'Seasonal Collections'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE CHECKOUT EXPERIENCE
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#242220]/70">{t.actions.bag}</span>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'إتمام الشراء' : 'Checkout'}
          </span>
        </nav>

        {/* Page Heading */}
        <div className="pb-6 mb-8 border-b border-[#242220]/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#511D24] font-medium block">
              {t.brandSentiment}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111] mt-1">
              {language === 'ar' ? 'إتمام طلبك لدى رِفْعة' : 'Complete Your RIFAA Order'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#242220]/60">
            <Lock className="w-3.5 h-3.5 text-[#511D24]" />
            <span>{language === 'ar' ? 'محاكاة دفع بدون خصم فعلي' : 'Simulated Checkout — No Real Charge'}</span>
          </div>
        </div>

        {/* Mobile Sticky Order Summary Toggle */}
        <div className="lg:hidden mb-8 border border-[#242220]/15 bg-[#FFFDFC] p-4">
          <button
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full flex items-center justify-between text-start cursor-pointer"
            aria-expanded={mobileSummaryOpen}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111111]">
              <ShoppingBag className="w-4 h-4 text-[#511D24]" />
              <span>
                {mobileSummaryOpen
                  ? language === 'ar'
                    ? 'إخفاء ملخص الطلب'
                    : 'Hide Order Summary'
                  : language === 'ar'
                  ? 'عرض ملخص الطلب والقطع'
                  : 'Show Order Summary & Items'}{' '}
                ({bagCount})
              </span>
              {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            <span className="text-sm font-bold text-[#111111] tabular-nums">
              {formatMoney(total)}
            </span>
          </button>

          {mobileSummaryOpen && (
            <div className="pt-4 mt-4 border-t border-[#242220]/10 space-y-4">
              <div className="max-h-60 overflow-y-auto divide-y divide-[#242220]/10">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-16 bg-[#EBE5DA] shrink-0 overflow-hidden">
                      <ImageWithFallback src={item.product.image} alt={item.product.nameEn} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#111111] truncate">
                        {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                      </p>
                      <p className="text-[11px] text-[#242220]/60">
                        {language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn} · {item.selectedSize} · x{item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-[#111111] tabular-nums shrink-0">
                      {formatMoney(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main 2-Column Grid (Workflow Left, Sticky Summary Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Checkout Form Column */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-10" noValidate>
            {/* Step 1: Contact Information */}
            <section className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#242220]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                    1
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                    {language === 'ar' ? 'بيانات التواصل' : 'Contact Information'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#242220]/50 font-light">
                  {language === 'ar' ? 'طلب ضيف سريع' : 'Express Guest Checkout'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor={emailId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    aria-describedby={errors.email ? `${emailId}-error` : undefined}
                    aria-invalid={Boolean(errors.email)}
                    className={`w-full py-2.5 px-3.5 bg-white border text-xs sm:text-sm text-[#111111] placeholder-[#242220]/40 focus:outline-hidden transition-colors ${
                      errors.email ? 'border-[#511D24] focus:border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                    }`}
                  />
                  {errors.email && (
                    <p id={`${emailId}-error`} className="text-[11px] text-[#511D24] flex items-center gap-1 mt-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor={phoneId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'رقم جوال سعودي لتجربة الطلب' : 'Saudi Mobile Number for Demo Order'} *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id={phoneId}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05XXXXXXXX / +966 5X XXX XXXX"
                      dir="ltr"
                      aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
                      aria-invalid={Boolean(errors.phone)}
                      className={`w-full py-2.5 px-3.5 bg-white border text-xs sm:text-sm text-[#111111] placeholder-[#242220]/40 focus:outline-hidden transition-colors tabular-nums ${
                        errors.phone ? 'border-[#511D24] focus:border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                      }`}
                    />
                  </div>
                  {errors.phone ? (
                    <p id={`${phoneId}-error`} className="text-[11px] text-[#511D24] flex items-center gap-1 mt-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#242220]/50 mt-1">
                      {language === 'ar'
                        ? 'يُستخدم لمحاكاة تفاصيل الاتصال وإشعار التتبع التوضيحي للطلب التجريبي.'
                        : 'Used for demonstration contact details and simulated order tracking notifications.'}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Step 2: Saudi Delivery Address */}
            <section className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#242220]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                    2
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                    {language === 'ar' ? 'عنوان التوصيل في المملكة' : 'Saudi Delivery Address'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#511D24] font-medium">
                  {language === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1">
                  <label htmlFor={firstNameId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                  </label>
                  <input
                    id={firstNameId}
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    aria-describedby={errors.firstName ? `${firstNameId}-error` : undefined}
                    aria-invalid={Boolean(errors.firstName)}
                    className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors ${
                      errors.firstName ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                    }`}
                  />
                  {errors.firstName && (
                    <p id={`${firstNameId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label htmlFor={lastNameId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'اسم العائلة' : 'Last Name'} *
                  </label>
                  <input
                    id={lastNameId}
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    aria-describedby={errors.lastName ? `${lastNameId}-error` : undefined}
                    aria-invalid={Boolean(errors.lastName)}
                    className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors ${
                      errors.lastName ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                    }`}
                  />
                  {errors.lastName && (
                    <p id={`${lastNameId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'الدولة / المنطقة' : 'Country / Region'}
                  </label>
                  <input
                    type="text"
                    value={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                    disabled
                    className="w-full py-2.5 px-3.5 bg-[#F2EDE4] border border-[#242220]/15 text-base sm:text-sm text-[#242220]/80 cursor-not-allowed font-medium"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label htmlFor={cityId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'المدينة' : 'City'} *
                  </label>
                  <select
                    id={cityId}
                    name="city"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 bg-white border border-[#242220]/20 text-base sm:text-sm text-[#111111] focus:outline-hidden focus:border-[#111111] cursor-pointer"
                  >
                    {COMMERCE_CONFIG.saudiCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {language === 'ar' ? city.nameAr : city.nameEn} ({language === 'ar' ? city.regionAr : city.regionEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label htmlFor={districtId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'الحي' : 'District'} *
                  </label>
                  <input
                    id={districtId}
                    type="text"
                    name="district"
                    autoComplete="address-level3"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'مثال: حي العليا، حطين، النرجس' : 'e.g. Al Olaya, Hittin, Al Narjis'}
                    aria-describedby={errors.district ? `${districtId}-error` : undefined}
                    aria-invalid={Boolean(errors.district)}
                    className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors ${
                      errors.district ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                    }`}
                  />
                  {errors.district && (
                    <p id={`${districtId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Street */}
                <div className="space-y-1">
                  <label htmlFor={streetId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'اسم الشارع' : 'Street Name'} *
                  </label>
                  <input
                    id={streetId}
                    type="text"
                    name="street"
                    autoComplete="street-address"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'مثال: طريق الملك فهد، شارع التحلية' : 'e.g. King Fahd Rd, Tahlia St'}
                    aria-describedby={errors.street ? `${streetId}-error` : undefined}
                    aria-invalid={Boolean(errors.street)}
                    className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors ${
                      errors.street ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                    }`}
                  />
                  {errors.street && (
                    <p id={`${streetId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">
                      {errors.street}
                    </p>
                  )}
                </div>

                {/* Building / Villa */}
                <div className="space-y-1">
                  <label htmlFor={buildingId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'رقم المبنى / الفيلا / الشقة' : 'Building / Villa / Apt Number'}
                  </label>
                  <input
                    id={buildingId}
                    type="text"
                    name="building"
                    autoComplete="address-line2"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'فيلا 12، عمارة 4' : 'Villa 12, Apt 4'}
                    className="w-full py-2.5 px-3.5 bg-white border border-[#242220]/20 text-base sm:text-sm text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>

                {/* Postal Code */}
                <div className="space-y-1">
                  <label htmlFor={postalCodeId} className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'الرمز البريدي (5 أرقام)' : 'Postal Code (5 Digits)'} *
                  </label>
                  <input
                    id={postalCodeId}
                    type="text"
                    name="postalCode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="12211"
                    dir="ltr"
                    aria-describedby={errors.postalCode ? `${postalCodeId}-error` : undefined}
                    aria-invalid={Boolean(errors.postalCode)}
                    className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors tabular-nums ${
                      errors.postalCode ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                    }`}
                  />
                  {errors.postalCode && (
                    <p id={`${postalCodeId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                {/* Additional Info */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#242220]/90">
                    {language === 'ar' ? 'ملاحظات إضافية لتسهيل الوصول (اختياري)' : 'Additional Delivery Instructions (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'بجانب معلم معروف أو بوابة محددة...' : 'Near landmark, gate number...'}
                    className="w-full py-2.5 px-3.5 bg-white border border-[#242220]/20 text-base sm:text-sm text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Delivery Method */}
            <section className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#242220]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                    3
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                    {language === 'ar' ? 'طريقة التوصيل' : 'Delivery Method'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#242220]/60 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#511D24]" />
                  <span>{language === 'ar' ? 'تقديرات دقيقة' : 'Estimated Timelines'}</span>
                </span>
              </div>

              <div className="space-y-3">
                {availableDeliveryOptions.map((opt) => {
                  const isSelected = selectedDelivery.id === opt.id;
                  const fee = calculateDeliveryFee(subtotal, opt);
                  const isFree = fee === 0;

                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedDelivery(opt)}
                      className={`block p-4 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111111] bg-[#FAF8F5] shadow-xs ring-1 ring-[#111111]'
                          : 'border-[#242220]/15 bg-white hover:border-[#242220]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={isSelected}
                            onChange={() => setSelectedDelivery(opt)}
                            className="mt-0.5 accent-[#511D24]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#111111]">
                                {language === 'ar' ? opt.nameAr : opt.nameEn}
                              </span>
                              {isFree && (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#511D24] bg-[#511D24]/10 px-2 py-0.5">
                                  {language === 'ar' ? 'شحن مجاني' : 'FREE'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#242220]/70 mt-0.5">
                              {language === 'ar' ? opt.descriptionAr : opt.descriptionEn}
                            </p>
                            <span className="text-[11px] font-medium text-[#511D24] block mt-1">
                              {language === 'ar' ? 'المدة التقديرية:' : 'Estimated Arrival:'}{' '}
                              {language === 'ar' ? opt.estimatedDaysAr : opt.estimatedDaysEn}
                            </span>
                          </div>
                        </div>

                        <div className="text-end shrink-0">
                          {isFree ? (
                            <span className="text-sm font-bold text-[#511D24]">
                              {language === 'ar' ? 'مجاني' : 'Free'}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-[#111111] tabular-nums">
                              {formatMoney(opt.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Step 4: Payment Experience (Demo Mode) */}
            <section className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-8 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#242220]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                    4
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111111]">
                    {language === 'ar' ? 'طريقة الدفع (استعراض تجريبي)' : 'Payment Method (Demo Mode)'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#511D24] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'استعراض تجريبي آمن' : 'Simulated Checkout'}</span>
                </span>
              </div>

              {/* Prominent subtle bilingual demo notice */}
              <div className="p-3.5 bg-[#FAF7F2] border-s-3 border-[#B59A73] text-xs text-[#242220]/80 space-y-1">
                <p className="font-semibold text-[#111111]">
                  {language === 'ar' ? 'تنبيه العرض التجريبي للمنصة:' : 'Demonstration Platform Notice:'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'هذا نموذج عرض تجريبي لمحفظة أعمال رِفْعة. لا تدخل بيانات دفع حقيقية؛ استخدم بيانات اختبار فقط، ولن يتم تنفيذ أي خصم مالي.'
                    : 'This is a portfolio demonstration checkout. Do not enter real payment details; use test data only. No monetary charge will be processed.'}
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-3">
                {/* mada */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mada')}
                  className={`p-3.5 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'mada'
                      ? 'border-[#111111] bg-[#FAF8F5] ring-1 ring-[#111111]'
                      : 'border-[#242220]/15 bg-white hover:border-[#242220]/40'
                  }`}
                >
                  <span className="text-sm font-bold tracking-tight text-[#111111]">mada</span>
                  <span className="text-[10px] text-[#242220]/60">
                    {language === 'ar' ? 'مدى البنكية' : 'Mada Debit'}
                  </span>
                </button>

                {/* Visa / Mastercard */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-[#111111] bg-[#FAF8F5] ring-1 ring-[#111111]'
                      : 'border-[#242220]/15 bg-white hover:border-[#242220]/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#111111]" />
                  <span className="text-[10px] text-[#242220]/70 font-medium">
                    Visa / Mastercard
                  </span>
                </button>

                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3.5 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#111111] bg-[#FAF8F5] ring-1 ring-[#111111]'
                      : 'border-[#242220]/15 bg-white hover:border-[#242220]/40'
                  }`}
                >
                  <span className="text-sm font-bold text-[#111111]"> Pay</span>
                  <span className="text-[10px] text-[#242220]/60">
                    {language === 'ar' ? 'آبل باي' : 'Apple Pay'}
                  </span>
                </button>
              </div>

              {/* Card input fields (for mada and card modes) */}
              {(paymentMethod === 'mada' || paymentMethod === 'card') && (
                <div className="space-y-4 pt-2 border-t border-[#242220]/10">
                  <div className="space-y-1">
                    <label htmlFor={cardNameId} className="block text-xs font-semibold text-[#242220]/90">
                      {language === 'ar' ? 'الاسم المطبوع على البطاقة' : 'Cardholder Name'} *
                    </label>
                    <input
                      id={cardNameId}
                      type="text"
                      name="cardholderName"
                      autoComplete="cc-name"
                      value={cardData.cardholderName}
                      onChange={(e) => {
                        setCardData((p) => ({ ...p, cardholderName: e.target.value }));
                        if (errors.cardholderName) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.cardholderName;
                            return next;
                          });
                        }
                      }}
                      placeholder={language === 'ar' ? 'كما يظهر على وجه البطاقة' : 'As printed on the card'}
                      aria-describedby={errors.cardholderName ? `${cardNameId}-error` : undefined}
                      aria-invalid={Boolean(errors.cardholderName)}
                      className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors ${
                        errors.cardholderName ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                      }`}
                    />
                    {errors.cardholderName && (
                      <p id={`${cardNameId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">{errors.cardholderName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={cardNumberId} className="block text-xs font-semibold text-[#242220]/90">
                      {language === 'ar' ? 'رقم البطاقة (تجريبي)' : 'Card Number (Demo)'} *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id={cardNumberId}
                        type="text"
                        name="cardNumber"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        maxLength={19}
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="•••• •••• •••• ••••"
                        dir="ltr"
                        aria-describedby={errors.cardNumber ? `${cardNumberId}-error` : undefined}
                        aria-invalid={Boolean(errors.cardNumber)}
                        className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors tabular-nums ${
                          errors.cardNumber ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                        }`}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p id={`${cardNumberId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor={expiryId} className="block text-xs font-semibold text-[#242220]/90">
                        {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'} *
                      </label>
                      <input
                        id={expiryId}
                        type="text"
                        name="expiry"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        dir="ltr"
                        aria-describedby={errors.expiry ? `${expiryId}-error` : undefined}
                        aria-invalid={Boolean(errors.expiry)}
                        className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors tabular-nums ${
                          errors.expiry ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                        }`}
                      />
                      {errors.expiry && (
                        <p id={`${expiryId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">{errors.expiry}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor={cvvId} className="block text-xs font-semibold text-[#242220]/90">
                        {language === 'ar' ? 'رمز الأمان (CVV)' : 'CVV Security Code'} *
                      </label>
                      <input
                        id={cvvId}
                        type="password"
                        name="cvv"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={handleCvvChange}
                        placeholder="•••"
                        dir="ltr"
                        aria-describedby={errors.cvv ? `${cvvId}-error` : undefined}
                        aria-invalid={Boolean(errors.cvv)}
                        className={`w-full py-2.5 px-3.5 bg-white border text-base sm:text-sm text-[#111111] focus:outline-hidden transition-colors tabular-nums ${
                          errors.cvv ? 'border-[#511D24]' : 'border-[#242220]/20 focus:border-[#111111]'
                        }`}
                      />
                      {errors.cvv && (
                        <p id={`${cvvId}-error`} className="text-[11px] text-[#511D24] mt-1 font-medium">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Apple Pay View */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-6 bg-[#111111] text-white text-center space-y-3">
                  <span className="text-xl font-bold tracking-tight"> Pay</span>
                  <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                    {language === 'ar'
                      ? 'خيار آبل باي معروض هنا كنموذج استعراضي تجريبي فقط، ولا تتم أي مصادقة على محفظتك الرقمية أو خصم أي مبالغ مالية.'
                      : 'Apple Pay is presented here as a demonstration payment option only. No digital wallet verification or actual monetary charge occurs.'}
                  </p>
                </div>
              )}
            </section>

            {/* Place Order CTA Button */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>{language === 'ar' ? 'جاري توثيق الطلب التجريبي...' : 'Recording Demo Order...'}</span>
                ) : (
                  <>
                    <span>
                      {language === 'ar'
                        ? `تأكيد الطلب التجريبي — ${formatMoney(total)}`
                        : `Place Demo Order — ${formatMoney(total)}`}
                    </span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#242220]/60 text-center">
                <ShieldCheck className="w-4 h-4 text-[#511D24] shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'تجربة تسوق تجريبية تحاكي أرقى معايير التجارة الرقمية الفاخرة'
                    : 'A demonstration ecommerce showcase reflecting luxury digital commerce standards'}
                </span>
              </div>
            </div>
          </form>

          {/* Sticky Order Summary Sidebar (Desktop) */}
          <aside className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-[#FFFDFC] border border-[#242220]/10 p-6 sm:p-7 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#242220]/10">
                <h3 className="text-base font-bold text-[#111111]">
                  {language === 'ar' ? 'ملخص طلبك' : 'Order Summary'}
                </h3>
                <span className="text-xs text-[#242220]/60 tabular-nums">
                  {bagCount} {language === 'ar' ? 'قطع' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[#242220]/10 pe-1">
                {items.map((item) => {
                  const name = language === 'ar' ? item.product.nameAr : item.product.nameEn;
                  const color = language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn;

                  return (
                    <div key={item.id} className="py-3 flex gap-3 text-xs">
                      <div className="relative w-14 h-18 bg-[#EBE5DA] shrink-0 overflow-hidden">
                        <ImageWithFallback src={item.product.image} alt={name} fill className="object-cover" />
                        <span className="absolute top-1 end-1 bg-[#111111] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-[#111111] line-clamp-1">{name}</h4>
                          <p className="text-[11px] text-[#242220]/60 mt-0.5">
                            {color} · {item.selectedSize}
                          </p>
                        </div>
                        <span className="font-semibold text-[#111111] tabular-nums">
                          {formatMoney(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Box */}
              <div className="pt-4 border-t border-[#242220]/10 space-y-2">
                <label className="block text-xs font-semibold text-[#242220]/80">
                  {language === 'ar' ? 'رمز ترويجي أو إهداء' : 'Promotional or Gift Code'}
                </label>

                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#B59A73]/40 text-xs">
                    <div className="flex items-center gap-1.5 text-[#511D24] font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code}</span>
                      <span className="text-[11px] text-[#242220]/70">
                        ({language === 'ar' ? appliedPromo.descriptionAr : appliedPromo.descriptionEn})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] text-[#511D24] hover:underline font-semibold cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={language === 'ar' ? 'جرب: RIFAA10' : 'Try: RIFAA10'}
                      className="flex-1 py-2 px-3 bg-white border border-[#242220]/20 text-xs text-[#111111] focus:outline-hidden uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="py-2 px-4 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {language === 'ar' ? 'تطبيق' : 'Apply'}
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[11px] text-[#511D24] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoError}</span>
                  </p>
                )}

                {appliedPromo && !isPromoApplicable && (
                  <p className="text-[11px] text-[#511D24] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      {language === 'ar'
                        ? `هذا الرمز يتطلب حداً أدنى للطلب قدره ${formatMoney(appliedPromo.minOrder || 0)}`
                        : `This promo requires a minimum subtotal of ${formatMoney(appliedPromo.minOrder || 0)}`}
                    </span>
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-[#242220]/10 space-y-2.5 text-xs text-[#242220]/80">
                <div className="flex justify-between">
                  <span>{t.actions.subtotal}</span>
                  <span className="font-semibold text-[#111111] tabular-nums">
                    {formatMoney(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                  <span className="font-semibold text-[#111111] tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-[#511D24] font-bold">
                        {language === 'ar' ? 'مجاني' : 'Free'}
                      </span>
                    ) : (
                      formatMoney(deliveryFee)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#511D24] font-medium">
                    <span>{language === 'ar' ? 'قيمة الخصم' : 'Discount Applied'}</span>
                    <span className="tabular-nums">
                      -{formatMoney(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#242220]/10 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-[#111111]">{language === 'ar' ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                  <span className="text-lg font-bold text-[#111111] tabular-nums">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Commitments Trust Card */}
            <div className="bg-[#EAE4D9]/60 border border-[#242220]/10 p-5 space-y-3 text-xs text-[#242220]/80">
              <span className="text-[11px] uppercase tracking-wider text-[#511D24] font-semibold block">
                {language === 'ar' ? 'معايير تجربة رِفْعة المقترحة' : 'PROPOSED RIFAA EXPERIENCE'}
              </span>
              <ul className="space-y-2 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <Package className="w-3.5 h-3.5 text-[#511D24] shrink-0 mt-0.5" />
                  <span>
                    {language === 'ar'
                      ? 'تصور تجريبي لتغليف عرض فاخر بصندوق صلب ومواد أرشيفية قابلة للتطبيق في نسخة إنتاجية.'
                      : 'A demonstration concept for premium presentation packaging using rigid and archival materials in a future production implementation.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#511D24] shrink-0 mt-0.5" />
                  <span>
                    {language === 'ar'
                      ? 'نموذج سياسة يوضح كيف يمكن تقديم نافذة إرجاع واستبدال لمدة 14 يوماً في متجر إنتاجي.'
                      : 'A sample policy illustrating how a 14-day return and exchange window could work in a production store.'}
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
