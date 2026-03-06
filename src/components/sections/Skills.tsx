import { useTranslation } from 'react-i18next';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { skillCategories } from '../../data/skills';

const categoryLabels: Record<string, Record<string, string>> = {
  sig: { fr: 'SIG & Géomatique', en: 'GIS & Geomatics', ro: 'SIG & Geomatică' },
  dev: { fr: 'Développement', en: 'Development', ro: 'Dezvoltare' },
  teledetection: { fr: 'Télédétection', en: 'Remote Sensing', ro: 'Teledetecție' },
  instrumentation: { fr: 'Instrumentation', en: 'Instrumentation', ro: 'Instrumentație' },
  outils: { fr: 'Outils', en: 'Tools', ro: 'Instrumente' },
};

export function Skills() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <section id="skills" className="py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('skills.title')} description={t('skills.description')} />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <div
              key={cat.key}
              className="rounded-xl border border-border-default bg-bg-card p-6 shadow-card hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-150"
            >
              <h3 className="mb-4 text-lg font-semibold text-text-primary">
                {categoryLabels[cat.key]?.[lang] ?? cat.key}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
