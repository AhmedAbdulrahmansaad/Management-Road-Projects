# ⚡ دليل البدء السريع

<div dir="rtl">

## 🎯 في 5 دقائق فقط!

---

## 📦 الخطوة 1: فك الضغط (30 ثانية)

```bash
# فك ضغط الملف
unzip management-road-projects.zip
cd management-road-projects
```

أو: انقر مرتين على الملف في Windows/Mac

---

## 📥 الخطوة 2: تثبيت المكتبات (2 دقيقة)

```bash
npm install
```

انتظر حتى ينتهي التحميل...

---

## 🔐 الخطوة 3: إعداد Supabase (1 دقيقة)

### 1. انسخ ملف .env:
```bash
cp .env.example .env
```

### 2. احصل على Supabase Keys:
1. اذهب إلى [supabase.com](https://supabase.com)
2. سجّل دخول وافتح مشروعك
3. اذهب إلى **Settings** → **API**
4. انسخ:
   - **Project URL**
   - **anon/public key**

### 3. عدّل ملف .env:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🚀 الخطوة 4: تشغيل المشروع (10 ثواني)

```bash
npm run dev
```

سيفتح المتصفح تلقائياً على: `http://localhost:3000`

---

## ✅ تحقق من العمل

يجب أن ترى:
- ✅ الصفحة الرئيسية بألوان سعودية
- ✅ الخطوط العربية واضحة
- ✅ زر تبديل اللغة يعمل
- ✅ الوضع الليلي يعمل

---

## 🎉 تهانينا!

المشروع يعمل الآن على جهازك! 🎊

---

## 📚 الخطوات التالية

### للنشر على Vercel:
راجع: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### للرفع على GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/management-road-projects.git
git push -u origin main
```

### لإنشاء مستخدم:
راجع: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) القسم الخاص بـ signup

---

</div>

## 🆘 مساعدة؟

إذا واجهت مشكلة:
1. راجع [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
2. راجع [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
3. تأكد من Node.js 18+

---

<div align="center">

### 🇸🇦 **بالتوفيق!**

**Management Road Projects**  
**نظام إدارة مشاريع الطرق السعودية**

</div>
