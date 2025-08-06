require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');
const mealRoutes = require('./routes/mealRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// تعطيل CORS تماماً - السماح لجميع المصادر
app.use(cors());

// الوسائط (Middleware)
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// إضافة Prisma إلى الطلبات
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// المسارات
app.use('/api/contact', contactRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/meals', mealRoutes);

// مسار الاختبار
app.get('/', (req, res) => {
  res.json({ message: 'مرحباً بك في خادم Evolve API' });
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});

// إغلاق Prisma عند إيقاف الخادم
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});