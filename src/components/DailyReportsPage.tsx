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
import { Plus, Upload, Image as ImageIcon, CheckCircle, Clock, FileText, Calendar, Users, Settings } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { X, Paperclip } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  projectType?: string;
  region?: string;
  contractNumber?: string;
}

interface ReportItem {
  itemNumber: string;
  itemName: string;
  itemType: string;
  attachment?: File;
}

interface DailyReport {
  id: string;
  projectId: string;
  date: string;
  workDescription: string;
  progress: number;
  workersCount: number;
  equipmentUsed: string;
  notes: string;
  images?: string[];
  status: string;
  createdByName: string;
  createdAt: string;
  reportItems?: ReportItem[];
}

export function DailyReportsPage() {
  const { accessToken, user } = useAuth();
  const { t, language } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    workDescription: '',
    progress: 0,
    workersCount: 0,
    equipmentUsed: '',
    notes: '',
    images: [] as File[],
    reportItems: [] as ReportItem[]
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchReports();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      console.log('📡 [Reports] Fetching projects from API...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      console.log('📥 [Reports] Projects response status:', response.status);
      
      const data = await response.json();
      console.log('📦 [Reports] Projects data received:', data);
      
      // Filter out null/undefined projects
      const validProjects = (data.projects || []).filter((p: any) => p && p.id);
      console.log(`✅ [Reports] Valid projects count: ${validProjects.length}`);
      
      setProjects(validProjects);
      
      if (validProjects.length > 0 && validProjects[0]?.id) {
        setSelectedProject(validProjects[0].id);
      }
    } catch (error) {
      console.error('❌ [Reports] Failed to fetch projects:', error);
      // Set empty array on error to prevent crashes
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    if (!selectedProject) return;

    try {
      console.log('📡 [Reports] Fetching reports for project:', selectedProject);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects/${selectedProject}/reports`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      console.log('📥 [Reports] Reports response status:', response.status);
      
      const data = await response.json();
      console.log('📦 [Reports] Reports data received:', data);
      
      // Filter out null/undefined reports
      const validReports = (data.reports || []).filter((r: any) => r && r.id);
      console.log(`✅ [Reports] Valid reports count: ${validReports.length}`);
      
      setReports(validReports);
    } catch (error) {
      console.error('❌ [Reports] Failed to fetch reports:', error);
      setReports([]);
    }
  };

  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `reports/${selectedProject}`);

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-92709448/upload`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData
          }
        );

        const data = await response.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImages(true);

    try {
      // Upload images first
      const imageUrls = await uploadImages(formData.images);

      // Create report
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects/${selectedProject}/reports`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            images: imageUrls
          })
        }
      );

      if (response.ok) {
        await fetchReports();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create report:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleApprove = async (reportId: string, status: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/reports/${reportId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ status })
        }
      );

      await fetchReports();
    } catch (error) {
      console.error('Failed to update report status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      workDescription: '',
      progress: 0,
      workersCount: 0,
      equipmentUsed: '',
      notes: '',
      images: [],
      reportItems: []
    });
  };

  const canCreateReport = user?.user_metadata.role === 'engineer' || 
                         user?.user_metadata.role === 'project_manager';

  const canApprove = user?.user_metadata.role === 'general_manager' || 
                     user?.user_metadata.role === 'project_manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t('loading', 'loading')}</p>
        </div>
      </div>
    );
  }

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
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
                {t('dailyReportsManagement', 'Daily Reports Management')}
              </h2>
              <p className="text-white/90 text-base md:text-lg drop-shadow">
                {t('trackDailyWork', 'Track daily work and progress')}
              </p>
            </div>
            {canCreateReport && selectedProject && (
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Plus className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('newDailyReport', 'newDailyReport')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{t('addDailyReport', 'addDailyReport')}</DialogTitle>
                <DialogDescription className="text-base">
                  {t('recordTodayWork', 'recordTodayWork')}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Project Information Header - Auto-Linked (Read Only) */}
                {selectedProject && projects.find(p => p.id === selectedProject) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-300" style={{ fontSize: '18px' }}>
                      <FileText className="h-5 w-5" />
                      {t('projectInfoHeader', 'Project Information')}
                      <span className="text-xs font-normal text-green-600 dark:text-green-400">
                        {t('autoLinked', '(Auto-linked)')}
                      </span>
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mt-0.5">
                          <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-green-600 dark:text-green-400 mb-1" style={{ fontSize: '13px', color: '#555' }}>
                            {t('projectName', 'Project Name')}
                          </p>
                          <p className="font-semibold text-green-900 dark:text-green-100" style={{ fontSize: '15px' }}>
                            {projects.find(p => p.id === selectedProject)?.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mt-0.5">
                          <Settings className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-green-600 dark:text-green-400 mb-1" style={{ fontSize: '13px', color: '#555' }}>
                            {t('location', 'Location')}
                          </p>
                          <p className="font-semibold text-green-900 dark:text-green-100" style={{ fontSize: '15px' }}>
                            {projects.find(p => p.id === selectedProject)?.location}
                          </p>
                        </div>
                      </div>
                      
                      {projects.find(p => p.id === selectedProject)?.projectType && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mt-0.5">
                            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600 dark:text-green-400 mb-1" style={{ fontSize: '13px', color: '#555' }}>
                              {t('projectType', 'Project Type')}
                            </p>
                            <p className="font-semibold text-green-900 dark:text-green-100" style={{ fontSize: '15px' }}>
                              {projects.find(p => p.id === selectedProject)?.projectType}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {projects.find(p => p.id === selectedProject)?.region && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mt-0.5">
                            <Settings className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600 dark:text-green-400 mb-1" style={{ fontSize: '13px', color: '#555' }}>
                              {t('region', 'Region')}
                            </p>
                            <p className="font-semibold text-green-900 dark:text-green-100" style={{ fontSize: '15px' }}>
                              {projects.find(p => p.id === selectedProject)?.region}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {projects.find(p => p.id === selectedProject)?.contractNumber && (
                        <div className="md:col-span-2 flex items-start gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mt-0.5">
                            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600 dark:text-green-400 mb-1" style={{ fontSize: '13px', color: '#555' }}>
                              {t('contractNumber', 'Contract Number')}
                            </p>
                            <p className="font-semibold text-green-900 dark:text-green-100" style={{ fontSize: '15px' }}>
                              {projects.find(p => p.id === selectedProject)?.contractNumber}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base">{t('date', 'date')}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    dir="ltr"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDescription" className="text-base">{t('workDescription', 'workDescription')}</Label>
                  <Textarea
                    id="workDescription"
                    value={formData.workDescription}
                    onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                    rows={5}
                    placeholder={t('workDescriptionPlaceholder', 'workDescriptionPlaceholder')}
                    required
                    className="resize-none"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="progress" className="text-base">{t('dailyProgressPercentage', 'dailyProgressPercentage')}</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workersCount" className="text-base">{t('workersCount', 'workersCount')}</Label>
                    <Input
                      id="workersCount"
                      type="number"
                      min="0"
                      value={formData.workersCount}
                      onChange={(e) => setFormData({ ...formData, workersCount: parseInt(e.target.value) || 0 })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipmentUsed" className="text-base">{t('equipmentUsed', 'equipmentUsed')}</Label>
                  <Input
                    id="equipmentUsed"
                    value={formData.equipmentUsed}
                    onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                    placeholder={t('equipmentPlaceholder', 'equipmentPlaceholder')}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base">{t('notesAndIssues', 'notesAndIssues')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder={t('notesPlaceholder', 'notesPlaceholder')}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images" className="text-base">{t('sitePhotos', 'sitePhotos')}</Label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/30">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setFormData({ ...formData, images: files });
                      }}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-base mb-1">{t('clickToUpload', 'clickToUpload')}</p>
                      <p className="text-sm text-muted-foreground">{t('multiplePhotosAllowed', 'multiplePhotosAllowed')}</p>
                    </label>
                    {formData.images.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {formData.images.map((file, index) => (
                          <Badge key={index} variant="secondary" className="gap-2 py-2 px-3">
                            <ImageIcon className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Report Items Section */}
                <div className="pt-4 border-t-2 border-dashed border-border">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    {t('reportItems', 'Report Items')}
                  </h3>
                  
                  {formData.reportItems.map((item, index) => (
                    <Card key={index} className="mb-4 bg-muted/20 border-2">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{t('itemNumber', 'Item Number')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = formData.reportItems.filter((_, i) => i !== index);
                              setFormData({ ...formData, reportItems: newItems });
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                            {t('removeItem', 'Remove Item')}
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-sm">{t('itemNumber', 'Item Number')}</Label>
                            <Input
                              value={item.itemNumber}
                              onChange={(e) => {
                                const newItems = [...formData.reportItems];
                                newItems[index].itemNumber = e.target.value;
                                setFormData({ ...formData, reportItems: newItems });
                              }}
                              placeholder={t('itemNumberPlaceholder', 'Example: 01, 02...')}
                              className="h-12"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">{t('itemType', 'Item Type')}</Label>
                            <Input
                              value={item.itemType}
                              onChange={(e) => {
                                const newItems = [...formData.reportItems];
                                newItems[index].itemType = e.target.value;
                                setFormData({ ...formData, reportItems: newItems });
                              }}
                              placeholder={t('itemTypePlaceholder', 'Example: asphalt, painting, sidewalks...')}
                              className="h-12"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">{t('itemName', 'Item Name')}</Label>
                          <Input
                            value={item.itemName}
                            onChange={(e) => {
                              const newItems = [...formData.reportItems];
                              newItems[index].itemName = e.target.value;
                              setFormData({ ...formData, reportItems: newItems });
                            }}
                            placeholder={t('itemNamePlaceholder', 'Example: Asphalt work for secondary road')}
                            className="h-12"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            {t('attachment', 'Attachment / Photo')}
                          </Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const newItems = [...formData.reportItems];
                                newItems[index].attachment = file;
                                setFormData({ ...formData, reportItems: newItems });
                              }
                            }}
                            className="h-12"
                          />
                          {item.attachment && (
                            <Badge variant="secondary" className="gap-2">
                              <Paperclip className="h-3 w-3" />
                              {item.attachment.name}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        reportItems: [
                          ...formData.reportItems,
                          { itemNumber: '', itemName: '', itemType: '', attachment: undefined }
                        ]
                      });
                    }}
                    className="w-full gap-2 border-2 border-dashed hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Plus className="h-5 w-5" />
                    {t('addNewItem', 'Add New Item')}
                  </Button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} size="lg">
                    {t('cancel', 'cancel')}
                  </Button>
                  <Button type="submit" disabled={uploadingImages} size="lg" className="gap-2">
                    {uploadingImages ? t('uploading', 'uploading') : t('saveReport', 'saveReport')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
          </div>
        </div>

        {projects.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="text-center py-16">
            <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl mb-2">{t('noProjects', 'noProjects')}</h3>
            <p className="text-muted-foreground text-lg">{t('mustAddProjectFirst', 'mustAddProjectFirst')}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{t('selectProject', 'selectProject')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects
                    .filter((project) => project && project.id) // Filter out null/undefined
                    .map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} - {project.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-5">
            {reports.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="text-center py-16">
                  <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-2xl mb-2">{t('noReports', 'noReports')}</h3>
                  <p className="text-muted-foreground text-lg">{t('startAddingReport', 'startAddingReport')}</p>
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <Card key={report.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-xl">
                            {new Date(report.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'full' })}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-base flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {t('createdBy', 'createdBy')}: {report.createdByName}
                        </CardDescription>
                      </div>
                      <Badge className={report.status === 'approved' ? 'bg-green-100 text-green-800 gap-2 py-2 px-3' : 'bg-secondary/10 text-secondary gap-2 py-2 px-3'}>
                        {report.status === 'approved' ? (
                          <>
                            <CheckCircle className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            {t('approved', 'approved')}
                          </>
                        ) : (
                          <>
                            <Clock className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            {t('underReview', 'underReview')}
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {t('workDetails', 'workDetails')}:
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{report.workDescription}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="bg-primary/10 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">{t('progress', 'progress')}</p>
                        <p className="text-2xl text-primary">{report.progress}%</p>
                      </div>
                      <div className="bg-secondary/10 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">{t('workersCount', 'workersCount')}</p>
                        <p className="text-2xl text-secondary">{report.workersCount}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">{t('equipment', 'equipment')}</p>
                        <p className="text-base">{report.equipmentUsed || t('notSpecified', 'notSpecified')}</p>
                      </div>
                    </div>

                    {report.notes && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="mb-2">{t('notes', 'notes')}:</h4>
                        <p className="text-muted-foreground">{report.notes}</p>
                      </div>
                    )}

                    {report.images && report.images.length > 0 && (
                      <div>
                        <h4 className="mb-3 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          {t('sitePhotos', 'sitePhotos')}:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {report.images.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`${t('sitePhotos', 'sitePhotos')} ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-md"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {canApprove && report.status === 'pending' && (
                      <div className="flex gap-3 pt-3 border-t">
                        <Button
                          variant="default"
                          size="lg"
                          onClick={() => handleApprove(report.id, 'approved')}
                          className="flex-1 gap-2"
                        >
                          <CheckCircle className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          {t('approveReport', 'approveReport')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
      </div>
    </div>
  );
}