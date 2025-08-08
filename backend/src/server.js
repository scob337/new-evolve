import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import contactRoutes from './routes/contactRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// إعداد CORS للسماح بالوصول من أي مكان
// إعداد CORS للإنتاج
const allowedOrigins = [
  'https://www.evolvetheapp.com',
  'https://evolvetheapp.com',
  'http://localhost:3000', // للتطوير المحلي
  'http://localhost:5173'  // للتطوير المحلي مع Vite
];

app.use(cors({
  origin: function (origin, callback) {
    // السماح بالطلبات بدون origin (مثل تطبيقات الموبايل)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('غير مسموح بواسطة CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// إضافة headers إضافية لضمان عدم وجود قيود CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// إعداد CORS للسماح بالوصول من أي مكان بدون قيود
app.use(cors({
  origin: '*', // السماح بالوصول من أي مكان
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
  credentials: true
}));

// تم إزالة الوسيط الذي يضيف headers إضافية

// الوسائط (Middleware)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// إضافة Prisma إلى الطلبات
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// إضافة هذا الكود بعد تعريف الوسائط (Middleware) وقبل تعريف المسارات

// تكوين الملفات الثابتة
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// المسارات
app.use('/api/contact', contactRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/auth', authRoutes);

// مسار الاختبار
app.get('/', (req, res) => {
  res.json({ 
    message: 'مرحباً بك في خادم Evolve API',
    version: '2.0.0',
    status: 'running',
    cors: 'disabled - accessible from anywhere'
  });
});

// مسار صحة النظام
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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

// معالجة المسارات غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    path: req.originalUrl
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`🌐 CORS معطل - يمكن الوصول من أي مكان`);
  console.log(`📡 API متاح على: http://localhost:${PORT}`);
});

// إغلاق Prisma عند إيقاف الخادم
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('\n🛑 إيقاف الخادم...');
  await prisma.$disconnect();
  process.exit(0);
});