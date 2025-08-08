import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';
import { fileURLToPath } from 'url';

const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// إعداد Multer لرفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/meals');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'meal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('يُسمح فقط بملفات الصور (JPEG, JPG, PNG, GIF, WebP)'));
    }
  }
});

// الحصول على جميع الوجبات (عام)
router.get('/meals', async (req, res) => {
  try {
    const { category, search, sortBy = 'name', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = { isActive: true };

    // فلترة بالفئة
    if (category && category !== 'all') {
      where.category = category;
    }

    // البحث
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // ترتيب
    let orderBy = {};
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { name: 'asc' }; // تغيير من nameAr إلى name
    }

    const [meals, total] = await Promise.all([
      req.prisma.meal.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      req.prisma.meal.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        meals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الوجبات'
    });
  }
});

// الحصول على وجبة واحدة (عام)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await req.prisma.meal.findFirst({
      where: {
        id,
        isActive: true
      }
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'الوجبة غير موجودة'
      });
    }

    res.json({
      success: true,
      data: { meal }
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الوجبة'
    });
  }
});

// إنشاء وجبة جديدة (بدون مصادقة)
router.post('/', [
  upload.single('image'),
  body('name').notEmpty().withMessage('الاسم مطلوب'),
  body('description').notEmpty().withMessage('الوصف مطلوب'),
  body('price').isFloat({ min: 0 }).withMessage('السعر يجب أن يكون رقم موجب'),
  body('category').notEmpty().withMessage('الفئة مطلوبة')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صالحة',
        errors: errors.array()
      });
    }

    const {
      name, description, usage, price, category, calories, prepTime, rating, ingredients
    } = req.body;

    const mealData = {
      name,
      description,
      usage,
      price: parseFloat(price),
      category,
      calories: calories ? parseInt(calories) : null,
      prepTime: prepTime || null,
      rating: rating ? parseFloat(rating) : 4.5,
      isActive: true,
      ingredients: ingredients || null
    };

    if (req.file) {
      mealData.image = `/uploads/meals/${req.file.filename}`;
    } else if (req.body.image) {
      mealData.image = req.body.image;
    }

    const meal = await req.prisma.meal.create({
      data: mealData
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الوجبة بنجاح',
      data: { meal }
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء الوجبة'
    });
  }
});

// تحديث وجبة (بدون مصادقة)
router.put('/:id', [
  upload.single('image')
], async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, usage, price, category, calories, prepTime, rating, isActive, ingredients
    } = req.body;

    // التحقق من وجود الوجبة
    const existingMeal = await req.prisma.meal.findUnique({
      where: { id }
    });

    if (!existingMeal) {
      return res.status(404).json({
        success: false,
        message: 'الوجبة غير موجودة'
      });
    }

    const updateData = {};

    // تحديث البيانات المرسلة فقط
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (usage) {
      updateData.usage = usage;
    }
    if (price !== undefined) {
      updateData.price = parseFloat(price);
    }
    if (category) {
      updateData.category = category;
    }
    if (calories !== undefined) {
      updateData.calories = calories ? parseInt(calories) : null;
    }
    if (prepTime !== undefined) {
      updateData.prepTime = prepTime;
    }
    if (rating !== undefined) {
      updateData.rating = rating ? parseFloat(rating) : null;
    }
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }
    if (ingredients !== undefined) {
      updateData.ingredients = ingredients;
    }

    // تحديث الصورة إذا تم رفع صورة جديدة
    if (req.file) {
      updateData.image = `/uploads/meals/${req.file.filename}`;
    } else if (req.body.image && !req.body.image.startsWith('/uploads')) {
      updateData.image = req.body.image;
    }

    const updatedMeal = await req.prisma.meal.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'تم تحديث الوجبة بنجاح',
      data: { meal: updatedMeal }
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الوجبة'
    });
  }
});

// حذف وجبة (بدون مصادقة)
router.delete('/:id', [], async (req, res) => {
  try {
    const { id } = req.params;

    const existingMeal = await req.prisma.meal.findUnique({
      where: { id }
    });

    if (!existingMeal) {
      return res.status(404).json({
        success: false,
        message: 'الوجبة غير موجودة'
      });
    }

    // حذف ناعم - تعطيل الوجبة بدلاً من حذفها
    await req.prisma.meal.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'تم حذف الوجبة بنجاح'
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الوجبة'
    });
  }
});

// الحصول على قائمة الفئات
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await req.prisma.meal.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories.map(item => item.category);

    res.json({
      success: true,
      data: { categories: categoryList }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الفئات'
    });
  }
});

export default router;