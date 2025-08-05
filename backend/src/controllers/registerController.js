const { validationResult } = require('express-validator');
const { sendTemplateEmail } = require('../utils/emailService');

/**
 * معالجة تقديم نموذج التسجيل
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 */
exports.submitRegistration = async (req, res) => {
  try {
    // التحقق من صحة المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { 
      firstName, lastName, email, phone, dateOfBirth, gender,
      primaryGoal, targetWeight, currentWeight, height, activityLevel,
      workoutFrequency, preferredWorkoutTime, sleepHours, stressLevel, smokingStatus,
      dietaryRestrictions, foodAllergies, supplementPreferences,
      communicationPreference, emergencyContact, emergencyPhone
    } = req.body;
    
    const currentYear = new Date().getFullYear();
    
    // Common context for both emails
    const commonContext = {
      firstName, lastName, email, phone, dateOfBirth, gender,
      primaryGoal, targetWeight, currentWeight, height, activityLevel,
      workoutFrequency, preferredWorkoutTime, sleepHours, stressLevel, smokingStatus,
      dietaryRestrictions, foodAllergies, supplementPreferences,
      communicationPreference, emergencyContact, emergencyPhone,
      year: currentYear
    };
    
    // Context for admin email (Arabic)
    const adminContext = {
      ...commonContext,
      dir: 'rtl',
      lang: 'ar',
      title: 'تسجيل عضو جديد',
      greeting: 'مرحباً',
      intro: 'لقد تلقيت تسجيلاً جديداً من:',
      personalInfoTitle: 'المعلومات الشخصية',
      nameLabel: 'الاسم',
      emailLabel: 'البريد الإلكتروني',
      phoneLabel: 'الهاتف',
      dateOfBirthLabel: 'تاريخ الميلاد',
      genderLabel: 'الجنس',
      goalsTitle: 'الأهداف الصحية',
      primaryGoalLabel: 'الهدف الرئيسي',
      currentWeightLabel: 'الوزن الحالي',
      targetWeightLabel: 'الوزن المستهدف',
      heightLabel: 'الطول',
      activityLevelLabel: 'مستوى النشاط',
      lifestyleTitle: 'نمط الحياة والعادات',
      workoutFrequencyLabel: 'تكرار التمارين',
      preferredWorkoutTimeLabel: 'وقت التمرين المفضل',
      sleepHoursLabel: 'ساعات النوم',
      stressLevelLabel: 'مستوى التوتر',
      smokingStatusLabel: 'حالة التدخين',
      preferencesTitle: 'التفضيلات والدعم',
      dietaryRestrictionsLabel: 'القيود الغذائية',
      foodAllergiesLabel: 'الحساسية الغذائية',
      supplementPreferencesLabel: 'تفضيلات المكملات الغذائية',
      communicationPreferenceLabel: 'تفضيل التواصل',
      emergencyContactLabel: 'جهة اتصال الطوارئ',
      emergencyPhoneLabel: 'هاتف جهة اتصال الطوارئ',
      nextStepsText: 'يرجى مراجعة التفاصيل الكاملة في لوحة التحكم.',
      callToActionUrl: 'https://evolve-fitness.com/dashboard',
      callToActionText: 'عرض التفاصيل الكاملة',
      outroText: 'يرجى التواصل مع العضو في أقرب وقت ممكن.',
      rightsText: 'جميع الحقوق محفوظة'
    };
    
    // Context for user email (can be English based on user's preference)
    const userLang = req.body.preferredLanguage || 'ar'; // Get user's preferred language if available
    const userDir = userLang === 'ar' ? 'rtl' : 'ltr';
    
    const userContext = userLang === 'ar' ? {
      ...commonContext,
      dir: 'rtl',
      lang: 'ar',
      title: 'تم تسجيلك بنجاح',
      greeting: `مرحباً ${firstName}`,
      intro: 'شكراً لتسجيلك في Evolve Fitness. نحن متحمسون لمساعدتك في تحقيق أهدافك الصحية واللياقة البدنية.',
      personalInfoTitle: 'معلوماتك الشخصية',
      nameLabel: 'الاسم',
      emailLabel: 'البريد الإلكتروني',
      phoneLabel: 'الهاتف',
      dateOfBirthLabel: 'تاريخ الميلاد',
      genderLabel: 'الجنس',
      goalsTitle: 'أهدافك الصحية',
      primaryGoalLabel: 'الهدف الرئيسي',
      currentWeightLabel: 'الوزن الحالي',
      targetWeightLabel: 'الوزن المستهدف',
      heightLabel: 'الطول',
      activityLevelLabel: 'مستوى النشاط',
      lifestyleTitle: 'نمط الحياة والعادات',
      workoutFrequencyLabel: 'تكرار التمارين',
      preferredWorkoutTimeLabel: 'وقت التمرين المفضل',
      sleepHoursLabel: 'ساعات النوم',
      stressLevelLabel: 'مستوى التوتر',
      smokingStatusLabel: 'حالة التدخين',
      preferencesTitle: 'التفضيلات والدعم',
      dietaryRestrictionsLabel: 'القيود الغذائية',
      foodAllergiesLabel: 'الحساسية الغذائية',
      supplementPreferencesLabel: 'تفضيلات المكملات الغذائية',
      communicationPreferenceLabel: 'تفضيل التواصل',
      emergencyContactLabel: 'جهة اتصال الطوارئ',
      emergencyPhoneLabel: 'هاتف جهة اتصال الطوارئ',
      nextStepsText: 'سيتواصل معك أحد مدربينا قريباً لمناقشة خطة اللياقة البدنية المخصصة لك.',
      callToActionUrl: 'https://evolve-fitness.com/profile',
      callToActionText: 'عرض ملفك الشخصي',
      outroText: 'نتطلع إلى رؤيتك قريباً!',
      rightsText: 'جميع الحقوق محفوظة'
    } : {
      ...commonContext,
      dir: 'ltr',
      lang: 'en',
      title: 'Registration Successful',
      greeting: `Hello ${firstName}`,
      intro: 'Thank you for registering with Evolve Fitness. We are excited to help you achieve your health and fitness goals.',
      personalInfoTitle: 'Your Personal Information',
      nameLabel: 'Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      dateOfBirthLabel: 'Date of Birth',
      genderLabel: 'Gender',
      goalsTitle: 'Your Health Goals',
      primaryGoalLabel: 'Primary Goal',
      currentWeightLabel: 'Current Weight',
      targetWeightLabel: 'Target Weight',
      heightLabel: 'Height',
      activityLevelLabel: 'Activity Level',
      lifestyleTitle: 'Lifestyle & Habits',
      workoutFrequencyLabel: 'Workout Frequency',
      preferredWorkoutTimeLabel: 'Preferred Workout Time',
      sleepHoursLabel: 'Sleep Hours',
      stressLevelLabel: 'Stress Level',
      smokingStatusLabel: 'Smoking Status',
      preferencesTitle: 'Preferences & Support',
      dietaryRestrictionsLabel: 'Dietary Restrictions',
      foodAllergiesLabel: 'Food Allergies',
      supplementPreferencesLabel: 'Supplement Preferences',
      communicationPreferenceLabel: 'Communication Preference',
      emergencyContactLabel: 'Emergency Contact',
      emergencyPhoneLabel: 'Emergency Phone',
      nextStepsText: 'One of our trainers will contact you soon to discuss your personalized fitness plan.',
      callToActionUrl: 'https://evolve-fitness.com/profile',
      callToActionText: 'View Your Profile',
      outroText: 'We look forward to seeing you soon!',
      rightsText: 'All Rights Reserved'
    };
    
    // Send admin email
    // إرسال بريد إلكتروني إلى المسؤول
    await sendTemplateEmail({
    to: process.env.ADMIN_EMAIL,
    from: process.env.EMAIL_FROM, // Changed from email to process.env.EMAIL_FROM
    subject: 'تسجيل عضو جديد',
      template: 'registration',
      context: adminContext
    });
    
    // Send user confirmation email
    await sendTemplateEmail({
      to: email,
      from: process.env.EMAIL_FROM, // Changed from email to process.env.EMAIL_FROM
      subject: userLang === 'ar' ? 'مرحباً بك في Evolve Fitness' : 'Welcome to Evolve Fitness',
      template: 'registration',
      context: userContext
    });

    res.status(200).json({
      success: true,
      message: 'تم تسجيلك بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تسجيل المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
    });
  }
};