import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { studio } from "@/lib/config";
import { OPENING_HOURS } from "@/lib/content";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <section className="banner" aria-labelledby="contact-title">
        <p className="eyebrow">WE&apos;RE HERE TO HELP</p>
        <h1 id="contact-title">Get In Touch</h1>
        <p>
          Have a question about our classes, membership plans, or facility? Reach out to our
          team—we&apos;re happy to help you get started.
        </p>
      </section>

      <div className="contact-grid">
        <section className="panel studio-card" aria-labelledby="studio-title">
          <p className="eyebrow">COME SAY HELLO</p>
          <h2 id="studio-title">Studio Details</h2>
          <p className="panel-intro">
            We&apos;d love to hear from you. Visit, call, or send us a message and we&apos;ll get
            back to you soon.
          </p>

          <div className="studio-detail">
            <span className="detail-label">Location</span>
            <p>{studio.location}</p>
          </div>
          <div className="studio-detail">
            <span className="detail-label">Phone / WhatsApp</span>
            <p>
              <a href={`tel:${studio.phoneTel}`}>{studio.phoneDisplay}</a>
            </p>
          </div>
          <div className="studio-detail">
            <span className="detail-label">Email</span>
            <p>
              <a href={`mailto:${studio.email}`}>{studio.email}</a>
            </p>
          </div>
          <div className="studio-detail">
            <span className="detail-label">Opening Hours</span>
            <p>
              {OPENING_HOURS.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </section>

        <ContactForm />
      </div>
    </>
  );
}
