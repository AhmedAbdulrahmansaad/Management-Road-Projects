import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  BarChart3, 
  Bot,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  Construction,
  Star,
  Sparkles,
  Award,
  Target,
  Rocket,
  Heart,
  Navigation
} from 'lucide-react';


interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const { t, language } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: LayoutDashboard,
      title: t('لوحة تحكم شاملة', 'Comprehensive Dashboard'),
      description: t('متابعة جميع المشاريع والإحصائيات في مكان وا��د مع رسوم بيانية تفاعلية', 'Track all projects and statistics in one place with interactive charts'),
      gradient: 'from-primary to-accent-road',
      iconColor: 'text-primary',
      bgGlow: 'group-hover:shadow-primary/50'
    },
    {
      icon: FolderKanban,
      title: t('إدارة المشاريع', 'Project Management'),
      description: t('إدارة كاملة للمشاريع مع الميزانيات والجداول الزمنية بطريقة احترافية', 'Complete project management with budgets and professional timelines'),
      gradient: 'from-secondary to-secondary-light',
      iconColor: 'text-secondary',
      bgGlow: 'group-hover:shadow-secondary/50'
    },
    {
      icon: FileText,
      title: t('التقارير اليومية', 'Daily Reports'),
      description: t('نظام تقارير يومية متطور مع رفع الصور والمستندات ومتابعة دقيقة', 'Advanced daily reporting with images, documents and precise tracking'),
      gradient: 'from-accent-road to-accent-road-light',
      iconColor: 'text-accent-road',
      bgGlow: 'group-hover:shadow-gray-500/50'
    },
    {
      icon: BarChart3,
      title: t('تقارير متقدمة', 'Advanced Analytics'),
      description: t('رسوم بيانية تفاعلية وتقارير قابلة للتصدير بصيغ متعددة', 'Interactive charts and multi-format exportable reports'),
      gradient: 'from-green-600 to-emerald-500',
      iconColor: 'text-green-600',
      bgGlow: 'group-hover:shadow-green-500/50'
    },
    {
      icon: Bot,
      title: t('مساعد ذكي', 'AI Assistant'),
      description: t('مساعد ذكي متقدم باللغة العربية لدعم قراراتك وتسهيل عملك', 'Advanced Arabic AI assistant to support decisions and facilitate work'),
      gradient: 'from-purple-600 to-pink-600',
      iconColor: 'text-purple-600',
      bgGlow: 'group-hover:shadow-purple-500/50'
    },
    {
      icon: Shield,
      title: t('أمان متقدم', 'Advanced Security'),
      description: t('4 مستويات صلاحيات مع نظام مصادقة آمن ومشفر', '4 permission levels with secure encrypted authentication'),
      gradient: 'from-red-600 to-orange-500',
      iconColor: 'text-red-600',
      bgGlow: 'group-hover:shadow-red-500/50'
    }
  ];

  const stats = [
    { 
      value: '1000+', 
      label: t('مشروع طرق', 'Road Projects'),
      icon: Construction,
      gradient: 'from-primary to-accent-road'
    },
    { 
      value: '500+', 
      label: t('مهندس ومشرف', 'Engineers'),
      icon: Users,
      gradient: 'from-secondary to-secondary-light'
    },
    { 
      value: '99.9%', 
      label: t('وقت التش��يل', 'Uptime'),
      icon: TrendingUp,
      gradient: 'from-green-600 to-emerald-500'
    },
    { 
      value: '24/7', 
      label: t('دعم فني', 'Support'),
      icon: CheckCircle2,
      gradient: 'from-blue-600 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Saudi Arabia Highway Road Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1646401502998-a6a61610e6c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3BoYWx0JTIwcm9hZCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjIzMDMwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      ></div>
      
      {/* Strong Overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-accent-mountain/55 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-black/35 pointer-events-none"></div>
      
      {/* Text Shadow Enhancement Layer */}
      <style>{`
        .enhanced-text-shadow {
          text-shadow: 
            0 2px 10px rgba(0, 0, 0, 0.8),
            0 4px 20px rgba(0, 0, 0, 0.6),
            0 0 30px rgba(0, 108, 53, 0.4);
        }
        .enhanced-card-contrast {
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
      `}</style>
      
      {/* Floating Glow Elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-secondary/25 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>

      {/* Top Navigation Bar - Fully Responsive */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl border-b border-border/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary-hover rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                  <Navigation className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold text-gradient-saudi">
                  {t('نظام إدارة مشاريع الطرق', 'Road Projects System')}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t('الهيئة العامة للطرق 🇸🇦', 'Roads General Authority 🇸🇦')}
                </p>
              </div>
            </div>

            {/* Theme & Language Toggles - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="transform hover:scale-110 transition-transform">
                <ThemeToggle />
              </div>
              <div className="transform hover:scale-110 transition-transform">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Fully Responsive */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 sm:space-y-10">
            {/* Main Heading - Responsive */}
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full border border-secondary/20 animate-shimmer">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-secondary animate-pulse" />
                <Badge className="text-sm sm:text-lg px-3 sm:px-4 py-1 bg-gradient-to-r from-secondary to-secondary-hover text-primary-foreground border-0 shadow-lg">
                  {t('الهيئة العامة للطرق', 'Roads General Authority')}
                </Badge>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight enhanced-text-shadow">
                <span className="text-gradient-saudi block mb-2 drop-shadow-2xl">
                  {t('نظام إدارة', 'Management')}
                </span>
                <span className="text-gradient-primary block drop-shadow-2xl">
                  {t('مشاريع الطرق', 'Road Projects')}
                </span>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold max-w-4xl mx-auto leading-relaxed px-4 enhanced-text-shadow">
                {t(
                  'منصة متكاملة ومتطورة لإدارة ومتابعة مشاريع البنية التحتية للطرق في المملكة العربية السعودية',
                  'An integrated and advanced platform for managing road infrastructure projects in Saudi Arabia'
                )}
              </p>
            </div>

            {/* CTA Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center pt-6 sm:pt-10 animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto group relative overflow-hidden text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 bg-gradient-to-r from-secondary via-secondary-light to-secondary bg-[length:200%] hover:bg-[position:100%] text-primary-foreground shadow-2xl hover:shadow-secondary/50 transition-all duration-500 transform hover:scale-105 border-0 rounded-2xl font-bold"
                onClick={onGetStarted}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                  {t('ابدأ الآ��', 'Get Started')}
                  <ArrowLeft className={`h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                </span>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto group text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 border-2 border-primary/30 hover:border-secondary hover:bg-secondary/5 backdrop-blur rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-secondary group-hover:animate-spin" />
                  {t('شاهد العرض', 'Watch Demo')}
                </span>
              </Button>
            </div>

            {/* Floating Features Pills - Responsive */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-6 sm:pt-8 animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Shield, text: t('آمن ومحمي', 'Secure'), gradient: 'from-green-600 to-emerald-500' },
                { icon: Zap, text: t('سريع وفعال', 'Fast'), gradient: 'from-secondary to-secondary-light' },
                { icon: Heart, text: t('سهل الاستخدام', 'Easy'), gradient: 'from-pink-600 to-red-600' },
                { icon: Award, text: t('عالي الجودة', 'Quality'), gradient: 'from-primary to-accent-road' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="group px-3 sm:px-5 py-2 sm:py-2.5 rounded-full glass-effect border border-border/50 hover:border-secondary/50 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 sm:p-1.5 rounded-full bg-gradient-to-r ${item.gradient}`}>
                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Responsive Grid */}
      <section className="relative py-12 sm:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className="enhanced-card-contrast group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 card-hover-lift hover:shadow-2xl transition-all duration-500 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <CardContent className="relative pt-6 sm:pt-8 text-center">
                    <div className="mb-3 sm:mb-4 inline-flex">
                      <div className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-br bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to bottom right, var(--secondary), var(--primary))` }}>
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-base text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Responsive Grid */}
      <section className="relative py-16 sm:py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Responsive */}
          <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 mb-4 sm:mb-6">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <Badge className="text-sm sm:text-base px-3 sm:px-4 py-1 bg-gradient-to-r from-primary to-accent-road text-primary-foreground border-0">
                {t('الميزات', 'Features')}
              </Badge>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 enhanced-text-shadow">
              <span className="text-gradient-saudi block drop-shadow-2xl">
                {t('كل ما تحتاجه', 'Everything You Need')}
              </span>
            </h2>
            
            <p className="text-base sm:text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto leading-relaxed px-4 enhanced-text-shadow">
              {t(
                'نظام شامل ومتكامل لإدارة جميع جوانب مشاريع الطرق بكفاءة عالية',
                'A comprehensive system to manage all road project aspects efficiently'
              )}
            </p>
          </div>

          {/* Features Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="enhanced-card-contrast group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 card-hover-lift hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`}></div>
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-500 ${feature.bgGlow}`}></div>
                  
                  <CardContent className="relative pt-6 sm:pt-8 pb-6">
                    <div className="mb-4 sm:mb-6 inline-flex">
                      <div className={`relative p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="h-6 w-6 sm:h-10 sm:w-10 text-white" />
                        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-secondary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                      {feature.description}
                    </p>

                    <div className="mt-4 sm:mt-6 flex items-center gap-2 text-secondary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="font-medium text-sm sm:text-base">{t('اعرف المزيد', 'Learn More')}</span>
                      <ArrowLeft className={`h-4 w-4 sm:h-5 sm:w-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="relative py-16 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-road to-secondary"></div>
        <div className="absolute inset-0 bg-road-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur rounded-full border border-white/20 mb-6 sm:mb-8 animate-bounce-in">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse" />
              <span className="text-white font-medium text-sm sm:text-base">{t('جاهز للبدء؟', 'Ready to Start?')}</span>
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 text-white drop-shadow-lg">
              {t('انضم إلينا الآن', 'Join Us Now')}
            </h2>
            
            <p className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow px-4">
              {t(
                'انضم إلى مئات المهندسين والمديرين الذين يستخدمون نظامنا لإدارة مشاريعهم بنجاح',
                'Join hundreds of engineers and managers successfully using our system'
              )}
            </p>
            
            <Button 
              size="lg" 
              className="w-full sm:w-auto group relative overflow-hidden text-lg sm:text-xl px-10 sm:px-14 py-7 sm:py-9 bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-white/30 transition-all duration-500 transform hover:scale-110 border-0 rounded-2xl font-bold"
              onClick={onGetStarted}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Rocket className="h-5 w-5 sm:h-7 sm:w-7 group-hover:animate-bounce" />
                {t('ابدأ مجاناً', 'Start Free')}
                <ArrowLeft className={`h-5 w-5 sm:h-7 sm:w-7 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
              </span>
            </Button>

            {/* Trust Indicators - Responsive */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-8 sm:mt-12">
              {[
                { icon: CheckCircle2, text: t('مجاني', 'Free') },
                { icon: Shield, text: t('آمن', 'Secure') },
                { icon: Zap, text: t('سريع', 'Fast') }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white/10 backdrop-blur rounded-full border border-white/20">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-white font-medium text-xs sm:text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="relative bg-card border-t py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary to-secondary-hover rounded-xl shadow-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gradient-saudi">
                {t('نظام إدارة مشاريع الطرق', 'Road Projects System')}
              </h3>
            </div>

            <p className="text-sm sm:text-lg text-muted-foreground mb-2 sm:mb-4">
              {t('© 2025 الهيئة العامة للطرق - المملكة العربية السعودية', '© 2025 Roads General Authority - Saudi Arabia')}
            </p>
            
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('جميع الحقوق محفوظة', 'All Rights Reserved')}
            </p>

            <div className="flex justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
