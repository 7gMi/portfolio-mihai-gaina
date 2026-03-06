import { useEffect, useRef } from 'react';

// Simplified world map points for flat 2D projection (Mercator-like)
// Format: normalized [x, y] on canvas
const CONTINENT_SHAPES = [
  // Europe
  [[0.47, 0.22], [0.49, 0.19], [0.52, 0.18], [0.55, 0.20], [0.57, 0.24], [0.55, 0.30], [0.52, 0.32], [0.49, 0.33], [0.46, 0.30], [0.46, 0.26]],
  // Africa
  [[0.47, 0.36], [0.50, 0.34], [0.54, 0.35], [0.56, 0.40], [0.55, 0.52], [0.52, 0.58], [0.49, 0.60], [0.47, 0.54], [0.46, 0.46], [0.46, 0.40]],
  // Asia
  [[0.57, 0.18], [0.64, 0.16], [0.72, 0.18], [0.80, 0.22], [0.82, 0.28], [0.78, 0.34], [0.72, 0.36], [0.65, 0.34], [0.60, 0.30], [0.57, 0.24]],
  // North America
  [[0.12, 0.18], [0.18, 0.16], [0.26, 0.18], [0.30, 0.24], [0.28, 0.32], [0.24, 0.36], [0.18, 0.34], [0.14, 0.28], [0.12, 0.22]],
  // South America
  [[0.24, 0.40], [0.28, 0.38], [0.31, 0.42], [0.32, 0.50], [0.30, 0.58], [0.27, 0.64], [0.24, 0.58], [0.23, 0.50], [0.23, 0.44]],
  // Australia
  [[0.78, 0.50], [0.82, 0.48], [0.86, 0.50], [0.86, 0.55], [0.82, 0.57], [0.78, 0.54]],
];

// Paris in normalized coords
const PARIS = [0.505, 0.26] as [number, number];

// Cable endpoints (cities) in normalized coords
const CITIES: { pos: [number, number]; name: string }[] = [
  { pos: [0.22, 0.26], name: 'New York' },
  { pos: [0.28, 0.52], name: 'Rio' },
  { pos: [0.78, 0.24], name: 'Tokyo' },
  { pos: [0.52, 0.46], name: 'Lagos' },
  { pos: [0.62, 0.26], name: 'Dubai' },
  { pos: [0.83, 0.52], name: 'Sydney' },
  { pos: [0.15, 0.30], name: 'SF' },
  { pos: [0.55, 0.20], name: 'London' },
];

// Cable routes: arrays of control points from city to Paris
function getCableRoute(from: [number, number], to: [number, number]): [number, number] {
  // Simple midpoint offset to create curve
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2 + 0.05; // Curve downward (submarine)
  return [midX, midY];
}

interface Photon {
  cableIndex: number;
  t: number;
  speed: number;
  forward: boolean;
}

export function SubmarineCables() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = Date.now();

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create photons traveling along cables
    const photons: Photon[] = [];
    for (let i = 0; i < CITIES.length; i++) {
      // 2 photons per cable, staggered
      photons.push({ cableIndex: i, t: 0, speed: 0.0003 + Math.random() * 0.0002, forward: true });
      photons.push({ cableIndex: i, t: 0.5, speed: 0.0003 + Math.random() * 0.0002, forward: false });
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const elapsed = Date.now() - startTime;

      ctx.clearRect(0, 0, w, h);

      const introProgress = Math.min(1, elapsed / 2500);

      // Draw continents (subtle filled shapes)
      for (const shape of CONTINENT_SHAPES) {
        ctx.beginPath();
        for (let i = 0; i < shape.length; i++) {
          const x = shape[i][0] * w;
          const y = shape[i][1] * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(56, 189, 248, ${0.08 * introProgress})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * introProgress})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw cables
      for (let i = 0; i < CITIES.length; i++) {
        const city = CITIES[i];
        const from: [number, number] = [city.pos[0] * w, city.pos[1] * h];
        const to: [number, number] = [PARIS[0] * w, PARIS[1] * h];
        const mid = getCableRoute(city.pos, PARIS);
        const midPx: [number, number] = [mid[0] * w, mid[1] * h];

        // Cable draw progress
        const cableDelay = i * 300;
        const cableProgress = Math.min(1, Math.max(0, (elapsed - cableDelay) / 1500));
        if (cableProgress <= 0) continue;

        // Cable line
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        ctx.quadraticCurveTo(midPx[0], midPx[1], to[0], to[1]);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.25 * cableProgress})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // City endpoint dot
        ctx.beginPath();
        ctx.arc(from[0], from[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${0.8 * cableProgress})`;
        ctx.fill();

        // City label
        if (cableProgress > 0.5) {
          ctx.font = '8px Inter, system-ui, sans-serif';
          ctx.fillStyle = `rgba(45, 212, 191, ${0.5 * cableProgress})`;
          ctx.fillText(city.name, from[0] + 6, from[1] - 5);
        }
      }

      // Animate photons
      for (const photon of photons) {
        const city = CITIES[photon.cableIndex];
        const cableDelay = photon.cableIndex * 300;
        if (elapsed < cableDelay + 1500) continue;

        photon.t = (photon.t + photon.speed * 16) % 1;
        const t = photon.forward ? photon.t : 1 - photon.t;

        const from: [number, number] = [city.pos[0] * w, city.pos[1] * h];
        const to: [number, number] = [PARIS[0] * w, PARIS[1] * h];
        const mid = getCableRoute(city.pos, PARIS);
        const midPx: [number, number] = [mid[0] * w, mid[1] * h];

        // Bezier position
        const px = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * midPx[0] + t * t * to[0];
        const py = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * midPx[1] + t * t * to[1];

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = photon.forward
          ? 'rgba(56, 189, 248, 0.15)'
          : 'rgba(45, 212, 191, 0.12)';
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = photon.forward ? '#38BDF8' : '#2DD4BF';
        ctx.fill();

        // Trail
        for (let tr = 1; tr <= 3; tr++) {
          const tt = ((photon.forward ? photon.t : 1 - photon.t) - tr * 0.02 + 1) % 1;
          const tx = (1 - tt) * (1 - tt) * from[0] + 2 * (1 - tt) * tt * midPx[0] + tt * tt * to[0];
          const ty = (1 - tt) * (1 - tt) * from[1] + 2 * (1 - tt) * tt * midPx[1] + tt * tt * to[1];
          ctx.beginPath();
          ctx.arc(tx, ty, 1.5 - tr * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = photon.forward
            ? `rgba(56, 189, 248, ${0.25 - tr * 0.07})`
            : `rgba(45, 212, 191, ${0.2 - tr * 0.06})`;
          ctx.fill();
        }
      }

      // Paris hub
      const px = PARIS[0] * w;
      const py = PARIS[1] * h;
      const pulse = 1 + 0.25 * Math.sin(Date.now() * 0.003);

      ctx.beginPath();
      ctx.arc(px, py, 20 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 12 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.font = 'bold 10px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.fillText('Paris', px + 10, py - 8);

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
