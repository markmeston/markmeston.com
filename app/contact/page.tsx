import Link from 'next/link';
import type { Metadata } from 'next';

import { MAILTO } from '@/lib/site-meta';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'How to route inquiries to Mark Meston LLC—commercial, product, operational.',
  openGraph: {
    title: 'Contact · Mark Meston',
    url: 'https://markmeston.com/contact',
  },
};

export default function ContactPage() {
  const mailHref = `${MAILTO}?subject=${encodeURIComponent('Orbit Terminal — routed inquiry')}`;
  const big =
    'inline-flex min-h-[52px] w-full items-center justify-center bg-white px-6 py-4 text-center text-[0.6875rem] font-bold uppercase tracking-[0.26em] text-black transition-colors hover:bg-neutral-200 sm:w-auto sm:min-w-[min(100%,280px)]';

  return (
    <main className="min-h-screen bg-[#000000] font-mono text-white selection:bg-white selection:text-black">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-12 px-6 py-16 md:px-8 md:py-24">
        <header className="flex flex-col gap-6 border border-white/15 bg-black/45 p-8 backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-white/52">
            Routing
          </p>
          <h1 className="text-xl font-bold uppercase tracking-[0.32em] text-white md:text-2xl">
            Contact
          </h1>
          <div className="flex flex-col gap-4 text-[0.8125rem] leading-relaxed tracking-wide text-white/75">
            <p>
              Solo operator throughput: initiate <strong className="text-white/92">commercial / administrative</strong> threads through electronic mail—the highest-accuracy ingress for LLC correspondence.
            </p>
            <p>
              <strong className="text-white/92">Product (Orbit Terminal)</strong> instrumentation and technical behavior live on orbit-terminal.io; escalate security findings there unless the bulletin demands legal counsel custody.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap">
            <a href={mailHref} className={big}>
              Open MAIL Channel
            </a>
          </div>

          <div className="border border-white/[0.08] bg-black/30 px-5 py-4 text-[11px] leading-relaxed tracking-wide text-white/58">
            Response cadence varies; async-first instrumentation: include intent, timelines, counterparties—signal over noise preserves bandwidth.
          </div>

          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex min-h-[48px] min-w-[140px] items-center justify-center border border-white/25 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/88 transition-colors hover:border-white/45 hover:bg-white/[0.05]"
            >
              ← Home
            </Link>
          </div>
        </header>
      </div>
    </main>
  );
}
