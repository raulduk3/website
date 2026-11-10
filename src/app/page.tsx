import Image from "next/image";
import Link from "next/link";
import CopyEmailButton from "../components/CopyEmailButton";
import LivingPaper from "../components/LivingPaper";

type Project = Readonly<{
  id: string;
  name: string;
  href: `https://${string}`;
  description: string;
  preview: `/projects/${string}.jpg`;
  status: "live" | "coming-soon";
}>;

const projects: readonly Project[] = [
  {
    id: "jonah-white",
    name: "Jonah White",
    href: "https://www.jonahwhitepxp.com/",
    description: "Sports broadcaster portfolio with demos, reporting, and Google Sheets content updates.",
    preview: "/projects/jonah-white.jpg",
    status: "live",
  },
  {
    id: "joaquin-morales",
    name: "Joaquín Morales",
    href: "https://www.joaquinmoralesdp.com/",
    description: "Director-of-photography portfolio with films, music, commercial work, and photography.",
    preview: "/projects/joaquin-morales.jpg",
    status: "live",
  },
  {
    id: "airlogic",
    name: "AirLogic",
    href: "https://airlogicchi.com/",
    description: "Chicago HVAC website and application. The public page currently says Coming soon.",
    preview: "/projects/airlogic.jpg",
    status: "coming-soon",
  },
];

const email = "rawalvarez731@gmail.com";

export default function HomePage() {
  return (
    <LivingPaper>
    <main id="main-content" tabIndex={-1} className="flex flex-col items-center justify-center w-full">
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
          <section aria-labelledby="selected-websites" className="border-t border-rule pt-3 mt-4 sm:pt-4 sm:mt-5">
            <h2 id="selected-websites" className="text-[0.875em] font-normal text-muted mb-2">
              Selected websites
            </h2>
            <div className="project-list">
              {projects.map((project) => (
                <article key={project.id} aria-labelledby={`${project.id}-title`}>
                  <div className="project-heading">
                    <h3 id={`${project.id}-title`} className="font-normal">
                      <a href={project.href} className="project-link">
                        <span aria-hidden="true">→ </span>{project.name}
                      </a>
                    </h3>
                    {project.status === "coming-soon" && <span className="project-status">Coming soon</span>}
                  </div>
                  <p className="project-description">{project.description}</p>
                  <details className="project-disclosure">
                    <summary>Preview website</summary>
                    <Image
                      src={project.preview}
                      alt={`${project.name} website screenshot`}
                      width={1440}
                      height={1000}
                      sizes="(min-width: 640px) 512px, calc(100vw - 48px)"
                      className="project-preview"
                    />
                  </details>
                </article>
              ))}
            </div>
          </section>
          <section aria-labelledby="contact-links" className="flex flex-col border-t border-rule pt-3 mt-4 sm:pt-4 sm:mt-5 gap-0">
            <h2 id="contact-links" className="text-[0.875em] font-normal text-muted mb-1">
              Links
            </h2>
            <Link
              href={`mailto:${email}`}
              className="contact-link w-fit text-ink font-normal leading-normal"
            >
              <span aria-hidden="true">→ </span>{email}
            </Link>
            <CopyEmailButton email={email} />
            <Link
              href="/Richard_Alvarez_Resume.pdf"
              className="contact-link w-fit text-ink font-normal leading-normal"
            >
              <span aria-hidden="true">→ </span>resume (PDF)
            </Link>
            <Link
              href="/Richard_Alvarez_CV.pdf"
              className="contact-link w-fit text-ink font-normal leading-normal"
            >
              <span aria-hidden="true">→ </span>academic CV (PDF)
            </Link>
          </section>
        </div>
      </section>
    </main>
    </LivingPaper>
  );
}
