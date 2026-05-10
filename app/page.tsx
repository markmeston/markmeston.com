'use client';

import Link from 'next/link';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useSyncExternalStore } from 'react';

import { MAILTO, ORBIT_DOCTRINE, ORBIT_ORIGIN } from '@/lib/site-meta';

/** Tiled pointy hex tile; parallax transforms follow cursor rails below. */
const HEX_TILE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='92' height='80' viewBox='0 0 92 80'>
    <path d='M46 4 L87 29.43 L87 50.57 L46 76 L5 50.57 L5 29.43 Z' fill='none' stroke='rgba(255,255,255,1)' stroke-width='0.9' opacity='1'/>
  </svg>`,
);



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
  const prefersReducedMotion = usePrefersReducedMotion();
  const logoRef = useRef<HTMLHeadingElement>(null);

  const cursorXpct = useMotionValue(50);
  const cursorYpct = useMotionValue(50);
  const spring = { stiffness: 38, damping: 22, mass: 0.9 };
  const smoothX = useSpring(cursorXpct, spring);
  const smoothY = useSpring(cursorYpct, spring);

  /** 0 idle → 1 near logo centroid */
  const logoGlowSignal = useMotionValue(0);
  const logoGlow = useSpring(logoGlowSignal, {
    stiffness: 120,
    damping: 24,
    mass: 0.55,
  });
  const haloPx = useTransform(logoGlow, [0, 1], [12, 42]);
  const logoFilterTemplate = useMotionTemplate`brightness(1.02) saturate(1) drop-shadow(0px 0px ${haloPx}px rgba(255,255,255,0.11))`;

  const voidMask = useMotionTemplate`radial-gradient(760px circle at ${smoothX}% ${smoothY}%, rgba(255,255,255,0.042) 0%, transparent 62%)`;

  /** Parallax: cursor high → lattice shifts down (+y); mirrored X for cohesion (Fitts-aligned depth cue). */
  const hexLayerX = useTransform(smoothX, [0, 100], [-22, 22]);
  const hexLayerY = useTransform(smoothY, [0, 100], [32, -32]);

  const linkInteract =
    'pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  const hexBg = `url("data:image/svg+xml,${HEX_TILE_SVG}")`;

  return (
    <main
      className="relative flex w-full flex-1 cursor-default flex-col items-center justify-center overflow-hidden bg-[#000000] font-mono text-white selection:bg-white selection:text-black"
      onPointerMove={(e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } =
          currentTarget.getBoundingClientRect();
        cursorXpct.set(((clientX - left) / width) * 100);
        cursorYpct.set(((clientY - top) / height) * 100);

        const lg = logoRef.current;
        if (lg) {
          const r = lg.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const d = Math.hypot(clientX - cx, clientY - cy);
          const denom = Math.max(180, Math.hypot(width, height) * 0.14);
          const n = Math.max(0, 1 - d / denom);
          logoGlowSignal.set(n * n);
        }
      }}
      onPointerLeave={() => {
        cursorXpct.set(50);
        cursorYpct.set(50);
        logoGlowSignal.set(0);
      }}
    >
      {/* —— Void Physics: hex lattice parallax tied to smoothed cursor + radial veil —— */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[12vmin] z-0 opacity-[0.065] [will-change:transform]"
        style={{
          backgroundImage: hexBg,
          backgroundSize: '92px 80px',
          backgroundPosition: '50% 50%',
          ...(prefersReducedMotion ? {} : { x: hexLayerX, y: hexLayerY }),
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
        style={{ backgroundImage: voidMask }}
      />

      {/* —— Identity shell —— */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center justify-center px-8 py-12 pointer-events-none">
        <motion.div
          className="pointer-events-none flex w-full flex-col gap-8 border border-white/20 bg-black/65 p-11 text-center shadow-2xl shadow-black/70 backdrop-blur-md transition-[border-color] duration-500 hover:border-white/38 sm:p-12"
          initial={
            prefersReducedMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 36, filter: 'blur(10px)' }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: prefersReducedMotion ? 'blur(0px)' : 'blur(0px)',
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  delay: 0.08,
                  duration: 0.96,
                  ease: [0.16, 1, 0.3, 1],
                  filter: { duration: 0.85 },
                }
          }
        >
          {/* —— Glassmorphic kinetic logotype —— */}
          <div className="flex flex-col items-center gap-1">
            <motion.h1
              ref={logoRef}
              className="relative text-[clamp(1.125rem,2.8vw,1.725rem)] font-bold uppercase tracking-[0.26em]"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { backgroundPosition: ['180% center', '-80% center'] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 28, repeat: Infinity, ease: 'linear' }
              }
              style={{
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                backgroundImage:
                  'linear-gradient(112deg,#737373 0%,#fafafa 16%,#ffffff 34%,#a3a3a3 48%,#f5f5f5 64%,#e5e5e5 80%,#737373 100%)',
                backgroundSize: '220% 100%',
                filter: prefersReducedMotion
                  ? 'drop-shadow(0 0 16px rgba(255,255,255,0.08))'
                  : logoFilterTemplate,
              }}
            >
              MARK MESTON LLC
            </motion.h1>
            <motion.div
              aria-hidden
              className="pointer-events-none h-px w-[68%] max-w-[16rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.32 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { delay: 0.72, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }
              style={{
                background:
                  'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)',
              }}
            />
          </div>

          <p className="mx-auto max-w-[22rem] text-center text-[0.6875rem] font-medium leading-relaxed tracking-wide text-white/[0.62] md:max-w-md">
            {ORBIT_DOCTRINE}
          </p>

          <div className="flex flex-col gap-4 pt-1">
            <motion.a
              href={ORBIT_ORIGIN}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkInteract} relative flex min-h-[3.625rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[1px] bg-white px-6 py-[1.15rem] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-black sm:min-h-[3.75rem]`}
              style={{ letterSpacing: '0.2em', willChange: 'transform, box-shadow' }}
              aria-label="Open Orbit Terminal in a new tab"
              transition={{ type: 'spring', stiffness: 580, damping: 36 }}
              whileHover={{
                backgroundColor: '#000000',
                color: '#ffffff',
                letterSpacing: '0.36em',
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,.92), 0 0 52px rgba(255,255,255,.26), inset 0 0 96px rgba(255,255,255,.048)',
              }}
              whileTap={{ scale: 0.986 }}
            >
              <span className="relative z-10">INITIALIZE ORBIT</span>
            </motion.a>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={MAILTO}
                className={`${linkInteract} flex min-h-11 items-center justify-center py-3 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/[0.78] transition-colors hover:text-white`}
              >
                MARK@MARKMESTON.COM
              </a>

              <Link
                href="/notes"
                className={`flex min-h-11 items-center justify-center border border-white/23 py-[0.6875rem] px-5 text-[0.625rem] font-bold uppercase tracking-[0.28em] text-white/68 transition-colors duration-300 hover:border-white/43 hover:bg-white/[0.04] hover:text-white/[0.93] ${linkInteract}`}
              >
                NOTES & CHANGELOG
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
