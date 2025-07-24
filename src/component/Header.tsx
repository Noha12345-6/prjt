import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeContext";
import { Button } from "../components/ui/button";
import { useState } from "react"; 

export const Header = () => {
  const { isDark } = useTheme();
  const [language, setLanguage] = useState('fr'); // État pour gérer la langue

  const toggleLanguage = () => {
    // Rotation entre français, arabe et anglais
    setLanguage(prev => 
      prev === 'fr' ? 'ar' : 
      prev === 'ar' ? 'en' : 
      'fr'
    );
  };

  const getLanguageLabel = () => {
    return language === 'fr' ? 'FR' : 
           language === 'ar' ? 'AR' : 
           'EN';
  };

  const getDashboardTitle = () => {
    return language === 'fr' ? 'Tableau de Bord' : 
           language === 'ar' ? 'لوحة القيادة' : 
           'Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">
          {getDashboardTitle()}
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLanguage}
            className="w-12"
          >
            {getLanguageLabel()}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};