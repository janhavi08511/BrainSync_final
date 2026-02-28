import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Contrast, Eye } from "lucide-react";

export const ThemeSwitcher = () => {
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    "high-contrast": Contrast,
    colorblind: Eye,
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ThemeIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="w-4 h-4 mr-2" />
          Light
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="w-4 h-4 mr-2" />
          Dark
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("high-contrast")}>
          <Contrast className="w-4 h-4 mr-2" />
          High Contrast
          {theme === "high-contrast" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("colorblind")}>
          <Eye className="w-4 h-4 mr-2" />
          Colorblind Friendly
          {theme === "colorblind" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="grid grid-cols-5 gap-2 p-2">
          {(["blue", "green", "purple", "orange", "pink"] as const).map(
            (color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  accentColor === color
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{
                  background:
                    color === "blue"
                      ? "#0080FF"
                      : color === "green"
                      ? "#22C55E"
                      : color === "purple"
                      ? "#A855F7"
                      : color === "orange"
                      ? "#F97316"
                      : "#EC4899",
                }}
                aria-label={`Select ${color} accent`}
              />
            )
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
