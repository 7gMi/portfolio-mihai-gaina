import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Badge } from '../components/ui/Badge';
import { projects, type Project } from '../data/projects';

type CategoryFilter = 'all' | Project['category'];

const FILTERS: { key: string; value: CategoryFilter }[] = [
  { key: 'portfolio.filterAll', value: 'all' },
  { key: 'portfolio.filterGeo', value: 'geomatique' },
  { key: 'portfolio.filterDev', value: 'dev-web' },
  { key: 'portfolio.filterBio', value: 'biomedical' },
];

export function PortfolioPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="pt-24">
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title={t('portfolio.title')}
            description={t('portfolio.description')}
          />

          {/* Filters */}
          <div
            className="mb-10 flex flex-wrap justify-center gap-2"
            role="group"
            aria-label={t('portfolio.filterLabel')}
          >
            {FILTERS.map(({ key, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                aria-pressed={activeFilter === value}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  activeFilter === value
                    ? 'bg-primary text-text-inverted'
                    : 'bg-bg-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
                }`}
              >
                {t(key)}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    to={`/portfolio/${project.id}`}
                    className="group block overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-card hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <div className="aspect-video bg-bg-surface flex items-center justify-center text-text-muted text-sm">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span>{t('portfolio.imagePlaceholder')}</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {t(project.titleKey)}
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary line-clamp-3">
                        {t(project.descriptionKey)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge key={tag} className="text-[0.65rem]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <p className="mt-10 text-center text-text-muted">
              {t('portfolio.noResults')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
