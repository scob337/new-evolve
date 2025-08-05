const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// استيراد المسارات
const contactRoutes = require('./routes/contactRoutes');
const registerRoutes = require('./routes/registerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// الوسائط (Middleware)
app.use(helmet());
app.use(cors({
  origin: [
    'https://evolvetheapp.com',
    'https://www.evolvetheapp.com',
    'http://localhost:3000', // للتطوير المحلي
    'http://localhost:5173'  // للتطوير مع Vite
  ],
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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