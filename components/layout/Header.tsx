'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, Globe, UserRound, Columns3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useSearch } from '@/context/SearchContext';
import { MobileMenu } from './MobileMenu';
import { useCompare } from '@/context/CompareContext';

export function Header() {
  const { language, isRtl, toggleLanguage, t } = useLanguage();
  const { wishlistCount } = useWishlist();
  const { bagCount, openBag } = useBag();
  const { openSearch } = useSearch();
  const { compareCount } = useCompare();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      const commandSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const slashSearch = event.key === '/' && !isTyping;

      if (!commandSearch && !slashSearch) return;

      event.preventDefault();
      openSearch();
    };

    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, [openSearch]);

  const navLinks = [
    { href: '/women', label: t.nav.women },
    { href: '/men', label: t.nav.men },
    { href: '/kids', label: t.nav.kids },
    { href: '/new', label: t.nav.newIn },
    { href: '/collections', label: t.nav.collections },
    { href: '/discover', label: language === 'ar' ? 'المنسّق' : 'Curator' },
    { href: '/atelier', label: language === 'ar' ? 'المشغل' : 'Atelier' },
    { href: '/editorial', label: t.nav.editorial },
    { href: '/sale', label: t.nav.sale },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
          isScrolled
            ? 'bg-[#F7F4EF]/95 backdrop-blur-md border-b border-[#242220]/10 shadow-xs'
            : 'bg-gradient-to-b from-[#111111]/70 via-[#111111]/30 to-transparent'
        }`}
      >
        {/* Subtle Announcement Strip (Visible on desktop when not scrolled) */}
        {!isScrolled && (
          <div className="hidden lg:block w-full border-b border-white/10 py-1.5 px-6 text-center">
            <p className="text-xs tracking-[0.08em] text-white/90">
              {t.topBanner}
            </p>
          </div>
        )}

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Start Zone: Mobile Menu Toggle / Desktop Secondary & Language */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`md:hidden p-2 transition-colors cursor-pointer ${
                  isScrolled ? 'text-[#111111] hover:text-[#511D24]' : 'text-white'
                }`}
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Language Switcher (Desktop) */}
              <button
                onClick={toggleLanguage}
                className={`hidden md:flex items-center gap-1.5 text-xs font-medium tracking-wider transition-colors cursor-pointer py-1 px-2 ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#511D24]'
                    : 'text-white/90 hover:text-white'
                }`}
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{language === 'ar' ? 'EN' : 'العربية'}</span>
              </button>

              {/* Country Trust Marker */}
              <span
                className={`hidden xl:inline-block text-[11px] tracking-widest uppercase ${
                  isScrolled ? 'text-[#242220]/50' : 'text-white/60'
                }`}
              >
                {t.actions.country} · {t.actions.sar}
              </span>
            </div>

            {/* Center Zone: Brand Wordmark */}
            <div className="flex flex-col items-center justify-center">
              <Link
                href="/"
                className="group flex items-baseline gap-2.5 transition-transform duration-300 hover:scale-[1.01]"
              >
                <span
                  className={`text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-tight leading-none ${
                    isScrolled ? 'text-[#111111]' : 'text-white'
                  }`}
                >
                  {t.brandName}
                </span>
                <span
                  className={`font-editorial text-lg sm:text-xl lg:text-2xl tracking-[0.2em] font-medium uppercase ${
                    isScrolled ? 'text-[#511D24]' : 'text-[#EFECE6]'
                  }`}
                >
                  RIFAA
                </span>
              </Link>
              <span
                className={`hidden sm:block text-[10px] lg:text-[11px] tracking-[0.16em] uppercase font-light mt-1 ${
                  isScrolled ? 'text-[#242220]/50' : 'text-white/70'
                }`}
              >
                {t.brandTagline}
              </span>
            </div>

            {/* End Zone: Search, Wishlist, Bag */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Button */}
              <button
                onClick={openSearch}
                aria-keyshortcuts="Control+K Meta+K /"
                className={`flex items-center gap-1.5 p-2 transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#511D24]'
                    : 'text-white hover:text-[#F7F4EF]'
                }`}
                aria-label={t.actions.search}
              >
                <Search className="w-5 h-5" />
                <span className="hidden xl:inline text-[10px] font-semibold opacity-55">/</span>
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className={`hidden sm:inline-flex relative p-2 transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#511D24]'
                    : 'text-white hover:text-[#F7F4EF]'
                }`}
                aria-label={t.actions.account}
              >
                <UserRound className="w-5 h-5" />
              </Link>

              {/* Compare Studio */}
              <Link
                href="/compare"
                className={`relative hidden sm:inline-flex p-2 transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#511D24]'
                    : 'text-white hover:text-[#F7F4EF]'
                }`}
                aria-label={language === 'ar' ? 'استوديو المقارنة' : 'Compare Studio'}
              >
                <Columns3 className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-[#B59A73] text-[#111111] text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className={`relative p-2 transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#511D24]'
                    : 'text-white hover:text-[#F7F4EF]'
                }`}
                aria-label={t.actions.wishlist}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-[#511D24] text-white text-[10px] font-medium flex items-center justify-center tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button */}
              <button
                onClick={openBag}
                className={`relative p-2 transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-[#111111] hover:text-[#511D24]'
                    : 'text-white hover:text-[#F7F4EF]'
                }`}
                aria-label={t.actions.bag}
              >
                <ShoppingBag className="w-5 h-5" />
                {bagCount > 0 && (
                  <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-[#111111] text-white text-[10px] font-medium flex items-center justify-center tabular-nums ring-1 ring-white">
                    {bagCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Primary Navigation Bar */}
          <nav className="hidden md:flex items-center justify-center gap-3 lg:gap-5 py-3 border-t border-[#242220]/05">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.href === '/sale' ? 'hidden xl:inline-flex' : link.href === '/editorial' ? 'hidden lg:inline-flex' : 'inline-flex'} text-[13px] lg:text-sm font-semibold tracking-[0.1em] uppercase transition-colors relative py-1 after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100 ${
                  isScrolled
                    ? 'text-[#242220] hover:text-[#511D24]'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
