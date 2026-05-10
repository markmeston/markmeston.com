import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How Mark Meston LLC treats data on markmeston.com—minimal by design.',
  openGraph: {
    title: 'Privacy · Mark Meston',
    url: 'https://markmeston.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#000000] font-mono text-white selection:bg-white selection:text-black">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-12 px-6 py-16 md:px-8 md:py-24">
        <header className="flex flex-col gap-5 border border-white/15 bg-black/45 p-8 backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-white/52">
            Policy
          </p>
          <h1 className="text-xl font-bold uppercase tracking-[0.32em] text-white md:text-2xl">
            Privacy
          </h1>
          <p className="text-[0.8125rem] leading-relaxed tracking-wide text-white/72">
            This site collects only what ordinary HTTP hosting emits (e.g.,
            logs) unless you voluntarily email—the mailbox is initiation, not
            analytics instrumentation.
          </p>
          <p className="text-[0.8125rem] leading-relaxed tracking-wide text-white/72">
            Orbit Terminal may articulate its own data posture on orbit-terminal.io; treat that surface as authoritative for product traffic.
          </p>
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
