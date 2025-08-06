const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const multer = require('multer');
const upload = multer(); // تخزين في الذاكرة (بدون ملفات)

const router = express.Router();

router.post(
  '/',
    upload.none(), // ← مهم علشان يقرأ FormData

  [
    body('name').notEmpty().withMessage('الاسم مطلوب'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('subject').notEmpty().withMessage('الموضوع مطلوب'),
    body('message').notEmpty().withMessage('الرسالة مطلوبة')
  ],
  contactController.submitContactForm
);

module.exports = router;