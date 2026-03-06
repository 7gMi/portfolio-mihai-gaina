import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin } from 'lucide-react';
import { Button } from '../ui/Button';
import { ParticleNetwork } from '../backgrounds/ParticleNetwork';
import { CV_MAP, SOCIAL_LINKS } from '../../data/constants';

export function Hero() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      {/* Animated globe background */}
      <ParticleNetwork />

      {/* Gradient overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-bg-base)/40%,var(--color-bg-base)/80%_70%)]" />

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
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-sm transition-all duration-150 bg-primary text-text-inverted hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {t('hero.cta')}
            <ArrowDown size={16} />
          </Link>
          <Button
            variant="outline"
            href={CV_MAP[lang] || CV_MAP.fr}
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
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors duration-150 hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin size={22} />
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors duration-150 hover:text-primary"
            aria-label="GitHub"
          >
            <Github size={22} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
