'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Cloud,
  CloudOff,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAccount } from '@/context/AccountContext';
import { useLanguage } from '@/context/LanguageContext';

export function AccountAuthCard() {
  const { language } = useLanguage();
  const { user, isLoading, signIn, signUp, signOut } = useAuth();
  const { cloudSyncState } = useAccount();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  if (isLoading) {
    return (
      <div className="mb-8 flex items-center gap-3 border border-[#242220]/10 bg-[#FFFDFC] p-5 text-sm text-[#242220]/70">
        <Loader2 className="h-4 w-4 animate-spin text-[#511D24]" />
        <span>{language === 'ar' ? 'جاري التحقق من جلسة العميل...' : 'Checking your client session...'}</span>
      </div>
    );
  }

  if (user) {
    const synced = cloudSyncState === 'synced';
    const syncError = cloudSyncState === 'error';

    return (
      <section className="mb-8 border border-[#B59A73]/30 bg-[#FFFDFC] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            {syncError ? (
              <CloudOff className="mt-0.5 h-5 w-5 text-[#511D24]" />
            ) : (
              <Cloud className="mt-0.5 h-5 w-5 text-[#511D24]" />
            )}
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                {language === 'ar' ? 'حساب سحابي فعلي' : 'LIVE CLOUD ACCOUNT'}
              </span>
              <p className="mt-1 text-sm font-semibold text-[#111111]">{user.email}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#242220]/60">
                {syncError
                  ? language === 'ar'
                    ? 'الحساب مسجل الدخول، لكن آخر مزامنة لم تكتمل. ستظل البيانات المحلية متاحة.'
                    : 'You are signed in, but the latest cloud sync did not complete. Local data remains available.'
                  : synced
                    ? language === 'ar'
                      ? 'تمت مزامنة الملف والعناوين والمفضلة وسجل الطلبات التجريبية مع Supabase.'
                      : 'Profile, addresses, wishlist and demo-order history are synced with Supabase.'
                    : language === 'ar'
                      ? 'جاري مزامنة بيانات العميل...'
                      : 'Syncing client data...'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center justify-center gap-2 border border-[#242220]/20 px-5 py-2.5 text-xs font-semibold text-[#111111] transition-colors hover:border-[#511D24] hover:text-[#511D24]"
          >
            <LogOut className="h-4 w-4" />
            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}</span>
          </button>
        </div>
      </section>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    if (mode === 'signin') {
      const result = await signIn(form.email, form.password);
      setMessage(
        result.error ||
          (language === 'ar' ? 'تم تسجيل الدخول بنجاح.' : 'Signed in successfully.')
      );
    } else {
      const result = await signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });

      setMessage(
        result.error ||
          (result.needsEmailConfirmation
            ? language === 'ar'
              ? 'تم إنشاء الحساب. تحقق من بريدك لتأكيده إذا طُلب ذلك من مزود المصادقة.'
              : 'Account created. Check your email for confirmation if required by the auth provider.'
            : language === 'ar'
              ? 'تم إنشاء الحساب وتسجيل الدخول.'
              : 'Account created and signed in.')
      );
    }

    setBusy(false);
  };

  return (
    <section className="mb-8 overflow-hidden border border-[#242220]/10 bg-[#FFFDFC]">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#161514] p-6 text-white sm:p-8">
          <LockKeyhole className="h-6 w-6 text-[#B59A73]" />
          <span className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B59A73]">
            {language === 'ar' ? 'مساحة عميل آمنة' : 'SECURE CLIENT SPACE'}
          </span>
          <h2 className="mt-2 text-2xl font-bold">
            {language === 'ar' ? 'انقل تفضيلاتك من هذا الجهاز إلى حسابك.' : 'Carry your preferences beyond this device.'}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-white/65">
            {language === 'ar'
              ? 'تسجيل الدخول يفعّل المزامنة السحابية للملف والعناوين والمفضلة والمنتجات المشاهدة والطلبات التجريبية. بيانات البطاقة لا تُحفظ.'
              : 'Signing in enables cloud sync for your profile, addresses, wishlist, recently viewed items and demo orders. Card data is never stored.'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex border-b border-[#242220]/10">
            {[
              { id: 'signin' as const, ar: 'تسجيل الدخول', en: 'Sign in' },
              { id: 'signup' as const, ar: 'إنشاء حساب', en: 'Create account' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setMessage('');
                }}
                className={`border-b-2 px-4 py-3 text-xs font-semibold ${
                  mode === tab.id
                    ? 'border-[#511D24] text-[#511D24]'
                    : 'border-transparent text-[#242220]/55'
                }`}
              >
                {language === 'ar' ? tab.ar : tab.en}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                  placeholder={language === 'ar' ? 'الاسم الأول' : 'First name'}
                  className="border border-[#242220]/20 px-3.5 py-3 text-sm outline-none focus:border-[#111111]"
                />
                <input
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                  placeholder={language === 'ar' ? 'اسم العائلة' : 'Last name'}
                  className="border border-[#242220]/20 px-3.5 py-3 text-sm outline-none focus:border-[#111111]"
                />
              </div>
            )}

            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
              className="w-full border border-[#242220]/20 px-3.5 py-3 text-sm outline-none focus:border-[#111111]"
            />

            {mode === 'signup' && (
              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder={language === 'ar' ? 'رقم الجوال (اختياري)' : 'Mobile number (optional)'}
                className="w-full border border-[#242220]/20 px-3.5 py-3 text-sm outline-none focus:border-[#111111]"
              />
            )}

            <input
              required
              minLength={8}
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder={language === 'ar' ? 'كلمة المرور — 8 أحرف على الأقل' : 'Password — at least 8 characters'}
              className="w-full border border-[#242220]/20 px-3.5 py-3 text-sm outline-none focus:border-[#111111]"
            />

            {message && (
              <div role="status" className="flex items-start gap-2 bg-[#EAE4D9]/65 p-3 text-xs leading-relaxed text-[#242220]/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#511D24]" />
                <span>{message}</span>
              </div>
            )}

            <button
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#111111] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#511D24] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'signin' ? (
                <LogIn className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              <span>
                {mode === 'signin'
                  ? language === 'ar'
                    ? 'دخول آمن'
                    : 'Secure sign in'
                  : language === 'ar'
                    ? 'إنشاء الحساب'
                    : 'Create account'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
