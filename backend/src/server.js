const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// إعدادات CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // إضافة منافذ التطوير
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// الوسائط (Middleware)
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// المسارات
app.use('/api/contact', contactRoutes);
app.use('/api/register', registerRoutes);

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