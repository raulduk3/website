import Image from "next/image";
import Link from "next/link";
import CopyEmailButton from "../components/CopyEmailButton";

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
    <main id="main-content" tabIndex={-1}>
      <header>
        <h1>Richard Álvarez</h1>
        <p>Web Developer & AI Engineer</p>
      </header>

      <div className="introduction">
        <p>
          Creative technologist building novel, effective and minimal internet experiences with a focus on integrating AI technologies.
        </p>
        <p>Based in Chicago, working globally.</p>
      </div>

      <section aria-labelledby="selected-websites">
        <h2 id="selected-websites">Selected websites</h2>
        <div className="project-list">
          {projects.map((project) => (
            <article key={project.id} aria-labelledby={`${project.id}-title`}>
              <div className="project-heading">
                <h3 id={`${project.id}-title`}>
                  <a href={project.href} className="project-link">
                    <span aria-hidden="true">→</span>
                    <span className="link-label">{project.name}</span>
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
                  sizes="(min-width: 424px) 384px, calc(100vw - 40px)"
                  className="project-preview"
                />
              </details>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="contact-links">
        <h2 id="contact-links">Links</h2>
        <Link href={`mailto:${email}`} className="contact-link">
          <span aria-hidden="true">→ </span><span className="link-label">{email}</span>
        </Link>
        <CopyEmailButton email={email} />
        <Link href="/Richard_Alvarez_Resume.pdf" className="contact-link">
          <span aria-hidden="true">→ </span><span className="link-label">resume (PDF)</span>
        </Link>
        <Link href="/Richard_Alvarez_CV.pdf" className="contact-link">
          <span aria-hidden="true">→ </span><span className="link-label">academic CV (PDF)</span>
        </Link>
      </section>
    </main>
  );
}
