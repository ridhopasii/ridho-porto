"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-6 w-11 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  const isDarkMode = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        isDarkMode ? "bg-teal-500" : "bg-neutral-200 dark:bg-neutral-800"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isDarkMode ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
