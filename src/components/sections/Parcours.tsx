import { useTranslation } from 'react-i18next';
import { Briefcase, GraduationCap } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { parcours } from '../../data/parcours';

export function Parcours() {
  const { t } = useTranslation();

  return (
    <section id="parcours" className="bg-bg-surface py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={t('parcours.title')} description={t('parcours.description')} />
        <div className="relative border-l-2 border-primary/20 pl-8">
          {parcours.map((item, i) => (
            <div key={i} className="relative mb-10 last:mb-0">
              {/* Dot */}
              <div className="absolute -left-[41px] flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-bg-card text-primary">
                {item.type === 'work' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
              </div>
              <span className="text-xs font-semibold text-primary">{item.period}</span>
              <h3 className="mt-1 text-lg font-semibold text-text-primary">{t(item.titleKey)}</h3>
              <p className="text-sm text-text-secondary">{t(item.placeKey)}</p>
              {item.location && (
                <p className="text-xs text-text-muted">{item.location}</p>
              )}
              <p className="mt-2 text-sm text-text-secondary">{t(item.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
