const express = require('express');
const { body } = require('express-validator');
const registerController = require('../controllers/registerController');

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
    body('motivationLevel').isNumeric().withMessage('مستوى الدافعية يجب أن يكون رقماً').toInt().isInt({ min: 1, max: 10 }).withMessage('مستوى الدافعية يجب أن يكون بين 1 و 10'),
    
    // Health & Medical validation
    body('medicalConditions').optional().isArray(),
    body('medications').optional(),
    body('hasMedications').optional().isBoolean().toBoolean(),
    body('foodAllergies').optional(),
    body('hasFoodAllergies').optional().isBoolean().toBoolean(),
    body('doctorClearance').optional(),
    
    // Current Habits validation
    body('mealsPerDay').optional(),
    body('eatingOutFrequency').optional(),
    body('sugaryDrinks').optional(),
    body('waterIntake').optional(),
    body('sleepHours').optional(),
    body('exerciseFrequency').optional(),
    body('exerciseTypes').optional().isArray(),
    
    // Preferences & Support validation
    body('mealPlanPreference').optional(),
    body('trainingInterest').optional().isArray(),
    body('dietaryRestrictions').optional(),
    body('hasDietaryRestrictions').optional().isBoolean().toBoolean(),
    body('coachGenderPreference').optional(),
    body('supportLevel').optional(),
    
    // Lifestyle & Readiness validation
    body('stressLevel').optional(),
    body('smokingStatus').optional(),
    body('alcoholConsumption').optional(),
    body('biggestChallenge').optional(),
    body('pastSuccesses').optional(),
    body('hasSupport').optional()
  ],
  registerController.submitRegistration
);

module.exports = router;