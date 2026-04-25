import React, { useState, useEffect } from "react";
import { Moon, Sun, Palette } from "lucide-react";

const THEMES = [
  { value: "editorial", label: "Editorial", icon: Sun },
  { value: "sakura", label: "Sakura", icon: Palette },
  { value: "lavender", label: "Lavender", icon: Palette },
  { value: "midnight", label: "Midnight", icon: Moon },
  { value: "sunset", label: "Sunset", icon: Palette },
  { value: "botanical", label: "Botanical", icon: Palette },
  { value: "berry", label: "Berry", icon: Palette },
];

const STORAGE_KEY = "elise-public-theme";

// eslint-disable-next-line react-refresh/only-export-components
export function getPublicTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "editorial";
  } catch {
    return "editorial";
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function setPublicTheme(theme: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

const ThemeToggle: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(getPublicTheme());

  useEffect(() => {
    const apply = () => {
      const theme = getPublicTheme();
      if (theme === "editorial") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
      setCurrent(theme);
    };
    apply();
    window.addEventListener("storage", apply);
    return () => window.removeEventListener("storage", apply);
  }, []);

  const select = (theme: string) => {
    setPublicTheme(theme);
    if (theme === "editorial") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    setCurrent(theme);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 transition-colors"
        aria-label="Change theme"
        aria-expanded={open}
      >
        <Palette className="w-5 h-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => select(t.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  current === t.value
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
