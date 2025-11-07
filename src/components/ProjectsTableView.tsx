import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeProvider';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FileText, Download, Printer, Filter, Search, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  projectType?: string;
  region?: string;
  contractNumber?: string;
  sequenceNumber?: string;
  notificationNumber?: string;
  totalValue?: number;
  paymentNumber?: string;
  contractualProgress?: number;
  actualProgress?: number;
  remainingProgress?: number;
  createdAt: string;
}

export function ProjectsTableView() {
  const { accessToken, user } = useAuth();
  const { t, language } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: any = {
      planning: { label: t('تخطيط', 'Planning'), color: 'bg-gray-100 text-gray-800' },
      active: { label: t('نشط', 'Active'), color: 'bg-primary/10 text-primary' },
      delayed: { label: t('متأخر', 'Delayed'), color: 'bg-secondary/10 text-secondary' },
      completed: { label: t('مكتمل', 'Completed'), color: 'bg-green-100 text-green-800' },
      on_hold: { label: t('متوقف', 'On Hold'), color: 'bg-gray-100 text-gray-800' }
    };
    const config = configs[status] || configs.planning;
    return <Badge className={`${config.color} font-bold`}>{config.label}</Badge>;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export to CSV
    const headers = ['م', 'النوع', 'وصف كامل العمل', 'المنطقة', 'رقم التبليغ', 'رقم العقد', 'قيمة تميع', 'رقم الصرف', 'تاريخ بدء العمل', 'تاريخ نهاية العمل', 'نسبة الإنجاز التعاقدية', 'نسبة الإنجاز الفعلية', 'نسبة الإنجاز المتبقي', 'حالة المشروع'];
    
    const rows = filteredProjects.map((p, index) => [
      p.sequenceNumber || (index + 1),
      p.projectType || '',
      p.name,
      p.region || p.location,
      p.notificationNumber || '',
      p.contractNumber || '',
      p.totalValue || p.budget || '',
      p.paymentNumber || '',
      p.startDate ? new Date(p.startDate).toLocaleDateString('ar-SA') : '',
      p.endDate ? new Date(p.endDate).toLocaleDateString('ar-SA') : '',
      p.contractualProgress || '',
      p.actualProgress || p.progress || '',
      p.remainingProgress || '',
      p.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `projects_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/30 border-t-primary"></div>
          <p className="text-lg font-medium">{t('جاري تحميل المشاريع...', 'Loading Projects...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-muted/10 to-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent-mountain to-secondary p-10 shadow-2xl">
          <div className="absolute inset-0 bg-nature-texture opacity-15"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                  {t('جدول المشاريع', 'Projects Table')}
                </h1>
                <p className="text-white/90 text-lg mt-1">
                  {t('عرض شامل لجميع مشاريع الطرق', 'Comprehensive view of all road projects')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-2 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full max-w-md">
                <div className="relative">
                  <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                  <Input
                    placeholder={t('بحث في المشاريع...', 'Search projects...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`h-12 ${language === 'ar' ? 'pr-10' : 'pl-10'} text-lg border-2`}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleExport}
                  className="gap-2 font-bold"
                >
                  <Download className="h-5 w-5" />
                  {t('تصدير Excel', 'Export Excel')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrint}
                  className="gap-2 font-bold"
                >
                  <Printer className="h-5 w-5" />
                  {t('طباعة', 'Print')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-2 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary">
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[60px]">
                    {t('م', '#')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[100px]">
                    {t('النوع', 'Type')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[300px]">
                    {t('وصف كامل العمل', 'Work Description')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[150px]">
                    {t('المنطقة', 'Region')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[120px]">
                    {t('رقم التبليغ', 'Notification #')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[120px]">
                    {t('رقم العقد', 'Contract #')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[120px]">
                    {t('قيمة تميع', 'Total Value')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[120px]">
                    {t('رقم الصرف', 'Payment #')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[150px]">
                    {t('تاريخ بدء العمل', 'Start Date')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[150px]">
                    {t('تاريخ نهاية العمل', 'End Date')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[100px]">
                    {t('نسبة الإنجاز التعاقدية %', 'Contractual %')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[100px]">
                    {t('نسبة الإنجاز الفعلية %', 'Actual %')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center border-l border-white/20 min-w-[100px]">
                    {t('نسبة الإنجاز المتبقي %', 'Remaining %')}
                  </TableHead>
                  <TableHead className="text-white font-black text-center min-w-[120px]">
                    {t('حالة مشروع', 'Status')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <FileText className="h-16 w-16 text-muted-foreground opacity-50" />
                        <p className="text-xl text-muted-foreground">
                          {t('لا توجد مشاريع', 'No projects found')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project, index) => (
                    <TableRow 
                      key={project.id} 
                      className="hover:bg-primary/5 transition-colors border-b-2"
                    >
                      <TableCell className="text-center font-bold border-l text-lg">
                        {project.sequenceNumber || (index + 1)}
                      </TableCell>
                      <TableCell className="text-center border-l">
                        {project.projectType ? (
                          <Badge variant="outline" className="font-bold whitespace-nowrap">
                            {project.projectType}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="border-l font-semibold">
                        <div className="max-w-md">
                          <p className="line-clamp-2 leading-relaxed">{project.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {project.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center border-l font-medium">
                        {project.region || project.location}
                      </TableCell>
                      <TableCell className="text-center border-l font-mono">
                        {project.notificationNumber || '-'}
                      </TableCell>
                      <TableCell className="text-center border-l font-mono font-bold text-primary">
                        {project.contractNumber || '-'}
                      </TableCell>
                      <TableCell className="text-center border-l font-bold text-primary" dir="ltr">
                        {project.totalValue ? 
                          `${(project.totalValue / 1000000).toFixed(2)} M` : 
                          project.budget ? 
                          `${(project.budget / 1000000).toFixed(2)} M` : 
                          '-'
                        }
                      </TableCell>
                      <TableCell className="text-center border-l font-mono">
                        {project.paymentNumber || '-'}
                      </TableCell>
                      <TableCell className="text-center border-l">
                        {project.startDate ? (
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              {new Date(project.startDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center border-l">
                        {project.endDate ? (
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="h-4 w-4 text-red-600" />
                            <span className="font-medium">
                              {new Date(project.endDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center border-l">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="font-black text-lg text-blue-600">
                            {project.contractualProgress || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center border-l">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-black text-lg text-green-600">
                            {project.actualProgress || project.progress || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center border-l">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="font-black text-lg text-orange-600">
                            {project.remainingProgress || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(project.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Summary */}
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-muted-foreground mb-1">{t('إجمالي المشاريع', 'Total Projects')}</p>
                <p className="text-3xl font-black text-primary">{filteredProjects.length}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-muted-foreground mb-1">{t('مشاريع نشطة', 'Active')}</p>
                <p className="text-3xl font-black text-green-600">
                  {filteredProjects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-muted-foreground mb-1">{t('مشاريع مكتملة', 'Completed')}</p>
                <p className="text-3xl font-black text-blue-600">
                  {filteredProjects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-muted-foreground mb-1">{t('متوسط الإنجاز', 'Avg Progress')}</p>
                <p className="text-3xl font-black text-secondary">
                  {filteredProjects.length > 0 
                    ? Math.round(filteredProjects.reduce((sum, p) => sum + (p.actualProgress || p.progress || 0), 0) / filteredProjects.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
