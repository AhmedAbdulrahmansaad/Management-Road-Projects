# 🚀 دليل النشر على Vercel - خطوة بخطوة

<div dir="rtl">

## ✅ قائمة التحقق السريع

قبل البدء، تأكد من:
- ✅ الكود مرفوع على GitHub
- ✅ حساب Vercel جاهز
- ✅ Supabase URL & Keys جاهزة
- ✅ لا توجد رموز عربية في أسماء الملفات

---

## 📋 معلومات المشروع

**اسم المشروع**: `management-road-projects`  
**Framework**: Vite + React + TypeScript  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Node Version**: 18.x أو أعلى

---

## 🎯 خطوات النشر على Vercel

### الخطوة 1: الدخول إلى Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجّل الدخول بحساب GitHub
3. اضغط **"Add New Project"**

### الخطوة 2: استيراد المشروع من GitHub

1. اختر **"Import Git Repository"**
2. ابحث عن المشروع: `management-road-projects`
3. اضغط **"Import"**

### الخطوة 3: تكوين المشروع

في صفحة Configure Project:

#### Framework Preset:
```
Framework Preset: Vite
```

#### Build & Development Settings:
```
Build Command:        npm run build
Output Directory:     dist
Install Command:      npm install
Development Command:  npm run dev
```

#### Root Directory:
```
Root Directory: ./  (leave as is)
```

### الخطوة 4: إضافة Environment Variables

اضغط على **"Environment Variables"** وأضف:

```env
VITE_SUPABASE_URL
Value: https://YOUR_PROJECT_ID.supabase.co

VITE_SUPABASE_ANON_KEY
Value: eyJhbGc... (your anon key)
```

⚠️ **مهم جداً**:
- لا تضع `SUPABASE_SERVICE_ROLE_KEY` في Vercel
- استخدم فقط `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`

### الخطوة 5: Deploy

1. اضغط **"Deploy"**
2. انتظر 2-3 دقائق للـ Build
3. ✅ سيظهر لك: **"Deployment Ready"**

---

## 🔍 حل المشاكل الشائعة

### مشكلة 1: Build Error - Arabic Characters

**الخطأ**:
```
Error: Invalid character in file name
```

**الحل**:
- ✅ تم حلها! جميع أسماء الملفات الآن بالإنجليزية
- ✅ اسم المشروع: `management-road-projects`
- ✅ لا توجد رموز عربية في المسارات

### مشكلة 2: Module Not Found

**الخطأ**:
```
Error: Cannot find module './App'
```

**الحل**:
1. تأكد من وجود `main.tsx` في الجذر
2. تأكد من وجود `index.html` في الجذر
3. تأكد من تطابق حالة الأحرف (Case-sensitive)

### مشكلة 3: Environment Variables Not Working

**الخطأ**:
```
VITE_SUPABASE_URL is undefined
```

**الحل**:
1. تأكد من البادئة `VITE_` في جميع المتغيرات
2. أعد Deploy بعد إضافة المتغيرات
3. تحقق من Vercel Dashboard → Settings → Environment Variables

### مشكلة 4: Blank Page After Deploy

**الحل**:
1. افتح Browser Console (F12)
2. تحقق من الأخطاء في Console
3. تأكد من أن `index.html` يشير إلى `/main.tsx` بشكل صحيح
4. تأكد من Environment Variables

### مشكلة 5: Font Loading Issues

**الحل**:
- ✅ الخطوط محمّلة من Google Fonts (CDN)
- ✅ لا حاجة لملفات خطوط محلية
- ✅ تحقق من اتصال الإنترنت

---

## 📊 التحقق من نجاح النشر

بعد Deploy، تحقق من:

### 1. الصفحة الرئيسية
- ✅ تفتح بدون أخطاء
- ✅ الشعار السعودي ظاهر
- ✅ الألوان الخضراء والذهبية ظاهرة

### 2. الخطوط
- ✅ الخطوط العربية (Cairo, Tajawal) واضحة
- ✅ لا يوجد تداخل في النصوص
- ✅ RTL يعمل بشكل صحيح

### 3. الوظائف
- ✅ زر تبديل اللغة يعمل
- ✅ الوضع الليلي يعمل
- ✅ جميع الأزرار تعمل

### 4. Supabase
- ✅ تسجيل الدخول يعمل
- ✅ API calls تعمل
- ✅ لا توجد CORS errors

---

## 🔄 التحديثات المستقبلية

### لإضافة تغييرات جديدة:

```bash
# في جهازك المحلي
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel سيقوم بـ Deploy تلقائياً! 🎉

---

## 📱 إعداد Domain مخصص (اختياري)

### الخطوة 1: إضافة Domain

1. في Vercel Dashboard → **Settings** → **Domains**
2. اضغط **"Add"**
3. أدخل domain الخاص بك (مثلاً: `roads.gov.sa`)

### الخطوة 2: تحديث DNS

في مزود الـ Domain الخاص بك، أضف:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### الخطوة 3: التحقق

انتظر 24-48 ساعة للـ DNS propagation، ثم:
- ✅ افتح `https://roads.gov.sa`
- ✅ يجب أن يعمل بشكل تلقائي مع SSL

---

## 🎯 Best Practices

### 1. Build Optimization

في `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': ['lucide-react', 'sonner'],
      },
    },
  },
}
```
✅ هذا موجود بالفعل!

### 2. Environment Variables

- ✅ استخدم `VITE_` prefix دائماً
- ✅ لا تضع API keys حساسة في Frontend
- ✅ استخدم Supabase Service Role Key في Edge Functions فقط

### 3. Performance

- ✅ الخطوط من CDN (Google Fonts)
- ✅ Code splitting enabled
- ✅ Tree shaking enabled
- ✅ Minification enabled

---

## 📈 المراقبة والتحليلات

### Vercel Analytics

1. في Vercel Dashboard → **Analytics**
2. راقب:
   - عدد الزوار
   - أوقات التحميل
   - الأخطاء

### Real User Monitoring

1. اذهب إلى **Settings** → **Analytics**
2. فعّل **Web Analytics**
3. ستظهر إحصائيات مفصلة بعد 24 ساعة

---

## 🎉 تهانينا!

الآن موقعك مباشر على:

🌐 **Production URL**: `https://management-road-projects.vercel.app`

أو Domain المخصص:

🌐 **Custom Domain**: `https://roads.gov.sa`

---

</div>

## 🔗 روابط مفيدة

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)

---

<div align="center">

### 🇸🇦 **بالتوفيق!**

**نظام إدارة مشاريع الطرق السعودية**  
**الهيئة العامة للطرق**

</div>
