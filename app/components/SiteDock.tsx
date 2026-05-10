import Link from 'next/link';

const year = new Date().getFullYear();

/**
 * Bottom-edge docking rail: leverages screen bottom as an infinite Fitts target;
 * tertiary sections get equal wedge width (maximum width × shared depth).
 */
export function SiteDock() {
  const wedge =
    'flex min-h-[52px] flex-1 items-center justify-center px-3 py-3 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-white/62 transition-colors hover:bg-white/[0.07] hover:text-white';

  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-[50] border-t border-white/12 bg-black/92 pb-[env(safe-area-inset-bottom,0px)] font-mono text-white backdrop-blur-md [&_a]:pointer-events-auto [&_nav]:pointer-events-auto">
      <p className="border-b border-white/[0.07] px-4 py-2 text-center text-[0.5625rem] font-bold uppercase leading-relaxed tracking-[0.32em] text-white/42">
        © {year} Mark Meston LLC
      </p>
      <nav
        aria-label="Site utilities"
        className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-white/10 md:divide-x md:divide-white/12"
      >
        <Link className={wedge} href="/privacy">
          Privacy
        </Link>
        <Link className={wedge} href="/contact">
          Contact
        </Link>
        <Link className={wedge} href="/notes">
          Notes
        </Link>
      </nav>
    </footer>
  );
}
