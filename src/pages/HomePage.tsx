import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/sections/Hero';
import { Badge } from '../components/ui/Badge';
import { SectionHeading } from '../components/ui/SectionHeading';
import { projects } from '../data/projects';

export function HomePage() {
  const { t } = useTranslation();
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <>
      <Hero />

      {/* Featured projects section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              title={t('home.featuredTitle')}
              description={t('home.featuredDescription')}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.id}`}
                  className="group overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-card hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-150"
                >
                  <div className="aspect-video bg-bg-surface flex items-center justify-center text-text-muted text-sm">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={t(project.titleKey)}
                        width={640}
                        height={360}
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
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-sm text-primary transition-all duration-150 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {t('home.viewAllProjects')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
