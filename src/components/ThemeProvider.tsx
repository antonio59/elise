import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const THEME_MAP: Record<string, string> = {
  kawaii: "sakura",
  light: "editorial",
  dark: "midnight",
  editorial: "editorial",
  sakura: "sakura",
  lavender: "lavender",
  midnight: "midnight",
  sunset: "sunset",
  botanical: "botanical",
  berry: "berry",
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const profile = useQuery(api.users.getProfile);

  useEffect(() => {
    const rawTheme = profile?.theme || "editorial";
    const theme = THEME_MAP[rawTheme] || "editorial";

    if (theme === "editorial") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [profile?.theme]);

  return <>{children}</>;
}
