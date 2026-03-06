import { useEffect, useRef } from 'react';

const PARIS = { x: 0.51, y: 0.35 }; // Normalized position on a flat map

// Simplified continent outlines (very rough, for visual effect only)
const CONTINENTS_PATHS = [
  // Europe rough shape
  [[0.47, 0.25], [0.50, 0.22], [0.53, 0.22], [0.55, 0.24], [0.56, 0.28], [0.54, 0.32], [0.52, 0.34], [0.48, 0.35], [0.46, 0.32], [0.47, 0.28]],
  // Africa
  [[0.48, 0.38], [0.50, 0.36], [0.54, 0.37], [0.56, 0.42], [0.55, 0.52], [0.53, 0.58], [0.50, 0.60], [0.48, 0.55], [0.47, 0.48], [0.47, 0.42]],
  // Asia
  [[0.56, 0.22], [0.62, 0.20], [0.70, 0.22], [0.78, 0.25], [0.80, 0.30], [0.75, 0.35], [0.68, 0.38], [0.62, 0.36], [0.58, 0.32], [0.56, 0.28]],
  // North America
  [[0.15, 0.22], [0.22, 0.20], [0.28, 0.22], [0.30, 0.28], [0.28, 0.35], [0.24, 0.38], [0.18, 0.36], [0.14, 0.30], [0.13, 0.26]],
  // South America
  [[0.26, 0.42], [0.30, 0.40], [0.32, 0.45], [0.33, 0.52], [0.30, 0.60], [0.27, 0.65], [0.25, 0.60], [0.24, 0.52], [0.24, 0.46]],
  // Australia
  [[0.78, 0.52], [0.82, 0.50], [0.85, 0.52], [0.85, 0.56], [0.82, 0.58], [0.78, 0.56]],
];

interface Ripple {
  startTime: number;
  maxRadius: number;
  duration: number;
}

export function PulseRadar() {
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

    // Generate ripples at intervals
    const ripples: Ripple[] = [];
    let lastRipple = 0;

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const now = Date.now();
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, w, h);

      const cx = PARIS.x * w;
      const cy = PARIS.y * h;

      // Draw continents (subtle)
      const introProgress = Math.min(1, elapsed / 2000);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * introProgress})`;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.07 * introProgress})`;
      ctx.lineWidth = 1;

      for (const continent of CONTINENTS_PATHS) {
        ctx.beginPath();
        for (let i = 0; i < continent.length; i++) {
          const x = continent[i][0] * w;
          const y = continent[i][1] * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Generate ripples periodically
      if (now - lastRipple > 2000) {
        ripples.push({
          startTime: now,
          maxRadius: Math.max(w, h) * 0.8,
          duration: 4000,
        });
        lastRipple = now;
        // Keep only active ripples
        while (ripples.length > 6) ripples.shift();
      }

      // Draw ripples
      for (const ripple of ripples) {
        const rippleElapsed = now - ripple.startTime;
        if (rippleElapsed > ripple.duration) continue;

        const t = rippleElapsed / ripple.duration;
        const radius = t * ripple.maxRadius;
        const alpha = 0.35 * (1 - t);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 2 * (1 - t) + 0.5;
        ctx.stroke();

        // Inner glow ring
        if (t < 0.5) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 * (1 - t * 2)})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // Radar sweep line
      const sweepAngle = (elapsed * 0.001) % (Math.PI * 2);
      const sweepLen = Math.max(w, h) * 0.7;
      const sweepX = cx + Math.cos(sweepAngle) * sweepLen;
      const sweepY = cy + Math.sin(sweepAngle) * sweepLen;

      // Sweep cone (fading trail)
      for (let i = 0; i < 20; i++) {
        const trailAngle = sweepAngle - i * 0.015;
        const tx = cx + Math.cos(trailAngle) * sweepLen;
        const ty = cy + Math.sin(trailAngle) * sweepLen;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - i / 20)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Main sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center point (Paris)
      const pulse = 1 + 0.25 * Math.sin(now * 0.004);
      ctx.beginPath();
      ctx.arc(cx, cy, 15 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 8 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Concentric fixed rings (subtle)
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * 80, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

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
