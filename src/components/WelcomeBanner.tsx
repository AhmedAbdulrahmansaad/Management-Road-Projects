import React from 'react';
import { useTheme } from './ThemeProvider';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, X } from 'lucide-react';

interface WelcomeBannerProps {
  userName: string;
  userRole: string;
  onDismiss: () => void;
}

export function WelcomeBanner({ userName, userRole, onDismiss }: WelcomeBannerProps) {
  const { t, language } = useTheme();

  const getRoleDisplay = () => {
    const roles: any = {
      general_manager: { ar: 'مدير عام', en: 'General Manager' },
      project_manager: { ar: 'مدير مشروع', en: 'Project Manager' },
      engineer: { ar: 'مهندس', en: 'Engineer' },
      observer: { ar: 'مراقب', en: 'Observer' }
    };
    return roles[userRole]?.[language] || userRole;
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="p-6 pr-12">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="text-xl">
              {t('مرحباً بك', 'Welcome')}, {userName}! 👋
            </h3>
            <p className="text-muted-foreground">
              {t(
                `بصفتك ${getRoleDisplay()}، يمكنك الآن الوصول إلى جميع أدوات إدارة مشاريع الطرق. استخدم القائمة الجانبية للتنقل بين الصفحات المختلفة.`,
                `As a ${getRoleDisplay()}, you now have access to all road project management tools. Use the sidebar to navigate between different pages.`
              )}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                ✓ {t('لوحة التحكم', 'Dashboard')}
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                ✓ {t('إدارة المشاريع', 'Project Management')}
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                ✓ {t('التقارير', 'Reports')}
              </div>
              <div className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                ✓ {t('مساعد ذكي', 'AI Assistant')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
