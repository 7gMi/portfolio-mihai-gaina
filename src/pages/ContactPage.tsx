import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Send, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react';
import { ContactGlobe } from '../components/backgrounds/ContactGlobe';
import { supabase } from '../lib/supabase';
import { SOCIAL_LINKS } from '../data/constants';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [lastSubmit, setLastSubmit] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (status === 'success' || status === 'error') setStatus('idle');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) return;

    // Rate limiting: 30s cooldown
    if (Date.now() - lastSubmit < 30000) {
      setStatus('error');
      return;
    }

    // Validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || name.length > 100) return;
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!message || message.length > 2000) return;

    setStatus('sending');

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (error) {
      console.error('[Contact Form]', error.message);
      setStatus('error');
      return;
    }

    setLastSubmit(Date.now());
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-24">
      {/* Two-column layout: animation LEFT, content RIGHT */}
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-stretch px-4 py-8" style={{ minHeight: '75vh' }}>

        {/* LEFT — Animation */}
        <div className="relative flex-1 overflow-hidden rounded-l-2xl lg:min-h-0" style={{ minHeight: '400px' }}>
          <ContactGlobe
            parisLabel={t('cities.paris')}
            cityNames={{
              newYork: t('cities.newYork'),
              rio: t('cities.rio'),
              tokyo: t('cities.tokyo'),
              chisinau: t('cities.chisinau'),
              bucharest: t('cities.bucharest'),
              dublin: t('cities.dublin'),
              berlin: t('cities.berlin'),
              dubai: t('cities.dubai'),
            }}
          />
        </div>

        {/* RIGHT — Description + Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full flex-col justify-center gap-8 rounded-r-2xl border border-border-default bg-bg-card/60 p-8 pl-10 backdrop-blur-sm lg:w-[480px] lg:shrink-0"
        >
          {/* Description */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">{t('contact.title')}</h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                {t('contact.description')}
              </p>
            </div>

            {/* Info items */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin size={18} />
                </div>
                <p className="text-sm font-medium text-text-primary">Paris, France</p>
              </div>

              <a
                href="mailto:gaina.mihai.pro@gmail.com"
                className="flex items-center gap-3 transition-colors hover:opacity-80"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail size={18} />
                </div>
                <p className="text-sm text-primary">gaina.mihai.pro@gmail.com</p>
              </a>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock size={18} />
                </div>
                <p className="text-sm text-text-muted">Freelance & CDI</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe size={18} />
                </div>
                <p className="text-sm text-text-muted">FR, EN, RO, RU</p>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-card/30 text-text-muted transition-colors hover:text-primary hover:border-primary/40"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-card/30 text-text-muted transition-colors hover:text-primary hover:border-primary/40"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-border-default" />

          {/* Status messages */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              <CheckCircle size={18} />
              {t('contact.success')}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} />
              {t('contact.error')}
            </motion.div>
          )}

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot — hidden from humans */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-text-secondary">
                {t('contact.name')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={status === 'sending'}
                className="w-full rounded-lg border border-border-default bg-bg-base/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                placeholder={t('contact.namePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-text-secondary">
                {t('contact.email')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'sending'}
                className="w-full rounded-lg border border-border-default bg-bg-base/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                placeholder={t('contact.emailPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-text-secondary">
                {t('contact.message')}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'sending'}
                className="w-full resize-none rounded-lg border border-border-default bg-bg-base/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                placeholder={t('contact.messagePlaceholder')}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-sm text-text-inverted transition-all duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? t('contact.sending') : t('contact.send')}
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
