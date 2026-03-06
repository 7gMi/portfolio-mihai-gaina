import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronRight, ExternalLink, FileText, Github } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { projects } from '../data/projects';

export function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    return <Navigate to="/portfolio" replace />;
  }

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <div className="pt-24">
      <article className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1 text-sm text-text-muted">
              <li>
                <Link
                  to="/portfolio"
                  className="transition-colors hover:text-primary"
                >
                  {t('nav.portfolio')}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li>
                <span className="text-text-primary font-medium">
                  {t(project.titleKey)}
                </span>
              </li>
            </ol>
          </nav>

          {/* Back link */}
          <Link
            to="/portfolio"
            className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            {t('projectDetail.backToPortfolio')}
          </Link>

          {/* Project image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 aspect-video overflow-hidden rounded-xl border border-border-default bg-bg-surface"
          >
            {project.image ? (
              <img
                src={project.image}
                alt={t(project.titleKey)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-text-muted">
                {t('portfolio.imagePlaceholder')}
              </div>
            )}
          </motion.div>

          {/* Title and date */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              {t(project.titleKey)}
            </h1>
            {project.date && (
              <p className="mt-2 text-sm text-text-muted">{project.date}</p>
            )}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </motion.div>

          {/* Links */}
          {(project.github || project.live || project.report) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6 flex flex-wrap gap-4"
            >
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  <Github size={16} />
                  {t('projectDetail.sourceCode')}
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  <ExternalLink size={16} />
                  {t('projectDetail.liveDemo')}
                </a>
              )}
              {project.report && (
                <a
                  href={project.report}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  <FileText size={16} />
                  {t('projectDetail.report')}
                </a>
              )}
            </motion.div>
          )}

          {/* Long description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-10"
          >
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {t(project.longDescriptionKey || project.descriptionKey)}
            </p>
          </motion.div>

          {/* Previous / Next navigation */}
          <nav
            className="mt-16 flex items-stretch gap-4 border-t border-border-default pt-8"
            aria-label={t('projectDetail.projectNavigation')}
          >
            {prevProject ? (
              <Link
                to={`/portfolio/${prevProject.id}`}
                className="flex flex-1 items-center gap-3 rounded-xl border border-border-default p-4 transition-all hover:border-primary/20 hover:shadow-card"
              >
                <ArrowLeft size={18} className="shrink-0 text-text-muted" />
                <div className="min-w-0">
                  <p className="text-xs text-text-muted">{t('projectDetail.previous')}</p>
                  <p className="truncate text-sm font-medium text-text-primary">
                    {t(prevProject.titleKey)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {nextProject ? (
              <Link
                to={`/portfolio/${nextProject.id}`}
                className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-border-default p-4 text-right transition-all hover:border-primary/20 hover:shadow-card"
              >
                <div className="min-w-0">
                  <p className="text-xs text-text-muted">{t('projectDetail.next')}</p>
                  <p className="truncate text-sm font-medium text-text-primary">
                    {t(nextProject.titleKey)}
                  </p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-text-muted" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        </div>
      </article>
    </div>
  );
}
