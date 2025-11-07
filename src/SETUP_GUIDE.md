# 🚀 دليل التثبيت والتشغيل | Setup & Installation Guide

## نظام إدارة مشاريع الطرق السعودية

---

## 📋 المتطلبات الأساسية | Prerequisites

قبل البدء، تأكد من تثبيت:
- **Node.js**: الإصدار 18 أو أحدث
- **npm** أو **yarn**: لإدارة الحزم
- **حساب Supabase**: للخلفية وقاعدة البيانات

---

## 🔧 خطوات التثبيت | Installation Steps

### الخطوة 1: استنساخ المشروع

```bash
# Clone the repository
git clone https://github.com/yourusername/saudi-roads-system.git

# Navigate to the project directory
cd saudi-roads-system
```

### الخطوة 2: تثبيت المكتبات

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### الخطوة 3: إعداد Supabase

#### 3.1 إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. قم بإنشاء حساب جديد (إذا لم يكن لديك)
3. اضغط على "New Project"
4. أدخل:
   - **Name**: Saudi Roads System
   - **Database Password**: كلمة مرور قوية (احفظها!)
   - **Region**: اختر أقرب منطقة (مثل: Singapore أو Frankfurt)
5. اضغط "Create new project"
6. انتظر حتى يتم إنشاء المشروع (1-2 دقيقة)

#### 3.2 الحصول على المفاتيح

1. اذهب إلى **Settings** > **API**
2. انسخ القيم التالية:
   - **Project URL**: مثل `https://xxx.supabase.co`
   - **anon public**: المفتاح العام
   - **service_role**: المفتاح الخاص (احفظه بأمان!)

#### 3.3 إنشاء ملف البيئة

قم بإنشاء ملف باسم `.env` في جذر المشروع:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

⚠️ **مهم جداً**: لا ترفع ملف `.env` إلى GitHub!

### الخطوة 4: نشر Edge Functions

#### 4.1 تثبيت Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Or using Homebrew (macOS)
brew install supabase/tap/supabase
```

#### 4.2 تسجيل الدخول

```bash
# Login to Supabase
supabase login
```

سيفتح متصفح للمصادقة. أكمل عملية تسجيل الدخول.

#### 4.3 ربط المشروع

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref
```

**ملاحظة**: يمكنك العثور على `project-ref` في URL المشروع:
`https://[project-ref].supabase.co`

#### 4.4 نشر الـ Functions

```bash
# Deploy the server function
supabase functions deploy make-server-92709448
```

انتظر حتى يتم النشر بنجاح ✅

#### 4.5 تعيين الـ Secrets

```bash
# Set environment variables for the function
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### الخطوة 5: إعداد قاعدة البيانات

#### 5.1 إنشاء الجدول

اذهب إلى **SQL Editor** في Supabase Dashboard وقم بتشغيل:

```sql
-- Create Key-Value Store Table
CREATE TABLE IF NOT EXISTS kv_store_92709448 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE kv_store_92709448 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON kv_store_92709448
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_92709448(key);
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_92709448(key text_pattern_ops);
```

#### 5.2 إنشاء Storage Bucket

اذهب إلى **Storage** في Supabase Dashboard:

1. اضغط "Create a new bucket"
2. **Name**: `make-92709448-roads-files`
3. **Public bucket**: غير مفعل (خاص)
4. اضغط "Create bucket"

أو استخدم SQL:

```sql
-- سيتم إنشاءه تلقائياً من Edge Function
-- ولكن يمكنك إنشاءه يدوياً إذا لزم الأمر
```

---

## 🎯 تشغيل المشروع | Running the Project

### تشغيل في وضع التطوير

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev
```

افتح المتصفح على: `http://localhost:5173`

### بناء للإنتاج

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 👤 إنشاء أول مستخدم | Creating First User

### الطريقة 1: من خلال الواجهة

1. افتح الصفحة الرئيسية
2. اضغط "ابدأ الآن"
3. اختر تبويب "حساب جديد"
4. أدخل البيانات:
   - **الاسم الكامل**: مثل "أحمد محمد"
   - **البريد الإلكتروني**: مثل "admin@mot.gov.sa"
   - **كلمة المرور**: كلمة مرور قوية (min 6 أحرف)
   - **المسمى الوظيفي**: اختر "مدير عام"
5. اضغط "إنشاء حساب"

### الطريقة 2: من خلال API

استخدم cURL أو Postman:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-92709448/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "admin@mot.gov.sa",
    "password": "SecurePassword123",
    "name": "أحمد محمد",
    "role": "general_manager"
  }'
```

### الطريقة 3: من Supabase Dashboard

1. اذهب إلى **Authentication** > **Users**
2. اضغط "Add user" > "Create new user"
3. أدخل:
   - **Email**: admin@mot.gov.sa
   - **Password**: كلمة مرور قوية
   - **Auto Confirm User**: مفعّل ✓
4. بعد الإنشاء، اضغط على المستخدم
5. اذهب إلى **User Metadata**
6. أضف:
```json
{
  "name": "أحمد محمد",
  "role": "general_manager"
}
```
7. احفظ التغييرات

---

## 🔐 تسجيل الدخول | Login

1. افتح الصفحة الرئيسية
2. اضغط "ابدأ الآن" أو "تسجيل الدخول"
3. أدخل:
   - **البريد الإلكتروني**: admin@mot.gov.sa
   - **كلمة المرور**: كلمة المرور التي أنشأتها
4. اضغط "دخول"

---

## 🎨 تخصيص النظام | Customization

### تغيير الألوان

قم بتعديل `/styles/globals.css`:

```css
:root {
  --primary: #006C35;        /* اللون الأخضر السعودي */
  --primary-hover: #005028;  /* أغمق قليلاً */
  --secondary: #F97316;      /* البرتقالي */
  --secondary-hover: #ea580c; /* أغمق قليلاً */
}
```

### تغيير حجم الخط

في `/styles/globals.css`:

```css
:root {
  --font-size: 18px;  /* غيّر هذا الرقم */
}
```

### تغيير اللغة الافتراضية

في `/components/ThemeProvider.tsx`:

```typescript
const [language, setLanguage] = useState<Language>('ar'); // أو 'en'
```

---

## 🐛 حل المشاكل | Troubleshooting

### مشكلة: لا يمكن تسجيل الدخول

**الحل:**
1. تأكد من أن Edge Function تم نشرها بنجاح
2. تحقق من أن Secrets تم تعيينها بشكل صحيح
3. تحقق من console في المتصفح للأخطاء

### مشكلة: "Failed to fetch projects"

**الحل:**
1. تحقق من أن الـ API endpoint صحيح
2. تحقق من أن الـ access token صالح
3. تحقق من console الـ Edge Function في Supabase

### مشكلة: لا يمكن رفع الصور

**الحل:**
1. تأكد من إنشاء Storage Bucket
2. تحقق من أن الـ bucket اسمه `make-92709448-roads-files`
3. تحقق من صلاحيات الـ bucket

### مشكلة: الخط العربي لا يظهر

**الحل:**
1. تأكد من الاتصال بالإنترنت (لتحميل Google Fonts)
2. تحقق من `/styles/globals.css` أن السطر الأول موجود:
```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
```

### مشكلة: CORS Error

**الحل:**
تأكد من أن Edge Function يحتوي على:
```typescript
app.use('*', cors());
```

---

## 📊 اختبار النظام | Testing

### 1. اختبار المصادقة

- ✅ تسجيل مستخدم جديد
- ✅ تسجيل الدخول
- ✅ تسجيل الخروج
- ✅ الجلسة المستمرة

### 2. اختبار المشاريع

- ✅ إضافة مشروع جديد
- ✅ تعديل مشروع
- ✅ حذف مشروع (مدير عام فقط)
- ✅ عرض قائمة المشاريع

### 3. اختبار التقارير

- ✅ إضافة تقرير يومي
- ✅ رفع صور
- ✅ الموافقة على تقرير (مدير)
- ✅ عرض التقارير

### 4. اختبار الثيمات

- ✅ التبديل بين الفاتح والداكن
- ✅ حفظ الإعداد
- ✅ التبديل بين العربية والإنجليزية

---

## 🚀 النشر | Deployment

### Vercel (موصى به)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### ضبط المتغيرات البيئية

لا تنسى إضافة المتغيرات في لوحة التحكم:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 📱 الاستخدام | Usage

### للمديرين:

1. **لوحة التحكم**: عرض الإحصائيات الشاملة
2. **المشاريع**: إضافة وتعديل المشاريع
3. **التقارير**: الموافقة على التقارير اليومية
4. **التقارير المتقدمة**: تصدير التقارير

### للمهندسين:

1. **لوحة التحكم**: متابعة المشاريع
2. **التقارير اليومية**: إضافة تقارير يومية
3. **المساعد الذكي**: الحصول على مساعدة

### للمراقبين:

1. **لوحة التحكم**: عرض الإحصائيات
2. **المشاريع**: عرض المشاريع فقط
3. **التقارير**: عرض التقارير فقط

---

## 📞 الدعم | Support

### للمساعدة:

- 📧 **Email**: support@rga.gov.sa
- 📱 **Phone**: +966 11 XXX XXXX
- 🌐 **Website**: www.rga.gov.sa
- 📖 **Documentation**: اقرأ ملفات:
  - `README.md`
  - `USER_GUIDE.md`
  - `API_DOCUMENTATION.md`

### الإبلاغ عن مشاكل:

1. تحقق من `CHANGELOG.md` للمشاكل المعروفة
2. ابحث في Issues الموجودة
3. أنشئ Issue جديد مع:
   - وصف المشكلة
   - خطوات إعادة إنتاج المشكلة
   - لقطات شاشة (إن أمكن)
   - رسائل الخطأ

---

## ✅ قائمة التحقق | Checklist

قبل البدء، تأكد من:

- [ ] تثبيت Node.js 18+
- [ ] تثبيت npm أو yarn
- [ ] إنشاء حساب Supabase
- [ ] إنشاء مشروع Supabase
- [ ] نسخ المفاتيح (URL, anon key, service role key)
- [ ] إنشاء ملف `.env`
- [ ] تثبيت المكتبات (`npm install`)
- [ ] تثبيت Supabase CLI
- [ ] تسجيل الدخول لـ Supabase CLI
- [ ] ربط المشروع (`supabase link`)
- [ ] نشر Edge Functions
- [ ] تعيين Secrets
- [ ] إنشاء جدول قاعدة البيانات
- [ ] إنشاء Storage Bucket
- [ ] إنشاء أول مستخدم
- [ ] تسجيل الدخول
- [ ] اختبار المميزات

---

## 🎉 مبروك!

الآن النظام جاهز للاستخدام! 🚀

استمتع بإدارة مشاريع الطرق بكفاءة واحترافية. 🇸🇦

---

<div align="center">

**نظام إدارة مشاريع الطرق السعودية**

© 2025 الهيئة العامة للطرق - المملكة العربية السعودية

**صُنع بـ ❤️ في المملكة العربية السعودية 🇸🇦**

</div>
