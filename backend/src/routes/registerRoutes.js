import express from 'express';
import { body } from 'express-validator';
import { submitRegistration } from '../controllers/registerController.js';

const router = express.Router();

router.post(
  '/',
  [
    // Basic Information validation
    body('fullName').notEmpty().withMessage('الاسم الكامل مطلوب'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('mobile').notEmpty().withMessage('رقم الهاتف مطلوب'),
    body('age').isNumeric().withMessage('العمر يجب أن يكون رقماً').toInt(),
    body('gender').isIn(['male', 'female']).withMessage('الجنس غير صالح'),
    body('height').isNumeric().withMessage('الطول يجب أن يكون رقماً').toFloat(),
    body('weight').isNumeric().withMessage('الوزن الحالي يجب أن يكون رقماً').toFloat(),
    body('occupation').optional(),
    body('cityCountry').optional(),
    
    // Goals & Motivation validation
    body('targetWeight').isNumeric().withMessage('الوزن المستهدف يجب أن يكون رقماً').toFloat(),
    body('targetDate').optional(),
    body('weightLossReasons').isArray().withMessage('أسباب فقدان الوزن يجب أن تكون مصفوفة'),
    body('motivationLevel').optional(),
    
    // Health Information validation
    body('medicalConditions').optional(),
    body('medications').optional(),
    body('foodAllergies').optional(),
    body('doctorClearance').optional(),
    
    // Lifestyle validation
    body('mealsPerDay').optional(),
    body('eatingOutFrequency').optional(),
    body('sugaryDrinks').optional(),
    body('waterIntake').optional(),
    body('sleepHours').optional(),
    body('exerciseFrequency').optional(),
    body('exerciseTypes').optional(),
    
    // Preferences validation
    body('mealPlanPreference').optional(),
    body('trainingInterest').optional(),
    body('dietaryRestrictions').optional(),
    body('coachGenderPreference').optional(),
    body('supportLevel').optional(),
    
    // Additional Information validation
    body('stressLevel').optional(),
    body('smokingStatus').optional(),
    body('alcoholConsumption').optional(),
    body('biggestChallenge').optional(),
    body('pastSuccesses').optional(),
    body('hasSupport').optional()
  ],
  submitRegistration
);

export default router;