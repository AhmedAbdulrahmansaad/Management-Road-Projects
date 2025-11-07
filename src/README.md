# 🇸🇦 Saudi Roads Management System

<div dir="rtl">

## 🌟 Overview

نظام إدارة متكامل لمشاريع الطرق والبنية التحتية في المملكة العربية السعودية، مصمم خصيصاً للهيئة العامة للطرق.

**Project Name**: Management Road Projects  
**Package Name**: `management-road-projects`  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

⚠️ **مهم**: هذا المشروع يستخدم **اللغة الإنجليزية فقط** لأسماء الملفات والمجلدات لضمان التوافق مع GitHub وVercel وأنظمة البناء الأخرى.

### المميزات الرئيسية:
- ✅ **4 مستويات صلاحيات** (مدير عام، مدير مشروع، مهندس، مراقب)
- ✅ **لوحة تحكم** بإحصائيات حية ورسوم بيانية تفاعلية
- ✅ **إدارة مشاريع شاملة** (15+ حقل لكل مشروع)
- ✅ **تقارير يومية تفصيلية** مع رفع صور متعددة
- ✅ **بنود تقرير قابلة للتكرار** (عدد غير محدود)
- ✅ **ربط تلقائي** بين المشاريع والتقارير
- ✅ **نظام ترجمة شامل** (عربي/إنجليزي)
- ✅ **الوضع الليلي** الكامل
- ✅ **تصميم Responsive** على جميع الشاشات
- ✅ **مساعد ذكي AI** لتحليل البيانات والإحصائيات

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account ([Create one here](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/management-road-projects.git
cd management-road-projects

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

---

## 🏗️ Architecture

### Tech Stack

#### Frontend:
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS v4** - Styling
- **Shadcn/UI** - Component Library
- **Recharts** - Charts & Graphs
- **Motion/React** - Animations
- **Sonner** - Toast Notifications

#### Backend:
- **Supabase** - Database & Auth
- **Supabase Edge Functions** - API
- **Supabase Storage** - File Storage
- **Hono** - Web Framework (for Edge Functions)

#### Fonts:
- **Cairo** & **Tajawal** - Arabic
- **Poppins** & **Inter** - English

---

## 📁 Project Structure

```
/
├── App.tsx                          # Main entry point
├── components/
│   ├── AuthContext.tsx             # Authentication
│   ├── ThemeProvider.tsx           # Theme & i18n
│   ├── Dashboard.tsx               # Dashboard page
│   ├── ProjectsPage.tsx            # Projects management
│   ├── ProjectFormNew.tsx          # Enhanced project form
│   ├── DailyReportsPage.tsx        # Daily reports
│   ├── ReportsPage.tsx             # Advanced reports
│   ├── AIAssistant.tsx             # AI assistant
│   ├── translations.ts             # i18n (200+ translations)
│   └── ui/                         # Shadcn components (50+)
├── styles/
│   └── globals.css                 # Global styles (750+ lines)
├── utils/
│   └── supabase/
│       └── info.tsx                # Supabase config
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # API routes
│           └── kv_store.tsx        # Key-Value store
└── Documentation files (15+)
```

---

## 🎨 Design System

### Colors (Saudi Green & Gold)

```css
/* Light Mode */
--primary: #006C35;           /* Saudi Green */
--secondary: #FDB714;         /* Gold */
--accent-mountain: #2D5016;   /* Mountain Green */

/* Dark Mode */
--primary: #00d46a;           /* Light Green */
--secondary: #FFD046;         /* Light Gold */
```

### Fonts

```css
/* Arabic */
font-family: 'Cairo', 'Tajawal', system-ui, sans-serif;

/* English */
font-family: 'Poppins', 'Inter', system-ui, sans-serif;
```

---

## 🔐 User Roles & Permissions

### 1. General Manager (المدير العام)
- ✅ Full access to all features
- ✅ Create/Edit/Delete projects
- ✅ View all reports
- ✅ Approve reports
- ✅ Manage users

### 2. Project Manager (مدير المشروع)
- ✅ Create/Edit projects
- ✅ Create daily reports
- ✅ Approve reports
- ✅ View assigned projects only

### 3. Engineer (المهندس)
- ✅ View projects
- ✅ Create daily reports
- ✅ Edit own reports only

### 4. Observer (المراقب)
- ✅ View projects (read-only)
- ✅ View reports (read-only)
- ❌ Cannot edit or create

---

## 📊 Features

### 1. Dashboard
- Real-time statistics
- Interactive charts (Recharts)
- Recent activities
- Project status distribution

### 2. Project Management (15 Fields)
1. اسم المشروع (Project Name)
2. نوع المشروع (Project Type - Text)
3. المنطقة (Region - Text)
4. رقم العقد (Contract Number)
5. وصف المشروع (Description)
6. مدة التنفيذ (Duration in Months)
7. قيمة المشروع (Project Value)
8. الميزانية (Budget)
9. نسبة الإنجاز الحالية (Actual Progress %)
10. النسبة المخططة (Planned Progress %)
11. **الفرق (Deviation - Auto-calculated)**
12. الحالة (Status)
13. تاريخ البدء (Start Date)
14. تاريخ الانتهاء (End Date)
15. رفع المرفقات (File Uploads)

**Special Feature**: Deviation auto-calculates with dynamic colors:
- 🟢 Green: Ahead of schedule
- 🔴 Red: Behind schedule
- ⚫ Gray: On schedule

### 3. Daily Reports
- **Auto-linked Project Info Header**:
  - Project Type (auto)
  - Region (auto)
  - Contract Number (auto)
  - Project Name (auto)
  - Location (auto)

- **Report Fields**:
  - Date
  - Work Description
  - Daily Progress %
  - Number of Workers
  - Equipment Used
  - Notes & Issues
  - Photo Uploads

- **Repeatable Report Items**:
  - Item Number
  - Item Name
  - Item Type
  - Attachment/Photo per item
  - Add/Remove unlimited items

### 4. Advanced Reports
- Performance Report
- Financial Report
- Productivity Report
- Safety Report
- Quality Report
- Export to PDF & Excel

### 5. AI Assistant
- Answer questions
- General guidance
- Arabic/English support

---

## 🌐 Internationalization (i18n)

### Supported Languages:
- 🇸🇦 **Arabic (العربية)** - RTL
- 🇺🇸 **English** - LTR

### Features:
- ✅ 200+ translations
- ✅ Language toggle button
- ✅ Auto RTL/LTR direction
- ✅ Global context

### Usage:
```typescript
const { t, language } = useTheme();

// Basic
{t('projects', 'Projects')}

// With key from translations.ts
{t('totalProjects', 'Total Projects')}
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

For Edge Functions, set in Supabase Dashboard:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📡 API Routes

All routes are prefixed with `/make-server-92709448`:

### Authentication:
- `POST /signup` - Sign up new user

### Projects:
- `POST /projects` - Create project
- `GET /projects` - Get all projects
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Reports:
- `POST /reports` - Create report
- `GET /reports` - Get all reports
- `PUT /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report

### Files:
- `POST /upload` - Upload file

### Stats:
- `GET /stats` - Get statistics

---

## 🧪 Testing

### Manual Testing Checklist:

```bash
✅ Create new project (15 fields)
✅ Auto-calculate deviation
✅ Dynamic deviation colors
✅ Save project → Toast notification
✅ Open daily report
✅ Auto-populate project info in header
✅ Add multiple report items
✅ Remove report item
✅ Upload files
✅ Switch language (AR ↔ EN)
✅ Toggle dark mode
✅ Test on mobile/tablet/desktop
```

---

## 🚀 Deployment

### Deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Build command
npm run build

# Output directory
dist
```

### Deploy Supabase Edge Functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy make-server-92709448
```

---

## 📚 Documentation

### Complete Documentation Files:
- `/IMPLEMENTATION_COMPLETE.md` - Full implementation guide
- `/TEST_CHECKLIST_AR.md` - Testing checklist (Arabic)
- `/ENHANCEMENTS_COMPLETED.md` - All enhancements
- `/FINAL_SUMMARY_AR.md` - Final summary (Arabic)
- `/README_DEV.md` - Developer quick guide
- `/PRE_DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `/USER_GUIDE_AR.md` - User guide (Arabic)
- `/API_DOCUMENTATION.md` - API documentation

---

## 🐛 Known Issues

None! ✅ The system is fully tested and production-ready.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

© 2025 General Authority for Roads - Kingdom of Saudi Arabia

---

## 👥 Team

Developed with ❤️ for the General Authority for Roads

---

## 📞 Support

For support, please contact:
- 📧 Email: support@roads.gov.sa
- 📞 Phone: +966-XX-XXXXXXX

---

## 🎉 Status

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 7, 2025

---

<div align="center">

### 🇸🇦 **Kingdom of Saudi Arabia**
### **General Authority for Roads**

**Built with modern web technologies**  
**React • TypeScript • Tailwind • Supabase**

⭐ **Star this repository if you find it useful!** ⭐

</div>