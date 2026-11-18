import type { Metadata } from "next";
import { TRAINERS } from "@/lib/content";

export const metadata: Metadata = { title: "Trainers" };

export default function TrainersPage() {
  return (
    <>
      <header className="page-heading">
        <h1>Meet Our Trainers</h1>
        <p>
          Our certified coaches bring years of experience, specialized techniques, and high-energy
          motivation to help you push past your limits safely.
        </p>
      </header>

      <div className="card-grid">
        {TRAINERS.map((t) => (
          <article key={t.id} className="card">
            <h2>{t.role}</h2>
            <h3>{t.name}</h3>
            <p>
              <strong>Specialty:</strong> {t.specialty}
            </p>
            <p>{t.bio}</p>
          </article>
        ))}
      </div>
    </>
  );
}
