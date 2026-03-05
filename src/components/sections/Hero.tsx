import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const cvMap: Record<string, string> = {
    fr: '/cv/MIHAI_GAINA_CV_FR.pdf',
    en: '/cv/MIHAI_GAINA_CV_EN.pdf',
    ro: '/cv/MIHAI_GAINA_CV_RO.pdf',
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/8%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-sm font-medium uppercase tracking-widest text-primary"
        >
          {t('hero.greeting')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold text-text-primary sm:text-6xl lg:text-7xl"
        >
          {t('hero.name')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl font-medium text-primary sm:text-2xl"
        >
          {t('hero.title')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-text-secondary"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {t('hero.cta')}
            <ArrowDown size={16} />
          </Button>
          <Button
            variant="outline"
            href={cvMap[lang] || cvMap.fr}
            download
          >
            {t('hero.cv')}
            <Download size={16} />
          </Button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-5"
        >
          <a
            href="https://www.linkedin.com/in/mihai-gaina-032812188/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors duration-150 hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin size={22} />
          </a>
          <a
            href="https://github.com/7gMi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors duration-150 hover:text-primary"
            aria-label="GitHub"
          >
            <Github size={22} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors duration-150 hover:text-primary"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
