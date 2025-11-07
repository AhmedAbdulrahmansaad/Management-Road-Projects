import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="relative overflow-hidden transition-all duration-300 hover:bg-muted"
          >
            <Sun className={`h-5 w-5 transition-all duration-300 ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon className={`absolute h-5 w-5 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
            <span className="sr-only">{t('تبديل المظهر', 'Toggle theme')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'dark' ? t('الوضع الفاتح', 'Light Mode') : t('الوضع الداكن', 'Dark Mode')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
