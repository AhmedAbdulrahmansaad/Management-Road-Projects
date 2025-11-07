# 🚀 دليل رفع المشروع على GitHub و Vercel و Supabase

<div dir="rtl">

## 📋 المحتويات
1. [الإعداد الأولي](#الإعداد-الأولي)
2. [رفع على GitHub](#رفع-على-github)
3. [إعداد Supabase](#إعداد-supabase)
4. [رفع على Vercel](#رفع-على-vercel)
5. [الاختبار النهائي](#الاختبار-النهائي)

---

## 1️⃣ الإعداد الأولي

### المتطلبات:
- ✅ حساب GitHub
- ✅ حساب Supabase (مجاني)
- ✅ حساب Vercel (مجاني)
- ✅ Git مثبت على جهازك
- ✅ Node.js 18+ مثبت

### التحقق من التثبيت:
```bash
git --version
node --version
npm --version
```

---

## 2️⃣ رفع على GitHub

### الخطوة 1: إنشاء Repository

1. افتح [GitHub.com](https://github.com)
2. اضغط على **"New repository"**
3. املأ البيانات:
   - **Repository name**: `saudi-roads-system`
   - **Description**: `نظام إدارة مشاريع الطرق السعودية`
   - **Visibility**: Private أو Public (حسب اختيارك)
   - ❌ **لا** تضع علامة على "Initialize with README"
4. اضغط **"Create repository"**

### الخطوة 2: رفع الكود

افتح Terminal في مجلد المشروع:

```bash
# تهيئة Git (إذا لم يكن مهيأ)
git init

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit: Saudi Roads Management System v1.0"

# تسمية الـ branch الرئيسي
git branch -M main

# ربط المشروع بـ GitHub
git remote add origin https://github.com/YOUR_USERNAME/saudi-roads-system.git

# رفع الكود
git push -u origin main
```

### الخطوة 3: التحقق

1. افتح repository على GitHub
2. تأكد من وجود جميع الملفات
3. ✅ يجب أن ترى:
   - `/components/` (25+ ملف)
   - `/styles/globals.css`
   - `/supabase/functions/server/`
   - `App.tsx`
   - `README.md`

---

## 3️⃣ إعداد Supabase

### الخطوة 1: إنشاء مشروع Supabase

1. افتح [Supabase.com](https://supabase.com)
2. اضغط **"New Project"**
3. املأ البيانات:
   - **Name**: `saudi-roads-system`
   - **Database Password**: (احفظها في مكان آمن)
   - **Region**: اختر الأقرب (مثلاً: Singapore)
4. اضغط **"Create new project"**
5. انتظر 2-3 دقائق حتى يكتمل الإعداد

### الخطوة 2: الحصول على المفاتيح

1. بعد إنشاء المشروع، اذهب إلى:
   **Settings** → **API**

2. ستجد:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (سري جداً!)

3. انسخ هذه القيم

### الخطوة 3: تحديث ملف info.tsx

افتح `/utils/supabase/info.tsx` وحدّث:

```typescript
export const projectId = "xxxxx" // من Project URL
export const publicAnonKey = "eyJhbGc..." // anon key
```

احفظ الملف وارفعه على GitHub:

```bash
git add utils/supabase/info.tsx
git commit -m "Update Supabase credentials"
git push
```

### الخطوة 4: رفع Edge Functions

#### تثبيت Supabase CLI:

```bash
# على macOS
brew install supabase/tap/supabase

# على Windows (PowerShell)
scoop install supabase

# على Linux
brew install supabase/tap/supabase
```

#### الربط والرفع:

```bash
# تسجيل الدخول
supabase login

# الربط بالمشروع
supabase link --project-ref YOUR_PROJECT_ID

# رفع Edge Function
supabase functions deploy make-server-92709448
```

### الخطوة 5: إعداد Environment Variables للـ Edge Function

1. في Supabase Dashboard، اذهب إلى:
   **Edge Functions** → **Environment Variables**

2. أضف المتغيرات التالية:
   ```
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_ANON_KEY = eyJhbGc... (anon key)
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (service_role key)
   ```

3. احفظ التغييرات

### الخطوة 6: إنشاء Storage Bucket (اختياري - سيُنشأ تلقائياً)

Edge Function سيُنشئ Bucket تلقائياً عند أول استخدام، لكن يمكنك إنشاؤه يدوياً:

1. اذهب إلى **Storage**
2. اضغط **"New bucket"**
3. املأ:
   - **Name**: `make-92709448-roads-files`
   - **Public**: ❌ (اتركه private)
4. اضغط **"Create bucket"**

---

## 4️⃣ رفع على Vercel

### الخطوة 1: ربط Vercel بـ GitHub

1. افتح [Vercel.com](https://vercel.com)
2. اضغط **"Add New Project"**
3. اضغط **"Import Git Repository"**
4. اختر **GitHub** وامنح الصلاحيات
5. اختر `saudi-roads-system` repository

### الخطوة 2: إعدادات المشروع

في صفحة الإعداد:

1. **Framework Preset**: اختر `Vite`
2. **Root Directory**: `.` (اتركه كما هو)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### الخطوة 3: إضافة Environment Variables

في قسم **Environment Variables**، أضف:

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc... (anon key فقط)
```

⚠️ **مهم**: لا تضع `SUPABASE_SERVICE_ROLE_KEY` في Vercel!

### الخطوة 4: Deploy

1. اضغط **"Deploy"**
2. انتظر 2-3 دقائق
3. ✅ سيظهر لك:
   ```
   🎉 Deployment ready!
   https://saudi-roads-system.vercel.app
   ```

### الخطوة 5: إعداد Domain مخصص (اختياري)

1. في Vercel Dashboard، اذهب إلى **Settings** → **Domains**
2. أضف domain الخاص بك
3. اتبع التعليمات لتحديث DNS

---

## 5️⃣ الاختبار النهائي

### اختبار الموقع المباشر:

1. افتح رابط Vercel: `https://saudi-roads-system.vercel.app`

2. تحقق من:
   - ✅ الصفحة الرئيسية تفتح
   - ✅ الألوان السعودية ظاهرة
   - ✅ الخطوط العربية واضحة
   - ✅ زر تبديل اللغة يعمل
   - ✅ الوضع الليلي يعمل

### اختبار تسجيل الدخول:

⚠️ **ملاحظة**: يجب إنشاء مستخدم أولاً عبر API!

#### إنشاء مستخدم تجريبي:

استخدم Postman أو أي أداة API:

```http
POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-92709448/signup
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json

{
  "email": "admin@roads.gov.sa",
  "password": "Admin@123456",
  "name": "المدير العام",
  "role": "general_manager"
}
```

#### تسجيل الدخول:

1. في الموقع، اضغط **"تسجيل الدخول"**
2. أدخل:
   - البريد: `admin@roads.gov.sa`
   - كلمة المرور: `Admin@123456`
3. ✅ يجب أن تدخل للوحة التحكم

### اختبار إنشاء مشروع:

1. اذهب إلى **"المشاريع"**
2. اضغط **"مشروع جديد"**
3. املأ جميع الحقول (15 حقل)
4. احفظ
5. ✅ يجب أن يظهر Toast أخضر: "تم حفظ المشروع بنجاح"
6. ✅ يجب أن يظهر المشروع في القائمة

### اختبار التقرير اليومي:

1. اذهب إلى **"التقارير اليومية"**
2. اختر المشروع الذي أنشأته
3. اضغط **"تقرير يومي جديد"**
4. ✅ تحقق من Header الأخضر مع بيانات المشروع التلقائية
5. املأ الحقول
6. أضف بند أو أكثر
7. احفظ
8. ✅ يجب أن يُحفظ التقرير بنجاح

---

## ✅ Checklist النهائي

### قبل الإطلاق الرسمي:

- [ ] ✅ الكود مرفوع على GitHub
- [ ] ✅ Supabase مُعد ويعمل
- [ ] ✅ Edge Functions مرفوعة
- [ ] ✅ Vercel مُعد ويعمل
- [ ] ✅ Environment Variables محددة
- [ ] ✅ تسجيل الدخول يعمل
- [ ] ✅ إنشاء مشروع يعمل
- [ ] ✅ إنشاء تقرير يعمل
- [ ] ✅ رفع الملفات يعمل
- [ ] ✅ جميع الصفحات تفتح
- [ ] ✅ Dark mode يعمل
- [ ] ✅ اللغة العربية والإنجليزية تعمل
- [ ] ✅ Responsive على الهاتف والتابلت

---

## 🔧 استكشاف الأخطاء

### مشكلة: "Failed to fetch"

**الحل**:
1. تأكد من أن Edge Function مرفوعة:
   ```bash
   supabase functions list
   ```
2. تأكد من Environment Variables في Supabase

### مشكلة: "Invalid API key"

**الحل**:
1. تحقق من `/utils/supabase/info.tsx`
2. تأكد من نسخ المفاتيح بشكل صحيح
3. تأكد من Environment Variables في Vercel

### مشكلة: "Build failed" في Vercel

**الحل**:
1. تحقق من Build Logs في Vercel
2. تأكد من:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. تأكد من عدم وجود أخطاء TypeScript

### مشكلة: الخطوط لا تظهر

**الحل**:
1. تحقق من اتصال الإنترنت (الخطوط من Google Fonts)
2. افتح Dev Tools → Network → تحقق من تحميل الخطوط
3. تحقق من `/styles/globals.css` السطر 1-2

---

## 📊 المراقبة والصيانة

### Vercel Analytics:

1. في Vercel Dashboard → **Analytics**
2. تابع:
   - عدد الزوار
   - أوقات التحميل
   - الأخطاء

### Supabase Logs:

1. في Supabase Dashboard → **Edge Functions** → **Logs**
2. تابع:
   - API Requests
   - Errors
   - Performance

### Backups:

1. في Supabase Dashboard → **Database** → **Backups**
2. قم بعمل Backup يومي/أسبوعي
3. احفظ نسخة محلية

---

## 🚀 التحديثات المستقبلية

### لإضافة ميزة جديدة:

```bash
# إنشاء branch جديد
git checkout -b feature/new-feature

# قم بالتعديلات...

# Commit
git add .
git commit -m "Add new feature"

# Push
git push origin feature/new-feature

# في GitHub، افتح Pull Request
# بعد المراجعة، قم بـ Merge
```

Vercel سيقوم بـ Deploy تلقائياً عند كل Push إلى `main` branch!

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. راجع Documentation في `/`
2. افتح Issue على GitHub
3. تواصل مع الدعم الفني

---

</div>

## 🎉 تهانينا!

<div align="center">

### ✅ **المشروع الآن مباشر على الإنترنت!**

🌐 **الموقع**: https://saudi-roads-system.vercel.app  
💾 **GitHub**: https://github.com/YOUR_USERNAME/saudi-roads-system  
☁️ **Supabase**: https://app.supabase.com/project/YOUR_PROJECT_ID

---

### 🇸🇦 **بالتوفيق!**

**نظام إدارة مشاريع الطرق السعودية**  
**الهيئة العامة للطرق - المملكة العربية السعودية**

</div>
