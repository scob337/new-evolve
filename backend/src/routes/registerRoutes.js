const express = require('express');
const { body } = require('express-validator');
const registerController = require('../controllers/registerController');

const router = express.Router();

router.post(
  '/',
  [
    // التحقق من البيانات الشخصية
    body('firstName').notEmpty().withMessage('الاسم الأول مطلوب'),
    body('lastName').notEmpty().withMessage('الاسم الأخير مطلوب'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('phone').notEmpty().withMessage('رقم الهاتف مطلوب'),
    body('dateOfBirth').notEmpty().withMessage('تاريخ الميلاد مطلوب'),
    body('gender').notEmpty().withMessage('الجنس مطلوب'),
    
    // التحقق من أهداف الصحة
    body('primaryGoal').notEmpty().withMessage('الهدف الرئيسي مطلوب'),
    body('currentWeight').notEmpty().withMessage('الوزن الحالي مطلوب'),
    body('height').notEmpty().withMessage('الطول مطلوب'),
    body('activityLevel').notEmpty().withMessage('مستوى النشاط مطلوب'),
    
    // التحقق من نمط الحياة والعادات
    body('workoutFrequency').notEmpty().withMessage('تكرار التمرين مطلوب'),
    body('preferredWorkoutTime').notEmpty().withMessage('وقت التمرين المفضل مطلوب'),
    body('sleepHours').notEmpty().withMessage('ساعات النوم مطلوبة'),
    body('stressLevel').notEmpty().withMessage('مستوى التوتر مطلوب'),
    
    // التحقق من التفضيلات والدعم
    body('communicationPreference').notEmpty().withMessage('تفضيل الاتصال مطلوب'),
    body('emergencyContact').notEmpty().withMessage('جهة اتصال للطوارئ مطلوبة'),
    body('emergencyPhone').notEmpty().withMessage('هاتف الطوارئ مطلوب')
  ],
  registerController.submitRegistration
);

module.exports = router;