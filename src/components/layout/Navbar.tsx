import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useActiveSection } from '../../hooks/useActiveSection';

const NAV_ITEMS = [
  { id: 'skills', key: 'nav.skills' },
  { id: 'parcours', key: 'nav.parcours' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'contact', key: 'nav.contact' },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const activeSection = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = useCallback(
    (id: string) => {
      setMenuOpen(false);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    },
    []
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      {/* Skip link */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-bg-base"
      >
        {t('nav.skipToContent')}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-surface/80 shadow-lg backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={() => handleNav('hero')}
            className="text-xl font-bold text-primary transition-colors duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          >
            MG
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ id, key }) => (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  aria-current={activeSection === id ? 'true' : undefined}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    activeSection === id
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t(key)}
                  {activeSection === id && (
                    <span className="mt-0.5 block h-0.5 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop language + mobile burger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden md:flex" />
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

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-bg-surface p-6 pt-20 shadow-xl transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <LanguageSwitcher className="mb-6" />
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ id, key }) => (
            <li key={id}>
              <button
                onClick={() => handleNav(id)}
                className={`w-full rounded-md px-4 py-3 text-left text-base font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t(key)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
