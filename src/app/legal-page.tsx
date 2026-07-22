import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="w-full max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
      <Link
        href="/"
        className="mb-10 inline-block text-sm font-medium text-orange hover:text-white"
      >
        ← richardalvarez.info
      </Link>

      <article className="select-text text-white">
        <header className="mb-10 border-b border-white/30 pb-6">
          <p className="mb-2 text-sm uppercase tracking-widest text-white/60">
            Fable Trader SMS Program
          </p>
          <h1 className="text-3xl font-black tracking-wide sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Last updated July 22, 2026
          </p>
        </header>

        <div className="space-y-8 text-base leading-7 text-white/85">
          {children}
        </div>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
