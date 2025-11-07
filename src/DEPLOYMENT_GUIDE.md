# 🚀 دليل نشر نظام إدارة مشاريع الطرق السعودية

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من وجود:
- ✅ حساب GitHub
- ✅ حساب Vercel (مجاني)
- ✅ حساب Supabase (مجاني)
- ✅ Git مثبت على جهازك

---

## 🗂️ الخطوة 1: تجهيز المشروع على GitHub

### 1.1 إنشاء Repository جديد

```bash
# افتح Terminal في مجلد المشروع
cd /path/to/your/project

# تهيئة Git (إذا لم يكن مهيأ)
git init

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit - Saudi Roads Management System"

# إنشاء branch رئيسي
git branch -M main
```

### 1.2 رفع المشروع إلى GitHub

```bash
# اذهب إلى github.com وأنشئ repository جديد
# اسم Repository المقترح: saudi-roads-management

# ربط المشروع مع GitHub
git remote add origin https://github.com/YOUR_USERNAME/saudi-roads-management.git

# رفع الكود
git push -u origin main
```

**ملاحظة مهمة:** 
- ✅ اسم المشروع يجب أن يكون بالإنجليزية فقط (بدون رموز عربية)
- ✅ تأكد من عدم رفع ملف `.env` للأمان

---

## 🗄️ الخطوة 2: إعداد قاعدة البيانات Supabase

### 2.1 إنشاء مشروع Supabase جديد

1. اذهب إلى: https://supabase.com
2. سجل دخول أو أنشئ حساب جديد
3. اضغط **"New Project"**
4. املأ البيانات:
   - **Name:** saudi-roads-management
   - **Database Password:** اختر كلمة مرور قوية واحفظها!
   - **Region:** اختر أقرب منطقة (مثل: Frankfurt أو Singapore)
5. اضغط **"Create new project"**
6. انتظر 2-3 دقائق حتى يتم إنشاء المشروع

### 2.2 الحصول على API Keys

بعد إنشاء المشروع:

1. اذهب إلى **Settings** → **API**
2. احفظ المعلومات التالية:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (سري جداً!)
```

### 2.3 إنشاء جدول المستخدمين

1. اذهب إلى **SQL Editor**
2. انسخ والصق هذا الكود:

```sql
-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('general_manager', 'project_manager', 'engineer', 'observer')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول KV Store
CREATE TABLE IF NOT EXISTS kv_store_92709448 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إضافة index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_92709448(key);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- إنشاء مستخدم مدير عام افتراضي
-- كلمة المرور: Admin@123
INSERT INTO users (email, name, role, password_hash)
VALUES (
  'admin@roads.sa',
  'المدير العام',
  'general_manager',
  '$2a$10$X9kqZvJxGqYxQqXqXqXqXuKJ.LPZJxYxYxYxYxYxYxYxYxYxYxYxY'
)
ON CONFLICT (email) DO NOTHING;

-- تفعيل Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_store_92709448 ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول
CREATE POLICY "Allow read access to all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow all access to kv_store" ON kv_store_92709448
  USING (true);
```

3. اضغط **"Run"**
4. تأكد من ظهور رسالة نجاح

### 2.4 إعداد Supabase Storage

1. اذهب إلى **Storage**
2. اضغط **"Create bucket"**
3. أنشئ 3 buckets:
   - **Name:** `make-92709448-projects`
   - **Public bucket:** ❌ (خاص)
   - اضغط **"Create bucket"**
4. كرر نفس الخطوات لـ:
   - `make-92709448-reports`
   - `make-92709448-daily-reports`

---

## ☁️ الخطوة 3: رفع Edge Functions إلى Supabase

### 3.1 تثبيت Supabase CLI

```bash
# على macOS
brew install supabase/tap/supabase

# على Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# على Linux
brew install supabase/tap/supabase
```

### 3.2 تسجيل الدخول والربط

```bash
# تسجيل الدخول
supabase login

# سيفتح متصفح - سجل دخول بحساب Supabase

# ربط المشروع
supabase link --project-ref YOUR_PROJECT_REF

# احصل على PROJECT_REF من Supabase Dashboard
# Settings → General → Reference ID
```

### 3.3 نشر Edge Functions

```bash
# انتقل لمجلد المشروع
cd /path/to/your/project

# نشر Server Function
supabase functions deploy make-server-92709448 --no-verify-jwt

# انتظر حتى تكتمل العملية
# ستظهر رسالة: ✅ Deployed Function make-server-92709448
```

### 3.4 إضافة Environment Variables للـ Edge Function

1. اذهب إلى Supabase Dashboard
2. **Edge Functions** → **make-server-92709448** → **Settings**
3. أضف المتغيرات:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role key)
SUPABASE_DB_URL=postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**للحصول على DATABASE_URL:**
- **Settings** → **Database** → **Connection string** → **URI**
- استبدل `[YOUR-PASSWORD]` بكلمة مرور قاعدة البيانات

---

## 🌐 الخطوة 4: نشر Frontend على Vercel

### 4.1 إعداد ملف package.json

تأكد من وجود هذه السكريبتات في `package.json`:

```json
{
  "name": "saudi-roads-management",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

### 4.2 إنشاء ملف vercel.json

أنشئ ملف `vercel.json` في المجلد الرئيسي:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 4.3 النشر على Vercel

#### الطريقة 1: عبر Vercel Dashboard (الأسهل)

1. اذهب إلى: https://vercel.com
2. سجل دخول أو أنشئ حساب (يمكنك استخدام حساب GitHub)
3. اضغط **"Add New..."** → **"Project"**
4. اختر **"Import Git Repository"**
5. اختر repository الخاص بك: `saudi-roads-management`
6. اضغط **"Import"**

**إعدادات المشروع:**

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

7. أضف **Environment Variables**:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

8. اضغط **"Deploy"**
9. انتظر 2-3 دقائق

#### الطريقة 2: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# اتبع التعليمات:
# - Set up and deploy? Yes
# - Which scope? (اختر حسابك)
# - Link to existing project? No
# - Project name? saudi-roads-management
# - Directory? ./
# - Override settings? No

# سيتم النشر تلقائياً
```

### 4.4 إضافة Environment Variables

بعد النشر:

1. اذهب إلى Vercel Dashboard
2. اختر المشروع **"saudi-roads-management"**
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف:

```
Name: VITE_SUPABASE_URL
Value: https://xxxxx.supabase.co
Environments: Production, Preview, Development

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGc...
Environments: Production, Preview, Development
```

5. اضغط **"Save"**
6. اذهب إلى **Deployments**
7. اضغط على آخر deployment
8. اضغط **"Redeploy"** لتطبيق المتغيرات

---

## 🔐 الخطوة 5: إنشاء ملف info.tsx

أنشئ ملف `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'YOUR_PROJECT_ID'; // من Supabase URL: xxxxx.supabase.co
export const publicAnonKey = 'YOUR_ANON_KEY';
```

**احصل على PROJECT_ID من:**
- Supabase URL: `https://xxxxx.supabase.co`
- PROJECT_ID = `xxxxx`

---

## ✅ الخطوة 6: التحقق من النشر

### 6.1 فحص Frontend

1. افتح رابط Vercel: `https://saudi-roads-management.vercel.app`
2. يجب أن تظهر صفحة تسجيل الدخول
3. جرب تسجيل الدخول:
   - **Email:** admin@roads.sa
   - **Password:** Admin@123

### 6.2 فحص Backend

افتح Console في المتصفح (F12):

```javascript
// اختبار Edge Function
fetch('https://xxxxx.supabase.co/functions/v1/make-server-92709448/projects', {
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(console.log)
```

يجب أن ترى:
```json
{
  "projects": []
}
```

### 6.3 فحص Storage

1. جرب إنشاء مشروع جديد
2. ارفع صورة
3. تحقق من Supabase Dashboard → Storage
4. يجب أن تظهر الصورة في bucket المناسب

---

## 🔄 الخطوة 7: التحديثات المستقبلية

### 7.1 تحديث الكود

```bash
# عدل الكود محلياً
# ثم:
git add .
git commit -m "وصف التحديث"
git push origin main

# Vercel سيقوم بالنشر تلقائياً!
```

### 7.2 تحديث Edge Functions

```bash
# بعد تعديل ملفات /supabase/functions/server/
supabase functions deploy make-server-92709448 --no-verify-jwt
```

---

## 🎨 الخطوة 8: إعداد Domain مخصص (اختياري)

### 8.1 عبر Vercel

1. اذهب إلى Project → **Settings** → **Domains**
2. اضغط **"Add"**
3. أدخل النطاق: `roads.sa` أو `roads.gov.sa`
4. اتبع التعليمات لإضافة DNS Records

### 8.2 DNS Records المطلوبة

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔒 الخطوة 9: إعداد أمان إضافي

### 9.1 تفعيل HTTPS

✅ Vercel يفعل HTTPS تلقائياً

### 9.2 إضافة Rate Limiting

في Supabase Edge Function:

```typescript
// في /supabase/functions/server/index.tsx
import { rateLimiter } from 'hono/rate-limiter'

app.use(
  '*',
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // 100 طلب
    message: 'Too many requests'
  })
)
```

### 9.3 تحديث كلمة مرور المدير

```sql
-- في Supabase SQL Editor
UPDATE users
SET password_hash = crypt('كلمة_المرور_الجديدة', gen_salt('bf'))
WHERE email = 'admin@roads.sa';
```

---

## 📊 الخطوة 10: المراقبة والصيانة

### 10.1 مراقبة Vercel

- **Analytics:** Vercel Dashboard → Analytics
- **Logs:** Deployments → View Function Logs

### 10.2 مراقبة Supabase

- **Database:** Database → Table Editor
- **Storage:** Storage → Buckets
- **Edge Functions:** Edge Functions → Logs

### 10.3 Backup قاعدة البيانات

```bash
# تحميل backup
supabase db dump -f backup.sql

# استعادة backup
supabase db reset
psql -h db.xxxxx.supabase.co -U postgres -f backup.sql
```

---

## 🎯 الخلاصة والروابط المهمة

### ✅ بعد إكمال جميع الخطوات:

- ✅ Frontend منشور على: `https://saudi-roads-management.vercel.app`
- ✅ Backend (Edge Functions) يعمل على Supabase
- ✅ قاعدة البيانات جاهزة
- ✅ Storage جاهز لرفع الملفات
- ✅ تحديثات تلقائية عبر Git

### 🔗 روابط مفيدة:

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs

### 📞 الدعم الفني:

- **Vercel Discord:** https://vercel.com/discord
- **Supabase Discord:** https://discord.supabase.com

---

## ⚠️ ملاحظات مهمة جداً

1. ✅ **لا تشارك** `service_role_key` أبداً
2. ✅ **احفظ** كلمة مرور قاعدة البيانات في مكان آمن
3. ✅ **غير** كلمة مرور المدير الافتراضية فوراً
4. ✅ **فعّل** Two-Factor Authentication في Vercel و Supabase
5. ✅ **اعمل backup** دوري لقاعدة البيانات

---

## 🎉 مبروك! المشروع منشور بنجاح!

الآن نظام إدارة مشاريع الطرق السعودية يعمل على الإنترنت ويمكن لفريقك استخدامه من أي مكان! 🚀
