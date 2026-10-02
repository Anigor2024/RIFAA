'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Gift } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function TrustStrip() {
  const { t } = useLanguage();

  const standards = [
    {
      icon: Truck,
      title: t.trust.deliveryTitle,
      description: t.trust.deliveryDesc,
    },
    {
      icon: RotateCcw,
      title: t.trust.returnsTitle,
      description: t.trust.returnsDesc,
    },
    {
      icon: ShieldCheck,
      title: t.trust.secureTitle,
      description: t.trust.secureDesc,
    },
    {
      icon: Gift,
      title: t.trust.packagingTitle,
      description: t.trust.packagingDesc,
    },
  ];

  return (
    <section className="py-14 bg-[#F7F4EF] border-t border-[#242220]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {standards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-start space-y-2.5">
                <div className="p-2.5 bg-[#EAE3D6] text-[#111111]">
                  <Icon className="w-5 h-5 text-[#511D24]" />
                </div>
                <h4 className="text-sm font-semibold text-[#111111] tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-[#242220]/70 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
