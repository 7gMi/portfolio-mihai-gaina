import { useEffect, useRef } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

let worldData: ReturnType<typeof feature> | null = null;

async function loadWorld() {
  if (worldData) return worldData;
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
  const topo: Topology = await res.json();
  worldData = feature(topo, topo.objects.countries as any);
  return worldData;
}

export function RotatingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    let animId: number;
    let rotation = -2; // start centered on France

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const projection = geoOrthographic()
      .clipAngle(90);

    const pathGen = geoPath(projection, ctx);
    const graticule = geoGraticule10();

    // Paris coordinates for pin
    const PARIS = [2.35, 48.86] as [number, number];
    const CHISINAU = [28.83, 47.01] as [number, number];

    loadWorld().then((countries) => {
      function draw() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        const radius = Math.min(w, h) * 0.38;

        projection
          .translate([w / 2, h / 2])
          .scale(radius)
          .rotate([rotation, -46, 0]);

        ctx.clearRect(0, 0, w, h);

        // Globe background circle
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(11, 22, 40, 0.6)';
        ctx.fill();

        // Globe outline
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(30, 58, 95, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Graticule
        ctx.beginPath();
        pathGen(graticule);
        ctx.strokeStyle = 'rgba(30, 58, 95, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Continents fill
        ctx.beginPath();
        pathGen(countries as any);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
        ctx.fill();

        // Continents stroke
        ctx.beginPath();
        pathGen(countries as any);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Paris pin
        const pParis = projection(PARIS);
        if (pParis) {
          // Halo
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fill();
          // Dot
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();
          // Inner
          ctx.beginPath();
          ctx.arc(pParis[0], pParis[1], 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#0B1628';
          ctx.fill();
        }

        // Chisinau point
        const pChisinau = projection(CHISINAU);
        if (pChisinau) {
          ctx.beginPath();
          ctx.arc(pChisinau[0], pChisinau[1], 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
          ctx.fill();
        }

        // Arc between Paris and Chisinau
        if (pParis && pChisinau) {
          const midX = (pParis[0] + pChisinau[0]) / 2;
          const midY = (pParis[1] + pChisinau[1]) / 2 - 20;
          ctx.beginPath();
          ctx.moveTo(pParis[0], pParis[1]);
          ctx.quadraticCurveTo(midX, midY, pChisinau[0], pChisinau[1]);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        rotation -= 0.03; // slow rotation
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
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
