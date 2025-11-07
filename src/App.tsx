import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { HomePage } from './components/HomePage';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { ProjectsPage } from './components/ProjectsPage';
import { DailyReportsPage } from './components/DailyReportsPage';
import { ReportsPage } from './components/ReportsPage';
import { AIAssistant } from './components/AIAssistant';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { Button } from './components/ui/button';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  BarChart3, 
  Bot, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import saudiLogo from 'figma:asset/95ee395e4beaf07692ad704752724e1b3511ad85.png';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'dashboard' | 'projects' | 'daily-reports' | 'reports' | 'ai-assistant';

function AppContent() {
  const { user, signOut, loading } = useAuth();
  const { t, language } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg text-muted-foreground animate-pulse">
            {t('جاري التحميل...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  // Show Login Form if user clicks login
  if (showLoginForm && !user) {
    return <LoginForm onBack={() => setShowLoginForm(false)} />;
  }

  // Show Home Page if not logged in
  if (!user && currentPage === 'home') {
    return <HomePage onGetStarted={() => setShowLoginForm(true)} />;
  }

  // Redirect to login if trying to access protected pages without authentication
  if (!user) {
    return <LoginForm />;
  }

  const navigation = [
    { id: 'home' as Page, name: t('الرئيسية', 'Home'), nameEn: 'Home', icon: Home },
    { id: 'dashboard' as Page, name: t('لوحة التحكم', 'Dashboard'), nameEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as Page, name: t('المشاريع', 'Projects'), nameEn: 'Projects', icon: FolderKanban },
    { id: 'daily-reports' as Page, name: t('التقارير اليومية', 'Daily Reports'), nameEn: 'Daily Reports', icon: FileText },
    { id: 'reports' as Page, name: t('التقارير المتقدمة', 'Advanced Reports'), nameEn: 'Advanced Reports', icon: BarChart3 },
    { id: 'ai-assistant' as Page, name: t('المساعد الذكي', 'AI Assistant'), nameEn: 'AI Assistant', icon: Bot },
  ];

  const getRoleDisplay = (role: string) => {
    const roles: any = {
      general_manager: { ar: 'مدير عام', en: 'General Manager' },
      project_manager: { ar: 'مدير مشروع', en: 'Project Manager' },
      engineer: { ar: 'مهندس', en: 'Engineer' },
      observer: { ar: 'مراقب', en: 'Observer' }
    };
    return roles[role]?.[language] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: any = {
      general_manager: 'bg-primary',
      project_manager: 'bg-secondary',
      engineer: 'bg-blue-600',
      observer: 'bg-gray-600'
    };
    return colors[role] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <header className="bg-card border-b sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-card/95">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  {t('نظام إدارة مشاريع الطرق', 'Road Projects System')}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t('الهيئة العامة للطرق 🇸🇦', 'Roads General Authority 🇸🇦')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme & Language Toggles */}
            <ThemeToggle />
            <LanguageToggle />

            {/* User Info */}
            <div className="hidden sm:block text-right mx-3">
              <p className="text-sm">{user.user_metadata.name}</p>
              <p className="text-xs text-muted-foreground">
                {getRoleDisplay(user.user_metadata.role)}
              </p>
            </div>
            
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarFallback className={`${getRoleColor(user.user_metadata.role)} text-white`}>
                {user.user_metadata.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut} 
              title={t('تسجيل الخروج', 'Sign Out')}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky top-[73px] ${language === 'ar' ? 'left-0' : 'right-0'} h-[calc(100vh-73px)] w-72 bg-card border-${language === 'ar' ? 'l' : 'r'}
            transform transition-transform duration-300 ease-in-out z-30 shadow-lg
            ${sidebarOpen ? 'translate-x-0' : `${language === 'ar' ? '-translate-x-full' : 'translate-x-full'} lg:translate-x-0`}
          `}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/30 scale-105' 
                      : 'hover:bg-muted text-foreground hover:scale-102'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.id === 'ai-assistant' && (
                    <Badge 
                      variant={isActive ? 'secondary' : 'outline'} 
                      className="text-xs px-2 py-0.5"
                    >
                      AI
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-muted/30 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p className="font-medium">{t('نسخة 1.0.0', 'Version 1.0.0')}</p>
              <p>© 2025 {t('الهيئة العامة للطرق', 'Roads Authority')}</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)]">
          <div className={`${currentPage === 'home' ? '' : 'p-4 lg:p-8 max-w-7xl mx-auto'}`}>
            {currentPage === 'home' && <HomePage onGetStarted={() => setCurrentPage('dashboard')} />}
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'projects' && <ProjectsPage />}
            {currentPage === 'daily-reports' && <DailyReportsPage />}
            {currentPage === 'reports' && <ReportsPage />}
            {currentPage === 'ai-assistant' && <AIAssistant />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}