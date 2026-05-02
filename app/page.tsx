'use client';

import { useEffect, useRef } from 'react';

function collectHexCenters(
  w: number,
  h: number,
  R: number,
): { x: number; y: number }[] {
  const sqrt3 = Math.sqrt(3);
  const horiz = sqrt3 * R;
  const vert = 1.5 * R;
  const pad = R * 3;
  const list: { x: number; y: number }[] = [];
  let row = 0;
  for (let y = -pad + R; y <= h + pad; y += vert, row++) {
    const xOff = (row % 2) * (horiz / 2);
    for (let x = -pad + xOff; x <= w + pad; x += horiz) {
      list.push({ x, y });
    }
  }
  return list;
}

function vertexPointyTop(cx: number, cy: number, R: number, k: number) {
  const angle = -Math.PI / 2 + k * (Math.PI / 3);
  return {
    x: cx + R * Math.cos(angle),
    y: cy + R * Math.sin(angle),
  };
}

export default function MinimalHexCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;

    const hexR = 26;
    const drawSpeed = 0.085;

    let centers: { x: number; y: number }[] = [];
    /** Indices into `centers` in draw order */
    let drawOrder: number[] = [];
    /** Fully traced hex indices */
    const completed = new Set<number>();
    let orderPos = 0;
    let currentSide = 0;
    let progress = 0;

    let cxScreen = 0;
    let cyScreen = 0;

    const rebuildGrid = () => {
      const w = canvas.width;
      const h = canvas.height;
      cxScreen = w / 2;
      cyScreen = h / 2;
      centers = collectHexCenters(w, h, hexR);
      drawOrder = centers
        .map((c, i) => ({
          i,
          d:
            (c.x - cxScreen) * (c.x - cxScreen) +
            (c.y - cyScreen) * (c.y - cyScreen),
        }))
        .sort((a, b) => a.d - b.d)
        .map((x) => x.i);
      completed.clear();
      orderPos = 0;
      currentSide = 0;
      progress = 0;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      rebuildGrid();
    };
    window.addEventListener('resize', resize);
    resize();

    const currentHexIndex = () =>
      drawOrder.length === 0 ? -1 : drawOrder[orderPos % drawOrder.length];

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Completed lone hexagons (frozen traces)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      for (const idx of completed) {
        const c = centers[idx];
        if (!c) continue;
        const v0 = vertexPointyTop(c.x, c.y, hexR, 0);
        ctx.moveTo(v0.x, v0.y);
        for (let k = 1; k <= 6; k++) {
          const v = vertexPointyTop(c.x, c.y, hexR, k);
          ctx.lineTo(v.x, v.y);
        }
      }
      ctx.stroke();

      const hi = currentHexIndex();
      if (hi >= 0 && centers[hi]) {
        const c = centers[hi];

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffffff';
        ctx.lineWidth = 2;

        const start = vertexPointyTop(c.x, c.y, hexR, 0);
        ctx.moveTo(start.x, start.y);

        for (let s = 0; s < currentSide; s++) {
          const v = vertexPointyTop(c.x, c.y, hexR, s + 1);
          ctx.lineTo(v.x, v.y);
        }

        const p1 = vertexPointyTop(c.x, c.y, hexR, currentSide);
        const p2 = vertexPointyTop(c.x, c.y, hexR, currentSide + 1);
        const curX = p1.x + (p2.x - p1.x) * progress;
        const curY = p1.y + (p2.y - p1.y) * progress;
        ctx.lineTo(curX, curY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        progress += drawSpeed;
        if (progress >= 1) {
          progress = 0;
          currentSide++;
          if (currentSide >= 6) {
            completed.add(hi);
            currentSide = 0;
            orderPos++;
            if (orderPos >= drawOrder.length) {
              completed.clear();
              orderPos = 0;
            }
          }
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="bg-[#000000] min-h-screen w-full overflow-hidden flex items-center justify-center relative font-mono selection:bg-white selection:text-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Brutalist Identity Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-sm">
        <div className="w-full border border-white/20 p-12 bg-black/60 backdrop-blur-md shadow-2xl flex flex-col gap-10 text-center transition-all hover:border-white/40">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase">
              Mark Meston
            </h1>
          </div>

          <div className="flex flex-col gap-3 text-sm tracking-widest text-white/80">
            <a href="tel:+10000000000" className="hover:text-white transition-colors">
              801.555.0199
            </a>
            <a href="mailto:mark@markmeston.com" className="hover:text-white transition-colors">
              MARK@MARKMESTON.COM
            </a>
          </div>

          <div className="pt-4">
            <a
              href="https://orbit.markmeston.com"
              target="_blank"
              rel="noreferrer"
              className="group relative flex w-full items-center justify-center bg-white text-black py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-gray-200"
            >
              <span className="relative z-10">Initialize Orbit</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
