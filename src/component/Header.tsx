import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    // Rotation entre français, arabe et anglais
    i18n.changeLanguage(
      i18n.language === 'fr' ? 'ar' :
      i18n.language === 'ar' ? 'en' :
      'fr'
    );
  };

  const getLanguageLabel = () => {
    return i18n.language === 'fr' ? 'FR' :
           i18n.language === 'ar' ? 'AR' :
           'EN';
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">
          {t('dashboard.title')}
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