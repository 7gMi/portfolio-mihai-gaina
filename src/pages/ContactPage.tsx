import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';

export function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic to be implemented
  };

  return (
    <div className="pt-24">
      <section className="py-16 px-4">
        <div className="mx-auto max-w-xl">
          <SectionHeading
            title={t('contact.title')}
            description={t('contact.description')}
          />

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 flex flex-col items-center gap-6"
          >
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
          </motion.div>

          {/* Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-5 rounded-xl border border-border-default bg-bg-card p-6 shadow-card"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {t('contact.name')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={t('contact.namePlaceholder')}
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {t('contact.email')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={t('contact.emailPlaceholder')}
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {t('contact.message')}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={t('contact.messagePlaceholder')}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-sm text-text-inverted transition-all duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {t('contact.send')}
              <Send size={16} />
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
