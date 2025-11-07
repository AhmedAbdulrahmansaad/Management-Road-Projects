import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeProvider';
import { WelcomeBanner } from './WelcomeBanner';
import { QuickGuide } from './QuickGuide';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  FolderKanban, TrendingUp, Users, FileText, Sparkles,
  Zap, Target, Award, Star, Rocket, BarChart3
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const COLORS = ['#6b7280', '#006C35', '#F97316', '#84cc16', '#94a3b8'];

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  totalReports: number;
  pendingReports: number;
  averageProgress: number;
  recentActivities: any[];
}

export function Dashboard() {
  const { accessToken, user } = useAuth();
  const { t, language } = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectsByStatus, setProjectsByStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => {
    const dismissed = localStorage.getItem('welcomeBannerDismissed');
    return !dismissed;
  });
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, statusRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-92709448/stats`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-92709448/stats/projects-by-status`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      const statsData = await statsRes.json();
      const statusData = await statusRes.json();

      setStats(statsData.stats);
      setProjectsByStatus(statusData.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/30 border-t-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-primary/20"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            {t('جاري التحميل...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  const statusChartData = projectsByStatus ? [
    { name: t('تخطيط', 'Planning'), value: projectsByStatus.planning, color: COLORS[0] },
    { name: t('نشط', 'Active'), value: projectsByStatus.active, color: COLORS[1] },
    { name: t('متأخر', 'Delayed'), value: projectsByStatus.delayed, color: COLORS[2] },
    { name: t('مكتمل', 'Completed'), value: projectsByStatus.completed, color: COLORS[3] },
    { name: t('متوقف', 'On Hold'), value: projectsByStatus.onHold, color: COLORS[4] },
  ] : [];

  const getRoleDisplay = (role: string) => {
    const roles: any = {
      general_manager: t('مدير عام', 'General Manager'),
      project_manager: t('مدير مشروع', 'Project Manager'),
      engineer: t('مهندس', 'Engineer'),
      observer: t('مراقب', 'Observer')
    };
    return roles[role] || role;
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeBannerDismissed', 'true');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Saudi Green Mountains Background */}
      <div className="fixed inset-0 bg-saudi-mesh opacity-40 pointer-events-none"></div>
      <div className="fixed inset-0 bg-green-hills opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-nature-texture opacity-20 pointer-events-none"></div>
      
      {/* Floating Mountain Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

      <div className="relative space-y-8 animate-fade-in p-6">
        {/* Welcome Banner */}
        {showWelcome && (
          <div className="animate-slide-in-down">
            <WelcomeBanner
              userName={user?.user_metadata.name || ''}
              userRole={user?.user_metadata.role || ''}
              onDismiss={handleDismissWelcome}
            />
          </div>
        )}

        {/* Hero Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent-mountain to-secondary p-10 shadow-2xl animate-scale-in">
          {/* Animated Background Patterns */}
          <div className="absolute inset-0 bg-nature-texture opacity-15"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur rounded-2xl animate-bounce-soft">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                    {t('مرحباً', 'Welcome')}, {user?.user_metadata.name}! 👋
                  </h2>
                  <p className="text-white/90 text-xl font-medium mt-2">
                    {getRoleDisplay(user?.user_metadata.role || '')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="px-4 py-2 bg-white/20 backdrop-blur border-white/30 text-white text-base">
                  {t('الهيئة العامة للطرق 🇸🇦', 'Roads General Authority 🇸🇦')}
                </Badge>
                <Badge className="px-4 py-2 bg-white/20 backdrop-blur border-white/30 text-white text-base">
                  {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
              </div>
            </div>
            
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="group px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-2xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 hover:scale-105 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-white font-bold text-lg">
                  {showGuide ? t('إخفاء الدليل', 'Hide Guide') : t('عرض الدليل السريع', 'Show Quick Guide')}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Guide */}
        {showGuide && (
          <div className="animate-fade-in-up">
            <QuickGuide />
          </div>
        )}

        {/* Stats Cards - Enhanced Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: t('إجمالي المشاريع', 'Total Projects'),
              value: stats?.totalProjects || 0,
              icon: FolderKanban,
              gradient: 'from-blue-500 to-cyan-400',
              bgGradient: 'from-blue-500/10 to-cyan-400/10',
              description: t('جميع المشاريع المسجلة', 'All Registered Projects')
            },
            {
              title: t('المشاريع النشطة', 'Active Projects'),
              value: stats?.activeProjects || 0,
              icon: Rocket,
              gradient: 'from-primary to-primary-light',
              bgGradient: 'from-primary/10 to-primary-light/10',
              description: t('قيد التنفيذ حالياً', 'Currently In Progress')
            },
            {
              title: t('المشاريع المكتملة', 'Completed'),
              value: stats?.completedProjects || 0,
              icon: Award,
              gradient: 'from-green-500 to-emerald-400',
              bgGradient: 'from-green-500/10 to-emerald-400/10',
              description: t('تم إنجازها بنجاح', 'Successfully Completed')
            },
            {
              title: t('مشاريع متأخرة', 'Delayed'),
              value: stats?.delayedProjects || 0,
              icon: AlertTriangle,
              gradient: 'from-secondary to-secondary-light',
              bgGradient: 'from-secondary/10 to-secondary-light/10',
              description: t('تحتاج متابعة عاجلة', 'Needs Urgent Follow-up')
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm card-hover-lift hover:shadow-2xl transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className={`text-5xl font-black mb-2 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  
                  {/* Progress Indicator */}
                  <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 animate-shimmer`} style={{ width: '70%' }}></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row - Enhanced */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Status Distribution */}
          <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm card-hover-lift hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary to-primary-hover rounded-xl shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('توزيع حالات المشاريع', 'Project Status Distribution')}</CardTitle>
                  <CardDescription className="mt-1 text-base">{t('التوزيع الحالي', 'Current Distribution')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '12px',
                      padding: '12px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reports Overview */}
          <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 bg-card/80 backdrop-blur-sm card-hover-lift hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-secondary to-secondary-hover rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('نظرة عامة على التقارير', 'Reports Overview')}</CardTitle>
                  <CardDescription className="mt-1 text-base">{t('حالة التقارير اليومية', 'Daily Reports Status')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative space-y-6">
              {[
                {
                  icon: FileText,
                  label: t('إجمالي التقارير', 'Total Reports'),
                  value: stats?.totalReports || 0,
                  progress: 100,
                  gradient: 'from-blue-500 to-cyan-400',
                  color: 'text-blue-600'
                },
                {
                  icon: Clock,
                  label: t('تقارير قيد المراجعة', 'Pending Reports'),
                  value: stats?.pendingReports || 0,
                  progress: stats?.totalReports ? (stats.pendingReports / stats.totalReports) * 100 : 0,
                  gradient: 'from-secondary to-secondary-light',
                  color: 'text-secondary'
                },
                {
                  icon: TrendingUp,
                  label: t('متوسط الإنجاز', 'Average Progress'),
                  value: `${stats?.averageProgress || 0}%`,
                  progress: stats?.averageProgress || 0,
                  gradient: 'from-green-500 to-emerald-400',
                  color: 'text-green-600'
                }
              ].map((item, idx) => (
                <div key={idx} className="group/item space-y-3 p-4 rounded-xl hover:bg-muted/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient}`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`text-3xl font-black ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities - Enhanced */}
        <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('آخر الأنشطة', 'Recent Activities')}</CardTitle>
                <CardDescription className="mt-1 text-base">{t('آخر التحديثات والتقارير', 'Latest Updates and Reports')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivities.slice(0, 5).map((activity, index) => (
                  <div 
                    key={index} 
                    className="group/activity flex items-center justify-between border-2 border-border/30 hover:border-primary/30 p-5 rounded-xl hover:bg-muted/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg group-hover/activity:from-primary/20 group-hover/activity:to-secondary/20 transition-all">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-lg">{activity.createdByName}</span>
                          <Badge 
                            variant={activity.status === 'approved' ? 'default' : 'secondary'}
                            className="text-sm px-3 py-1"
                          >
                            {activity.status === 'approved' ? 
                              <><CheckCircle2 className="h-4 w-4 mr-1 inline" /> {t('معتمد', 'Approved')}</> : 
                              <><Clock className="h-4 w-4 mr-1 inline" /> {t('قيد المراجعة', 'Under Review')}</>
                            }
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {activity.workDescription?.substring(0, 200)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'} text-right`}>
                      <div className="text-sm font-medium text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex p-6 bg-muted/50 rounded-full mb-6">
                  <Activity className="h-20 w-20 text-muted-foreground/30" />
                </div>
                <p className="text-xl font-medium text-muted-foreground">
                  {t('لا توجد أنشطة حديثة', 'No Recent Activities')}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('ستظهر التحديثات هنا عند إضافة تقارير جديدة', 'Updates will appear here when new reports are added')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
