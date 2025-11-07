import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="relative overflow-hidden transition-all duration-300 hover:bg-muted"
          >
            <div className="flex items-center gap-1">
              <Languages className="h-5 w-5" />
              <span className="text-xs font-bold absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground rounded px-1">
                {language.toUpperCase()}
              </span>
            </div>
            <span className="sr-only">{t('تبديل اللغة', 'Toggle language')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{language === 'ar' ? 'English' : 'عربي'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
