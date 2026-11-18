import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES } from "@/lib/content";

export const metadata: Metadata = { title: "Classes" };

export default function ClassesPage() {
  return (
    <>
      <header className="page-heading">
        <h1>Our Classes</h1>
      </header>

      <div className="card-grid">
        {CLASSES.map((c) => (
          <section key={c.id} className="card">
            <h2>{c.title}</h2>
            <p>“{c.tagline}”</p>
            <ul>
              {c.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div>
        <Link className="book-class-button" href="/join">
          Book a Class
        </Link>
      </div>
    </>
  );
}
