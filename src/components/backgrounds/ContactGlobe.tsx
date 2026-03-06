import { useEffect, useRef } from 'react';
import { geoOrthographic } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

let cachedDots: [number, number][] | null = null;

async function loadDots(): Promise<[number, number][]> {
  if (cachedDots) return cachedDots;
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json');
  const topo: Topology = await res.json();
  const land = feature(topo, topo.objects.land as any);
  const dots: [number, number][] = [];
  const step = 3;
  for (let lat = -60; lat <= 75; lat += step) {
    for (let lon = -180; lon < 180; lon += step) {
      const point = [lon, lat] as [number, number];
      if (isPointOnLand(point, land)) dots.push(point);
    }
  }
  cachedDots = dots;
  return dots;
}

function isPointOnLand(point: [number, number], land: any): boolean {
  const geometries = land.type === 'FeatureCollection'
    ? land.features.map((f: any) => f.geometry)
    : [land.geometry || land];
  for (const geom of geometries) {
    if (geom.type === 'Polygon') {
      if (pip(point, geom.coordinates[0])) return true;
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        if (pip(point, poly[0])) return true;
      }
    }
  }
  return false;
}

function pip(point: [number, number], ring: number[][]): boolean {
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

// Origins: messages come from around the world toward Paris
const PARIS = [2.35, 48.86] as [number, number];

interface CityDef {
  pos: [number, number];
  key: string;
}

const ORIGINS: CityDef[] = [
  { pos: [-74, 40.7], key: 'newYork' },
  { pos: [-43.2, -22.9], key: 'rio' },
  { pos: [139.7, 35.7], key: 'tokyo' },
  { pos: [28.83, 47.01], key: 'chisinau' },
  { pos: [26.1, 44.43], key: 'bucharest' },
  { pos: [-6.26, 53.35], key: 'dublin' },
  { pos: [13.4, 52.52], key: 'berlin' },
  { pos: [55.3, 25.3], key: 'dubai' },
];

interface Line {
  from: [number, number];
  progress: number;
  speed: number;
  delay: number;
}

interface ContactGlobeProps {
  cityNames?: Record<string, string>;
  parisLabel?: string;
}

const DEFAULT_CITY_NAMES: Record<string, string> = {
  newYork: 'New York', rio: 'Rio', tokyo: 'Tokyo', chisinau: 'Chișinău',
  bucharest: 'București', dublin: 'Dublin', berlin: 'Berlin', dubai: 'Dubai',
};

export function ContactGlobe({ cityNames = DEFAULT_CITY_NAMES, parisLabel = 'Paris' }: ContactGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
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

    const projection = geoOrthographic().clipAngle(90);

    // Create connection lines
    const lines: Line[] = ORIGINS.map((o, i) => ({
      from: o.pos,
      progress: 0,
      speed: 0.003 + Math.random() * 0.002,
      delay: i * 400,
    }));

    loadDots().then((worldDots) => {
      function draw() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        const radius = Math.min(w, h) * 0.42;
        const elapsed = Date.now() - startTime;

        projection
          .translate([w / 2, h / 2])
          .scale(radius)
          .rotate([-2, -46, 0]); // Centered on Europe, static

        ctx.clearRect(0, 0, w, h);

        // Globe circle
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // World dots
        for (const dot of worldDots) {
          const p = projection(dot);
          if (!p) continue;
          const dx = p[0] - w / 2;
          const dy = p[1] - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;
          const edgeFade = 1 - (dist / radius) * 0.5;
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.55 * edgeFade})`;
          ctx.fill();
        }

        // Paris pin (pulsing)
        const pParis = projection(PARIS);
        if (pParis) {
          const pulse = 1 + 0.3 * Math.sin(Date.now() * 0.003);
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 18 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 10 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          // Paris label
          ctx.font = 'bold 12px Inter, system-ui, sans-serif';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.fillText(parisLabel, pParis[0] + 10, pParis[1] - 10);
        }

        // Animated connection lines from origins to Paris (Hero-style arcs)
        for (let li = 0; li < lines.length; li++) {
          const line = lines[li];
          if (elapsed < line.delay) continue;

          const pFrom = projection(line.from);
          if (!pFrom || !pParis) continue;

          // Arc midpoint (curved upward)
          const dist = Math.sqrt(
            (pFrom[0] - pParis[0]) ** 2 + (pFrom[1] - pParis[1]) ** 2
          );
          const midX = (pFrom[0] + pParis[0]) / 2;
          const midY = (pFrom[1] + pParis[1]) / 2 - Math.min(dist * 0.3, 50);

          // Glow arc (wide, soft)
          ctx.beginPath();
          ctx.moveTo(pFrom[0], pFrom[1]);
          ctx.quadraticCurveTo(midX, midY, pParis[0], pParis[1]);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.1)';
          ctx.lineWidth = 5;
          ctx.stroke();

          // Dashed animated arc
          ctx.beginPath();
          ctx.moveTo(pFrom[0], pFrom[1]);
          ctx.quadraticCurveTo(midX, midY, pParis[0], pParis[1]);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -Date.now() * 0.0077;
          ctx.stroke();
          ctx.setLineDash([]);

          // Traveling dot 1 (forward: city → Paris)
          const t1 = ((Date.now() * 0.00015 + li * 0.15) % 1);
          const d1x = (1 - t1) * (1 - t1) * pFrom[0] + 2 * (1 - t1) * t1 * midX + t1 * t1 * pParis[0];
          const d1y = (1 - t1) * (1 - t1) * pFrom[1] + 2 * (1 - t1) * t1 * midY + t1 * t1 * pParis[1];
          ctx.beginPath();
          ctx.arc(d1x, d1y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#2DD4BF';
          ctx.fill();
          // Trail
          for (let i = 1; i <= 5; i++) {
            const tt = ((Date.now() * 0.00015 + li * 0.15 - i * 0.03) % 1 + 1) % 1;
            const tx = (1 - tt) * (1 - tt) * pFrom[0] + 2 * (1 - tt) * tt * midX + tt * tt * pParis[0];
            const ty = (1 - tt) * (1 - tt) * pFrom[1] + 2 * (1 - tt) * tt * midY + tt * tt * pParis[1];
            ctx.beginPath();
            ctx.arc(tx, ty, 2 - i * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(45, 212, 191, ${0.4 - i * 0.07})`;
            ctx.fill();
          }

          // Traveling dot 2 (return: Paris → city, offset)
          const t2 = ((Date.now() * 0.00015 + li * 0.15 + 0.5) % 1);
          const d2x = (1 - t2) * (1 - t2) * pParis[0] + 2 * (1 - t2) * t2 * midX + t2 * t2 * pFrom[0];
          const d2y = (1 - t2) * (1 - t2) * pParis[1] + 2 * (1 - t2) * t2 * midY + t2 * t2 * pFrom[1];
          ctx.beginPath();
          ctx.arc(d2x, d2y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();

          // Origin dot + city name
          const dxO = pFrom[0] - w / 2;
          const dyO = pFrom[1] - h / 2;
          if (Math.sqrt(dxO * dxO + dyO * dyO) <= radius) {
            // Pulsing halo
            const pulse2 = 1 + 0.3 * Math.sin(Date.now() * 0.004 + li);
            ctx.beginPath();
            ctx.arc(pFrom[0], pFrom[1], 10 * pulse2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(45, 212, 191, 0.06)';
            ctx.fill();
            // Core dot
            ctx.beginPath();
            ctx.arc(pFrom[0], pFrom[1], 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#2DD4BF';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(pFrom[0], pFrom[1], 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            // City label
            ctx.font = 'bold 10px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(45, 212, 191, 0.8)';
            ctx.fillText(cityNames[ORIGINS[li].key] || ORIGINS[li].key, pFrom[0] + 8, pFrom[1] - 7);
          }
        }

        animId = requestAnimationFrame(draw);
      }
      draw();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [cityNames, parisLabel]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}
