import { useEffect, useRef } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { useCanvasVisibility } from '../../hooks/useCanvasVisibility';

let cachedCountries: any = null;

async function loadCountries() {
  if (cachedCountries) return cachedCountries;
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
  const topo: Topology = await res.json();
  cachedCountries = feature(topo, topo.objects.countries as any);
  return cachedCountries;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Props {
  locations: [number, number][];
  labels: string[];
  activeIndex: number;
}

export function ParcoursBg({ locations, labels, activeIndex }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useCanvasVisibility(canvasRef);
  const visibleRef = useRef(isVisible);
  const drawRef = useRef<(() => void) | null>(null);
  const cursorRef = useRef(0);
  const activeRef = useRef(activeIndex);
  const bgCacheRef = useRef<{ canvas: HTMLCanvasElement | null; w: number; h: number }>({ canvas: null, w: 0, h: 0 });

  useEffect(() => { activeRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { visibleRef.current = isVisible; }, [isVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const projection = geoMercator();

    loadCountries().then((countries) => {
      function draw() {
        if (!visibleRef.current) return;
        const w = canvas!.offsetWidth;
        const h = canvas!.offsetHeight;

        // Diagonal ~55°: rotate the view so France (west) is top-right, Moldova (east) is bottom-left
        // Geography stays accurate, just the viewing angle is tilted
        projection
          .center([0, 0])
          .rotate([-15, -51.3, -55])
          .translate([w / 2, h / 2])
          .scale(Math.min(w, h) * 3);

        ctx!.clearRect(0, 0, w, h);

        // Pre-render countries to offscreen canvas (only on resize)
        const cache = bgCacheRef.current;
        if (!cache.canvas || cache.w !== w || cache.h !== h) {
          const offscreen = document.createElement('canvas');
          offscreen.width = w * dpr;
          offscreen.height = h * dpr;
          const offCtx = offscreen.getContext('2d')!;
          offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const offPath = geoPath(projection, offCtx);
          for (const feat of (countries as any).features) {
            offCtx.beginPath();
            offPath(feat);
            offCtx.fillStyle = 'rgba(56, 189, 248, 0.06)';
            offCtx.fill();
            offCtx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
            offCtx.lineWidth = 0.6;
            offCtx.stroke();
          }
          bgCacheRef.current = { canvas: offscreen, w, h };
        }

        // Draw cached countries (fast drawImage instead of ~200 polygons)
        ctx!.drawImage(bgCacheRef.current.canvas!, 0, 0, w, h);

        // Smooth cursor movement
        const cursorSpeed = prefersReduced ? 1 : 0.04;
        cursorRef.current = lerp(cursorRef.current, activeRef.current, cursorSpeed);

        // Pre-calculate arc midpoints
        const arcMids: { midX: number; midY: number }[] = [];
        for (let i = 0; i < locations.length - 1; i++) {
          const pA = projection(locations[i]);
          const pB = projection(locations[i + 1]);
          if (!pA || !pB) { arcMids.push({ midX: 0, midY: 0 }); continue; }
          const midX = (pA[0] + pB[0]) / 2;
          const dist = Math.sqrt((pA[0] - pB[0]) ** 2 + (pA[1] - pB[1]) ** 2);
          const midY = (pA[1] + pB[1]) / 2 - Math.min(dist * 0.15, 40);
          arcMids.push({ midX, midY });
        }

        // Arcs between locations
        for (let i = 0; i < locations.length - 1; i++) {
          const pA = projection(locations[i]);
          const pB = projection(locations[i + 1]);
          if (!pA || !pB) continue;

          const { midX, midY } = arcMids[i];
          const isPassed = i < activeRef.current;

          // Glow
          ctx!.beginPath();
          ctx!.moveTo(pA[0], pA[1]);
          ctx!.quadraticCurveTo(midX, midY, pB[0], pB[1]);
          ctx!.strokeStyle = isPassed ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.04)';
          ctx!.lineWidth = 4;
          ctx!.stroke();

          // Dashed animated line
          ctx!.beginPath();
          ctx!.moveTo(pA[0], pA[1]);
          ctx!.quadraticCurveTo(midX, midY, pB[0], pB[1]);
          ctx!.strokeStyle = isPassed ? 'rgba(45, 212, 191, 0.35)' : 'rgba(45, 212, 191, 0.12)';
          ctx!.lineWidth = 1;
          ctx!.setLineDash([5, 4]);
          ctx!.lineDashOffset = -Date.now() * 0.008;
          ctx!.stroke();
          ctx!.setLineDash([]);
        }

        // Cursor position on the path
        function getCursorPos(progress: number): [number, number] | null {
          const idx = Math.floor(progress);
          const t = progress - idx;
          if (idx >= locations.length - 1) return projection(locations[locations.length - 1]);
          if (idx < 0) return projection(locations[0]);
          const pA = projection(locations[idx]);
          const pB = projection(locations[idx + 1]);
          if (!pA || !pB) return null;
          const m = arcMids[idx];
          const x = (1 - t) * (1 - t) * pA[0] + 2 * (1 - t) * t * m.midX + t * t * pB[0];
          const y = (1 - t) * (1 - t) * pA[1] + 2 * (1 - t) * t * m.midY + t * t * pB[1];
          return [x, y];
        }

        // Trail
        for (let tr = 6; tr >= 1; tr--) {
          const trailPos = getCursorPos(Math.max(0, cursorRef.current - tr * 0.05));
          if (trailPos) {
            ctx!.beginPath();
            ctx!.arc(trailPos[0], trailPos[1], 3.5 - tr * 0.4, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(45, 212, 191, ${0.35 - tr * 0.05})`;
            ctx!.fill();
          }
        }

        // Main cursor
        const cursorPos = getCursorPos(cursorRef.current);
        if (cursorPos) {
          ctx!.beginPath();
          ctx!.arc(cursorPos[0], cursorPos[1], 14, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(45, 212, 191, 0.1)';
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(cursorPos[0], cursorPos[1], 6, 0, Math.PI * 2);
          ctx!.fillStyle = '#2DD4BF';
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(cursorPos[0], cursorPos[1], 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = '#ffffff';
          ctx!.fill();
        }

        // Location markers + labels
        for (let i = 0; i < locations.length; i++) {
          const p = projection(locations[i]);
          if (!p) continue;
          const isActive = i === activeRef.current;

          if (isActive) {
            const pulse = 1 + 0.2 * Math.sin(Date.now() * 0.003);
            ctx!.beginPath();
            ctx!.arc(p[0], p[1], 16 * pulse, 0, Math.PI * 2);
            ctx!.fillStyle = 'rgba(56, 189, 248, 0.06)';
            ctx!.fill();
            ctx!.beginPath();
            ctx!.arc(p[0], p[1], 9 * pulse, 0, Math.PI * 2);
            ctx!.fillStyle = 'rgba(56, 189, 248, 0.1)';
            ctx!.fill();
          }

          ctx!.beginPath();
          ctx!.arc(p[0], p[1], isActive ? 5 : 3, 0, Math.PI * 2);
          ctx!.fillStyle = isActive ? '#38BDF8' : 'rgba(45, 212, 191, 0.6)';
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(p[0], p[1], isActive ? 2 : 1.2, 0, Math.PI * 2);
          ctx!.fillStyle = '#ffffff';
          ctx!.fill();

          // City label
          const label = labels[i] || '';
          if (label) {
            ctx!.font = `${isActive ? 'bold ' : ''}${isActive ? 11 : 9}px Inter, system-ui, sans-serif`;
            ctx!.fillStyle = isActive ? 'rgba(56, 189, 248, 0.85)' : 'rgba(56, 189, 248, 0.45)';
            ctx!.fillText(label, p[0] + 10, p[1] - 8);
          }
        }

        if (!prefersReduced) animId = requestAnimationFrame(draw);
      }
      drawRef.current = draw;
      draw();
    });

    return () => {
      drawRef.current = null;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [locations, labels]);

  useEffect(() => {
    if (isVisible && drawRef.current) drawRef.current();
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
