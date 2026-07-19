"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("luma_theme");
    const isLight = saved === "light";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("luma_theme", next ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-line bg-ink-2/80 p-2.5"
      aria-label="Toggle theme"
    >
      {light ? (
        <Moon className="h-4 w-4 text-sand" />
      ) : (
        <Sun className="h-4 w-4 text-sand" />
      )}
    </button>
  );
}
