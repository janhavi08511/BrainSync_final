import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "high-contrast" | "colorblind";
type AccentColor = "blue" | "green" | "purple" | "orange" | "pink";

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("braille-theme") as Theme;
    return saved || "light";
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("braille-accent") as AccentColor;
    return saved || "blue";
  });

  const accentColors = {
    blue: { primary: "210 100% 60%", secondary: "200 90% 65%" },
    green: { primary: "140 70% 50%", secondary: "150 65% 55%" },
    purple: { primary: "270 70% 60%", secondary: "280 65% 65%" },
    orange: { primary: "25 95% 60%", secondary: "30 90% 65%" },
    pink: { primary: "330 80% 60%", secondary: "340 75% 65%" },
  };

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast", "colorblind");
    root.classList.add(theme);

    // Apply accent color
    const colors = accentColors[accentColor];
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--secondary", colors.secondary);

    // Save to localStorage
    localStorage.setItem("braille-theme", theme);
  }, [theme, accentColor]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem("braille-accent", color);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "high-contrast", "colorblind"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, accentColor, setTheme, setAccentColor, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
