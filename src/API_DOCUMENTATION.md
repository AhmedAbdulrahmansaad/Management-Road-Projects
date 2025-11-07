# 📡 API Documentation | توثيق API

## نظرة عامة | Overview

هذا التوثيق يشرح جميع API endpoints المتاحة في نظام إدارة مشاريع الطرق السعودية.
This documentation explains all available API endpoints in the Saudi Roads Project Management System.

**Base URL**: `https://{projectId}.supabase.co/functions/v1/make-server-92709448`

**Authentication**: جميع الـ endpoints تتطلب Bearer Token في الـ header
All endpoints require a Bearer Token in the header:
```
Authorization: Bearer {access_token}
```

---

## 🔐 Authentication Endpoints

### 1. Sign Up | تسجيل مستخدم جديد

**POST** `/auth/signup`

إنشاء مستخدم جديد في النظام (يتطلب صلاحيات admin)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "أحمد محمد",
  "role": "engineer"
}
```

**Roles:**
- `general_manager` - مدير عام
- `project_manager` - مدير مشروع
- `engineer` - مهندس
- `observer` - مراقب

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "أحمد محمد",
      "role": "engineer"
    }
  }
}
```

### 2. Get Profile | الحصول على الملف الشخصي

**GET** `/auth/profile`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "أحمد محمد",
      "role": "engineer"
    }
  }
}
```

### 3. Update Profile | تحديث الملف الشخصي

**PUT** `/auth/profile`

**Request Body:**
```json
{
  "name": "أحمد محمد العلي"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "أحمد محمد العلي",
      "role": "engineer"
    }
  }
}
```

---

## 🏗️ Projects Endpoints

### 1. Get All Projects | الحصول على جميع المشاريع

**GET** `/projects`

يحصل على جميع المشاريع بناءً على صلاحيات المستخدم:
- **مدير عام**: جميع المشاريع
- **مدير مشروع / مهندس**: المشاريع التي يشرف عليها فقط
- **مراقب**: جميع المشاريع (قراءة فقط)

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "طريق الرياض - جدة السريع",
      "description": "مشروع إنشاء طريق سريع يربط الرياض بجدة",
      "location": "الرياض - جدة",
      "status": "active",
      "progress": 65,
      "budget": 500000000,
      "startDate": "2024-01-01",
      "endDate": "2025-12-31",
      "createdBy": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

**Status Values:**
- `planning` - تخطيط
- `active` - نشط
- `delayed` - متأخر
- `completed` - مكتمل
- `on_hold` - معلق

### 2. Get Single Project | الحصول على مشروع واحد

**GET** `/projects/:id`

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "name": "طريق الرياض - جدة السريع",
    "description": "مشروع إنشاء طريق سريع يربط الرياض بجدة",
    "location": "الرياض - جدة",
    "status": "active",
    "progress": 65,
    "budget": 500000000,
    "startDate": "2024-01-01",
    "endDate": "2025-12-31"
  }
}
```

### 3. Create Project | إنشاء مشروع جديد

**POST** `/projects`

**Permissions:** مدير عام أو مدير مشروع فقط

**Request Body:**
```json
{
  "name": "طريق الدمام - الجبيل",
  "description": "مشروع توسعة طريق الدمام - الجبيل",
  "location": "الدمام - الجبيل",
  "status": "planning",
  "progress": 0,
  "budget": 300000000,
  "startDate": "2025-03-01",
  "endDate": "2026-12-31"
}
```

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "name": "طريق الدمام - الجبيل",
    "description": "مشروع توسعة طريق الدمام - الجبيل",
    "location": "الدمام - الجبيل",
    "status": "planning",
    "progress": 0,
    "budget": 300000000,
    "startDate": "2025-03-01",
    "endDate": "2026-12-31",
    "createdBy": "uuid",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Project | تحديث مشروع

**PUT** `/projects/:id`

**Permissions:** مدير عام أو مدير مشروع

**Request Body:**
```json
{
  "status": "active",
  "progress": 15,
  "name": "طريق الدمام - الجبيل (محدث)"
}
```

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "name": "طريق الدمام - الجبيل (محدث)",
    "status": "active",
    "progress": 15,
    "updatedAt": "2025-01-15T00:00:00.000Z"
  }
}
```

### 5. Delete Project | حذف مشروع

**DELETE** `/projects/:id`

**Permissions:** مدير عام فقط

**Response:**
```json
{
  "success": true
}
```

---

## 📝 Daily Reports Endpoints

### 1. Get Project Reports | الحصول على تقارير مشروع

**GET** `/projects/:projectId/reports`

**Response:**
```json
{
  "reports": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "date": "2025-01-15",
      "workDescription": "تم صب الخرسانة للجسر الرئيسي",
      "progress": 5,
      "workersCount": 25,
      "equipmentUsed": "خلاطات خرسانة، رافعات",
      "notes": "سير العمل جيد، لا توجد مشاكل",
      "images": [
        "https://signed-url-1.com",
        "https://signed-url-2.com"
      ],
      "status": "approved",
      "createdBy": "uuid",
      "createdByName": "أحمد محمد",
      "createdAt": "2025-01-15T14:30:00.000Z",
      "approvedBy": "uuid",
      "approvedAt": "2025-01-15T16:00:00.000Z"
    }
  ]
}
```

**Report Status:**
- `pending` - قيد المراجعة
- `approved` - معتمد

### 2. Create Daily Report | إنشاء تقرير يومي

**POST** `/projects/:projectId/reports`

**Permissions:** مهندس أو مدير مشروع

**Request Body:**
```json
{
  "date": "2025-01-16",
  "workDescription": "تم الانتهاء من أعمال الحفر في القطاع الأول",
  "progress": 8,
  "workersCount": 30,
  "equipmentUsed": "حفارات، شاحنات نقل",
  "notes": "تم مواجهة طبقة صخرية، تتطلب معدات إضافية",
  "images": [
    "https://signed-url-1.com",
    "https://signed-url-2.com"
  ]
}
```

**Response:**
```json
{
  "report": {
    "id": "uuid",
    "projectId": "uuid",
    "date": "2025-01-16",
    "workDescription": "تم الانتهاء من أعمال الحفر في القطاع الأول",
    "progress": 8,
    "workersCount": 30,
    "equipmentUsed": "حفارات، شاحنات نقل",
    "notes": "تم مواجهة طبقة صخرية، تتطلب معدات إضافية",
    "images": ["..."],
    "status": "pending",
    "createdBy": "uuid",
    "createdByName": "أحمد محمد",
    "createdAt": "2025-01-16T14:00:00.000Z"
  }
}
```

### 3. Update Report Status | تحديث حالة التقرير (الموافقة)

**PUT** `/reports/:reportId/status`

**Permissions:** مدير عام أو مدير مشروع

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response:**
```json
{
  "report": {
    "id": "uuid",
    "status": "approved",
    "approvedBy": "uuid",
    "approvedAt": "2025-01-16T16:00:00.000Z"
  }
}
```

---

## 📁 File Upload Endpoints

### 1. Upload File | رفع ملف

**POST** `/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: الملف المراد رفعه
- `folder`: المجلد (اختياري، افتراضي: "general")

**Response:**
```json
{
  "path": "reports/project-uuid/1705332000000-image.jpg",
  "url": "https://signed-url.com"
}
```

**Supported Folders:**
- `reports/{projectId}` - صور التقارير اليومية
- `projects/{projectId}` - ملفات المشروع
- `general` - ملفات عامة

### 2. Get File URL | الحصول على رابط ملف

**GET** `/files/:path`

**Response:**
```json
{
  "url": "https://signed-url.com"
}
```

**Note:** الرابط صالح لمدة ساعة واحدة

---

## 📊 Statistics Endpoints

### 1. Get Dashboard Statistics | إحصائيات لوحة التحكم

**GET** `/stats`

**Response:**
```json
{
  "stats": {
    "totalProjects": 15,
    "activeProjects": 8,
    "completedProjects": 5,
    "delayedProjects": 2,
    "totalReports": 245,
    "pendingReports": 12,
    "averageProgress": 67,
    "recentActivities": [
      {
        "id": "uuid",
        "workDescription": "تم صب الخرسانة...",
        "status": "approved",
        "createdByName": "أحمد محمد",
        "createdAt": "2025-01-15T14:30:00.000Z"
      }
    ]
  }
}
```

### 2. Get Projects by Status | المشاريع حسب الحالة

**GET** `/stats/projects-by-status`

**Response:**
```json
{
  "data": {
    "planning": 3,
    "active": 8,
    "delayed": 2,
    "completed": 5,
    "onHold": 1
  }
}
```

### 3. Health Check | فحص صحة السيرفر

**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T14:30:00.000Z"
}
```

---

## 🔴 Error Responses | استجابات الأخطاء

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Rate Limiting | حدود الاستخدام

Currently no rate limiting is implemented, but it's recommended to:
- حالياً لا يوجد حد للاستخدام، ولكن يُنصح بـ:
  - Limit requests to 100 per minute per user
  - حد الطلبات إلى 100 طلب في الدقيقة لكل مستخدم
  - Implement retry logic with exponential backoff
  - تنفيذ منطق إعادة المحاولة مع تأخير متصاعد

---

## 🔒 Security Best Practices | أفضل ممارسات الأمان

1. **Always use HTTPS** | دائماً استخدم HTTPS
2. **Store access tokens securely** | احفظ رموز الوصول بشكل آمن
3. **Implement CSRF protection** | نفذ الحماية من CSRF
4. **Validate all user input** | تحقق من جميع مدخلات المستخدم
5. **Use environment variables for sensitive data** | استخدم متغيرات البيئة للبيانات الحساسة
6. **Implement proper error handling** | نفذ معالجة الأخطاء بشكل صحيح
7. **Log security events** | سجل الأحداث الأمنية

---

## 📞 Support | الدعم

للمساعدة والدعم:
For help and support:

- 📧 Email: support@rga.gov.sa
- 📱 Phone: +966 11 XXX XXXX
- 🌐 Website: www.rga.gov.sa

---

<div align="center">

**نظام إدارة مشاريع الطرق السعودية v1.0.0**

© 2025 الهيئة العامة للطرق - المملكة العربية السعودية

</div>
