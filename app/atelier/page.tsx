'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Heart,
  Layers3,
  ScanSearch,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { useQuickView } from '@/context/QuickViewContext';
import { ATELIER_EDITS } from '@/data/atelier';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';

type SelectionMap = Record<string, { colorNameEn: string; size: string }>;

function createDefaultSelections(): SelectionMap {
  return Object.fromEntries(
    DEMO_PRODUCTS.map((product) => [
      product.id,
      {
        colorNameEn: product.colors[0]?.nameEn || '',
        size: product.sizes[0] || 'M',
      },
    ])
  );
}

export default function AtelierPage() {
  const { language, isRtl } = useLanguage();
  const searchParams = useSearchParams();
  const { addManyToBag } = useBag();
  const { wishlistIds, addManyToWishlist } = useWishlist();
  const { openQuickView } = useQuickView();

  const requestedEdit = searchParams.get('edit');
  const initialEdit = ATELIER_EDITS.some((edit) => edit.id === requestedEdit)
    ? requestedEdit!
    : ATELIER_EDITS[0].id;

  const [activeId, setActiveId] = useState(initialEdit);
  const [selections, setSelections] = useState<SelectionMap>(createDefaultSelections);

  const activeEdit = ATELIER_EDITS.find((edit) => edit.id === activeId) || ATELIER_EDITS[0];
  const products = useMemo(
    () =>
      activeEdit.productIds
        .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
        .filter((product): product is (typeof DEMO_PRODUCTS)[number] => Boolean(product)),
    [activeEdit]
  );

  const total = products.reduce((sum, product) => sum + product.price, 0);
  const allSaved = products.length > 0 && products.every((product) => wishlistIds.includes(product.id));

  const getSelectedColor = (product: (typeof DEMO_PRODUCTS)[number]) =>
    product.colors.find((color) => color.nameEn === selections[product.id]?.colorNameEn) ||
    product.colors[0];

  const setColor = (productId: string, colorNameEn: string) => {
    setSelections((current) => ({
      ...current,
      [productId]: {
        colorNameEn,
        size: current[productId]?.size || 'M',
      },
    }));
  };

  const setSize = (productId: string, size: string) => {
    setSelections((current) => ({
      ...current,
      [productId]: {
        colorNameEn: current[productId]?.colorNameEn || '',
        size,
      },
    }));
  };

  const addFullEdit = () => {
    addManyToBag(
      products.map((product) => ({
        product,
        color: getSelectedColor(product),
        size: selections[product.id]?.size || product.sizes[0] || 'M',
        quantity: 1,
      }))
    );
  };

  const saveFullEdit = () => {
    addManyToWishlist(products.map((product) => product.id));
  };

  const compareRows = [
    {
      ar: 'الخامة',
      en: 'Fabric',
      value: (product: (typeof DEMO_PRODUCTS)[number]) =>
        language === 'ar' ? product.fabricAr : product.fabricEn,
    },
    {
      ar: 'التفصيل',
      en: 'Tailoring',
      value: (product: (typeof DEMO_PRODUCTS)[number]) =>
        language === 'ar' ? product.tailoringAr : product.tailoringEn,
    },
    {
      ar: 'القصّة',
      en: 'Fit',
      value: (product: (typeof DEMO_PRODUCTS)[number]) =>
        language === 'ar' ? product.fitAr : product.fitEn,
    },
    {
      ar: 'العناية',
      en: 'Care',
      value: (product: (typeof DEMO_PRODUCTS)[number]) =>
        language === 'ar' ? product.careAr : product.careEn,
    },
    {
      ar: 'الحرفة',
      en: 'Craft',
      value: (product: (typeof DEMO_PRODUCTS)[number]) =>
        language === 'ar' ? product.originAr : product.originEn,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'مشغل رِفْعة' : 'RIFAA Atelier'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-9 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Layers3 className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.27em]">
                {language === 'ar' ? 'مشغل التنسيق الرقمي' : 'DIGITAL STYLING ATELIER'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'نسّق القطع، قارن تفاصيلها، واحفظ الإطلالة كقرار واحد.'
                : 'Compose pieces, compare the details, and treat the look as one decision.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'كل تحرير هنا مكوّن من ثلاث قطع متكاملة. اختر اللون والمقاس لكل قطعة، افحص الخامة والتفصيل، ثم أضف المجموعة كلها للحقيبة أو المفضلة.'
              : 'Each edit is built from three coordinated pieces. Choose color and size, inspect fabrication and tailoring, then save or bag the whole composition.'}
          </p>
        </header>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {ATELIER_EDITS.map((edit, index) => {
            const active = edit.id === activeId;
            return (
              <button
                key={edit.id}
                type="button"
                onClick={() => setActiveId(edit.id)}
                className={
                  active
                    ? 'min-w-max border border-[#111111] bg-[#111111] px-5 py-3 text-start text-white'
                    : 'min-w-max border border-[#242220]/12 bg-[#FFFDFC] px-5 py-3 text-start text-[#111111] transition-colors hover:border-[#511D24]/35'
                }
              >
                <span className={active ? 'font-editorial text-xs text-[#D9D0C4]' : 'font-editorial text-xs text-[#B59A73]'}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="ms-3 text-xs font-bold">
                  {language === 'ar' ? edit.titleAr : edit.titleEn}
                </span>
              </button>
            );
          })}
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid min-h-[680px] grid-cols-2 grid-rows-2 gap-3 bg-[#E7E0D4] p-3 sm:gap-4 sm:p-4">
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => openQuickView(product)}
                className={
                  index === 0
                    ? 'group relative row-span-2 overflow-hidden bg-[#D8D0C4] text-start'
                    : 'group relative overflow-hidden bg-[#D8D0C4] text-start'
                }
                aria-label={
                  (language === 'ar' ? 'عرض سريع: ' : 'Quick view: ') +
                  (language === 'ar' ? product.nameAr : product.nameEn)
                }
              >
                <ImageWithFallback
                  src={product.image}
                  alt={language === 'ar' ? product.nameAr : product.nameEn}
                  fill
                  sizes={index === 0 ? '(max-width: 1024px) 50vw, 40vw' : '(max-width: 1024px) 50vw, 25vw'}
                  className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <span className="font-editorial text-xs text-[#D9D0C4]">0{index + 1}</span>
                  <span className="mt-1 block text-sm font-bold sm:text-base">
                    {language === 'ar' ? product.nameAr : product.nameEn}
                  </span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-white/55">
                    {language === 'ar' ? product.categoryAr : product.categoryEn}
                  </span>
                </div>
                <div className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-sm">
                  <Eye className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>

          <div className="border border-[#242220]/10 bg-[#FFFDFC] p-5 sm:p-7">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#511D24]">
              {language === 'ar' ? activeEdit.departmentAr : activeEdit.departmentEn}
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111111]">
              {language === 'ar' ? activeEdit.titleAr : activeEdit.titleEn}
            </h2>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#B59A73]">
              {language === 'ar' ? activeEdit.subtitleAr : activeEdit.subtitleEn}
            </p>
            <p className="mt-5 text-sm font-light leading-7 text-[#242220]/68">
              {language === 'ar' ? activeEdit.descriptionAr : activeEdit.descriptionEn}
            </p>

            <div className="mt-7 divide-y divide-[#242220]/10 border-y border-[#242220]/10">
              {products.map((product, index) => {
                const selectedColor = getSelectedColor(product);
                const selectedSize = selections[product.id]?.size || product.sizes[0] || 'M';
                return (
                  <div key={product.id} className="py-5">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <span className="font-editorial text-xs text-[#B59A73]">0{index + 1}</span>
                        <Link
                          href={'/products/' + product.slug}
                          className="ms-2 text-sm font-bold text-[#111111] transition-colors hover:text-[#511D24]"
                        >
                          {language === 'ar' ? product.nameAr : product.nameEn}
                        </Link>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-[#111111]">
                        {formatPrice(product.price, language)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_130px]">
                      <div>
                        <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#242220]/42">
                          {language === 'ar' ? 'اللون' : 'COLOR'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => {
                            const selected = selectedColor?.nameEn === color.nameEn;
                            return (
                              <button
                                key={color.nameEn}
                                type="button"
                                onClick={() => setColor(product.id, color.nameEn)}
                                title={language === 'ar' ? color.nameAr : color.nameEn}
                                className={
                                  selected
                                    ? 'flex h-8 items-center gap-2 border border-[#111111] bg-[#F7F4EF] px-2.5 text-[10px] font-semibold text-[#111111]'
                                    : 'flex h-8 items-center gap-2 border border-[#242220]/12 px-2.5 text-[10px] text-[#242220]/60 hover:border-[#511D24]/35'
                                }
                              >
                                <span
                                  className="h-3 w-3 rounded-full border border-black/10"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span>{language === 'ar' ? color.nameAr : color.nameEn}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <label>
                        <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#242220]/42">
                          {language === 'ar' ? 'المقاس' : 'SIZE'}
                        </span>
                        <select
                          value={selectedSize}
                          onChange={(event) => setSize(product.id, event.target.value)}
                          className="h-9 w-full border border-[#242220]/15 bg-white px-3 text-xs text-[#111111] outline-none focus:border-[#511D24]"
                        >
                          {product.sizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-end justify-between gap-5">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#242220]/42">
                  {language === 'ar' ? 'إجمالي الإطلالة' : 'EDIT TOTAL'}
                </span>
                <span className="mt-1 block text-2xl font-bold text-[#111111]">
                  {formatPrice(total, language)}
                </span>
              </div>
              <span className="text-[10px] leading-5 text-[#242220]/42">
                {language === 'ar' ? '٣ قطع · قبل الشحن والخصومات' : '3 pieces · before delivery & discounts'}
              </span>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={addFullEdit}
                className="group inline-flex min-h-12 items-center justify-center gap-2 bg-[#111111] px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#511D24]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{language === 'ar' ? 'أضف الإطلالة للحقيبة' : 'Add full edit to bag'}</span>
              </button>
              <button
                type="button"
                onClick={saveFullEdit}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#111111] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#111111] transition-colors hover:bg-[#F7F4EF]"
              >
                {allSaved ? <Check className="h-4 w-4 text-[#511D24]" /> : <Heart className="h-4 w-4" />}
                <span>
                  {allSaved
                    ? language === 'ar'
                      ? 'الإطلالة محفوظة'
                      : 'Edit saved'
                    : language === 'ar'
                      ? 'احفظ الإطلالة'
                      : 'Save full edit'}
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-[#242220]/10 pt-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <ScanSearch className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                  {language === 'ar' ? 'مقارنة الخامات والتفصيل' : 'MATERIAL & TAILORING COMPARE'}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-[#111111] sm:text-3xl">
                {language === 'ar' ? 'افهم لماذا تعمل القطع معاً.' : 'See why the pieces work together.'}
              </h2>
            </div>
            <p className="max-w-lg text-xs leading-6 text-[#242220]/55">
              {language === 'ar'
                ? 'المقارنة هنا تعتمد فقط على بيانات المنتجات الموجودة داخل رِفْعة، بدون ادعاءات قياس أو ملاءمة آلية غير موثقة.'
                : 'This comparison uses only the product data already present in RIFAA, without unverified automated fit claims.'}
            </p>
          </div>

          <div className="overflow-x-auto border border-[#242220]/10 bg-[#FFFDFC]">
            <table className="min-w-[900px] w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-[#242220]/10 bg-[#EEE8DE]/55">
                  <th className="w-[160px] p-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#242220]/45">
                    {language === 'ar' ? 'المعيار' : 'ATTRIBUTE'}
                  </th>
                  {products.map((product) => (
                    <th key={product.id} className="p-4 text-start text-xs font-bold text-[#111111]">
                      {language === 'ar' ? product.nameAr : product.nameEn}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.en} className="border-b border-[#242220]/08 last:border-b-0">
                    <th className="p-4 text-start text-[10px] font-semibold uppercase tracking-[0.14em] text-[#511D24]">
                      {language === 'ar' ? row.ar : row.en}
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 align-top text-xs font-light leading-6 text-[#242220]/65">
                        {row.value(product) || (language === 'ar' ? 'غير محدد' : 'Not specified')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              ar: 'ابدأ بالقطعة المحورية',
              en: 'Anchor the composition',
              descAr: 'القطعة الأولى تحدد لغة الإطلالة واتجاه الخامة.',
              descEn: 'The first piece establishes the visual and material direction.',
            },
            {
              icon: Layers3,
              ar: 'وازن النسب والطبقات',
              en: 'Balance proportion',
              descAr: 'القطعة الثانية تضبط النسبة والحركة بين الأعلى والأسفل.',
              descEn: 'The second piece controls proportion, movement and layering.',
            },
            {
              icon: Heart,
              ar: 'اختم بتفصيل له وظيفة',
              en: 'Finish with purpose',
              descAr: 'القطعة الأخيرة تكمل الحضور بدون إضافة ضوضاء بصرية.',
              descEn: 'The final piece completes the look without unnecessary visual noise.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.en} className="bg-[#F7F4EF] p-6">
                <Icon className="h-4 w-4 text-[#511D24]" />
                <h3 className="mt-4 text-sm font-bold text-[#111111]">
                  {language === 'ar' ? item.ar : item.en}
                </h3>
                <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">
                  {language === 'ar' ? item.descAr : item.descEn}
                </p>
              </div>
            );
          })}
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/discover"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
          >
            <span>{language === 'ar' ? 'تحتاج اقتراحاً؟ ابدأ بمنسّق رِفْعة' : 'Need a suggestion? Start with the RIFAA Curator'}</span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
