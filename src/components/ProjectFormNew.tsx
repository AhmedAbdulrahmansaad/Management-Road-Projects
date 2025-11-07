import React from 'react';
import { useTheme } from './ThemeProvider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { FolderKanban, MapPin, DollarSign, Calendar, TrendingUp, Upload, AlertCircle, Clock, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProjectFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  error: string;
  editingProject: any;
  selectedFiles?: File[];
  setSelectedFiles?: (files: File[]) => void;
  uploadingFiles?: boolean;
}

export function ProjectFormNew({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  error, 
  editingProject, 
  selectedFiles = [], 
  setSelectedFiles,
  uploadingFiles = false 
}: ProjectFormProps) {
  const { t, language } = useTheme();
  
  // Calculate deviation automatically
  const deviation = formData.actualProgress - formData.plannedProgress;
  
  // Get deviation color
  const getDeviationColor = () => {
    if (deviation > 0) return 'bg-green-50 border-green-300 text-green-700 dark:bg-green-950 dark:border-green-800';
    if (deviation < 0) return 'bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-800';
    return 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-900 dark:border-gray-700';
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-4">
      {error && (
        <Alert variant="destructive" className="animate-shake">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}

      {/* 1. اسم المشروع - Project Name */}
      <div className="space-y-3">
        <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
          <FolderKanban className="h-4 w-4 text-primary" />
          {t('projectName', 'Project Name')}
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal' }}
          placeholder={t('مثال: طريق الرياض - جدة السريع', 'e.g., Riyadh - Jeddah Highway')}
        />
      </div>

      {/* 2. نوع المشروع - Project Type */}
      <div className="space-y-3">
        <Label htmlFor="projectType" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
          {t('projectType', 'Project Type')}
        </Label>
        <Input
          id="projectType"
          value={formData.projectType}
          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal' }}
          placeholder={t('projectTypePlaceholder', 'Enter project type (maintenance / execution)')}
        />
      </div>

      {/* 3. المنطقة - Region */}
      <div className="space-y-3">
        <Label htmlFor="region" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
          {t('region', 'Region')}
        </Label>
        <Input
          id="region"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal' }}
          placeholder={t('regionPlaceholder', 'Example: Najran Region')}
        />
      </div>

      {/* 4. رقم العقد - Contract Number */}
      <div className="space-y-3">
        <Label htmlFor="contractNumber" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
          {t('contractNumber', 'Contract Number')}
        </Label>
        <Input
          id="contractNumber"
          value={formData.contractNumber}
          onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal' }}
          placeholder={t('contractNumberPlaceholder', 'Enter contract number')}
        />
      </div>

      {/* 4b. الموقع / الطريق - Location / Road */}
      <div className="space-y-3">
        <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
          <MapPin className="h-4 w-4 text-secondary" />
          {t('location', 'Location / Road Name')}
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal' }}
          placeholder={t('مثال: الطريق الدائري الشرقي', 'e.g., Eastern Ring Road')}
        />
      </div>

      {/* 5. وصف المشروع - Project Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
          {t('projectDescription', 'Project Description')}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
          className="resize-none border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal', lineHeight: '1.7' }}
          placeholder={t('وصف تفصيلي للمشروع وأهدافه...', 'Detailed description of the project and its objectives...')}
        />
      </div>

      {/* 6. مدة التنفيذ - Duration */}
      <div className="space-y-3">
        <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
          <Clock className="h-4 w-4 text-primary" />
          {t('duration', 'Duration (Months)')}
        </Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px', letterSpacing: 'normal' }}
          placeholder={t('durationPlaceholder', 'Example: 12 months')}
        />
      </div>

      {/* 7. قيمة المشروع - Total Value */}
      <div className="space-y-3">
        <Label htmlFor="totalValue" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
          <DollarSign className="h-4 w-4 text-primary" />
          {t('totalValue', 'Total Value')} ({t('ريال سعودي', 'SAR')})
        </Label>
        <Input
          id="totalValue"
          type="number"
          value={formData.totalValue}
          onChange={(e) => setFormData({ ...formData, totalValue: parseInt(e.target.value) || 0 })}
          dir="ltr"
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px' }}
          placeholder="0"
        />
      </div>

      {/* 8. الميزانية - Budget */}
      <div className="space-y-3">
        <Label htmlFor="budget" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
          <DollarSign className="h-4 w-4 text-primary" />
          {t('budget', 'Budget')} ({t('ريال سعودي', 'SAR')})
        </Label>
        <Input
          id="budget"
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
          required
          dir="ltr"
          className="h-14 border-2 focus:border-primary"
          style={{ fontSize: '16px' }}
          placeholder="0"
        />
      </div>

      {/* Progress Section - نسب الإنجاز */}
      <div className="pt-4 border-t-2 border-dashed border-border">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontSize: '20px', color: '#0B5E3A' }}>
          <TrendingUp className="h-5 w-5" />
          {t('progressSection', 'Progress and Monitoring Percentages')}
        </h3>
        
        <div className="space-y-4">
          {/* 9. نسبة الإنجاز الحالية - Actual Progress */}
          <div className="space-y-3">
            <Label htmlFor="actualProgress" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
              {t('actualProgress', 'Actual Progress %')}
            </Label>
            <Input
              id="actualProgress"
              type="number"
              min="0"
              max="100"
              value={formData.actualProgress}
              onChange={(e) => setFormData({ ...formData, actualProgress: parseInt(e.target.value) || 0 })}
              className="h-14 border-2 focus:border-primary"
              style={{ fontSize: '16px' }}
              placeholder="0-100"
            />
          </div>

          {/* 10. النسبة المخططة - Planned Progress */}
          <div className="space-y-3">
            <Label htmlFor="plannedProgress" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
              {t('plannedProgress', 'Planned Progress (%)')}
            </Label>
            <Input
              id="plannedProgress"
              type="number"
              min="0"
              max="100"
              value={formData.plannedProgress}
              onChange={(e) => setFormData({ ...formData, plannedProgress: parseInt(e.target.value) || 0 })}
              className="h-14 border-2 focus:border-primary"
              style={{ fontSize: '16px' }}
              placeholder={t('plannedProgressPlaceholder', '0-100')}
            />
          </div>

          {/* 11. الفرق - Deviation (Auto-calculated) */}
          <div className="space-y-3">
            <Label htmlFor="deviation" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
              {t('deviation', 'Deviation')}
              <span className="text-xs text-muted-foreground">({t('deviationAutoCalculated', 'Auto-calculated')})</span>
            </Label>
            <Input
              id="deviation"
              type="text"
              value={`${deviation > 0 ? '+' : ''}${deviation}%`}
              disabled
              className={`h-14 border-2 ${getDeviationColor()}`}
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            />
          </div>
        </div>
      </div>

      {/* 12. الحالة - Status */}
      <div className="space-y-3">
        <Label htmlFor="status" className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
          {t('status', 'Status')}
        </Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger className="h-14 border-2">
            <SelectValue style={{ fontSize: '16px' }} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">{t('تخطيط', 'Planning')}</SelectItem>
            <SelectItem value="active">{t('نشط', 'Active')}</SelectItem>
            <SelectItem value="delayed">{t('متأخر', 'Delayed')}</SelectItem>
            <SelectItem value="completed">{t('مكتمل', 'Completed')}</SelectItem>
            <SelectItem value="on_hold">{t('متوقف', 'On Hold')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dates - التواريخ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 13. تاريخ البدء - Start Date */}
        <div className="space-y-3">
          <Label htmlFor="startDate" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
            <Calendar className="h-4 w-4 text-green-600" />
            {t('startDate', 'Start Date')}
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            dir="ltr"
            className="h-14 border-2 focus:border-primary"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* 14. تاريخ اانتهاء - End Date */}
        <div className="space-y-3">
          <Label htmlFor="endDate" className="text-base font-semibold flex items-center gap-2" style={{ fontSize: '14px', color: '#555' }}>
            <Calendar className="h-4 w-4 text-red-600" />
            {t('endDate', 'Expected End Date')}
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            dir="ltr"
            className="h-14 border-2 focus:border-primary"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* 15. رفع المرفقات - Upload Files */}
      <div className="pt-4 border-t-2 border-dashed border-border">
        <div className="space-y-3">
          <Label className="text-base font-semibold" style={{ fontSize: '14px', color: '#555' }}>
            {t('uploadProjectFile', 'Upload project file or image')}
          </Label>
          <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-muted/30 shadow-sm">
            <Input
              id="attachments"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                console.log('📎 Files selected:', files.length, files.map(f => f.name));
                setSelectedFiles && setSelectedFiles(files);
              }}
            />
            <label htmlFor="attachments" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ fontSize: '16px' }}>{t('clickToUpload', 'Click to upload photos')}</p>
                <p className="text-sm text-muted-foreground" style={{ fontSize: '13px' }}>
                  {t('يمكن رفع صور، PDF، Word، Excel', 'Images, PDF, Word, Excel allowed')}
                </p>
              </div>
            </label>
            
            {/* Display selected files */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-6 pt-4 border-t border-dashed">
                <p className="text-sm font-semibold mb-3 text-primary">
                  {language === 'ar' ? `تم اختيار ${selectedFiles.length} ملف` : `${selectedFiles.length} file(s) selected`}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedFiles.map((file, index) => (
                    <Badge key={index} variant="secondary" className="gap-2 py-2 px-4 text-sm">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span className="max-w-[200px] truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = selectedFiles.filter((_, i) => i !== index);
                          setSelectedFiles && setSelectedFiles(newFiles);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          size="lg"
          className="px-8 py-6"
          style={{ fontSize: '16px' }}
          disabled={uploadingFiles}
        >
          {t('cancel', 'Cancel')}
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          className="px-8 py-6 bg-gradient-to-r from-[#0B5E3A] to-[#006C35] hover:from-[#006C35] hover:to-[#0B5E3A] shadow-lg"
          style={{ fontSize: '16px' }}
          disabled={uploadingFiles}
        >
          {uploadingFiles ? (
            <>
              <Loader2 className={`h-5 w-5 animate-spin ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
            </>
          ) : (
            editingProject ? t('update', 'Update') : t('create', 'Create')
          )}
        </Button>
      </div>
    </form>
  );
}