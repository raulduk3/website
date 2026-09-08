// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <section className="w-full max-w-xl px-2 py-8 sm:px-8 sm:py-10 flex flex-col items-center">
        <div className="w-full border-b border-rule pb-3 mb-3 sm:pb-4 sm:mb-4">
          <h1 className="text-[clamp(1.75rem,1.5rem+1vw,2rem)] font-normal leading-[1.2] tracking-[-0.025em] text-center">Richard Álvarez</h1>
        </div>

        <div className="w-full border-b border-rule pb-3 mb-3 sm:pb-4 sm:mb-4">
          <p className="text-center text-[1em] font-normal leading-normal text-muted tracking-normal">Web Developer & AI Engineer</p>
        </div>

        <div className="w-full text-[1em] leading-[1.6] text-ink">
          <p className="mb-3">
            Creative technologist building novel, effective and minimal internet experiences with a focus on integrating AI technologies.
          </p>
          <p className="text-muted">
            Based in Chicago, working globally. 
          </p>
          <div className="flex flex-col border-t border-rule pt-3 mt-4 sm:pt-4 sm:mt-5 gap-0">
            <p className="text-[0.875em] text-muted mb-1">
              Links
            </p>
            <Link
              href="mailto:rawalvarez731@gmail.com"
              className="w-fit text-ink font-normal leading-normal py-1"
            >
              → email
            </Link>
            <Link
              href="/Richard_Alvarez_Resume.pdf"
              className="w-fit text-ink font-normal leading-normal py-1"
            >
              → resume
            </Link>
            <Link
              href="/Richard_Alvarez_CV.pdf"
              className="w-fit text-ink font-normal leading-normal py-1"
            >
              → academic CV
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
