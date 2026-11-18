import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "My Fitness Studio",
    template: "%s | My Fitness Studio",
  },
  description:
    "Expert-led strength, yoga and HIIT classes in Enugu. Book a free trial class or choose a membership plan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint so dark-mode visitors never see a white flash.
const themeScript = `try{if(localStorage.getItem('gym-theme')==='dark'){document.documentElement.classList.add('dark-mode')}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
