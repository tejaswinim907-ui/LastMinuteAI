import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem("lastminute_theme") || "light";
  });
  const [displayName, setDisplayName] = useState(() => {
    if (typeof window === "undefined") {
      return "User";
    }

    return window.localStorage.getItem("lastminute_display_name") || "User";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");

    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastminute_theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastminute_display_name", displayName);
    }
  }, [displayName]);

  const value = useMemo(() => ({ theme, setTheme, displayName, setDisplayName }), [theme, displayName]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
