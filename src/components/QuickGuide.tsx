import React from 'react';
import { useTheme } from './ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  BarChart3, 
  Bot,
  Shield,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

export function QuickGuide() {
  const { t, language } = useTheme();

  const features = [
    {
      icon: LayoutDashboard,
      title: t('لوحة التحكم', 'Dashboard'),
      description: t('عرض الإحصائيات والرسوم البيانية الحية', 'View live statistics and charts'),
      color: 'text-primary'
    },
    {
      icon: FolderKanban,
      title: t('المشاريع', 'Projects'),
      description: t('إدارة جميع مشاريع الطرق والميزانيات', 'Manage all road projects and budgets'),
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      title: t('التقارير اليومية', 'Daily Reports'),
      description: t('إضافة وتتبع التقارير اليومية للعمل', 'Add and track daily work reports'),
      color: 'text-green-600'
    },
    {
      icon: BarChart3,
      title: t('التقارير المتقدمة', 'Advanced Reports'),
      description: t('تحليلات متقدمة وتصدير البيانا��', 'Advanced analytics and data export'),
      color: 'text-purple-600'
    },
    {
      icon: Bot,
      title: t('المساعد الذكي', 'AI Assistant'),
      description: t('احصل على مساعدة ذكية باللغة العربية', 'Get smart assistance in Arabic'),
      color: 'text-secondary'
    },
    {
      icon: Shield,
      title: t('الصلاحيات', 'Permissions'),
      description: t('نظام متقدم بـ 4 مستويات صلاحيات', 'Advanced system with 4 permission levels'),
      color: 'text-red-600'
    }
  ];

  const tips = [
    {
      icon: Globe,
      title: t('تبديل اللغة', 'Language Toggle'),
      description: t('انقر على أيقونة اللغة للتبديل بين العربية والإنجليزية', 'Click the language icon to switch between Arabic and English')
    },
    {
      icon: Moon,
      title: t('الوضع الداكن', 'Dark Mode'),
      description: t('استخدم أيقونة القمر للتبديل إلى الوضع الداكن المريح للعين', 'Use the moon icon to switch to comfortable dark mode')
    }
  ];

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            {t('دليل سريع للنظام', 'Quick System Guide')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Features */}
          <div>
            <h4 className="mb-4 text-lg text-primary">{t('المميزات الرئيسية', 'Main Features')}</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="mb-4 text-lg text-secondary">{t('نصائح مفيدة', 'Useful Tips')}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex gap-3 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium">{tip.title}</div>
                      <div className="text-sm text-muted-foreground">{tip.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="space-y-1">
                <div className="font-medium">{t('تحتاج مساعدة؟', 'Need Help?')}</div>
                <div className="text-sm text-muted-foreground">
                  {t(
                    'استخدم المساعد الذكي للحصول على إجابات فورية أو تواصل مع الدعم الفني',
                    'Use the AI Assistant for instant answers or contact technical support'
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
