import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, Linkedin, MapPin, Microscope, Globe, Code, Radio } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skills } from '../components/sections/Skills';

const interests = [
  { key: 'about.interests.geomatics', icon: Globe },
  { key: 'about.interests.gis', icon: MapPin },
  { key: 'about.interests.remoteSensing', icon: Microscope },
  { key: 'about.interests.webDev', icon: Code },
  { key: 'about.interests.instrumentation', icon: Radio },
] as const;

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="pt-24">
      {/* Bio section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <SectionHeading title={t('about.title')} />

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
            {/* Photo placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-56 w-56 shrink-0 items-center justify-center rounded-2xl border-2 border-border-default bg-bg-surface text-text-muted"
            >
              <span className="text-sm">{t('about.photoPlaceholder')}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-text-secondary leading-relaxed">
                {t('about.bio')}
              </p>

              {/* Social links */}
              <div className="mt-6 flex gap-4">
                <a
                  href="https://github.com/7gMi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-text-muted transition-colors hover:text-primary"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mihai-gaina-032812188/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-text-muted transition-colors hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research interests */}
      <section className="bg-bg-surface py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title={t('about.interestsTitle')}
            description={t('about.interestsDescription')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interests.map(({ key, icon: Icon }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-card p-4 shadow-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {t(key)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <Skills />
    </div>
  );
}
