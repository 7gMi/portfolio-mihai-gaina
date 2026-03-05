import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

export function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="bg-bg-surface py-20 px-4">
      <div className="mx-auto max-w-xl">
        <SectionHeading title={t('contact.title')} description={t('contact.description')} />

        <div className="flex flex-col items-center gap-6">
          <Button href="mailto:gaina.mihai.pro@gmail.com">
            <Mail size={18} />
            gaina.mihai.pro@gmail.com
          </Button>

          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/in/mihai-gaina-032812188/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin size={28} />
            </a>
            <a
              href="https://github.com/7gMi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github size={28} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
