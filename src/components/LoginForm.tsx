import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Loader2, ArrowRight, Lock, Mail, User, Briefcase, Sparkles, Navigation, Shield } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


interface LoginFormProps {
  onBack?: () => void;
}

export function LoginForm({ onBack }: LoginFormProps) {
  const { t, language } = useTheme();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('engineer');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
    } catch (err: any) {
      setError(err.message || t('فشل تسجيل الدخول', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(signupEmail, signupPassword, signupName, signupRole);
    } catch (err: any) {
      setError(err.message || t('فشل التسجيل', 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'general_manager', label: t('مدير عام', 'General Manager') },
    { value: 'project_manager', label: t('مدير مشروع', 'Project Manager') },
    { value: 'engineer', label: t('مهندس', 'Engineer') },
    { value: 'observer', label: t('مراقب', 'Observer') }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Saudi Arabia Highway Road Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1705515483510-5f62e500eedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGhpZ2h3YXklMjBwZXJzcGVjdGl2ZXxlbnwxfHx8fDE3NjIzMDMwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      ></div>
      
      {/* Strong Overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-accent-mountain/60"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20"></div>
      <div className="fixed inset-0 bg-black/30"></div>
      
      {/* Text Shadow Enhancement */}
      <style>{`
        .login-enhanced-text {
          text-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.9),
            0 4px 16px rgba(0, 0, 0, 0.7),
            0 0 25px rgba(253, 183, 20, 0.3);
        }
        .login-card-enhanced {
          background: rgba(255, 255, 255, 0.97) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }
      `}</style>
      
      {/* Floating Glow Elements */}
      <div className="fixed top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/25 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl relative z-10 animate-scale-in">
        {/* Theme & Language Controls - Responsive */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="gap-2 hover:bg-secondary/10 transition-all"
            >
              <ArrowRight className={`h-4 w-4 ${language === 'ar' ? '' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{t('رجوع', 'Back')}</span>
            </Button>
          )}
          <div className={`flex gap-2 ${!onBack ? 'ml-auto' : ''}`}>
            <div className="transform hover:scale-110 transition-transform">
              <ThemeToggle />
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in-down">
          <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-black text-gradient-saudi login-enhanced-text drop-shadow-2xl">
            {t('نظام إدارة مشاريع الطرق', 'Road Projects System')}
          </h1>
          <p className="text-white font-bold text-sm sm:text-base px-4 login-enhanced-text">
            {t('الهيئة العامة للطرق - المملكة العربية السعودية 🇸🇦', 'Roads General Authority - Saudi Arabia 🇸🇦')}
          </p>

          {/* Decorative Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              { icon: Shield, text: t('آمن', 'Secure') },
              { icon: Sparkles, text: t('متطور', 'Modern') }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border-2 border-secondary/30 text-xs sm:text-sm font-semibold shadow-lg"
              >
                <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                <span className="text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Container - Responsive */}
        <Tabs defaultValue="login" className="w-full animate-fade-in-up">
          <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14 mb-6 bg-muted/50 backdrop-blur">
            <TabsTrigger 
              value="login" 
              className="text-base sm:text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent-road data-[state=active]:text-primary-foreground"
            >
              {t('تسجيل الدخول', 'Sign In')}
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-base sm:text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary-light data-[state=active]:text-secondary-foreground"
            >
              {t('حساب جديد', 'Sign Up')}
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="mt-0">
            <Card className="login-card-enhanced shadow-2xl border-2 border-border/50 hover:border-secondary/50 transition-all duration-300">
              <CardHeader className="space-y-2 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-primary to-accent-road rounded-xl">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{t('تسجيل الدخول', 'Sign In')}</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
                      {t('ادخل بريدك الإلكتروني وكلمة المرور', 'Enter your email and password')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                  {error && (
                    <Alert variant="destructive" className="animate-shake border-2">
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription className="text-base">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="login-email" className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {t('البريد الإلكتروني', 'Email')}
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="example@rga.gov.sa"
                      required
                      dir="ltr"
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-secondary transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="text-base font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      {t('كلمة المرور', 'Password')}
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      dir="ltr"
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-secondary transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent-road hover:from-secondary hover:to-secondary-light text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                        {t('جاري التحميل...', 'Loading...')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
                        {t('دخول', 'Sign In')}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="mt-0">
            <Card className="login-card-enhanced shadow-2xl border-2 border-border/50 hover:border-secondary/50 transition-all duration-300">
              <CardHeader className="space-y-2 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-secondary to-secondary-light rounded-xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{t('إنشاء حساب جديد', 'Create Account')}</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
                      {t('قم بملء البيانات لإنشاء حساب', 'Fill in the details to create account')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-5 sm:space-y-6">
                  {error && (
                    <Alert variant="destructive" className="animate-shake border-2">
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription className="text-base">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="signup-name" className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-secondary" />
                      {t('الاسم الكامل', 'Full Name')}
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder={t('محمد أحمد', 'Mohammed Ahmed')}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-secondary transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-secondary" />
                      {t('البريد الإلكتروني', 'Email')}
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="example@rga.gov.sa"
                      required
                      dir="ltr"
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-secondary transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-base font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-secondary" />
                      {t('كلمة المرور', 'Password')}
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      dir="ltr"
                      minLength={6}
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-secondary transition-all"
                      placeholder="••••••••"
                    />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('6 أحرف على الأقل', 'At least 6 characters')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-role" className="text-base font-semibold flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-secondary" />
                      {t('المسمى الوظيفي', 'Job Title')}
                    </Label>
                    <Select value={signupRole} onValueChange={setSignupRole}>
                      <SelectTrigger className="h-12 sm:h-14 text-base sm:text-lg border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-base sm:text-lg py-3"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-secondary to-secondary-light hover:from-secondary-hover hover:to-secondary text-secondary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                        {t('جاري الإنشاء...', 'Creating...')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                        {t('إنشاء حساب', 'Create Account')}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Note - Responsive */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground animate-fade-in px-4">
          <p>
            {t(
              'بإنشاء حساب، أنت توافق على سياسة الخصوصية وشروط الاستخدام',
              'By creating an account, you agree to our Privacy Policy and Terms of Use'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
