import { useEffect, useRef } from 'react';

export function TopoGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Grid parameters
    const cols = 60;
    const rows = 35;

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cellW = w / (cols - 1);
      const cellH = h / (rows - 1);

      // Compute heights for each grid point
      const heights: number[][] = [];
      for (let r = 0; r < rows; r++) {
        heights[r] = [];
        for (let c = 0; c < cols; c++) {
          const x = c / cols;
          const y = r / rows;

          // Multiple wave sources for terrain-like effect
          const h1 = Math.sin(x * 6 + time * 0.8) * Math.cos(y * 4 + time * 0.5) * 18;
          const h2 = Math.sin((x + y) * 3 + time * 0.3) * 12;
          const h3 = Math.cos(x * 8 - time * 0.6) * Math.sin(y * 6 + time * 0.4) * 8;

          // Elevation peak near center (France position ~60% right, ~40% up)
          const dx = x - 0.55;
          const dy = y - 0.4;
          const peak = Math.exp(-(dx * dx + dy * dy) * 8) * 30;

          heights[r][c] = h1 + h2 + h3 + peak;
        }
      }

      // Draw horizontal lines (contour-like)
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const x = c * cellW;
          const baseY = r * cellH;
          const elevation = heights[r][c];
          const y = baseY - elevation;

          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Color based on row position — gradient from blue to teal
        const t = r / rows;
        const alpha = 0.15 + 0.2 * (1 - Math.abs(t - 0.4) * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.05, alpha)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw vertical lines (sparse, lighter)
      for (let c = 0; c < cols; c += 3) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const x = c * cellW;
          const baseY = r * cellH;
          const elevation = heights[r][c];
          const y = baseY - elevation;

          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Contour lines (same height = same color, drawn as iso-lines)
      const contourLevels = [-15, -5, 5, 15, 25, 35];
      for (const level of contourLevels) {
        ctx.beginPath();
        let started = false;

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const h00 = heights[r][c];
            const h10 = heights[r][c + 1];

            // Simple marching on horizontal segments
            if ((h00 <= level && h10 > level) || (h00 > level && h10 <= level)) {
              const t = (level - h00) / (h10 - h00);
              const x = (c + t) * cellW;
              const baseY = r * cellH;
              const y = baseY - level;

              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
          }
        }

        ctx.strokeStyle = `rgba(45, 212, 191, ${level > 20 ? 0.25 : 0.1})`;
        ctx.lineWidth = level > 20 ? 1.2 : 0.6;
        ctx.stroke();
      }

      // Pin marker at the peak (France)
      const peakC = Math.round(0.55 * (cols - 1));
      const peakR = Math.round(0.4 * (rows - 1));
      const pinX = peakC * cellW;
      const pinBaseY = peakR * cellH;
      const pinY = pinBaseY - heights[peakR][peakC];

      // Pulsing ring
      const pulse = 1 + 0.2 * Math.sin(time * 3);
      ctx.beginPath();
      ctx.arc(pinX, pinY, 10 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pinX, pinY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pinX, pinY, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#0B1628';
      ctx.fill();

      // Coordinate text
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fillText('48.86°N, 2.35°E', pinX + 14, pinY + 4);

      time += 0.008;
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
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}
