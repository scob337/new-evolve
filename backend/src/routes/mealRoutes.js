const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

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
router.get('/', async (req, res) => {
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
          nameAr: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          nameEn: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          descriptionAr: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          descriptionEn: {
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
        orderBy = { nameAr: 'asc' };
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

// إنشاء وجبة جديدة (مدير فقط)
router.post('/', [
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  body('nameEn').notEmpty().withMessage('الاسم بالإنجليزية مطلوب'),
  body('nameAr').notEmpty().withMessage('الاسم بالعربية مطلوب'),
  body('descriptionEn').notEmpty().withMessage('الوصف بالإنجليزية مطلوب'),
  body('descriptionAr').notEmpty().withMessage('الوصف بالعربية مطلوب'),
  body('usageEn').notEmpty().withMessage('الاستخدام بالإنجليزية مطلوب'),
  body('usageAr').notEmpty().withMessage('الاستخدام بالعربية مطلوب'),
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
      nameEn, nameAr, descriptionEn, descriptionAr,
      usageEn, usageAr, price, category, calories, prepTime, rating
    } = req.body;

    const mealData = {
      name: { en: nameEn, ar: nameAr },
      description: { en: descriptionEn, ar: descriptionAr },
      usage: { en: usageEn, ar: usageAr },
      price: parseFloat(price),
      category,
      calories: calories ? parseInt(calories) : null,
      prepTime: prepTime || null,
      rating: rating ? parseFloat(rating) : 4.5
    };

    // إضافة مسار الصورة إذا تم رفعها
    if (req.file) {
      mealData.image = `/uploads/meals/${req.file.filename}`;
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

// تحديث وجبة (مدير فقط)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  upload.single('image')
], async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nameEn, nameAr, descriptionEn, descriptionAr,
      usageEn, usageAr, price, category, calories, prepTime, rating, isActive
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
    if (nameEn && nameAr) {
      updateData.name = { en: nameEn, ar: nameAr };
    }
    if (descriptionEn && descriptionAr) {
      updateData.description = { en: descriptionEn, ar: descriptionAr };
    }
    if (usageEn && usageAr) {
      updateData.usage = { en: usageEn, ar: usageAr };
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
      updateData.prepTime = prepTime || null;
    }
    if (rating !== undefined) {
      updateData.rating = rating ? parseFloat(rating) : null;
    }
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // تحديث الصورة إذا تم رفع صورة جديدة
    if (req.file) {
      updateData.image = `/uploads/meals/${req.file.filename}`;
      
      // حذف الصورة القديمة
      if (existingMeal.image) {
        const oldImagePath = path.join(__dirname, '../../', existingMeal.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const meal = await req.prisma.meal.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'تم تحديث الوجبة بنجاح',
      data: { meal }
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الوجبة'
    });
  }
});

// حذف وجبة (مدير فقط)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await req.prisma.meal.findUnique({
      where: { id }
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'الوجبة غير موجودة'
      });
    }

    // حذف الصورة
    if (meal.image) {
      const imagePath = path.join(__dirname, '../../', meal.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await req.prisma.meal.delete({
      where: { id }
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

// الحصول على الفئات المتاحة
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

module.exports = router;