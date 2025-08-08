import express from 'express';
import { body } from 'express-validator';
import { submitContactForm } from '../controllers/contactController.js';
import multer from 'multer';

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
  submitContactForm
);

export default router;