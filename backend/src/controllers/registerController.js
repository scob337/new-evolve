const { validationResult } = require('express-validator');
const { sendTemplateEmail } = require('../utils/emailService');

/**
 * معالجة تقديم نموذج التسجيل
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 */
exports.submitRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { 
      fullName, email, mobile, age, gender, height, weight, occupation, cityCountry,
      targetWeight, targetDate, weightLossReasons, motivationLevel,
      medicalConditions, medications, hasMedications, foodAllergies, hasFoodAllergies, doctorClearance,
      mealsPerDay, eatingOutFrequency, sugaryDrinks, waterIntake, sleepHours, exerciseFrequency, exerciseTypes,
      mealPlanPreference, trainingInterest, dietaryRestrictions, hasDietaryRestrictions, coachGenderPreference, supportLevel,
      stressLevel, smokingStatus, alcoholConsumption, biggestChallenge, pastSuccesses, hasSupport
    } = req.body;

    const currentYear = new Date().getFullYear();

    // تقسيم الاسم الكامل إلى firstName و lastName
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Common context for both emails
    const commonContext = {
      fullName, 
      firstName, 
      lastName,
      email, 
      mobile,
      phone: mobile, // إضافة phone كمرادف لـ mobile
      age, 
      gender, 
      height, 
      weight,
      currentWeight: weight, // إضافة currentWeight كمرادف لـ weight
      occupation, 
      cityCountry,
      targetWeight, 
      targetDate, 
      weightLossReasons: Array.isArray(weightLossReasons) ? weightLossReasons.join(', ') : '',
      motivationLevel,
      primaryGoal: weightLossReasons ? (Array.isArray(weightLossReasons) ? weightLossReasons.join(', ') : weightLossReasons) : '', // إضافة primaryGoal
      medicalConditions: Array.isArray(medicalConditions) ? medicalConditions.join(', ') : '',
      medications, 
      hasMedications, 
      foodAllergies, 
      hasFoodAllergies, 
      doctorClearance,
      mealsPerDay, 
      eatingOutFrequency, 
      sugaryDrinks, 
      waterIntake, 
      sleepHours, 
      exerciseFrequency,
      workoutFrequency: exerciseFrequency, // إضافة workoutFrequency كمرادف
      exerciseTypes: Array.isArray(exerciseTypes) ? exerciseTypes.join(', ') : '',
      mealPlanPreference, 
      trainingInterest: Array.isArray(trainingInterest) ? trainingInterest.join(', ') : '',
      dietaryRestrictions, 
      hasDietaryRestrictions, 
      coachGenderPreference,
      communicationPreference: coachGenderPreference, // إضافة communicationPreference
      supportLevel,
      stressLevel, 
      smokingStatus, 
      alcoholConsumption, 
      biggestChallenge, 
      pastSuccesses, 
      hasSupport,
      emergencyContact: '', // إضافة حقول فارغة للحقول المفقودة
      emergencyPhone: '',
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
      genderLabel: 'الجنس',
      goalsTitle: 'الأهداف الصحية',
      primaryGoalLabel: 'الهدف الرئيسي',
      currentWeightLabel: 'الوزن الحالي',
      targetWeightLabel: 'الوزن المستهدف',
      heightLabel: 'الطول',
      lifestyleTitle: 'نمط الحياة والعادات',
      workoutFrequencyLabel: 'تكرار التمارين',
      sleepHoursLabel: 'ساعات النوم',
      stressLevelLabel: 'مستوى التوتر',
      smokingStatusLabel: 'حالة التدخين',
      preferencesTitle: 'التفضيلات والدعم',
      communicationPreferenceLabel: 'تفضيل التواصل',
      emergencyContactLabel: 'جهة اتصال الطوارئ',
      emergencyPhoneLabel: 'هاتف جهة اتصال الطوارئ',
      nextStepsText: 'يرجى التواصل مع العضو في أقرب وقت ممكن.',
      callToActionUrl: '#', // إزالة رابط لوحة التحكم
      callToActionText: '', // إزالة نص الزر
      outroText: 'نتطلع إلى خدمة هذا العضو الجديد.',
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
      greeting: `مرحباً ${fullName}`,
      intro: 'شكراً لتسجيلك في Evolve Fitness. نحن متحمسون لمساعدتك في تحقيق أهدافك الصحية واللياقة البدنية.',
      personalInfoTitle: 'معلوماتك الشخصية',
      nameLabel: 'الاسم',
      emailLabel: 'البريد الإلكتروني',
      phoneLabel: 'الهاتف',
      genderLabel: 'الجنس',
      goalsTitle: 'أهدافك الصحية',
      primaryGoalLabel: 'الهدف الرئيسي',
      currentWeightLabel: 'الوزن الحالي',
      targetWeightLabel: 'الوزن المستهدف',
      heightLabel: 'الطول',
      lifestyleTitle: 'نمط الحياة والعادات',
      workoutFrequencyLabel: 'تكرار التمارين',
      sleepHoursLabel: 'ساعات النوم',
      stressLevelLabel: 'مستوى التوتر',
      smokingStatusLabel: 'حالة التدخين',
      preferencesTitle: 'التفضيلات والدعم',
      communicationPreferenceLabel: 'تفضيل التواصل',
      emergencyContactLabel: 'جهة اتصال الطوارئ',
      emergencyPhoneLabel: 'هاتف جهة اتصال الطوارئ',
      nextStepsText: 'سيتواصل معك أحد مدربينا قريباً لمناقشة خطة اللياقة البدنية المخصصة لك.',
      callToActionUrl: '#', // إزالة رابط لوحة التحكم
      callToActionText: '', // إزالة نص الزر
      outroText: 'نتطلع إلى رؤيتك قريباً!',
      rightsText: 'جميع الحقوق محفوظة'
    } : {
      // النسخة الإنجليزية مع نفس التعديلات
      ...commonContext,
      dir: 'ltr',
      lang: 'en',
      title: 'Registration Successful',
      greeting: `Hello ${fullName}`,
      intro: 'Thank you for registering with Evolve Fitness. We are excited to help you achieve your health and fitness goals.',
      personalInfoTitle: 'Your Personal Information',
      nameLabel: 'Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      genderLabel: 'Gender',
      goalsTitle: 'Your Health Goals',
      primaryGoalLabel: 'Primary Goal',
      currentWeightLabel: 'Current Weight',
      targetWeightLabel: 'Target Weight',
      heightLabel: 'Height',
      lifestyleTitle: 'Lifestyle & Habits',
      workoutFrequencyLabel: 'Workout Frequency',
      sleepHoursLabel: 'Sleep Hours',
      stressLevelLabel: 'Stress Level',
      smokingStatusLabel: 'Smoking Status',
      preferencesTitle: 'Preferences & Support',
      communicationPreferenceLabel: 'Communication Preference',
      emergencyContactLabel: 'Emergency Contact',
      emergencyPhoneLabel: 'Emergency Phone',
      nextStepsText: 'One of our trainers will contact you soon to discuss your personalized fitness plan.',
      callToActionUrl: '#', // إزالة رابط لوحة التحكم
      callToActionText: '', // إزالة نص الزر
      outroText: 'We look forward to seeing you soon!',
      rightsText: 'All Rights Reserved'
    };
    
    // Send admin email
    await sendTemplateEmail({
     to: commonContext.age || process.env.ADMIN_EMAIL,
      subject: 'تسجيل عضو جديد',
      context: adminContext
    });
    
    // Send user confirmation email
    await sendTemplateEmail({
      to: email, // استخدم email بدلاً من fullName
      subject: 'Welcome to Evolve Fitness',
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