// Static site content. Kept in one place so the pages, the public JSON API
// and the payment validation all read from the same source of truth.

export const SITE_NAME = "My Fitness Studio";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Classes" },
  { href: "/trainers", label: "Trainers" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact Us" },
] as const;

export type FitnessClass = {
  id: string;
  title: string;
  tagline: string;
  highlights: string[];
};

export const CLASSES: FitnessClass[] = [
  {
    id: "strength-training",
    title: "Strength Training",
    tagline: "Build lean muscle, boost metabolism, and master proper lifting form.",
    highlights: [
      "Barbell Squats & Deadlifts",
      "Dumbbell Upper-Body Conditioning",
      "Kettlebell Core & Stability",
      "Progressive Overload Coaching",
    ],
  },
  {
    id: "yoga",
    title: "Yoga",
    tagline:
      "Improve flexibility, balance, and mental focus through guided breathwork and movement.",
    highlights: [
      "Vinyasa Flow (All Levels)",
      "Power Yoga & Core Strength",
      "Deep Stretch & Mobility Recovery",
      "Guided Breathwork & Mindfulness",
    ],
  },
  {
    id: "hiit",
    title: "HIIT (High-Intensity Interval Training)",
    tagline:
      "Fast-paced, high-energy circuits engineered to torch calories and build endurance.",
    highlights: [
      "45-Second Full-Body Sprint Circuits",
      "Battle Ropes & Box Jumps",
      "Bodyweight Cardio Burners",
      "Guided Breathwork & Mindfulness",
    ],
  },
];

export type Trainer = {
  id: string;
  role: string;
  name: string;
  specialty: string;
  bio: string;
};

export const TRAINERS: Trainer[] = [
  {
    id: "tunde-adeyemi",
    role: "Strength Coach",
    name: "Coach Tunde Adeyemi",
    specialty: "Strength & Conditioning Specialist",
    bio: "With over 7 years of coaching experience, Tunde helps members build functional strength, master proper barbell form, and break past lifting plateaus safely. His structured, supportive approach makes heavy lifting accessible for both complete beginners and seasoned athletes.",
  },
  {
    id: "amaka-okafor",
    role: "Yoga Instructor",
    name: "Coach Amaka Okafor",
    specialty: "Vinyasa Flow & Mobility Instructor",
    bio: "Certified in Vinyasa and restorative movement, Amaka focuses on improving flexibility, core stability, and mind-body balance. Her sessions are designed to help busy professionals relieve tension, prevent workout injuries, and recover faster.",
  },
  {
    id: "david-mensah",
    role: "HIIT & Cardio Coach",
    name: "Coach David Mensah",
    specialty: "HIIT & Athletic Endurance Coach",
    bio: "A former track athlete with a passion for high-energy group workouts, David designs fast-paced interval circuits that maximize calorie burn and improve cardiovascular fitness. He brings infectious energy to every class, motivating you to push through that final round.",
  },
];

export const PLAN_IDS = ["basic", "premium", "elite"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type Plan = {
  id: PlanId;
  name: string;
  priceNaira: number; // per month
  features: string[];
  bestFor: string;
};

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    priceNaira: 15000,
    features: [
      "Full gym floor access",
      "Locker room and showers",
      "2 group classes per month",
      "1 initial fitness assessment",
    ],
    bestFor: "Beginners and solo gym-goers",
  },
  {
    id: "premium",
    name: "Premium",
    priceNaira: 30000,
    features: [
      "Unlimited strength, Yoga, and HIIT classes",
      "Full gym access",
      "Monthly body composition tracking",
      "1 guest pass per month",
    ],
    bestFor: "Regulars who love group workouts",
  },
  {
    id: "elite",
    name: "Elite",
    priceNaira: 55000,
    features: [
      "Everything in Premium",
      "4 private personal-training sessions per month",
      "Custom nutrition plan",
      "Priority class booking",
    ],
    bestFor: "Personalized coaching and faster progress",
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

/** Deterministic (no Intl) so server and client always render the same string. */
export function formatNaira(amount: number): string {
  return "₦" + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ---- Form option lists (value is what the API stores, label is what people see)

export const PREFERRED_TIMES = [
  { value: "morning", label: "Morning (6:00 AM - 10:00 AM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 4:00 PM)" },
  { value: "evening", label: "Evening (5:00 PM - 8:00 PM)" },
  { value: "weekend", label: "Weekend Sessions" },
] as const;

export const GOALS = [
  { value: "strength", label: "Build Strength & Muscle" },
  { value: "weight-loss", label: "Weight Loss & Cardio Endurance" },
  { value: "flexibility", label: "Flexibility, Mobility & Stress Relief" },
  { value: "general", label: "General Fitness / Free Trial Class" },
] as const;

export const CONTACT_SUBJECTS = [
  { value: "general-question", label: "General Question" },
  { value: "membership-inquiry", label: "Membership Inquiry" },
  { value: "personal-training", label: "Personal Training" },
  { value: "feedback", label: "Feedback" },
] as const;

export const OPENING_HOURS = ["Mon–Fri: 6 AM–9 PM", "Sat: 7 AM–6 PM", "Sun: Closed"];
