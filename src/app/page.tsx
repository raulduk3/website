// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <section className="w-full max-w-xl p-8 flex flex-col items-center">
        <div className="w-full border-b pb-4 mb-6">
          <h1 className="text-3xl font-black tracking-wide uppercase text-center">Richard Álvarez</h1>
        </div>

        <div className="w-full border-b pb-4 mb-6">
          <p className="text-center text-lg font-light mb-1 tracking-normal">Web Developer & AI Engineer</p>
        </div>

        <div className="w-full text-base text-white">
          <p className="mb-4">
            Creative technologist building novel, effective and minimal internet experiences with a focus on integrating AI technologies.
          </p>
          <p className="mb-4 text-white/80">
            Based in Chicago, working globally. 
          </p>
          <div className="flex flex-col border-t border-white pt-4 mt-6">
            <p>
              Links
            </p>
            <Link
              href="mailto:rawalvarez731@gmail.com"
              className="no-underline text-orange hover:text-white font-medium"
            >
              → email
            </Link>
            <Link
              href="/Richard_Alvarez_Resume.pdf"
              className="no-underline text-orange hover:text-white font-medium"
            >
              → resume
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
