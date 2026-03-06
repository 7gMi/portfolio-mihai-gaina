import { useEffect, useRef } from 'react';
import { useCanvasVisibility } from '../../hooks/useCanvasVisibility';

const COORDS = [
  '48.8566°N  2.3522°E   PARIS',
  '47.0105°N  28.8328°E  CHISINAU',
  '40.7128°N  74.0060°W  NEW YORK',
  '35.6762°N  139.6503°E TOKYO',
  '-33.8688°S 151.2093°E SYDNEY',
  '25.2048°N  55.2708°E  DUBAI',
  '37.7749°N  122.4194°W SAN FRANCISCO',
  '-22.9068°S 43.1729°W  RIO DE JANEIRO',
  '51.5074°N  0.1278°W   LONDON',
  '55.7558°N  37.6173°E  MOSCOW',
];

const GRID_LABELS_LAT = [-60, -30, 0, 30, 60];
const GRID_LABELS_LON = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

export function GpsTerminal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useCanvasVisibility(canvasRef);
  const visibleRef = useRef(isVisible);
  const drawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    visibleRef.current = isVisible;
  }, [isVisible]);

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

    function draw() {
      if (!visibleRef.current) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const elapsed = Date.now() - startTime;

      ctx.clearRect(0, 0, w, h);

      // Draw latitude/longitude grid lines
      const gridAlpha = 0.12;

      // Horizontal lines (latitude)
      for (const lat of GRID_LABELS_LAT) {
        const y = h / 2 - (lat / 90) * (h / 2) * 0.8;
        const drawProgress = Math.min(1, (elapsed - 200) / 2000);
        if (drawProgress <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w * drawProgress, y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Label
        if (drawProgress > 0.1) {
          ctx.font = '9px "JetBrains Mono", "Fira Code", monospace';
          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 * drawProgress})`;
          ctx.fillText(`${lat}°`, 8, y - 3);
        }
      }

      // Vertical lines (longitude)
      for (const lon of GRID_LABELS_LON) {
        const x = w / 2 + (lon / 180) * (w / 2) * 0.85;
        const drawProgress = Math.min(1, (elapsed - 500) / 2000);
        if (drawProgress <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x, h - h * drawProgress);
        ctx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (drawProgress > 0.1) {
          ctx.font = '9px "JetBrains Mono", "Fira Code", monospace';
          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 * drawProgress})`;
          ctx.fillText(`${lon}°`, x + 2, h - 8);
        }
      }

      // Typing GPS coordinates
      ctx.font = '11px "JetBrains Mono", "Fira Code", monospace';

      for (let i = 0; i < COORDS.length; i++) {
        const lineDelay = 800 + i * 600;
        if (elapsed < lineDelay) continue;

        const lineElapsed = elapsed - lineDelay;
        const charCount = Math.min(COORDS[i].length, Math.floor(lineElapsed / 40));
        const text = COORDS[i].substring(0, charCount);

        const x = 20 + (i % 2) * (w / 2);
        const row = Math.floor(i / 2);
        const y = 40 + row * 55;

        // Prefix
        const prefixAlpha = Math.min(0.5, lineElapsed / 1500);
        ctx.fillStyle = `rgba(45, 212, 191, ${prefixAlpha})`;
        ctx.fillText('>', x, y);

        // Coordinate text
        ctx.fillStyle = `rgba(56, 189, 248, ${prefixAlpha * 0.9})`;
        ctx.fillText(text, x + 14, y);

        // Blinking cursor
        if (charCount < COORDS[i].length) {
          const cursorVisible = Math.sin(Date.now() * 0.008) > 0;
          if (cursorVisible) {
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = `rgba(56, 189, 248, ${prefixAlpha})`;
            ctx.fillRect(x + 14 + textWidth + 2, y - 9, 6, 12);
          }
        }

        // Ping dot after typing finishes
        if (charCount >= COORDS[i].length) {
          const ping = 1 + 0.3 * Math.sin(Date.now() * 0.004 + i);
          const dotX = x + 14 + ctx.measureText(COORDS[i]).width + 15;
          ctx.beginPath();
          ctx.arc(dotX, y - 4, 3 * ping, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(45, 212, 191, ${0.15})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dotX, y - 4, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.4)';
          ctx.fill();
        }
      }

      // Center crosshair on Paris position
      const pX = w / 2 + (2.35 / 180) * (w / 2) * 0.85;
      const pY = h / 2 - (48.86 / 90) * (h / 2) * 0.8;
      const crossProgress = Math.min(1, (elapsed - 300) / 1500);

      if (crossProgress > 0) {
        const size = 20 * crossProgress;
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * crossProgress})`;
        ctx.lineWidth = 1;

        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(pX - size, pY);
        ctx.lineTo(pX - 5, pY);
        ctx.moveTo(pX + 5, pY);
        ctx.lineTo(pX + size, pY);
        ctx.moveTo(pX, pY - size);
        ctx.lineTo(pX, pY - 5);
        ctx.moveTo(pX, pY + 5);
        ctx.lineTo(pX, pY + size);
        ctx.stroke();

        // Circle
        ctx.beginPath();
        ctx.arc(pX, pY, 12 * crossProgress, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 * crossProgress})`;
        ctx.stroke();

        // Pulsing ring
        const ring = (Date.now() * 0.001) % 2;
        if (ring < 1.5) {
          ctx.beginPath();
          ctx.arc(pX, pY, 12 + ring * 20, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.25 * (1 - ring / 1.5)})`;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    drawRef.current = draw;
    draw();

    return () => {
      drawRef.current = null;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Restart animation loop when canvas becomes visible again
  useEffect(() => {
    if (isVisible && drawRef.current) {
      drawRef.current();
    }
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
