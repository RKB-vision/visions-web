import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <p>Visions portfolio</p>
      <h1>A clear view of what I build.</h1>
      <p>
        The public portfolio foundation is ready for site content, project
        discovery, and funding experiences.
      </p>
      <Link href="/projects">Browse projects</Link>
    </main>
  );
}
