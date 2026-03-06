import { useState } from 'react';
import { Mail, MapPin, Linkedin, Github, Clock, Globe } from 'lucide-react';
import { ContactGlobe } from '../components/backgrounds/ContactGlobe';
import { GpsTerminal } from '../components/backgrounds/GpsTerminal';
import { PulseRadar } from '../components/backgrounds/PulseRadar';
import { SubmarineCables } from '../components/backgrounds/SubmarineCables';

const OPTIONS = [
  { id: 'A', label: 'A — Globe "Find Me"', Component: ContactGlobe },
  { id: 'B', label: 'B — GPS Terminal', Component: GpsTerminal },
  { id: 'C', label: 'C — Pulse Radar', Component: PulseRadar },
  { id: 'D', label: 'D — Submarine Cables', Component: SubmarineCables },
] as const;

export function ContactBgPreview() {
  const [active, setActive] = useState<string>('A');
  const ActiveComponent = OPTIONS.find((o) => o.id === active)!.Component;

  return (
    <div className="min-h-screen bg-bg-base pt-24">
      {/* Tab buttons */}
      <div className="flex flex-wrap justify-center gap-3 px-4 pb-6">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActive(opt.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              active === opt.id
                ? 'bg-primary text-text-inverted shadow-md'
                : 'bg-bg-card text-text-secondary border border-border-default hover:text-text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Two-column side by side: animation LEFT, content RIGHT */}
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-stretch px-4" style={{ minHeight: '75vh' }}>

        {/* LEFT — Animation zone (no overlay) */}
        <div className="relative flex-1 overflow-hidden rounded-l-2xl lg:min-h-0" style={{ minHeight: '400px' }}>
          <ActiveComponent />
        </div>

        {/* RIGHT — Description + Form */}
        <div className="flex w-full flex-col justify-center gap-10 rounded-r-2xl border border-white/10 bg-bg-card/60 p-8 pl-10 backdrop-blur-sm lg:w-[480px] lg:shrink-0">

          {/* Description */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Contact</h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                Projet SIG, cartographie interactive, traitement de donnees geospatiales, ou developpement de site web vitrine — je suis disponible pour en discuter et vous accompagner.
              </p>
            </div>

            {/* Info items */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Paris, France</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm text-primary">gaina.mihai.pro@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Freelance & CDI — reponse sous 24h</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-sm text-text-muted">FR, EN, RO, RU</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-card/30 text-text-muted transition-colors hover:text-primary hover:border-primary/40">
                <Linkedin size={16} />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-card/30 text-text-muted transition-colors hover:text-primary hover:border-primary/40">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-border-default" />

          {/* Form */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-text-primary">Envoyer un message</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Nom</label>
                <div className="h-10 rounded-lg border border-border-default bg-bg-base/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
                <div className="h-10 rounded-lg border border-border-default bg-bg-base/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Message</label>
                <div className="h-28 rounded-lg border border-border-default bg-bg-base/50" />
              </div>
              <div className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-text-inverted">
                Envoyer
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
