import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Languages } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Parcours } from '../components/sections/Parcours';

const keySkills = [
  'ArcGIS Pro', 'QGIS', 'PostGIS', 'React', 'TypeScript', 'Python',
  'SNAP', 'Google Earth Engine', 'Docker', 'Git',
];

const languages = [
  { key: 'resume.languages.french', level: 'resume.languages.frenchLevel' },
  { key: 'resume.languages.english', level: 'resume.languages.englishLevel' },
  { key: 'resume.languages.romanian', level: 'resume.languages.romanianLevel' },
];

export function ResumePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const cvMap: Record<string, string> = {
    fr: '/cv/MIHAI_GAINA_CV_FR.pdf',
    en: '/cv/MIHAI_GAINA_CV_EN.pdf',
    ro: '/cv/MIHAI_GAINA_CV_RO.pdf',
  };

  return (
    <div className="pt-24">
      {/* Header with download */}
      <section className="py-8 px-4">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <SectionHeading title={t('resume.title')} />
          <Button
            variant="outline"
            href={cvMap[lang] || cvMap.fr}
            download
          >
            {t('resume.download')}
            <Download size={16} />
          </Button>
        </div>
      </section>

      {/* Timeline */}
      <Parcours />

      {/* Key skills summary */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title={t('resume.keySkills')}
          />
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {keySkills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Languages */}
      <section className="bg-bg-surface py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={t('resume.languagesTitle')} />
          <div className="grid gap-4 sm:grid-cols-3">
            {languages.map(({ key, level }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-card p-4 shadow-card"
              >
                <Languages size={20} className="shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-text-primary">{t(key)}</p>
                  <p className="text-xs text-text-muted">{t(level)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
