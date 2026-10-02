'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useBag } from '@/context/BagContext';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function BagDrawer() {
  const { items, removeFromBag, updateQuantity, clearBag, subtotal, bagCount, isOpen, closeBag } = useBag();
  const { language, isRtl, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeBag}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-[#F7F4EF] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#242220]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
              <h2 className="text-base font-medium tracking-tight text-[#111111]">
                {t.actions.bag}
              </h2>
              <span className="text-xs text-[#242220]/60 tabular-nums">
                ({bagCount})
              </span>
            </div>
            <button
              onClick={closeBag}
              aria-label={t.actions.close}
              className="p-1.5 text-[#242220]/60 hover:text-[#111111] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#242220]/10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBE5DA] flex items-center justify-center text-[#242220]/40">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-[#111111]">{t.actions.emptyBag}</h3>
                  <p className="text-xs text-[#242220]/60 mt-1 max-w-xs">{t.actions.emptyBagSub}</p>
                </div>
                <button
                  onClick={closeBag}
                  className="mt-2 px-6 py-2.5 bg-[#111111] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#511D24] transition-colors cursor-pointer"
                >
                  {t.actions.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const name = language === 'ar' ? item.product.nameAr : item.product.nameEn;
                const colorName = language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn;
                return (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="relative w-20 h-24 bg-[#EBE5DA] shrink-0 overflow-hidden">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-[#111111] line-clamp-1">
                            {name}
                          </h4>
                          <button
                            onClick={() => removeFromBag(item.id)}
                            aria-label={t.actions.remove}
                            className="text-[#242220]/40 hover:text-[#511D24] transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-[#242220]/60 mt-1 space-x-2 rtl:space-x-reverse">
                          <span>{colorName}</span>
                          <span>·</span>
                          <span>{item.selectedSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#242220]/20 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#EBE5DA] text-[#111111] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-medium tabular-nums text-[#111111]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#EBE5DA] text-[#111111] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-semibold text-[#111111] tabular-nums">
                          {(item.product.price * item.quantity).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}{' '}
                          {t.actions.sar}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Note */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#242220]/10 bg-[#FFFDFC]/80 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#242220]/70">{t.actions.subtotal}:</span>
                <span className="text-base font-semibold text-[#111111] tabular-nums">
                  {subtotal.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t.actions.sar}
                </span>
              </div>
              <p className="text-[11px] text-[#242220]/60">{t.actions.shippingCalc}</p>

              {/* Demo Notice Banner */}
              <div className="p-3 bg-[#EAE3D6]/70 border-s-2 border-[#B59A73] text-[11px] text-[#242220]/80 leading-relaxed">
                {t.actions.checkoutNote}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert(language === 'ar' ? 'شكراً لاهتمامك بدار رِفْعة. هذه النسخة هي استعراض تصميم رقمي تمهيدي، وسيتم ربط بوابات الدفع الفعلية في المرحلة القادمة.' : 'Thank you for your interest in RIFAA. This is a digital portfolio preview. Production payment gateways will be integrated in the upcoming phase.');
                  }}
                  className="w-full py-3.5 px-6 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-medium tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>{t.actions.checkoutDemoBtn}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearBag}
                  className="w-full py-1 text-center text-xs text-[#242220]/50 hover:text-[#511D24] transition-colors"
                >
                  {t.actions.clear}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
