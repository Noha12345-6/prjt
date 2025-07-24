import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeContext";

export const Header = () => {
  const { isDark } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">
          Tableau de Bord
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
};