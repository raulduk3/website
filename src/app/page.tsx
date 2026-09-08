// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <section className="w-full max-w-xl px-2 py-10 sm:px-8 sm:py-14 flex flex-col items-center">
        <div className="w-full border-b border-rule pb-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-medium leading-tight tracking-tight text-center">Richard Álvarez</h1>
        </div>

        <div className="w-full border-b border-rule pb-6 mb-6">
          <p className="text-center text-lg font-normal leading-relaxed text-muted tracking-normal">Web Developer & AI Engineer</p>
        </div>

        <div className="w-full text-lg leading-relaxed text-ink">
          <p className="mb-4">
            Creative technologist building novel, effective and minimal internet experiences with a focus on integrating AI technologies.
          </p>
          <p className="mb-6 text-muted">
            Based in Chicago, working globally. 
          </p>
          <div className="flex flex-col border-t border-rule pt-6 mt-8 gap-2">
            <p className="text-base text-muted mb-1">
              Links
            </p>
            <Link
              href="mailto:rawalvarez731@gmail.com"
              className="w-fit text-ink font-medium py-1"
            >
              → email
            </Link>
            <Link
              href="/Richard_Alvarez_Resume.pdf"
              className="w-fit text-ink font-medium py-1"
            >
              → resume
            </Link>
            <Link
              href="/Richard_Alvarez_CV.pdf"
              className="w-fit text-ink font-medium py-1"
            >
              → academic CV
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
