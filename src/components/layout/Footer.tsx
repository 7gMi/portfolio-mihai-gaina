import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-bg-subtle py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-sm text-text-muted">
          &copy; {year} Mihai Gaina. {t('footer.rights')}
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/7gMi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors hover:text-primary"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/mihai-gaina-032812188/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:gaina.mihai.pro@gmail.com"
            className="text-text-muted transition-colors hover:text-primary"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
