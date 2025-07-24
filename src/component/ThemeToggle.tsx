import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Button } from '../components/ui/button';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
};