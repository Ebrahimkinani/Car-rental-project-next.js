# إعداد قاعدة البيانات - Database Setup

## نظرة عامة - Overview

هذا الدليل يوضح كيفية إعداد قاعدة البيانات MongoDB للمشروع مع البيانات التجريبية والصور المجانية.

This guide explains how to set up the MongoDB database for the project with sample data and free online images.

## المتطلبات - Prerequisites

- Node.js (v18 أو أحدث)
- MongoDB (محلي أو Atlas)
- npm أو yarn

## الإعداد السريع - Quick Setup

### 1. تثبيت التبعيات - Install Dependencies

```bash
npm install
```

### 2. إعداد متغيرات البيئة - Environment Variables

انسخ ملف الإعدادات:

```bash
cp env.local.example .env.local
```

قم بتعديل `.env.local` حسب احتياجاتك:

```env
MONGODB_URI=mongodb://localhost:27017/car_rental
MONGODB_DB=car_rental
NODE_ENV=development
```

### 3. تشغيل MongoDB - Start MongoDB

#### خيار 1: MongoDB محلي - Local MongoDB

```bash
# تشغيل MongoDB محلياً
mongod --dbpath /path/to/your/db

# أو باستخدام Homebrew (macOS)
brew services start mongodb-community
```

#### خيار 2: Docker - Docker

```bash
# تشغيل MongoDB باستخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### خيار 3: MongoDB Atlas - MongoDB Atlas

استخدم connection string من MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car_rental
```

### 4. اختبار الاتصال - Test Connection

```bash
# اختبار الاتصال بقاعدة البيانات
npm run test-db
```

### 5. تهيئة قاعدة البيانات - Initialize Database

```bash
# تهيئة قاعدة البيانات مع البيانات التجريبية
npm run init-db
```

أو تشغيل كلا الأمرين معاً:

```bash
# اختبار الاتصال وتهيئة قاعدة البيانات
npm run setup-db
```

### 6. تشغيل التطبيق - Start Application

```bash
# تشغيل التطبيق في وضع التطوير
npm run dev
```

## API Endpoints - API Endpoints

### تهيئة قاعدة البيانات - Database Initialization

```bash
# POST - تهيئة قاعدة البيانات
curl -X POST http://localhost:3000/api/init-db

# GET - فحص حالة قاعدة البيانات
curl -X GET http://localhost:3000/api/init-db
```

## البيانات التجريبية - Sample Data

### الفئات - Categories

- BMW
- Mercedes-Benz
- Audi
- Porsche
- Tesla
- Toyota
- Honda
- Ford

### السيارات - Cars

- BMW X5 (SUV)
- Mercedes-Benz C-Class (Sedan)
- Audi A4 (Sedan)
- Tesla Model 3 (Electric)
- Porsche 911 (Sports Car)
- Toyota Camry (Sedan)

## الصور - Images

جميع الصور تستخدم من Unsplash (مجانية):

- صور العلامات التجارية: 400x300 بكسل
- صور السيارات: 800x600 بكسل
- جميع الصور محسنة للويب مع معاملات تحسين

## استكشاف الأخطاء - Troubleshooting

### خطأ الاتصال - Connection Error

```bash
# تحقق من حالة MongoDB
brew services list | grep mongo

# أو للـ Docker
docker ps | grep mongo
```

### خطأ في الصلاحيات - Permission Error

```bash
# تأكد من صلاحيات المجلد
sudo chown -R $(whoami) /usr/local/var/mongodb
```

### خطأ في متغيرات البيئة - Environment Variables Error

```bash
# تحقق من ملف .env.local
cat .env.local

# تأكد من وجود MONGODB_URI
echo $MONGODB_URI
```

## هيكل قاعدة البيانات - Database Structure

### Collection: categories

```javascript
{
  _id: ObjectId,
  name: String,
  code: String,
  slug: String,
  status: "Active" | "Hidden",
  sortOrder: Number,
  description: String,
  imageUrl: String,
  country: String,
  founded: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: cars

```javascript
{
  _id: ObjectId,
  name: String,
  model: String,
  brand: String,
  categoryId: ObjectId,
  description: String,
  price: Number,
  seats: Number,
  doors: Number,
  images: [String],
  year: Number,
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid",
  transmission: "manual" | "automatic",
  available: Boolean,
  status: "available" | "rented" | "maintenance" | "reserved",
  createdAt: Date,
  updatedAt: Date
}
```

## الأوامر المفيدة - Useful Commands

```bash
# فحص حالة قاعدة البيانات
npm run test-db

# إعادة تهيئة قاعدة البيانات
npm run init-db

# تشغيل التطبيق
npm run dev

# بناء التطبيق للإنتاج
npm run build

# تشغيل التطبيق في الإنتاج
npm run start
```

## الدعم - Support

إذا واجهت أي مشاكل، تأكد من:

1. MongoDB يعمل بشكل صحيح
2. متغيرات البيئة صحيحة
3. الاتصال بالإنترنت متاح (للصور)
4. المنافذ متاحة (27017 لـ MongoDB، 3000 للتطبيق)

For support, make sure:

1. MongoDB is running correctly
2. Environment variables are correct
3. Internet connection is available (for images)
4. Ports are available (27017 for MongoDB, 3000 for the app)
