import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useTheme } from '../../hooks/useTheme';

const NAV_ITEMS = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/resume', key: 'nav.resume' },
  { to: '/portfolio', key: 'nav.portfolio' },
  { to: '/contact', key: 'nav.contact' },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Focus trap + Escape key for mobile drawer
  const handleDrawerKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.addEventListener('keydown', handleDrawerKeyDown);
    // Focus first focusable element when drawer opens
    const timer = setTimeout(() => {
      const first = drawerRef.current?.querySelector<HTMLElement>('a[href], button');
      first?.focus();
    }, 300); // wait for slide animation
    return () => {
      document.removeEventListener('keydown', handleDrawerKeyDown);
      clearTimeout(timer);
    };
  }, [menuOpen, handleDrawerKeyDown]);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverted"
      >
        {t('nav.skipToContent')}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-base/80 shadow-nav backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          >
            <img
              src="/images/logo/logo-globe.svg"
              alt="MG"
              width="67"
              height="81"
              className="h-[67px] w-auto"
            />
            <span className="text-lg font-bold text-text-primary">
              Mihai <span className="text-primary">Gaina</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ to, key }) => (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={isActive(to) ? 'page' : undefined}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    isActive(to)
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t(key)}
                  {isActive(to) && (
                    <span className="mt-0.5 block h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop language + theme + mobile burger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden md:flex" />
            <button
              onClick={toggleTheme}
              className="hidden rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:block"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu', 'Navigation menu')}
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-bg-card p-6 pt-20 shadow-xl transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ to, key }) => (
            <li key={to}>
              <Link
                to={to}
                className={`block w-full rounded-md px-4 py-3 text-left text-base font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
