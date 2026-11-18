import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "My Fitness Studio" },
};

const FEATURES = [
  {
    title: "Experts in Fitness Training",
    body: "Our team of certified fitness professionals is dedicated to helping you achieve your health and wellness goals. With years of experience and a passion for fitness, they provide personalized guidance and support to ensure you get the most out of every workout.",
  },
  {
    title: "Diverse Classes",
    body: "We offer a wide range of fitness classes to suit every level and interest. Whether you're a beginner or an experienced athlete, our diverse selection of classes ensures there's something for everyone.",
  },
  {
    title: "Custom Plans",
    body: "We understand that every individual has unique fitness needs and goals. That's why we offer custom workout plans tailored to your specific requirements, ensuring you get the most effective and efficient training possible.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="home-intro">
        <h1>WELCOME TO MY FITNESS STUDIO</h1>
        <p>
          Attending gym classes at <strong>My Fitness Studio</strong> is one of the most effective
          ways to fast-track your health and fitness goals. Beyond just a great workout, our
          structured classes provide expert guidance from certified trainers who ensure you use
          proper form, maximizing your results while keeping you safe. Working out in a group
          dynamic brings an infectious energy and built-in accountability that keeps you
          motivated, pushing you further than you might go on your own. Plus, with a variety of
          specialized sessions designed for all fitness levels, you&apos;ll never get bored—making
          it easy to build a consistent, rewarding routine that fits perfectly into your
          lifestyle.
        </p>
        <Image
          className="hero-image"
          src="/hero.jpg"
          alt="Fitness studio training"
          width={1024}
          height={559}
          sizes="(max-width: 1100px) 100vw, 1100px"
          priority
        />
      </section>

      <div className="card-grid card-grid--3 home-cards">
        {FEATURES.map((f) => (
          <section key={f.title} className="card card--lift">
            <h2>{f.title}</h2>
            <p>{f.body}</p>
          </section>
        ))}
      </div>

      <Link className="trial-button" href="/join">
        START YOUR FREE TRIAL
      </Link>
    </>
  );
}
