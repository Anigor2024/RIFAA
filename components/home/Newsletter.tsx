'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Newsletter() {
  const { isRtl, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-[#161514] text-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <span className="font-editorial text-xs tracking-[0.3em] text-[#B59A73] uppercase block">
            {t.newsletter.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            {t.newsletter.title}
          </h2>
          <p className="text-sm sm:text-base text-[#D9D0C4]/80 font-light max-w-lg mx-auto leading-relaxed pt-1">
            {t.newsletter.description}
          </p>
        </div>

        {submitted ? (
          <div role="status" aria-live="polite" className="py-6 px-8 bg-[#242220] border border-[#B59A73]/40 inline-flex items-center gap-3 text-xs sm:text-sm text-white">
            <Check className="w-5 h-5 text-[#B59A73]" />
            <span>{t.newsletter.successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-2 space-y-3">
            <div className="flex border border-white/30 focus-within:border-white transition-colors bg-white/5">
              <input
                type="email"
                name="email"
                autoComplete="email"
                aria-label={t.newsletter.placeholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="flex-1 bg-transparent py-3.5 px-4 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-hidden"
              />
              <button
                type="submit"
                className="py-3.5 px-6 bg-white hover:bg-[#F7F4EF] text-[#111111] text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>{t.newsletter.submit}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-[#FAF8F5]/40 font-light">
              {t.newsletter.disclaimer}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
