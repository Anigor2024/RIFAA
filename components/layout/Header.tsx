'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Columns3,
  Globe,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useSearch } from '@/context/SearchContext';
import { useCompare } from '@/context/CompareContext';
import { MobileMenu } from './MobileMenu';
import { MegaMenu } from './MegaMenu';
import { MEGA_NAVIGATION, MegaNavKey } from '@/data/navigation';

export function Header() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { wishlistCount } = useWishlist();
  const { bagCount, openBag } = useBag();
  const { openSearch } = useSearch();
  const { compareCount } = useCompare();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MegaNavKey | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === '/';
  const overlayMode = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 28);
    };

    handleScroll();
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

      const commandSearch =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const slashSearch = event.key === '/' && !isTyping;

      if (!commandSearch && !slashSearch) return;

      event.preventDefault();
      openSearch();
    };

    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, [openSearch]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMenu(null);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (key: MegaNavKey) => {
    cancelClose();
    setActiveMenu(key);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const closeMenu = () => {
    cancelClose();
    setActiveMenu(null);
  };

  const activeConfig = MEGA_NAVIGATION.find((item) => item.key === activeMenu);

  return (
    <>
      <header
        className={
          'fixed inset-x-0 top-0 z-40 transition-all duration-500 ' +
          (overlayMode
            ? 'bg-gradient-to-b from-[#111111]/82 via-[#111111]/38 to-transparent'
            : 'border-b border-[#242220]/10 bg-[#F7F4EF]/96 shadow-[0_8px_30px_rgba(17,17,17,0.045)] backdrop-blur-xl')
        }
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        {overlayMode && (
          <div className="hidden w-full border-b border-white/10 px-6 py-2 text-center lg:block">
            <p className="text-[11px] font-medium tracking-[0.11em] text-white/88">
              {t.topBanner}
            </p>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between md:h-[86px]">
            <div className="flex min-w-[120px] items-center gap-3 lg:min-w-[220px]">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={
                  'cursor-pointer p-2 transition-colors md:hidden ' +
                  (overlayMode ? 'text-white' : 'text-[#111111] hover:text-[#511D24]')
                }
                aria-label={language === 'ar' ? 'فتح القائمة' : 'Open navigation menu'}
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={toggleLanguage}
                className={
                  'hidden items-center gap-1.5 px-2 py-1 text-xs font-semibold tracking-wider transition-colors md:flex ' +
                  (overlayMode
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#111111] hover:text-[#511D24]')
                }
                title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="uppercase">{language === 'ar' ? 'EN' : 'العربية'}</span>
              </button>

              <span
                className={
                  'hidden text-[10px] font-medium uppercase tracking-[0.13em] xl:inline-block ' +
                  (overlayMode ? 'text-white/55' : 'text-[#242220]/45')
                }
              >
                {t.actions.country} · {t.actions.sar}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Link
                href="/"
                onClick={closeMenu}
                className="group flex items-baseline gap-3 transition-transform duration-300 hover:scale-[1.012]"
              >
                <span
                  className={
                    'text-[2rem] font-bold leading-none tracking-[-0.035em] sm:text-[2.25rem] lg:text-[2.55rem] ' +
                    (overlayMode ? 'text-white' : 'text-[#111111]')
                  }
                >
                  {t.brandName}
                </span>
                <span
                  className={
                    'font-editorial text-xl font-semibold uppercase tracking-[0.22em] sm:text-2xl lg:text-[1.7rem] ' +
                    (overlayMode ? 'text-[#F1EEE8]' : 'text-[#511D24]')
                  }
                >
                  RIFAA
                </span>
              </Link>
              <span
                className={
                  'mt-1 hidden text-[10px] font-medium uppercase tracking-[0.18em] sm:block lg:text-[11px] ' +
                  (overlayMode ? 'text-white/68' : 'text-[#242220]/48')
                }
              >
                {t.brandTagline}
              </span>
            </div>

            <div className="flex min-w-[120px] items-center justify-end gap-0.5 sm:gap-1 lg:min-w-[220px]">
              <button
                type="button"
                onClick={openSearch}
                aria-keyshortcuts="Control+K Meta+K /"
                className={
                  'flex cursor-pointer items-center gap-1.5 p-2 transition-colors ' +
                  (overlayMode
                    ? 'text-white hover:text-[#F7F4EF]'
                    : 'text-[#111111] hover:text-[#511D24]')
                }
                aria-label={t.actions.search}
              >
                <Search className="h-5 w-5" />
                <span className="hidden text-[10px] font-semibold opacity-50 xl:inline">/</span>
              </button>

              <Link
                href="/account"
                className={
                  'relative hidden p-2 transition-colors sm:inline-flex ' +
                  (overlayMode
                    ? 'text-white hover:text-[#F7F4EF]'
                    : 'text-[#111111] hover:text-[#511D24]')
                }
                aria-label={t.actions.account}
              >
                <UserRound className="h-5 w-5" />
              </Link>

              <Link
                href="/compare"
                className={
                  'relative hidden p-2 transition-colors sm:inline-flex ' +
                  (overlayMode
                    ? 'text-white hover:text-[#F7F4EF]'
                    : 'text-[#111111] hover:text-[#511D24]')
                }
                aria-label={language === 'ar' ? 'استوديو المقارنة' : 'Compare Studio'}
              >
                <Columns3 className="h-5 w-5" />
                {compareCount > 0 && (
                  <span className="absolute end-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B59A73] text-[9px] font-bold text-[#111111]">
                    {compareCount}
                  </span>
                )}
              </Link>

              <Link
                href="/wishlist"
                className={
                  'relative p-2 transition-colors ' +
                  (overlayMode
                    ? 'text-white hover:text-[#F7F4EF]'
                    : 'text-[#111111] hover:text-[#511D24]')
                }
                aria-label={t.actions.wishlist}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute end-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#511D24] text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openBag}
                className={
                  'relative cursor-pointer p-2 transition-colors ' +
                  (overlayMode
                    ? 'text-white hover:text-[#F7F4EF]'
                    : 'text-[#111111] hover:text-[#511D24]')
                }
                aria-label={t.actions.bag}
              >
                <ShoppingBag className="h-5 w-5" />
                {bagCount > 0 && (
                  <span className="absolute end-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[9px] font-bold text-white ring-1 ring-white/70">
                    {bagCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <nav
            className={
              'hidden items-center justify-center gap-1 border-t py-1.5 md:flex ' +
              (overlayMode ? 'border-white/12' : 'border-[#242220]/[0.07]')
            }
            aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'}
            onFocus={cancelClose}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                scheduleClose();
              }
            }}
          >
            {MEGA_NAVIGATION.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href + '/'));
              const expanded = activeMenu === item.key;

              return (
                <div
                  key={item.key}
                  className={
                    item.key === 'sale'
                      ? 'hidden xl:block'
                      : item.key === 'editorial'
                        ? 'hidden lg:block'
                        : 'block'
                  }
                  onMouseEnter={() => openMenu(item.key)}
                >
                  <Link
                    href={item.href}
                    onFocus={() => openMenu(item.key)}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowDown') return;
                      event.preventDefault();
                      openMenu(item.key);
                      window.setTimeout(() => {
                        const firstLink = document.querySelector<HTMLAnchorElement>(
                          '[data-mega-menu="' + item.key + '"] a'
                        );
                        firstLink?.focus();
                      }, 0);
                    }}
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    className={
                      'group relative inline-flex min-h-[42px] items-center gap-1.5 px-3 text-[14px] font-bold tracking-[0.055em] transition-colors lg:px-4 lg:text-[15px] xl:text-[15.5px] ' +
                      (overlayMode
                        ? active || expanded
                          ? 'text-white'
                          : 'text-white/88 hover:text-white'
                        : active || expanded
                          ? 'text-[#511D24]'
                          : 'text-[#242220] hover:text-[#511D24]')
                    }
                  >
                    <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                    <ChevronDown
                      className={
                        'h-3.5 w-3.5 opacity-45 transition-transform duration-300 ' +
                        (expanded ? 'rotate-180 opacity-80' : '')
                      }
                    />
                    <span
                      className={
                        'absolute inset-x-3 bottom-0 h-[2px] origin-center transition-transform duration-300 ' +
                        (overlayMode ? 'bg-white' : 'bg-[#511D24]') +
                        (active || expanded ? ' scale-x-100' : ' scale-x-0 group-hover:scale-x-100')
                      }
                    />
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div
          className={
            'absolute inset-x-0 top-full overflow-hidden transition-all duration-300 ' +
            (activeConfig
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0')
          }
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {activeConfig && <MegaMenu config={activeConfig} onNavigate={closeMenu} />}
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
