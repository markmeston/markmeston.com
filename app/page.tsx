'use client';

import Link from 'next/link';
import { useEffect, useRef, useSyncExternalStore } from 'react';

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

function strokeHexPath(
  ctx: CanvasRenderingContext2D,
  c: { x: number; y: number },
  R: number,
) {
  const v0 = vertexPointyTop(c.x, c.y, R, 0);
  ctx.moveTo(v0.x, v0.y);
  for (let k = 1; k <= 6; k++) {
    const v = vertexPointyTop(c.x, c.y, R, k);
    ctx.lineTo(v.x, v.y);
  }
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getReducedMotionClient() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionClient,
    () => false,
  );
}

export default function MinimalHexCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;

    const hexR = 26;
    const drawSpeedBase = 0.085;

    let centers: { x: number; y: number }[] = [];
    let drawOrder: number[] = [];
    const completed = new Set<number>();
    let orderPos = 0;
    let currentSide = 0;
    let progress = 0;

    let cxScreen = 0;
    let cyScreen = 0;

    const pointer = { x: 0, y: 0, active: false };

    const applyPointerFromEvent = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const sx = canvas.width / rect.width;
      const sy = canvas.height / rect.height;
      pointer.x = (clientX - rect.left) * sx;
      pointer.y = (clientY - rect.top) * sy;
      pointer.active = true;
    };

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

    const drawStaticField = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;

      ctx.lineJoin = ctx.lineCap = 'round';
      for (const c of centers) strokeHexPath(ctx, c, hexR);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 2;
      const focus = centers[drawOrder[0]];
      if (focus) strokeHexPath(ctx, focus, hexR);
      ctx.stroke();
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      rebuildGrid();
      if (prefersReducedMotion) drawStaticField();
    };

    window.addEventListener('resize', resize);
    resize();

    if (prefersReducedMotion) {
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    const onPointerMove = (e: PointerEvent) => {
      applyPointerFromEvent(e.clientX, e.clientY);
    };
    const onPointerDown = (e: PointerEvent) => {
      applyPointerFromEvent(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);

    const currentHexIndex = () =>
      drawOrder.length === 0 ? -1 : drawOrder[orderPos % drawOrder.length];

    const influenceFromPointer = (cx: number, cy: number) => {
      if (!pointer.active) return { speedMul: 1, glowBlur: 12 };

      const d = Math.hypot(cx - pointer.x, cy - pointer.y);
      const horizon = Math.hypot(canvas.width, canvas.height) * 0.38;
      const near = Math.max(0, 1 - Math.min(d / horizon, 1));

      const speedMul = 0.32 + near * (2.35 - 0.32);
      const glowBlur = 12 + near * 20;
      return { speedMul, glowBlur };
    };

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineJoin = ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      for (const idx of completed) {
        const c = centers[idx];
        if (!c) continue;
        strokeHexPath(ctx, c, hexR);
      }
      ctx.stroke();

      const hi = currentHexIndex();
      if (hi >= 0 && centers[hi]) {
        const c = centers[hi];
        const { speedMul, glowBlur } = influenceFromPointer(c.x, c.y);

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = glowBlur;
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
        ctx.arc(curX, curY, 3 + speedMul * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        progress += drawSpeedBase * speedMul;
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
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion]);

  const linkInteract =
    'pointer-events-auto hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <main className="bg-[#000000] min-h-screen w-full overflow-hidden flex items-center justify-center relative font-mono selection:bg-white selection:text-black">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full block touch-none"
      />

      <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-sm pointer-events-none">
        <div className="w-full border border-white/20 p-12 bg-black/60 backdrop-blur-md shadow-2xl flex flex-col gap-10 text-center transition-all hover:border-white/40 pointer-events-none">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase">
              Mark Meston
            </h1>
          </div>

          <div className="flex flex-col gap-3 text-sm tracking-widest text-white/80">
            <a
              href="mailto:mark@markmeston.com"
              className={linkInteract}
              title="Contact"
            >
              MARK@MARKMESTON.COM
            </a>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <a
              href="https://orbit.markmeston.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex w-full items-center justify-center bg-white text-black py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-gray-200 ${linkInteract}`}
            >
              <span className="relative z-10">Initialize Orbit</span>
            </a>

            <Link
              href="/notes"
              className={`flex w-full items-center justify-center border border-white/25 py-3 px-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/70 hover:border-white/45 hover:bg-white/[0.04] hover:text-white/90 ${linkInteract}`}
            >
              Notes &amp; changelog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
