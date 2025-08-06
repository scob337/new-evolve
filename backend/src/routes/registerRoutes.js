const express = require('express');
const { body } = require('express-validator');
const registerController = require('../controllers/registerController');
const multer = require('multer');
const upload = multer(); // تخزين في الذاكرة (بدون ملفات)

const router = express.Router();

router.post(
  '/',
  upload.none(),
  [
    // Basic Information validation
    body('fullName').notEmpty().withMessage('الاسم الكامل مطلوب'),
    body('age').notEmpty().withMessage('العمر مطلوب'),
    body('gender').notEmpty().withMessage('الجنس مطلوب'),
    body('height').notEmpty().withMessage('الطول مطلوب'),
    body('weight').notEmpty().withMessage('الوزن مطلوب'),
    body('occupation').notEmpty().withMessage('المهنة مطلوبة'),
    body('cityCountry').notEmpty().withMessage('المدينة والدولة مطلوبة'),
    
    // Goals & Motivation validation
    body('targetWeight').notEmpty().withMessage('الوزن المستهدف مطلوب'),
    body('targetDate').notEmpty().withMessage('التاريخ المستهدف مطلوب'),
    body('motivationLevel').notEmpty().withMessage('مستوى الدافعية مطلوب')
  ],
  registerController.submitRegistration
);

module.exports = router;