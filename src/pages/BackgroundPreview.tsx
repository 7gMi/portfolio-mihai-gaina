import { useState } from 'react';
import { RotatingGlobe } from '../components/backgrounds/RotatingGlobe';
import { ParticleNetwork } from '../components/backgrounds/ParticleNetwork';
import { TopoGrid } from '../components/backgrounds/TopoGrid';

const OPTIONS = [
  { id: 'globe', label: 'A) Globe 3D Rotatif', Component: RotatingGlobe },
  { id: 'particles', label: 'B) Reseau de Particules', Component: ParticleNetwork },
  { id: 'topo', label: 'C) Grille Topographique', Component: TopoGrid },
] as const;

export function BackgroundPreview() {
  const [active, setActive] = useState<string>('globe');
  const ActiveComponent = OPTIONS.find(o => o.id === active)!.Component;

  return (
    <div className="min-h-screen bg-white">
      {/* Tab bar */}
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setActive(opt.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
              active === opt.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Preview area — simulates the Hero section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        {/* Animated background */}
        <ActiveComponent key={active} />

        {/* Simulated Hero content overlay */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-600">
            Developpeur SIG / Geomaticien
          </p>
          <h1 className="text-5xl font-bold text-slate-900 sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Mihai Gaina
          </h1>
          <p className="mt-4 text-xl font-medium text-blue-600 sm:text-2xl">
            Developpeur SIG / Geomaticien
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-slate-500">
            De l'instrumentation terrain a la geomatique et au developpement web.
            Portfolio professionnel — React, TypeScript, QGIS, Python, PostGIS.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
              Voir mes projets
            </button>
            <button className="rounded-lg border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600">
              Telecharger CV
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
