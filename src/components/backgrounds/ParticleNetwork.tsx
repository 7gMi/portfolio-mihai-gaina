import { useEffect, useRef } from 'react';
import { geoOrthographic } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

// Pre-sampled world dot positions (lat/lon) — generated from coastlines
// We'll generate dots on-the-fly from real data
let cachedDots: [number, number][] | null = null;

async function loadDots(): Promise<[number, number][]> {
  if (cachedDots) return cachedDots;
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json');
  const topo: Topology = await res.json();
  const land = feature(topo, topo.objects.land as any);

  // Sample points on land using a grid
  const dots: [number, number][] = [];
  const step = 2.5; // degrees between dots

  // Simple point-in-polygon test using d3 projection clip
  const testProj = geoOrthographic().clipAngle(180);

  for (let lat = -60; lat <= 75; lat += step) {
    for (let lon = -180; lon < 180; lon += step) {
      // Quick test: project and check if the point is on land
      // We use a simple approach: check if the point is inside any polygon
      const point = [lon, lat] as [number, number];
      if (isPointOnLand(point, land)) {
        dots.push(point);
      }
    }
  }

  cachedDots = dots;
  return dots;
}

function isPointOnLand(point: [number, number], land: any): boolean {
  // Ray casting for each polygon
  const geometries = land.type === 'FeatureCollection'
    ? land.features.map((f: any) => f.geometry)
    : [land.geometry || land];

  for (const geom of geometries) {
    if (geom.type === 'Polygon') {
      if (pointInPolygon(point, geom.coordinates[0])) return true;
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        if (pointInPolygon(point, poly[0])) return true;
      }
    }
  }
  return false;
}

function pointInPolygon(point: [number, number], ring: number[][]): boolean {
  let inside = false;
  const [px, py] = point;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = -2;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const projection = geoOrthographic().clipAngle(90);
    const PARIS = [2.35, 48.86] as [number, number];
    const CHISINAU = [28.83, 47.01] as [number, number];

    // Floating ambient particles
    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    loadDots().then((worldDots) => {
      function draw() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        const radius = Math.min(w, h) * 0.46;

        projection
          .translate([w / 2, h / 2])
          .scale(radius)
          .rotate([rotation, -46, 0]);

        ctx.clearRect(0, 0, w, h);

        // Globe circle (faint)
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(30, 58, 95, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // World dots
        for (const dot of worldDots) {
          const p = projection(dot);
          if (!p) continue;
          // Distance from center for fade effect
          const dx = p[0] - w / 2;
          const dy = p[1] - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;

          const edgeFade = 1 - (dist / radius) * 0.5;
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.45 * edgeFade})`;
          ctx.fill();
        }

        // Connection lines between nearby projected dots
        const projectedDots: [number, number][] = [];
        for (const dot of worldDots) {
          const p = projection(dot);
          if (p) projectedDots.push(p as [number, number]);
        }

        // ====== PARIS PIN — bright & large ======
        const pParis = projection(PARIS);
        if (pParis) {
          const pulse = 1 + 0.35 * Math.sin(Date.now() * 0.003);
          // Outer halo
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 22 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
          ctx.fill();
          // Mid halo
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 13 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.fill();
          // Inner glow
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 7 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.fill();
          // Core dot
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          // Label
          ctx.font = 'bold 11px Inter, system-ui, sans-serif';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.fillText('Paris', pParis[0] + 10, pParis[1] - 8);
        }

        // ====== CHISINAU PIN — teal accent ======
        const pChi = projection(CHISINAU);
        if (pChi) {
          const pulse2 = 1 + 0.3 * Math.sin(Date.now() * 0.004 + 1);
          // Halo
          ctx.beginPath();
          ctx.arc(pChi[0], pChi[1], 16 * pulse2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.06)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pChi[0], pChi[1], 9 * pulse2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.15)';
          ctx.fill();
          // Core
          ctx.beginPath();
          ctx.arc(pChi[0], pChi[1], 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#2DD4BF';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pChi[0], pChi[1], 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          // Label
          ctx.font = 'bold 10px Inter, system-ui, sans-serif';
          ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
          ctx.fillText('Chișinău', pChi[0] + 9, pChi[1] - 7);
        }

        // ====== ARC Paris ↔ Chisinau — accentuated ======
        if (pParis && pChi) {
          const midX = (pParis[0] + pChi[0]) / 2;
          const midY = (pParis[1] + pChi[1]) / 2 - 35;

          // Glow arc (wide, soft)
          ctx.beginPath();
          ctx.moveTo(pParis[0], pParis[1]);
          ctx.quadraticCurveTo(midX, midY, pChi[0], pChi[1]);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.12)';
          ctx.lineWidth = 6;
          ctx.stroke();

          // Main arc (dashed, animated)
          ctx.beginPath();
          ctx.moveTo(pParis[0], pParis[1]);
          ctx.quadraticCurveTo(midX, midY, pChi[0], pChi[1]);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -Date.now() * 0.025;
          ctx.stroke();
          ctx.setLineDash([]);

          // Traveling dot 1 (forward)
          const t1 = ((Date.now() * 0.0004) % 1);
          const d1x = (1-t1)*(1-t1)*pParis[0] + 2*(1-t1)*t1*midX + t1*t1*pChi[0];
          const d1y = (1-t1)*(1-t1)*pParis[1] + 2*(1-t1)*t1*midY + t1*t1*pChi[1];
          ctx.beginPath();
          ctx.arc(d1x, d1y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#2DD4BF';
          ctx.fill();
          // Trail
          for (let i = 1; i <= 5; i++) {
            const tt = ((Date.now() * 0.0004 - i * 0.03) % 1 + 1) % 1;
            const tx = (1-tt)*(1-tt)*pParis[0] + 2*(1-tt)*tt*midX + tt*tt*pChi[0];
            const ty = (1-tt)*(1-tt)*pParis[1] + 2*(1-tt)*tt*midY + tt*tt*pChi[1];
            ctx.beginPath();
            ctx.arc(tx, ty, 2 - i * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(45, 212, 191, ${0.4 - i * 0.07})`;
            ctx.fill();
          }

          // Traveling dot 2 (return, offset)
          const t2 = ((Date.now() * 0.0004 + 0.5) % 1);
          const d2x = (1-t2)*(1-t2)*pChi[0] + 2*(1-t2)*t2*midX + t2*t2*pParis[0];
          const d2y = (1-t2)*(1-t2)*pChi[1] + 2*(1-t2)*t2*midY + t2*t2*pParis[1];
          ctx.beginPath();
          ctx.arc(d2x, d2y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();
        }

        // Ambient floating particles
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
          ctx.fill();
        }

        // Connect nearby ambient particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        rotation -= 0.03;
        animId = requestAnimationFrame(draw);
      }

      draw();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
