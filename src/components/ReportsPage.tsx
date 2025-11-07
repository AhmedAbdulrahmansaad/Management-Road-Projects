import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthContext';
import { projectId } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Download, TrendingUp, Calendar, DollarSign, Activity, BarChart3, Award, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

export function ReportsPage() {
  const { t, language } = useTheme();
  const { accessToken } = useAuth();
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('📊 [Reports] Fetching statistics and projects...');
      
      // Fetch stats
      const statsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/stats`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📈 [Reports] Stats received:', statsData);
        setStats(statsData.stats);
      }
      
      // Fetch projects
      const projectsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        console.log('📁 [Reports] Projects received:', projectsData);
        setProjects(projectsData.projects || []);
      }
    } catch (error) {
      console.error('❌ [Reports] Failed to fetch data:', error);
    }
  };

  const generateReportData = () => {
    const reportData: any = {
      type: reportType,
      dateRange: dateRange,
      generatedAt: new Date().toISOString(),
      language: language,
    };

    // Filter valid projects
    const validProjects = (projects || []).filter(p => p && p.id && p.name);

    if (reportType === 'performance') {
      reportData.title = language === 'ar' ? 'تقرير الأداء الشامل' : 'Comprehensive Performance Report';
      reportData.stats = {
        totalProjects: stats?.totalProjects || validProjects.length,
        activeProjects: stats?.activeProjects || validProjects.filter(p => p.status === 'active').length,
        completedProjects: stats?.completedProjects || validProjects.filter(p => p.status === 'completed').length,
        averageProgress: stats?.averageProgress || 0,
      };
      reportData.projects = validProjects.map(p => ({
        name: p.name || 'N/A',
        progress: p.progress || 0,
        status: p.status || 'N/A',
        location: p.location || 'N/A'
      }));
    } else if (reportType === 'financial') {
      reportData.title = language === 'ar' ? 'التقرير المالي' : 'Financial Report';
      reportData.stats = {
        totalBudget: validProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
        totalValue: validProjects.reduce((sum, p) => sum + (p.totalValue || 0), 0),
        projectCount: validProjects.length
      };
      reportData.projects = validProjects.map(p => ({
        name: p.name || 'N/A',
        budget: p.budget || 0,
        totalValue: p.totalValue || 0,
        location: p.location || 'N/A'
      }));
    } else if (reportType === 'productivity') {
      reportData.title = language === 'ar' ? 'تقرير الإنتاجية' : 'Productivity Report';
      reportData.stats = {
        averageProgress: stats?.averageProgress || 0,
        activeProjects: stats?.activeProjects || validProjects.filter(p => p.status === 'active').length,
        completedProjects: stats?.completedProjects || validProjects.filter(p => p.status === 'completed').length
      };
      reportData.projects = validProjects.map(p => ({
        name: p.name || 'N/A',
        progress: p.progress || 0,
        status: p.status || 'N/A'
      }));
    }

    return reportData;
  };

  const handleExportPDF = async () => {
    setLoading(true);
    console.log('📄 [Reports] Generating PDF report...');
    
    try {
      const reportData = generateReportData();
      
      // Create PDF content
      const pdfContent = `
===========================================
${reportData.title}
===========================================

${language === 'ar' ? 'تاريخ التقرير' : 'Report Date'}: ${new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'full' })}
${language === 'ar' ? 'نوع التقرير' : 'Report Type'}: ${reportType}
${language === 'ar' ? 'الفترة الزمنية' : 'Time Period'}: ${dateRange}

-------------------------------------------
${language === 'ar' ? 'الإحصائيات الرئيسية' : 'Key Statistics'}
-------------------------------------------

${Object.entries(reportData.stats || {}).map(([key, value]) => 
  `${key}: ${value}`
).join('\n')}

-------------------------------------------
${language === 'ar' ? 'المشاريع' : 'Projects'}
-------------------------------------------

${(reportData.projects || []).map((p: any, i: number) => 
  `${i + 1}. ${p.name} - ${language === 'ar' ? 'التقدم' : 'Progress'}: ${p.progress}%`
).join('\n')}

-------------------------------------------
${language === 'ar' ? 'نهاية التقرير' : 'End of Report'}
===========================================
`;
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportType}-${dateRange}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ [Reports] PDF report downloaded successfully');
      toast.success(
        language === 'ar' ? '✅ تم تحميل التقرير' : '✅ Report downloaded',
        {
          description: language === 'ar' 
            ? 'تم تنزيل التقرير بنجاح'
            : 'Report downloaded successfully',
          duration: 3000
        }
      );
    } catch (error) {
      console.error('❌ [Reports] Failed to generate PDF:', error);
      toast.error(
        language === 'ar' ? 'فشل تحميل التقرير' : 'Failed to download report',
        { duration: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setLoading(true);
    console.log('📊 [Reports] Generating Excel report...');
    
    try {
      const reportData = generateReportData();
      
      console.log('📊 [Reports] Report data:', reportData);
      
      // Create CSV content (Excel compatible)
      let csvContent = '';
      
      // Header with BOM for UTF-8
      csvContent = '\uFEFF'; // BOM for UTF-8
      
      // Title
      csvContent += `${reportData.title}\n`;
      csvContent += `${language === 'ar' ? 'التاريخ' : 'Date'},${new Date().toLocaleDateString()}\n`;
      csvContent += `${language === 'ar' ? 'النوع' : 'Type'},${reportType}\n`;
      csvContent += `${language === 'ar' ? 'الفترة' : 'Period'},${dateRange}\n\n`;
      
      // Stats
      csvContent += `${language === 'ar' ? 'الإحصائيات' : 'Statistics'}\n`;
      if (reportData.stats) {
        Object.entries(reportData.stats).forEach(([key, value]) => {
          csvContent += `${key},${value || 0}\n`;
        });
      }
      csvContent += '\n';
      
      // Projects table
      if (reportData.projects && Array.isArray(reportData.projects) && reportData.projects.length > 0) {
        csvContent += `${language === 'ar' ? 'قائمة المشاريع' : 'Projects List'}\n`;
        
        // Header row based on report type
        if (reportType === 'performance') {
          csvContent += `${language === 'ar' ? 'الاسم' : 'Name'},${language === 'ar' ? 'التقدم' : 'Progress'},${language === 'ar' ? 'الحالة' : 'Status'},${language === 'ar' ? 'الموقع' : 'Location'}\n`;
          reportData.projects.forEach((p: any) => {
            const name = (p.name || 'N/A').replace(/,/g, ';'); // Replace commas to avoid CSV issues
            const progress = p.progress || 0;
            const status = (p.status || 'N/A').replace(/,/g, ';');
            const location = (p.location || 'N/A').replace(/,/g, ';');
            csvContent += `${name},${progress}%,${status},${location}\n`;
          });
        } else if (reportType === 'financial') {
          csvContent += `${language === 'ar' ? 'الاسم' : 'Name'},${language === 'ar' ? 'الميزانية' : 'Budget'},${language === 'ar' ? 'القيمة الكلية' : 'Total Value'},${language === 'ar' ? 'الموقع' : 'Location'}\n`;
          reportData.projects.forEach((p: any) => {
            const name = (p.name || 'N/A').replace(/,/g, ';');
            const budget = p.budget || 0;
            const totalValue = p.totalValue || 0;
            const location = (p.location || 'N/A').replace(/,/g, ';');
            csvContent += `${name},${budget},${totalValue},${location}\n`;
          });
        } else if (reportType === 'productivity') {
          csvContent += `${language === 'ar' ? 'الاسم' : 'Name'},${language === 'ar' ? 'التقدم' : 'Progress'},${language === 'ar' ? 'الحالة' : 'Status'}\n`;
          reportData.projects.forEach((p: any) => {
            const name = (p.name || 'N/A').replace(/,/g, ';');
            const progress = p.progress || 0;
            const status = (p.status || 'N/A').replace(/,/g, ';');
            csvContent += `${name},${progress}%,${status}\n`;
          });
        }
      } else {
        csvContent += `\n${language === 'ar' ? 'لا توجد مشاريع' : 'No projects available'}\n`;
      }
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportType}-${dateRange}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ [Reports] Excel report downloaded successfully');
      toast.success(
        language === 'ar' ? '✅ تم تحمي�� التقرير' : '✅ Report downloaded',
        {
          description: language === 'ar' 
            ? 'تم تنزيل التقرير بصيغة Excel (CSV)'
            : 'Report downloaded as Excel (CSV)',
          duration: 3000
        }
      );
    } catch (error) {
      console.error('❌ [Reports] Failed to generate Excel:', error);
      toast.error(
        language === 'ar' ? 'فشل تحميل التقرير' : 'Failed to download report',
        { 
          description: language === 'ar' 
            ? 'حدث خطأ أثناء إنشاء التقرير'
            : 'An error occurred while generating the report',
          duration: 3000 
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Saudi Green Mountains Background */}
      <div className="fixed inset-0 bg-saudi-mesh opacity-40 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-green-hills opacity-30 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-nature-texture opacity-20 pointer-events-none -z-10"></div>

      <div className="space-y-6 animate-fade-in relative z-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent-mountain to-secondary p-8 md:p-10 shadow-2xl animate-scale-in">
          <div className="absolute inset-0 bg-nature-texture opacity-15"></div>
          <div className="absolute inset-0 bg-green-hills opacity-10"></div>
          
          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
              {t('advancedReportsManagement', 'Advanced Reports & Analytics')}
            </h2>
            <p className="text-white/90 text-base md:text-lg drop-shadow">
              {t('comprehensiveReportsStats', 'Comprehensive reports and statistics')}
            </p>
          </div>
        </div>

      {/* Report Configuration */}
      <Card className="border-2 hover:shadow-xl transition-all">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{t('reportSettings', 'reportSettings')}</CardTitle>
              <CardDescription className="mt-1 text-base">{t('selectReportTypeAndPeriod', 'selectReportTypeAndPeriod')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base">{t('reportType', 'reportType')}</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">{t('performanceReport', 'performanceReport')}</SelectItem>
                  <SelectItem value="financial">{t('financialReport', 'financialReport')}</SelectItem>
                  <SelectItem value="productivity">{t('productivityReport', 'productivityReport')}</SelectItem>
                  <SelectItem value="safety">{t('safetyReport', 'safetyReport')}</SelectItem>
                  <SelectItem value="quality">{t('qualityReport', 'qualityReport')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">{t('timePeriod', 'timePeriod')}</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">{t('thisWeek', 'thisWeek')}</SelectItem>
                  <SelectItem value="month">{t('thisMonth', 'thisMonth')}</SelectItem>
                  <SelectItem value="quarter">{t('thisQuarter', 'thisQuarter')}</SelectItem>
                  <SelectItem value="year">{t('thisYear', 'thisYear')}</SelectItem>
                  <SelectItem value="custom">{t('customPeriod', 'customPeriod')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 pt-2">
            <Button onClick={handleExportPDF} size="lg" className="gap-2 shadow-lg">
              <Download className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('exportPDF', 'exportPDF')}
            </Button>
            <Button onClick={handleExportExcel} variant="outline" size="lg" className="gap-2">
              <Download className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('exportExcel', 'exportExcel')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Based on Type */}
      {reportType === 'performance' && (
        <div className="space-y-6">
          <Card className="border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('projectPerformanceReport', 'projectPerformanceReport')}</CardTitle>
                  <CardDescription className="mt-1 text-base">{t('comprehensiveOverview', 'comprehensiveOverview')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-3">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <Badge className="bg-primary text-white">{t('veryGood', 'veryGood')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{t('averageCompletion', 'averageCompletion')}</p>
                  <p className="text-3xl text-primary mt-2">78%</p>
                  <Progress value={78} className="h-2 mt-3" />
                </div>

                <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <Activity className="h-6 w-6 text-green-600" />
                    <Badge className="bg-green-600 text-white">{t('excellent', 'excellent')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{t('scheduleCompliance', 'scheduleCompliance')}</p>
                  <p className="text-3xl text-green-600 mt-2">92%</p>
                  <Progress value={92} className="h-2 mt-3" />
                </div>

                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-xl border-2 border-secondary/20 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="h-6 w-6 text-secondary" />
                    <Badge className="bg-secondary text-white">{t('average', 'average')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{t('budgetCompliance', 'budgetCompliance')}</p>
                  <p className="text-3xl text-secondary mt-2">85%</p>
                  <Progress value={85} className="h-2 mt-3" />
                </div>
              </div>

              <div>
                <h4 className="mb-4 flex items-center gap-2 text-xl">
                  <Award className="h-5 w-5 text-primary" />
                  {t('individualProjectPerformance', 'individualProjectPerformance')}
                </h4>
                <div className="space-y-3">
                  {[
                    { name: language === 'ar' ? 'طريق الرياض - جدة السريع' : 'Riyadh - Jeddah Highway', progress: 85, status: t('good', 'good'), color: 'bg-primary' },
                    { name: language === 'ar' ? 'جسر وادي حنيفة' : 'Wadi Hanifa Bridge', progress: 92, status: t('excellent', 'excellent'), color: 'bg-green-600' },
                    { name: language === 'ar' ? 'طريق الملك عبدالله' : 'King Abdullah Road', progress: 68, status: t('average', 'average'), color: 'bg-secondary' },
                    { name: language === 'ar' ? 'نفق الدائري الشرقي' : 'Eastern Ring Tunnel', progress: 45, status: t('delayed', 'delayed'), color: 'bg-red-500' }
                  ].map((project, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all">
                      <div className="flex-1">
                        <p className="font-semibold">{project.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 bg-background rounded-full h-3 overflow-hidden">
                            <div 
                              className={`${project.color} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold min-w-[3rem]">{project.progress}%</span>
                        </div>
                      </div>
                      <Badge className={
                        project.status === t('excellent', 'excellent') ? 'bg-green-100 text-green-800' :
                        project.status === t('good', 'good') ? 'bg-primary/10 text-primary' :
                        project.status === t('delayed', 'delayed') ? 'bg-red-100 text-red-800' : 'bg-secondary/10 text-secondary'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'financial' && (
        <Card className="border-2 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('financialReport', 'financialReport')}</CardTitle>
                <CardDescription className="mt-1 text-base">{t('budgetSummary', 'budgetSummary')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-xl border-2 border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">{t('totalBudget', 'totalBudget')}</p>
                <p className="text-3xl text-primary mt-2">450M {language === 'ar' ? 'ر.س' : 'SAR'}</p>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10 p-5 rounded-xl border-2 border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground mb-1">{t('totalSpent', 'totalSpent')}</p>
                <p className="text-3xl text-green-600 mt-2">315M {language === 'ar' ? 'ر.س' : 'SAR'}</p>
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-5 rounded-xl border-2 border-secondary/20">
                <p className="text-sm text-muted-foreground mb-1">{t('remaining', 'remaining')}</p>
                <p className="text-3xl text-secondary mt-2">135M {language === 'ar' ? 'ر.س' : 'SAR'}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground mb-1">{t('spendingPercentage', 'spendingPercentage')}</p>
                <p className="text-3xl text-blue-600 mt-2">70%</p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-xl">{t('expenseDistribution', 'expenseDistribution')}</h4>
              <div className="space-y-3">
                {[
                  { category: t('labor', 'labor'), amount: 120, percentage: 38, color: 'bg-primary' },
                  { category: t('materials', 'materials'), amount: 95, percentage: 30, color: 'bg-secondary' },
                  { category: t('equipment', 'equipment'), amount: 65, percentage: 21, color: 'bg-green-600' },
                  { category: t('other', 'other'), amount: 35, percentage: 11, color: 'bg-gray-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <span className="min-w-[6rem] font-semibold">{item.category}</span>
                    <div className="flex-1 bg-background rounded-full h-4 overflow-hidden">
                      <div 
                        className={`${item.color} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm text-muted-foreground min-w-[5rem] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {item.amount}M {language === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                    <span className="text-sm font-semibold min-w-[3rem]">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'productivity' && (
        <Card className="border-2 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('productivityReport', 'productivityReport')}</CardTitle>
                <CardDescription className="mt-1 text-base">{t('teamEfficiencyReport', 'teamEfficiencyReport')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">{t('averageProductivity', 'averageProductivity')}</p>
                <p className="text-4xl text-primary">94%</p>
                <p className="text-xs text-green-600 mt-2">↑ 5% {t('lastMonth', 'lastMonth')}</p>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground mb-2">{t('workHours', 'workHours')}</p>
                <p className="text-4xl text-green-600">12,450</p>
                <p className="text-xs text-green-600 mt-2">↑ 8% {t('lastMonth', 'lastMonth')}</p>
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-xl border-2 border-secondary/20">
                <p className="text-sm text-muted-foreground mb-2">{t('completionRate', 'completionRate')}</p>
                <p className="text-4xl text-secondary">89%</p>
                <p className="text-xs text-green-600 mt-2">↑ 3% {t('lastMonth', 'lastMonth')}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-primary" />
                {t('topTeams', 'topTeams')}
              </h4>
              <div className="space-y-4">
                {[
                  { team: language === 'ar' ? 'فريق المنطقة الشرقية' : 'Eastern Region Team', score: 98, projects: 5 },
                  { team: language === 'ar' ? 'فريق الرياض' : 'Riyadh Team', score: 95, projects: 8 },
                  { team: language === 'ar' ? 'فريق جدة' : 'Jeddah Team', score: 92, projects: 6 },
                  { team: language === 'ar' ? 'فريق المدينة' : 'Madinah Team', score: 88, projects: 4 }
                ].map((team, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center text-xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{team.team}</p>
                      <p className="text-sm text-muted-foreground">{team.projects} {t('activeProjects', 'activeProjects')}</p>
                    </div>
                    <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <p className="text-3xl font-bold text-primary">{team.score}%</p>
                      <p className="text-xs text-muted-foreground">{t('productivity', 'productivity')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(reportType === 'safety' || reportType === 'quality') && (
        <Card className="border-2 border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {reportType === 'safety' ? t('safetyReport', 'safetyReport') : t('qualityReport', 'qualityReport')}
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  {reportType === 'safety' 
                    ? t('safetyStatistics', 'safetyStatistics')
                    : t('qualityStandards', 'qualityStandards')
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center py-16">
            <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl mb-2">{t('comingSoon', 'comingSoon')}</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {t('reportUnderDevelopment', 'reportUnderDevelopment')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Export Info */}
      <Card className="border-2">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-base">
              {t('lastUpdate', 'lastUpdate')}: {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'full' })}
            </span>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}