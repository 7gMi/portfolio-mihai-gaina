import { useTranslation } from 'react-i18next';
import { ExternalLink, Github } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { projects } from '../../data/projects';

export function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('projects.title')} description={t('projects.description')} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-xl border border-white/5 bg-bg-card transition-colors hover:border-primary/20"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-bg-surface flex items-center justify-center text-text-muted text-sm">
                {project.image ? (
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span>Image à venir</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t(project.titleKey)}
                </h3>
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                  {t(project.descriptionKey)}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="text-[0.65rem]">{tag}</Badge>
                  ))}
                </div>
                {(project.github || project.live) && (
                  <div className="mt-4 flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted transition-colors hover:text-primary"
                        aria-label="Source code"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted transition-colors hover:text-primary"
                        aria-label="Live demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
