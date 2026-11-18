import type { Metadata } from "next";
import { JoinForm } from "@/components/JoinForm";

export const metadata: Metadata = { title: "Book a Class" };

export default function JoinPage() {
  return (
    <>
      <section className="banner">
        <h1>Book A Class or Join Today</h1>
        <p>
          Ready to start your fitness journey? Fill out the form below to claim your free trial
          class or sign up for a membership plan. Our team will reach out within 24 hours to
          confirm your session.
        </p>
      </section>
      <JoinForm />
    </>
  );
}
