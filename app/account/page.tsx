'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Eye,
  Settings2,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAccount } from '@/context/AccountContext';
import { useAuth } from '@/context/AuthContext';
import { AccountAuthCard } from '@/components/account/AccountAuthCard';
import { DEMO_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/commerce';

type AccountTab = 'overview' | 'profile' | 'orders' | 'addresses' | 'preferences';

export default function AccountPage() {
  const { language, isRtl } = useLanguage();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const {
    profile,
    addresses,
    orders,
    recentlyViewedIds,
    preferences,
    isHydrated,
    cloudSyncState,
    saveProfile,
    addAddress,
    removeAddress,
    updatePreferences,
    clearDemoAccount,
  } = useAccount();

  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [profileSaved, setProfileSaved] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    city: '',
    district: '',
    street: '',
    building: '',
    postalCode: '',
  });

  const recentProducts = recentlyViewedIds
    .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is (typeof DEMO_PRODUCTS)[number] => Boolean(product));

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    (language === 'ar' ? 'ضيف رِفْعة' : 'RIFAA Guest');

  const tabs: {
    id: AccountTab;
    ar: string;
    en: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'overview', ar: 'نظرة عامة', en: 'Overview', icon: Sparkles },
    { id: 'profile', ar: 'الملف الشخصي', en: 'Profile', icon: UserRound },
    { id: 'orders', ar: 'الطلبات', en: 'Orders', icon: Package },
    { id: 'addresses', ar: 'العناوين', en: 'Addresses', icon: MapPin },
    { id: 'preferences', ar: 'التفضيلات', en: 'Preferences', icon: Settings2 },
  ];

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));

  const handleProfileField = (field: keyof typeof profile, value: string) => {
    saveProfile({ ...profile, [field]: value });
    setProfileSaved(false);
  };

  const handleAddAddress = (event: React.FormEvent) => {
    event.preventDefault();
    if (!addressForm.label.trim() || !addressForm.city.trim() || !addressForm.street.trim()) return;

    addAddress({
      label: addressForm.label.trim(),
      city: addressForm.city.trim(),
      district: addressForm.district.trim(),
      street: addressForm.street.trim(),
      building: addressForm.building.trim() || undefined,
      postalCode: addressForm.postalCode.trim() || undefined,
    });

    setAddressForm({
      label: '',
      city: '',
      district: '',
      street: '',
      building: '',
      postalCode: '',
    });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="border border-[#242220]/10 bg-[#FFFDFC] p-10">
            <UserRound className="mx-auto h-7 w-7 text-[#511D24]" />
            <p className="mt-3 text-sm font-semibold text-[#111111]">
              {language === 'ar' ? 'جاري تجهيز مساحة العميل...' : 'Preparing your client space...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] pt-32 sm:pt-36 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#242220]/50">
          <Link href="/" className="transition-colors hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#111111]">
            {language === 'ar' ? 'مساحة العميل' : 'Client Space'}
          </span>
        </nav>

        <header className="mb-8 border-b border-[#242220]/10 pb-8">
          <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#511D24]">
            {user
              ? language === 'ar'
                ? 'حساب عميل سحابي'
                : 'CLOUD CLIENT ACCOUNT'
              : language === 'ar'
                ? 'وضع الضيف المحلي'
                : 'LOCAL GUEST MODE'}
          </span>
          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl md:text-5xl">
                {language === 'ar' ? `مرحباً، ${displayName}` : `Welcome, ${displayName}`}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-[#242220]/70">
                {user
                  ? language === 'ar'
                    ? 'بيانات الملف والعناوين والمفضلة وسجل الطلبات التجريبية تتم مزامنتها مع حساب Supabase المحمي بسياسات RLS.'
                    : 'Profile, addresses, wishlist and demo-order history sync with a Supabase account protected by Row Level Security.'
                  : language === 'ar'
                    ? 'يمكنك الاستمرار كضيف محلي أو تسجيل الدخول لنقل بياناتك إلى المزامنة السحابية الآمنة.'
                    : 'Continue as a local guest or sign in to move your client data into secure cloud sync.'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 border border-[#B59A73]/35 bg-[#FFFDFC] px-4 py-2 text-[11px] text-[#242220]/70">
              <ShieldCheck className="h-4 w-4 text-[#511D24]" />
              <span>
                {user
                  ? cloudSyncState === 'synced'
                    ? language === 'ar'
                      ? 'مصادقة فعلية · المزامنة مكتملة'
                      : 'Live authentication · Cloud synced'
                    : language === 'ar'
                      ? 'مصادقة فعلية · المزامنة جارية'
                      : 'Live authentication · Syncing'
                  : language === 'ar'
                    ? 'بيانات الضيف تبقى على هذا الجهاز'
                    : 'Guest data stays on this device'}
              </span>
            </div>
          </div>
        </header>

        <AccountAuthCard />

        <div className="mb-8 overflow-x-auto border-y border-[#242220]/10 bg-[#FFFDFC]/70">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-5 py-4 text-xs font-semibold tracking-wide transition-colors sm:px-6 ${
                    active
                      ? 'border-[#511D24] text-[#511D24]'
                      : 'border-transparent text-[#242220]/60 hover:text-[#111111]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{language === 'ar' ? tab.ar : tab.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {[
                { icon: Heart, value: wishlistCount, ar: 'قطع محفوظة', en: 'Saved Pieces' },
                { icon: Package, value: orders.length, ar: user ? 'طلبات محفوظة' : 'طلبات تجريبية', en: user ? 'Saved Orders' : 'Demo Orders' },
                { icon: MapPin, value: addresses.length, ar: 'عناوين محفوظة', en: 'Saved Addresses' },
                { icon: Eye, value: recentProducts.length, ar: 'شوهدت مؤخراً', en: 'Recently Viewed' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.en} className="border border-[#242220]/10 bg-[#FFFDFC] p-5 sm:p-6">
                    <Icon className="h-5 w-5 text-[#511D24]" />
                    <span className="mt-4 block text-2xl font-bold text-[#111111] tabular-nums">
                      {item.value}
                    </span>
                    <span className="mt-1 block text-xs text-[#242220]/60">
                      {language === 'ar' ? item.ar : item.en}
                    </span>
                  </div>
                );
              })}
            </section>

            {orders.length > 0 && (
              <section className="border border-[#242220]/10 bg-[#FFFDFC] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                      {language === 'ar' ? 'آخر نشاط' : 'LATEST ACTIVITY'}
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-[#111111]">
                      {user ? (language === 'ar' ? 'آخر طلب محفوظ' : 'Latest Saved Order') : (language === 'ar' ? 'آخر طلب تجريبي' : 'Latest Demo Order')}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#511D24] hover:underline"
                  >
                    {language === 'ar' ? 'عرض كل الطلبات' : 'View all orders'}
                  </button>
                </div>
                <div className="mt-6 grid gap-4 border-t border-[#242220]/10 pt-5 sm:grid-cols-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#242220]/45">
                      {language === 'ar' ? 'المرجع' : 'Reference'}
                    </span>
                    <p className="mt-1 font-mono text-sm font-bold text-[#111111]">
                      {orders[0].orderReference}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#242220]/45">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#111111]">
                      {formatDate(orders[0].createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#242220]/45">
                      {language === 'ar' ? 'الإجمالي' : 'Total'}
                    </span>
                    <p className="mt-1 text-sm font-bold text-[#111111]">
                      {formatPrice(orders[0].total, language)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                    {language === 'ar' ? 'ذاكرة التصفح' : 'BROWSING MEMORY'}
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-[#111111]">
                    {language === 'ar' ? 'شوهدت مؤخراً' : 'Recently Viewed'}
                  </h2>
                </div>
                <Link
                  href="/new"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#511D24] hover:underline"
                >
                  <span>{language === 'ar' ? 'استكشف المزيد' : 'Explore more'}</span>
                  {isRtl ? (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </Link>
              </div>

              {recentProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                  {recentProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[#242220]/20 bg-[#FFFDFC]/60 px-6 py-12 text-center text-sm text-[#242220]/60">
                  {language === 'ar'
                    ? 'افتح أي منتج وسيظهر هنا تلقائياً لتسهيل الرجوع إليه.'
                    : 'Open any product and it will appear here automatically for easy return.'}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'profile' && (
          <section className="mx-auto max-w-3xl border border-[#242220]/10 bg-[#FFFDFC] p-6 sm:p-8">
            <div className="mb-6 border-b border-[#242220]/10 pb-5">
              <h2 className="text-xl font-bold text-[#111111]">
                {user ? (language === 'ar' ? 'ملف العميل السحابي' : 'Cloud Client Profile') : (language === 'ar' ? 'بيانات العميل المحلية' : 'Local Client Profile')}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#242220]/60">
                {user
                  ? language === 'ar'
                    ? 'الاسم والجوال والتفضيلات تُزامن مع حسابك. البريد مرتبط بهوية تسجيل الدخول.'
                    : 'Name, mobile number and preferences sync to your account. Email belongs to your login identity.'
                  : language === 'ar'
                    ? 'تُحفظ هذه البيانات محلياً حتى تختار تسجيل الدخول.'
                    : 'These details remain local until you choose to sign in.'}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { key: 'firstName' as const, ar: 'الاسم الأول', en: 'First name', type: 'text' },
                { key: 'lastName' as const, ar: 'اسم العائلة', en: 'Last name', type: 'text' },
                { key: 'email' as const, ar: 'البريد الإلكتروني', en: 'Email', type: 'email' },
                { key: 'phone' as const, ar: 'رقم الجوال', en: 'Mobile number', type: 'tel' },
              ].map((field) => (
                <label key={field.key} className="space-y-1.5 text-xs font-semibold text-[#242220]/80">
                  <span>{language === 'ar' ? field.ar : field.en}</span>
                  <input
                    type={field.type}
                    value={profile[field.key]}
                    onChange={(event) => handleProfileField(field.key, event.target.value)}
                    disabled={Boolean(user) && field.key === 'email'}
                    className="w-full border border-[#242220]/20 bg-white px-3.5 py-3 text-sm font-normal text-[#111111] outline-none transition-colors focus:border-[#111111] disabled:cursor-not-allowed disabled:bg-[#F3EFE8] disabled:text-[#242220]/55"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                setProfileSaved(true);
                window.setTimeout(() => setProfileSaved(false), 1600);
              }}
              className="mt-7 inline-flex items-center gap-2 bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#511D24]"
            >
              <Save className="h-4 w-4" />
              <span>
                {profileSaved
                  ? language === 'ar'
                    ? user
                      ? 'تم الحفظ والمزامنة'
                      : 'تم الحفظ محلياً'
                    : user
                      ? 'Saved & synced'
                      : 'Saved locally'
                  : language === 'ar'
                    ? 'حفظ الملف'
                    : 'Save Profile'}
              </span>
            </button>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="space-y-4">
            {orders.length === 0 ? (
              <div className="border border-dashed border-[#242220]/20 bg-[#FFFDFC] px-6 py-16 text-center">
                <Package className="mx-auto h-8 w-8 text-[#511D24]" />
                <h2 className="mt-4 text-lg font-bold text-[#111111]">
                  {language === 'ar' ? 'لا توجد طلبات تجريبية بعد' : 'No demo orders yet'}
                </h2>
                <p className="mt-2 text-xs text-[#242220]/60">
                  {language === 'ar'
                    ? 'أي طلب تجريبي جديد سيُحفظ هنا تلقائياً.'
                    : 'Any new demo checkout will be saved here automatically.'}
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const expanded = expandedOrder === order.orderReference;
                return (
                  <article key={order.orderReference} className="border border-[#242220]/10 bg-[#FFFDFC]">
                    <button
                      onClick={() => setExpandedOrder(expanded ? null : order.orderReference)}
                      className="grid w-full gap-4 p-5 text-start sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center sm:p-6"
                    >
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#242220]/45">
                          {language === 'ar' ? 'مرجع الطلب' : 'Order Reference'}
                        </span>
                        <p className="mt-1 font-mono text-sm font-bold text-[#111111]">
                          {order.orderReference}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#242220]/45">
                          {language === 'ar' ? 'التاريخ' : 'Date'}
                        </span>
                        <p className="mt-1 text-xs font-semibold text-[#111111]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#242220]/45">
                          {language === 'ar' ? 'الإجمالي' : 'Total'}
                        </span>
                        <p className="mt-1 text-sm font-bold text-[#111111]">
                          {formatPrice(order.total, language)}
                        </p>
                      </div>
                      {expanded ? (
                        <ChevronUp className="h-4 w-4 text-[#511D24]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#511D24]" />
                      )}
                    </button>

                    {expanded && (
                      <div className="border-t border-[#242220]/10 px-5 py-5 sm:px-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#511D24]">
                              {language === 'ar' ? 'القطع' : 'ITEMS'}
                            </span>
                            <div className="mt-3 space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 text-xs">
                                  <span className="text-[#242220]/75">
                                    {language === 'ar' ? item.productNameAr : item.productNameEn} × {item.quantity}
                                  </span>
                                  <span className="font-semibold text-[#111111]">
                                    {formatPrice(item.lineTotal, language)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#511D24]">
                              {language === 'ar' ? 'الوجهة' : 'DESTINATION'}
                            </span>
                            <p className="mt-3 text-xs leading-relaxed text-[#242220]/75">
                              {order.deliveryAddress.city} · {order.deliveryAddress.district}
                              <br />
                              {order.deliveryAddress.street}
                            </p>
                            <p className="mt-3 text-[11px] text-[#242220]/55">
                              {language === 'ar'
                                ? 'طلب توضيحي فقط — لا توجد عملية شحن أو تحصيل حقيقية.'
                                : 'Demonstration order only — no real shipment or payment is processed.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </section>
        )}

        {activeTab === 'addresses' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={handleAddAddress} className="border border-[#242220]/10 bg-[#FFFDFC] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111111]">
                {user ? (language === 'ar' ? 'إضافة عنوان توصيل' : 'Add Delivery Address') : (language === 'ar' ? 'إضافة عنوان محلي' : 'Add Local Address')}
              </h2>
              <p className="mt-1 text-xs text-[#242220]/60">
                {user
                  ? language === 'ar'
                    ? 'سيُحفظ العنوان داخل حسابك السحابي ولا يراه سوى المستخدم المصادق عليه.'
                    : 'This address is stored in your cloud account and is protected by user-level access policies.'
                  : language === 'ar'
                    ? 'العنوان يبقى محلياً على هذا الجهاز حتى تسجيل الدخول.'
                    : 'The address remains local to this device until you sign in.'}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { key: 'label', ar: 'اسم العنوان', en: 'Label', placeholder: language === 'ar' ? 'المنزل' : 'Home' },
                  { key: 'city', ar: 'المدينة', en: 'City', placeholder: language === 'ar' ? 'الرياض' : 'Riyadh' },
                  { key: 'district', ar: 'الحي', en: 'District', placeholder: language === 'ar' ? 'حي تجريبي' : 'Demo district' },
                  { key: 'street', ar: 'الشارع', en: 'Street', placeholder: language === 'ar' ? 'شارع تجريبي' : 'Demo street' },
                  { key: 'building', ar: 'المبنى / الوحدة', en: 'Building / Unit', placeholder: '12' },
                  { key: 'postalCode', ar: 'الرمز البريدي', en: 'Postal code', placeholder: '12211' },
                ].map((field) => (
                  <label key={field.key} className="space-y-1.5 text-xs font-semibold text-[#242220]/80">
                    <span>{language === 'ar' ? field.ar : field.en}</span>
                    <input
                      value={addressForm[field.key as keyof typeof addressForm]}
                      onChange={(event) =>
                        setAddressForm((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full border border-[#242220]/20 bg-white px-3.5 py-3 text-sm font-normal text-[#111111] outline-none focus:border-[#111111]"
                    />
                  </label>
                ))}
              </div>

              <button className="mt-6 inline-flex items-center gap-2 bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#511D24]">
                <Plus className="h-4 w-4" />
                <span>{user ? (language === 'ar' ? 'حفظ العنوان' : 'Save Address') : (language === 'ar' ? 'حفظ محلياً' : 'Save Locally')}</span>
              </button>
            </form>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#111111]">
                {language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}
              </h2>

              {addresses.length === 0 ? (
                <div className="border border-dashed border-[#242220]/20 bg-[#FFFDFC]/60 p-10 text-center text-xs text-[#242220]/60">
                  {language === 'ar'
                    ? 'لم يتم حفظ أي عناوين تجريبية بعد.'
                    : 'No demo addresses saved yet.'}
                </div>
              ) : (
                addresses.map((address) => (
                  <article key={address.id} className="border border-[#242220]/10 bg-[#FFFDFC] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#111111]">{address.label}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-[#242220]/70">
                          {address.city}
                          {address.district ? ` · ${address.district}` : ''}
                          <br />
                          {address.street}
                          {address.building ? ` · ${address.building}` : ''}
                          <br />
                          {address.postalCode || ''}
                        </p>
                      </div>

                      <button
                        onClick={() => removeAddress(address.id)}
                        aria-label={language === 'ar' ? 'حذف العنوان' : 'Remove address'}
                        className="p-2 text-[#242220]/45 transition-colors hover:text-[#511D24]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>
        )}

        {activeTab === 'preferences' && (
          <section className="mx-auto max-w-3xl space-y-6">
            <div className="border border-[#242220]/10 bg-[#FFFDFC] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111111]">
                {user ? (language === 'ar' ? 'تفضيلات الحساب' : 'Account Preferences') : (language === 'ar' ? 'تفضيلات التجربة' : 'Experience Preferences')}
              </h2>

              <div className="mt-6 space-y-6">
                <label className="block space-y-2 text-xs font-semibold text-[#242220]/80">
                  <span>{language === 'ar' ? 'القسم المفضل' : 'Preferred department'}</span>
                  <select
                    value={preferences.preferredDepartment}
                    onChange={(event) =>
                      updatePreferences({
                        ...preferences,
                        preferredDepartment: event.target.value as typeof preferences.preferredDepartment,
                      })
                    }
                    className="w-full border border-[#242220]/20 bg-white px-3.5 py-3 text-sm font-normal text-[#111111] outline-none focus:border-[#111111]"
                  >
                    <option value="all">{language === 'ar' ? 'كل الأقسام' : 'All departments'}</option>
                    <option value="women">{language === 'ar' ? 'النساء' : 'Women'}</option>
                    <option value="men">{language === 'ar' ? 'الرجال' : 'Men'}</option>
                    <option value="kids">{language === 'ar' ? 'الأطفال' : 'Kids'}</option>
                  </select>
                </label>

                <label className="flex items-center justify-between gap-5 border-t border-[#242220]/10 pt-5">
                  <div>
                    <span className="block text-sm font-semibold text-[#111111]">
                      {language === 'ar' ? 'محاكاة تحديثات الإصدارات' : 'Simulate release updates'}
                    </span>
                    <span className="mt-1 block text-xs text-[#242220]/55">
                      {language === 'ar'
                        ? 'تفضيل واجهة فقط؛ لا يتم إرسال أي بريد فعلي.'
                        : 'Interface preference only; no real email is sent.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={(event) =>
                      updatePreferences({ ...preferences, emailUpdates: event.target.checked })
                    }
                    className="h-5 w-5 accent-[#511D24]"
                  />
                </label>
              </div>
            </div>

            {!user && (
            <div className="border border-[#511D24]/15 bg-[#511D24]/[0.03] p-6">
              <h3 className="text-sm font-bold text-[#111111]">
                {language === 'ar' ? 'إعادة ضبط بيانات الضيف' : 'Reset Guest Data'}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#242220]/60">
                {language === 'ar'
                  ? 'يمسح الملف والعناوين وسجل الطلبات والمنتجات المشاهدة من هذا المتصفح فقط.'
                  : 'Clears the profile, addresses, order history, and recently viewed products from this browser only.'}
              </p>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      language === 'ar'
                        ? 'مسح بيانات الحساب التجريبي المحلية؟'
                        : 'Clear local demo account data?'
                    )
                  ) {
                    clearDemoAccount();
                    setActiveTab('overview');
                  }
                }}
                className="mt-4 border border-[#511D24] px-5 py-2.5 text-xs font-semibold text-[#511D24] transition-colors hover:bg-[#511D24] hover:text-white"
              >
                {language === 'ar' ? 'مسح بيانات الحساب' : 'Clear Account Data'}
              </button>
            </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
