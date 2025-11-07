import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Bot, Send, User, Sparkles, MessageCircle, CheckCircle2, Loader2, FolderPlus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  projectCreated?: any; // If this message created a project
}

export function AIAssistant() {
  const { t, language } = useTheme();
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('aiWelcome', 'aiWelcome'),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error('AI: Failed to fetch projects:', error);
      return [];
    }
  };

  // Fetch statistics from Supabase
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/stats`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      const data = await response.json();
      return data.stats || null;
    } catch (error) {
      console.error('AI: Failed to fetch stats:', error);
      return null;
    }
  };

  // Create project via AI
  const createProjectViaAI = async (projectData: any) => {
    try {
      console.log('📤 AI: Sending project data to API:', projectData);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92709448/projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(projectData)
        }
      );
      
      console.log('📥 AI: API response status:', response.status);
      
      const data = await response.json();
      console.log('📦 AI: API response data:', data);
      
      if (!response.ok) {
        console.error('❌ AI: API error:', data.error || 'Unknown error');
        return null;
      }
      
      return data.project || null;
    } catch (error) {
      console.error('💥 AI: Failed to create project:', error);
      return null;
    }
  };

  // Smart project extraction from user input
  const extractProjectFromMessage = (message: string): any | null => {
    const lowerMsg = message.toLowerCase();
    
    // Check if user wants to create a project
    const createKeywords = ['أنشئ', 'انشئ', 'إنشاء', 'create', 'new project', 'مشروع جديد', 'اصنع', 'سوي'];
    const isCreationRequest = createKeywords.some(keyword => lowerMsg.includes(keyword));
    
    if (!isCreationRequest) return null;

    console.log('🤖 AI: Detected project creation request');

    // Extract project details using intelligent parsing
    const projectData: any = {
      name: '',
      description: message,
      location: '',
      status: 'planning',
      progress: 0,
      budget: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      projectType: '',
      region: '',
      contractNumber: '',
      duration: 12,
      totalValue: 0,
      actualProgress: 0,
      plannedProgress: 0
    };

    // Extract name (usually after keywords like "اسمه" / "called" / "named")
    const namePatterns = [
      /(?:اسمه|اسمها|يسمى|يسمي|called|named|title|name)[:\s]+([^،\n]+)/i,
      /مشروع\s+([^،\n]+)/i,
      /طريق\s+([^،\n]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        projectData.name = match[1].trim();
        break;
      }
    }

    // If no name found, generate one
    if (!projectData.name) {
      projectData.name = language === 'ar' 
        ? `مشروع ${new Date().toLocaleDateString('ar-SA')}`
        : `Project ${new Date().toLocaleDateString('en-US')}`;
    }

    // Extract location
    const locationPatterns = [
      /(?:في|at|in|location|موقع|منطقة)[:\s]+([^،\n]+)/i,
      /(?:الرياض|جدة|مكة|المدينة|الدمام|الطائف|تبوك|نجران|جازان|أبها|القصيم|حائل)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = message.match(pattern);
      if (match) {
        projectData.location = match[0].includes('في') || match[0].includes('at') 
          ? match[1]?.trim() || match[0] 
          : match[0];
        projectData.region = projectData.location;
        break;
      }
    }

    // Extract budget/value
    const budgetPatterns = [
      /(\d+(?:[.,]\d+)?)\s*(?:مليون|million|ريال|sar|sr)/i,
      /(?:ميزانية|budget|يمة|value|cost|تكلفة)[:\s]+(\d+(?:[.,]\d+)?)/i
    ];
    
    for (const pattern of budgetPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        let value = parseFloat(match[1].replace(',', '.'));
        if (message.toLowerCase().includes('مليون') || message.toLowerCase().includes('million')) {
          value = value * 1000000;
        }
        projectData.budget = value;
        projectData.totalValue = value;
        break;
      }
    }

    // Extract duration
    const durationPatterns = [
      /(\d+)\s*(?:شهر|month|أشهر|months)/i,
      /(?:مدة|duration|فترة)[:\s]+(\d+)/i
    ];
    
    for (const pattern of durationPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        projectData.duration = parseInt(match[1]);
        // Calculate end date
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + projectData.duration);
        projectData.endDate = endDate.toISOString().split('T')[0];
        break;
      }
    }

    // If no end date, set default to 12 months from now
    if (!projectData.endDate) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 12);
      projectData.endDate = endDate.toISOString().split('T')[0];
    }

    // Extract project type
    if (message.includes('صيانة') || message.includes('maintenance')) {
      projectData.projectType = language === 'ar' ? 'صيانة' : 'Maintenance';
    } else if (message.includes('تنفيذ') || message.includes('execution') || message.includes('construction')) {
      projectData.projectType = language === 'ar' ? 'تنفيذ' : 'Execution';
    } else if (message.includes('تطوير') || message.includes('development')) {
      projectData.projectType = language === 'ar' ? 'تطوير' : 'Development';
    }

    console.log('🎯 AI: Extracted project data:', projectData);
    return projectData;
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Dynamic responses with Supabase data
    if (lowerMessage.includes('مشاريع') || lowerMessage.includes('projects') || 
        lowerMessage.includes('عرض') || lowerMessage.includes('show') ||
        lowerMessage.includes('كم') || lowerMessage.includes('how many')) {
      
      const projects = await fetchProjects();
      const stats = await fetchStats();
      
      if (language === 'ar') {
        return `📊 **ملخص المشاريع الحالية:**

🔢 **إجمالي المشاريع**: ${stats?.totalProjects || 0}
✅ **مشاريع نشطة**: ${stats?.activeProjects || 0}
✔️ **مشاريع مكتملة**: ${stats?.completedProjects || 0}
⚠️ **مشاريع متأخرة**: ${stats?.delayedProjects || 0}
📈 **متوسط الإنجاز**: ${stats?.averageProgress || 0}%

${projects.length > 0 ? `\n**آخر المشاريع:**\n${projects.slice(0, 3).map((p: any, i: number) => 
  `${i + 1}. ${p.name || 'مشروع'} - ${p.status || 'جاري'} (${p.progress || 0}%)`
).join('\n')}` : '\n_لا توجد مشاريع حالياً_'}

💡 **اسألني عن مشروع محدد أو أطلب مني إنشاء مشروع جديد!**`;
      } else {
        return `📊 **Current Projects Summary:**

🔢 **Total Projects**: ${stats?.totalProjects || 0}
✅ **Active Projects**: ${stats?.activeProjects || 0}
✔️ **Completed Projects**: ${stats?.completedProjects || 0}
⚠️ **Delayed Projects**: ${stats?.delayedProjects || 0}
📈 **Average Progress**: ${stats?.averageProgress || 0}%

${projects.length > 0 ? `\n**Recent Projects:**\n${projects.slice(0, 3).map((p: any, i: number) => 
  `${i + 1}. ${p.name || 'Project'} - ${p.status || 'active'} (${p.progress || 0}%)`
).join('\n')}` : '\n_No projects available_'}

💡 **Ask me about a specific project or request to create a new one!**`;
      }
    }

    // Template responses based on keywords (keeping existing static responses)
    if (lowerMessage.includes('تقرير') || lowerMessage.includes('كتابة') || lowerMessage.includes('report') || lowerMessage.includes('write')) {
      return language === 'ar' 
        ? `لكتابة تقرير يومي فعال، أنصحك بالتالي:

📋 **العناصر الأساسية:**
1. وصف دقيق للأعمال المنجزة
2. نسبة الإنجاز المحققة
3. عدد العمال والمعدات المستخدمة
4. أي تحديات أو مشاكل واجهتها
5. صور توثيقية للموقع

✨ **نصائح:**
- كن محدداً ودقيقاً في الأرقام
- استخدم لغة واضحة ومهنية
- وثق أي انحرافات عن الخطة الأصلية
- اقترح حلول للمشاكل المواجهة`
        : `For writing an effective daily report, I recommend:

📋 **Essential Elements:**
1. Accurate description of completed work
2. Progress percentage achieved
3. Number of workers and equipment used
4. Any challenges or problems encountered
5. Documentary site photos

✨ **Tips:**
- Be specific and precise with numbers
- Use clear and professional language
- Document any deviations from the original plan
- Suggest solutions for encountered problems`;
    }

    if (lowerMessage.includes('مشروع') || lowerMessage.includes('إدارة') || lowerMessage.includes('project') || lowerMessage.includes('management')) {
      return language === 'ar'
        ? `لإدارة المشاريع بفعالية:

🎯 **أساسيات الإدارة:**
1. تحديد الأهداف والنطاق بوضوح
2. تقسيم العمل إلى مراحل قابلة للقياس
3. متابعة الجدول الزمني باستمرار
4. مراقبة الميزانية والموارد
5. التواصل الفعال مع الفريق

📊 **مؤشرات الأداء الرئيسية:**
- نسبة الإنجاز مقارنة بالخطة
- الالتزام بالميزانية
- جودة التنفيذ
- رضا أصحاب المصلحة`
        : `For effective project management:

🎯 **Management Basics:**
1. Clearly define objectives and scope
2. Divide work into measurable phases
3. Continuously monitor the timeline
4. Control budget and resources
5. Effective team communication

📊 **Key Performance Indicators:**
- Progress percentage vs. plan
- Budget compliance
- Execution quality
- Stakeholder satisfaction`;
    }

    if (lowerMessage.includes('سلامة') || lowerMessage.includes('أمان') || lowerMessage.includes('safety') || lowerMessage.includes('security')) {
      return language === 'ar'
        ? `السلامة أولاً في مشاريع الطرق:

⚠️ **إجراءات السلامة الأساسية:**
1. ارتداء معدات الحماية الشخصية دائماً
2. تأمين موقع العمل بشكل صحيح
3. فحص المعدات قل الاستخدام
4. وضع لافتات تحذيرية واضحة
5. تدريب العمال على إجراءات الطوارئ

🚨 **في حالة الطوارئ:**
- إيقاف العمل فوراً
- الإبلاغ عن الحادث
- تأمين المنطقة
- تقديم الإسعافات الأولية`
        : `Safety first in road projects:

⚠️ **Basic Safety Procedures:**
1. Always wear personal protective equipment
2. Properly secure the work site
3. Inspect equipment before use
4. Place clear warning signs
5. Train workers on emergency procedures

🚨 **In Case of Emergency:**
- Stop work immediately
- Report the incident
- Secure the area
- Provide first aid`;
    }

    if (lowerMessage.includes('ميزانية') || lowerMessage.includes('تكلفة') || lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
      return language === 'ar'
        ? `إدارة ميزانية المشروع:

💰 **التحكم في التكاليف:**
1. تتبع النفقات اليومية بدقة
2. مقارنة التكاليف الفعلية بالمخططة
3. توقع التكاليف المستقبلية
4. تحديد فرص التوفير
5. توثيق جميع المصروفات

📈 **نصائح للتوفير:**
- التخطيط الجيد يقلل الهدر
- الشراء بالجملة عند الإمكان
- صيانة المعدات بانتظام
- تحسين كفاءة استخدام الموارد`
        : `Project Budget Management:

💰 **Cost Control:**
1. Track daily expenses accurately
2. Compare actual vs. planned costs
3. Forecast future costs
4. Identify saving opportunities
5. Document all expenditures

📈 **Saving Tips:**
- Good planning reduces waste
- Buy in bulk when possible
- Maintain equipment regularly
- Improve resource efficiency`;
    }

    if (lowerMessage.includes('جودة') || lowerMessage.includes('فحص') || lowerMessage.includes('quality') || lowerMessage.includes('inspection')) {
      return language === 'ar'
        ? `ضمان الجودة في مشاريع الطرق:

✅ **معايير الجودة:**
1. الالتزام بالمواصفات الفنية
2. فحص المواد قبل الاستخدام
3. اختبارات الجودة الدورية
4. التوثيق المستمر
5. المراجعة والتحسين

🔍 **نقاط الفحص الرئيسية:**
- سماكة طبقات الأسفلت
- نسب خلط المواد
- الانحدارات والميول
- التصريف والصرف الصحي`
        : `Quality Assurance in Road Projects:

✅ **Quality Standards:**
1. Comply with technical specifications
2. Inspect materials before use
3. Periodic quality tests
4. Continuous documentation
5. Review and improvement

🔍 **Key Inspection Points:**
- Asphalt layer thickness
- Material mixing ratios
- Gradients and slopes
- Drainage and sanitation`;
    }

    if (lowerMessage.includes('فريق') || lowerMessage.includes('عمال') || lowerMessage.includes('team') || lowerMessage.includes('workers')) {
      return language === 'ar'
        ? `إدارة فريق العمل:

👥 **قيادة الفريق الفعالة:**
1. توزيع المهام بوضوح
2. التواصل المنتظم والشفاف
3. تقديم الدعم والتدريب
4. تقدير الإنجازات
5. حل النزاعات بسرعة

🎯 **تحفيز الفريق:**
- وضع أهداف واضحة وقابلة للتحقيق
- إشراك الفريق في القرارات
- الاعتراف بالجهود المبذولة
- توفير بيئة عمل آمنة ومريحة`
        : `Team Management:

👥 **Effective Team Leadership:**
1. Distribute tasks clearly
2. Regular and transparent communication
3. Provide support and training
4. Appreciate achievements
5. Resolve conflicts quickly

🎯 **Team Motivation:**
- Set clear and achievable goals
- Involve team in decisions
- Acknowledge efforts
- Provide safe and comfortable work environment`;
    }

    // Default response
    return language === 'ar'
      ? `شكراً على سؤالك! أنا هنا لمساعدتك في:

🔧 **المجالات التي أغطيها:**
- كتابة التقارير اليومية
- إدارة المشاريع والمهام
- السلامة والأمان
- إدارة الميزانيات
- ضمان الجودة
- قيادة فرق العمل
- التخطيط والجدولة

💡 **اسألني عن:**
"كيف أكتب تقرير يومي فعال؟"
"ما هي أفضل ممارسات إدارة المشاريع؟"
"كيف أضمن السلامة في الموقع؟"

ما هو سؤالك المحدد؟`
      : `Thank you for your question! I'm here to help you with:

🔧 **Areas I Cover:**
- Writing daily reports
- Project and task management
- Safety and security
- Budget management
- Quality assurance
- Team leadership
- Planning and scheduling

💡 **Ask me about:**
"How to write an effective daily report?"
"What are the best project management practices?"
"How to ensure site safety?"

What is your specific question?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      console.log('🤖 AI: Processing user message:', currentInput);
      
      // FIRST: Check if this is a project creation request
      const projectData = extractProjectFromMessage(currentInput);
      
      if (projectData) {
        console.log('🎯 AI: Project creation detected! Data:', projectData);
        console.log('🔑 AI: Access token available:', !!accessToken);
        
        // Create the project FIRST
        const createdProject = await createProjectViaAI(projectData);
        
        if (createdProject) {
          console.log('✅ AI: Project created successfully!', createdProject);
          
          // Show success toast
          toast.success(
            language === 'ar' ? '🎉 تم إنشاء المشروع بنجاح!' : '🎉 Project created successfully!',
            {
              description: language === 'ar' 
                ? `تم إنشاء "${createdProject.name}" وإضافته إلى قائمة المشاريع`
                : `"${createdProject.name}" has been added to your projects`,
              duration: 5000,
              style: {
                background: '#F0FDF4',
                border: '2px solid #22C55E',
                color: '#166534'
              }
            }
          );
          
          // Trigger custom event to refresh projects page
          console.log('📢 AI: Dispatching projectCreated event');
          window.dispatchEvent(new CustomEvent('projectCreated', { 
            detail: { project: createdProject } 
          }));
          
          const projectCreatedMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: language === 'ar'
              ? `✅ **تم إنشاء المشروع بنجاح!**\n\n📋 **تفاصيل المشروع:**\n🏗️ **الاسم:** ${createdProject.name}\n📝 **الوصف:** ${createdProject.description}\n📍 **الموقع:** ${createdProject.location || 'غير محدد'}\n🔖 **النوع:** ${createdProject.projectType || 'عام'}\n💰 **الميزانية:** ${createdProject.budget?.toLocaleString() || '0'} ريال\n⏱️ **المدة:** ${createdProject.duration} شهر\n📅 **تاريخ البدء:** ${createdProject.startDate}\n📅 **تاريخ الانتهاء:** ${createdProject.endDate}\n\n✨ **يمكنك الآن متابعة المشروع من صفحة "المشاريع"!**`
              : `✅ **Project Created Successfully!**\n\n📋 **Project Details:**\n🏗️ **Name:** ${createdProject.name}\n📝 **Description:** ${createdProject.description}\n📍 **Location:** ${createdProject.location || 'Not specified'}\n🔖 **Type:** ${createdProject.projectType || 'General'}\n💰 **Budget:** ${createdProject.budget?.toLocaleString() || '0'} SAR\n⏱️ **Duration:** ${createdProject.duration} months\n📅 **Start Date:** ${createdProject.startDate}\n📅 **End Date:** ${createdProject.endDate}\n\n✨ **You can now track the project from the "Projects" page!**`,
            timestamp: new Date(),
            projectCreated: createdProject
          };
          
          setMessages(prev => [...prev, projectCreatedMessage]);
        } else {
          console.error('❌ AI: Failed to create project');
          
          // Show error toast
          toast.error(
            language === 'ar' ? 'فشل إنشاء المشروع' : 'Failed to create project',
            {
              description: language === 'ar' 
                ? 'حدث خطأ أثناء إنشاء المشروع. حاول مرة أخرى.'
                : 'An error occurred while creating the project. Please try again.',
              duration: 5000
            }
          );
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: language === 'ar'
              ? '❌ عذراً، حدث خطأ أثناء إنشاء المشروع. تأكد من صلاحياتك وحاول مرة أخرى.'
              : '❌ Sorry, an error occurred while creating the project. Check your permissions and try again.',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        // If not a project creation request, get normal AI response
        console.log('💬 AI: Regular conversation, getting AI response');
        const aiResponseText = await getAIResponse(currentInput);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponseText,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('AI Response error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ أثناء معالجة سؤالك. حاول مرة أخرى.'
          : 'Sorry, an error occurred while processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative h-[calc(100vh-12rem)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Saudi Green Mountains Background */}
      <div className="fixed inset-0 bg-saudi-mesh opacity-40 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-green-hills opacity-30 pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-nature-texture opacity-20 pointer-events-none -z-10"></div>

      <Card className="h-full flex flex-col shadow-2xl border-2 border-border/50 hover:border-primary/30 bg-card/95 backdrop-blur-sm transition-all duration-300 animate-fade-in relative z-10">
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-accent-mountain/10 pb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-nature-texture opacity-10"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-mountain rounded-xl blur opacity-75 animate-pulse-glow"></div>
              <div className="relative p-3 bg-gradient-to-br from-primary to-accent-mountain rounded-xl shadow-xl">
                <Bot className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                {t('aiAssistantTitle', 'aiAssistantTitle')}
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </CardTitle>
              <CardDescription className="mt-1 text-base">
                {t('personalAssistant', 'personalAssistant')}
              </CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-primary to-accent-mountain text-white gap-2 py-2 px-4 shadow-xl animate-pulse">
              <Sparkles className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} animate-pulse`} />
              AI
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary-hover text-white'
                        : 'bg-muted border border-border'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary-hover flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl p-4 border border-border shadow-md">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <div className="border-t p-5 bg-muted/30">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeYourQuestion', 'typeYourQuestion')}
              className="flex-1 h-12 text-base"
              disabled={loading}
            />
            <Button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              size="lg"
              className="gap-2 px-6 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center leading-relaxed">
            {t('aiDisclaimer', 'aiDisclaimer')}
          </p>
        </div>
      </Card>
    </div>
  );
}