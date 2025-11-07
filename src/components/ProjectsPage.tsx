import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeProvider';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Plus, Edit2, Trash2, MapPin, Calendar, DollarSign, Users, AlertCircle, TrendingUp, Sparkles, FolderKanban, Target, Rocket, Award, Upload } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { ProjectsTableView } from './ProjectsTableView';
import { toast } from 'sonner@2.0.3';
import { ProjectFormNew } from './ProjectFormNew';

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
  managerId?: string;
  teamMembers?: string[];
  createdAt: string;
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
  attachments?: string[];
}

export function ProjectsPage() {
  const { accessToken, user } = useAuth();
  const { t, language } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'planning',
    progress: 0,
    budget: 0,
    startDate: '',
    endDate: '',
    projectType: '',
    region: '',
    contractNumber: '',
    roadName: '',
    duration: 0,
    totalValue: 0,
    actualProgress: 0,
    plannedProgress: 0,
    sequenceNumber: '',
    notificationNumber: '',
    paymentNumber: '',
    contractualProgress: 0,
    remainingProgress: 0,
    attachments: [] as string[]
  });

  // Calculate deviation automatically
  const deviation = formData.actualProgress - formData.plannedProgress;

  useEffect(() => {
    fetchProjects();
    
    // Listen for project creation events from AI Assistant
    const handleProjectCreated = (event: any) => {
      console.log('🔔 ProjectsPage: Received projectCreated event', event.detail);
      // Refresh projects list
      fetchProjects();
      
      toast.success(
        language === 'ar' ? '🔄 تم تحديث قائمة المشاريع' : '🔄 Projects list updated',
        {
          description: language === 'ar' 
            ? 'المشروع الجديد ظاهر الآن في القائمة'
            : 'New project is now visible in the list',
          duration: 3000
        }
      );
    };
    
    window.addEventListener('projectCreated', handleProjectCreated);
    
    return () => {
      window.removeEventListener('projectCreated', handleProjectCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('📡 Fetching projects from API...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      console.log('📥 Projects response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Projects data received:', data);
      
      // Ensure we have a valid array and filter out any null/undefined entries
      const validProjects = (data.projects || []).filter((p: any) => p && p.id);
      console.log(`✅ Valid projects count: ${validProjects.length}`);
      
      setProjects(validProjects);
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error);
      // Set empty array on error to prevent crashes
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Upload files to storage
  const uploadFiles = async (files: File[]) => {
    console.log('📤 Starting file upload...', files.length, 'files');
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects');

      try {
        console.log('⬆️ Uploading file:', file.name);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-92709448/upload`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData
          }
        );

        console.log('📥 Upload response status:', response.status);
        const data = await response.json();
        console.log('📦 Upload response data:', data);
        
        if (response.ok && data.url) {
          uploadedUrls.push(data.url);
          console.log('✅ File uploaded successfully:', data.url);
        } else {
          console.error('❌ Upload failed for file:', file.name, data);
          throw new Error(data.error || 'File upload failed');
        }
      } catch (error) {
        console.error('💥 Failed to upload file:', file.name, error);
        throw error; // Re-throw to stop project creation on upload failure
      }
    }

    console.log('✅ All files uploaded successfully!', uploadedUrls);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploadingFiles(true);

    console.log('🚀 Project Submit Started:', {
      editMode: !!editingProject,
      formData: formData,
      selectedFiles: selectedFiles.length,
      hasAuth: !!accessToken
    });

    try {
      // Upload files first if any
      let fileUrls: string[] = [];
      if (selectedFiles.length > 0) {
        console.log('📤 Uploading', selectedFiles.length, 'files...');
        toast.info(
          language === 'ar' ? `جاري رفع ${selectedFiles.length} ملف...` : `Uploading ${selectedFiles.length} file(s)...`,
          { duration: 3000 }
        );
        
        fileUrls = await uploadFiles(selectedFiles);
        console.log('✅ Files uploaded:', fileUrls);
      }

      // Combine new file URLs with existing attachments
      const allAttachments = [...(formData.attachments || []), ...fileUrls];

      const url = editingProject
        ? `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects/${editingProject.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`;

      console.log('📡 Sending project data to:', url);

      // Prepare project data with progress set to actualProgress
      const projectData = {
        ...formData,
        progress: formData.actualProgress || 0, // Sync progress with actualProgress
        attachments: allAttachments
      };

      console.log('📊 Project data being sent:', projectData);

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(projectData)
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        const errorMsg = data.error || t('حدث خطأ', 'Error occurred');
        console.error('❌ Server error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ Project saved successfully!');
      
      await fetchProjects();
      setDialogOpen(false);
      resetForm();
      setSelectedFiles([]);
      
      // Show success toast with Saudi colors
      toast.success(
        editingProject 
          ? t('projectUpdated', 'Project updated successfully')
          : t('projectSavedSuccessfully', 'Project saved successfully, and data linked to reports'),
        {
          duration: 5000,
          description: editingProject ? undefined : t('projectDataLinked', 'Project data automatically linked to all reports'),
          style: {
            background: '#F0FDF4',
            border: '2px solid #22C55E',
            color: '#166534'
          }
        }
      );
    } catch (err: any) {
      console.error('💥 Project submit error:', err);
      const errorMessage = err.message || (language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
      setError(errorMessage);
      
      // Show error toast
      toast.error(
        language === 'ar' ? 'فشل في حفظ المشروع' : 'Failed to save project',
        {
          description: errorMessage,
          duration: 5000,
          style: {
            background: '#FEF2F2',
            border: '2px solid #EF4444',
            color: '#991B1B'
          }
        }
      );
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm(t('هل أنت متأكد من حذف هذا المشروع؟', 'Are you sure you want to delete this project?'))) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'planning',
      progress: 0,
      budget: 0,
      startDate: '',
      endDate: '',
      projectType: '',
      region: '',
      contractNumber: '',
      roadName: '',
      duration: 0,
      totalValue: 0,
      actualProgress: 0,
      plannedProgress: 0,
      sequenceNumber: '',
      notificationNumber: '',
      paymentNumber: '',
      contractualProgress: 0,
      remainingProgress: 0,
      attachments: [] as string[]
    });
    setEditingProject(null);
    setError('');
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      location: project.location,
      status: project.status,
      progress: project.progress,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      projectType: project.projectType || '',
      region: project.region || '',
      contractNumber: project.contractNumber || '',
      roadName: project.contractNumber || '',
      duration: 0,
      totalValue: project.totalValue || 0,
      paymentNumber: project.paymentNumber || '',
      contractualProgress: project.contractualProgress || 0,
      actualProgress: project.actualProgress || 0,
      remainingProgress: project.remainingProgress || 0,
      attachments: project.attachments || [] as string[]
    });
    setDialogOpen(true);
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      planning: { 
        label: t('تخطيط', 'Planning'), 
        gradient: 'from-gray-500 to-gray-600',
        bgClass: 'bg-gray-100 dark:bg-gray-800',
        textClass: 'text-gray-800 dark:text-gray-200',
        icon: Target
      },
      active: { 
        label: t('نشط', 'Active'), 
        gradient: 'from-primary to-primary-light',
        bgClass: 'bg-primary/10',
        textClass: 'text-primary',
        icon: Rocket
      },
      delayed: { 
        label: t('متأخر', 'Delayed'), 
        gradient: 'from-secondary to-secondary-light',
        bgClass: 'bg-secondary/10',
        textClass: 'text-secondary',
        icon: AlertCircle
      },
      completed: { 
        label: t('مكتمل', 'Completed'), 
        gradient: 'from-green-500 to-emerald-400',
        bgClass: 'bg-green-100 dark:bg-green-900',
        textClass: 'text-green-800 dark:text-green-200',
        icon: Award
      },
      on_hold: { 
        label: t('متوقف', 'On Hold'), 
        gradient: 'from-gray-500 to-gray-600',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-800',
        icon: Users
      }
    };
    return configs[status] || configs.planning;
  };

  // Permissions based on user role
  const canCreateProject = user?.user_metadata.role === 'general_manager' || 
                          user?.user_metadata.role === 'project_manager';
                          
  const canEditProject = user?.user_metadata.role === 'general_manager' || 
                        user?.user_metadata.role === 'project_manager';
                        
  const canDeleteProject = user?.user_metadata.role === 'general_manager';
  
  const canViewProjects = true; // All authenticated users can view projects

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/30 border-t-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-primary/20"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            {t('جاري تحميل المشاريع...', 'Loading Projects...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Saudi Green Mountains Background */}
      <div className="fixed inset-0 bg-saudi-mesh opacity-40 pointer-events-none"></div>
      <div className="fixed inset-0 bg-green-hills opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-nature-texture opacity-20 pointer-events-none"></div>
      
      {/* Floating Mountain Elements */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

      <div className="relative space-y-8 animate-fade-in p-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent-mountain to-secondary p-10 shadow-2xl animate-scale-in">
          <div className="absolute inset-0 bg-nature-texture opacity-15"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 flex-1">
              <div className="p-5 bg-white/20 backdrop-blur rounded-3xl shadow-xl animate-bounce-soft">
                <FolderKanban className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
                  {t('إدارة المشاريع', 'Project Management')}
                </h2>
                <p className="text-white/90 text-xl">
                  {t('جميع مشاريع البنية لتحية للطرق', 'All Road Infrastructure Projects')}
                </p>
              </div>
            </div>
            
            {canCreateProject && (
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="group px-8 py-6 bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-105 rounded-2xl text-lg font-bold"
                  >
                    <Plus className={`h-6 w-6 group-hover:rotate-90 transition-transform ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('مشروع جديد', 'New Project')}
                    <Sparkles className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ml-2'} group-hover:animate-spin`} />
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto shadow-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3" style={{ fontSize: '22px', color: '#0B5E3A', fontWeight: '700' }}>
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <FolderKanban className="h-7 w-7 text-primary" />
                      </div>
                      {editingProject ? t('تعديل المشروع', 'Edit Project') : t('إضافة مشروع جديد', 'Add New Project')}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground" style={{ fontSize: '14px' }}>
                      {t('أدخل تفاصيل المشروع بدقة', 'Enter project details accurately')}
                    </DialogDescription>
                  </DialogHeader>

                  <ProjectFormNew
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={() => setDialogOpen(false)}
                    error={error}
                    editingProject={editingProject}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    uploadingFiles={uploadingFiles}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm animate-fade-in-up">
            <CardContent className="text-center py-24">
              <div className="inline-flex p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mb-6 animate-bounce-soft">
                <MapPin className="h-20 w-20 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t('لا تود مشاريع بعد', 'No Projects Yet')}</h3>
              <p className="text-muted-foreground text-xl mb-6">
                {t('ابدأ بإضافة مشروعك الأول الآن', 'Start by adding your first project now')}
              </p>
              {canCreateProject && (
                <Button 
                  size="lg" 
                  onClick={() => setDialogOpen(true)}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover shadow-xl"
                >
                  <Plus className={`h-6 w-6 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('إضافة مشروع', 'Add Project')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects
              .filter((project) => project && project.id) // Filter out null/undefined projects
              .map((project, index) => {
              const statusConfig = getStatusConfig(project?.status || 'planning');
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card 
                  key={project.id} 
                  className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm card-hover-lift hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${statusConfig.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${statusConfig.gradient}`}>
                            <FolderKanban className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="line-clamp-2 text-2xl group-hover:text-primary transition-colors">
                            {project.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-5 w-5 flex-shrink-0 text-secondary" />
                          <CardDescription className="line-clamp-1 text-base">{project.location}</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${statusConfig.bgClass} ${statusConfig.textClass} px-4 py-2 text-sm font-bold flex items-center gap-2`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-6">
                    <p className="text-base text-muted-foreground line-clamp-3 min-h-[60px] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{t('نسبة الإنجاز', 'Progress')}</span>
                        </div>
                        <span className="text-2xl font-black text-primary">{project.progress}%</span>
                      </div>
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${statusConfig.gradient} rounded-full transition-all duration-1000`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{t('الميزانية', 'Budget')}</p>
                        </div>
                        <p className="text-xl font-black text-primary">
                          {(project.budget / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-secondary/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-secondary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{t('البدء', 'Start')}</p>
                        </div>
                        <p className="text-base font-bold text-secondary">
                          {new Date(project.startDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {(canCreateProject || user?.user_metadata.role === 'general_manager') && (
                      <div className="flex gap-3 pt-4 border-t-2 border-dashed border-border">
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 group/btn hover:bg-primary/5 hover:border-primary/50 transition-all"
                          onClick={() => openEditDialog(project)}
                        >
                          <Edit2 className={`h-5 w-5 group-hover/btn:text-primary transition-colors ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          {t('تعديل', 'Edit')}
                        </Button>
                        {user?.user_metadata.role === 'general_manager' && (
                          <Button
                            variant="destructive"
                            size="lg"
                            onClick={() => handleDelete(project.id)}
                            className="group/btn hover:scale-110 transition-transform"
                          >
                            <Trash2 className="h-5 w-5 group-hover/btn:animate-wiggle" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}