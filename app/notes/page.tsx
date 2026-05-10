import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notes',
  description:
    'Brief updates, breadcrumbs, and context around Mark Meston\'s work—not a full blog.',
  openGraph: {
    title: 'Notes · Mark Meston',
    description:
      'Brief updates and breadcrumbs—not a full blog.',
    url: 'https://markmeston.com/notes',
  },
};

export default function NotesPage() {
  const link =
    'text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white/70';

  return (
    <main className="min-h-screen bg-[#050506] font-mono text-white selection:bg-white selection:text-black">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-14 px-6 py-16 md:px-8 md:py-24">
        <header className="flex flex-col gap-6 border border-white/15 bg-black/40 p-8 backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-white/55">
            Breadcrumbs
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-[0.35em] text-white md:text-3xl">
            Notes
          </h1>
          <p className="max-w-lg text-sm leading-relaxed tracking-wide text-white/70">
            Short-lived context for things that deserve a permalink but do not belong in a timeline feed.
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 border border-white/25 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/85 transition-colors hover:border-white/45 hover:bg-white/[0.05]"
            >
              ← Signal
            </Link>
          </div>
        </header>

        <ol className="flex flex-col gap-10 border-l border-white/10 pl-6">
          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-[25px] top-1 block h-[7px] w-[7px] rounded-full bg-white/80 shadow-[0_0_14px_rgba(255,255,255,0.45)]"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-white/45">
              2026 · Site
            </p>
            <p className="mt-4 text-xs leading-relaxed tracking-wide text-white/75 md:text-[0.813rem]">
              Home is deliberately minimal—a living card over a procedural grid—and everything heavier lives in{' '}
              <a href="https://orbit-terminal.io" className={link} target="_blank" rel="noopener noreferrer">
                Orbit
              </a>
              .
            </p>
          </li>

          <li className="relative">
            <span
              aria-hidden
              className="absolute -left-[25px] top-1 block h-[7px] w-[7px] rounded-full bg-white/35"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-white/45">
              Colophon
            </p>
            <p className="mt-4 text-xs leading-relaxed tracking-wide text-white/75 md:text-[0.813rem]">
              Built with Next.js—canvas for the lattice, monospace for signage. Questions:{' '}
              <a href="mailto:mark@markmeston.com" className={link}>
                mark@markmeston.com
              </a>
              .
            </p>
          </li>
        </ol>
      </div>
    </main>
  );
}
