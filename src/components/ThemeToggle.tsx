"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "gym-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // The inline script in the root layout already set the class before first paint;
  // here we only sync React state with it (and with other open tabs).
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark-mode"));

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next = event.newValue === "dark";
        document.documentElement.classList.toggle("dark-mode", next);
        setDark(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark-mode", next);
    setDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* storage can be blocked (private mode); the theme still applies for this visit */
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={toggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </svg>
    </button>
  );
}
