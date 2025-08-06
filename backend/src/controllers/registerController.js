const { validationResult } = require('express-validator');
const { sendTemplateEmail } = require('../utils/emailService');

/**
 * معالجة تقديم نموذج التسجيل
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 */
exports.submitRegistration = async (req, res) => {
  try {
    console.log('البيانات المستلمة:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('أخطاء التحقق:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array(),
        message: 'يرجى التحقق من البيانات المدخلة'
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

    // معالجة أسباب فقدان الوزن
    let processedWeightLossReasons = '';
    if (Array.isArray(weightLossReasons)) {
      const reasons = weightLossReasons.map(reason => {
        switch(reason) {
          case 'health': return 'تحسين الصحة';
          case 'confidence': return 'زيادة الثقة بالنفس';
          case 'fitness': return 'تحسين اللياقة البدنية';
          case 'appearance': return 'تحسين المظهر';
          case 'medical': return 'أسباب طبية';
          case 'other': return 'أخرى';
          default: return reason;
        }
      });
      processedWeightLossReasons = reasons.join(', ');
    }

    // معالجة الحالات الطبية
    let processedMedicalConditions = '';
    if (Array.isArray(medicalConditions)) {
      const conditions = medicalConditions.map(condition => {
        switch(condition) {
          case 'diabetes': return 'السكري';
          case 'hypertension': return 'ارتفاع ضغط الدم';
          case 'heart_disease': return 'أمراض القلب';
          case 'thyroid': return 'مشاكل الغدة الدرقية';
          case 'arthritis': return 'التهاب المفاصل';
          case 'none': return 'لا يوجد';
          case 'other': return 'أخرى';
          default: return condition;
        }
      });
      processedMedicalConditions = conditions.join(', ');
    }

    // معالجة أنواع التمارين
    let processedExerciseTypes = '';
    if (Array.isArray(exerciseTypes)) {
      processedExerciseTypes = exerciseTypes.join(', ');
    }

    // معالجة اهتمامات التدريب
    let processedTrainingInterest = '';
    if (Array.isArray(trainingInterest)) {
      processedTrainingInterest = trainingInterest.join(', ');
    }

    // Common context for both emails
    const commonContext = {
      fullName, 
      firstName, 
      lastName,
      email, 
      mobile,
      phone: mobile, // للتوافق مع القوالب القديمة
      age, 
      gender: gender === 'male' ? 'ذكر' : gender === 'female' ? 'أنثى' : gender, 
      height, 
      weight,
      currentWeight: weight, // للتوافق مع القوالب القديمة
      occupation: occupation || 'غير محدد', 
      cityCountry: cityCountry || 'غير محدد',
      city: cityCountry ? cityCountry.split(',')[0] : 'غير محدد',
      country: cityCountry ? cityCountry.split(',')[1] || 'غير محدد' : 'غير محدد',
      targetWeight, 
      targetDate: targetDate || 'غير محدد',
      goalDate: targetDate, // للتوافق مع القوالب القديمة
      weightLossReasons: processedWeightLossReasons || 'غير محدد',
      motivationLevel,
      medicalConditions: processedMedicalConditions || 'لا يوجد',
      medications: medications || 'لا يوجد',
      hasMedications: hasMedications ? 'نعم' : 'لا',
      foodAllergies: foodAllergies || 'لا يوجد',
      hasFoodAllergies: hasFoodAllergies ? 'نعم' : 'لا',
      doctorClearance: doctorClearance || 'غير محدد',
      mealsPerDay: mealsPerDay || 'غير محدد',
      eatingOutFrequency: eatingOutFrequency || 'غير محدد',
      sugaryDrinks: sugaryDrinks || 'غير محدد',
      waterIntake: waterIntake || 'غير محدد',
      sleepHours: sleepHours || 'غير محدد',
      exerciseFrequency: exerciseFrequency || 'غير محدد',
      exerciseTypes: processedExerciseTypes || 'غير محدد',
      mealPlanPreference: mealPlanPreference || 'غير محدد',
      trainingInterest: processedTrainingInterest || 'غير محدد',
      dietaryRestrictions: dietaryRestrictions || 'لا يوجد',
      hasDietaryRestrictions: hasDietaryRestrictions ? 'نعم' : 'لا',
      coachGenderPreference: coachGenderPreference || 'غير محدد',
      supportLevel: supportLevel || 'غير محدد',
      stressLevel: stressLevel || 'غير محدد',
      smokingStatus: smokingStatus || 'غير محدد',
      alcoholConsumption: alcoholConsumption || 'غير محدد',
      biggestChallenge: biggestChallenge || 'غير محدد',
      pastSuccesses: pastSuccesses || 'غير محدد',
      hasSupport: hasSupport || 'غير محدد',
      currentYear
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
      callToActionUrl: '#',
      callToActionText: '',
      outroText: 'نتطلع إلى خدمة هذا العضو الجديد.',
      rightsText: 'جميع الحقوق محفوظة'
    };
    
    // Context for user email (Arabic)
    const userContext = {
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
      callToActionUrl: '#',
      callToActionText: '',
      outroText: 'نتطلع إلى رؤيتك قريباً!',
      rightsText: 'جميع الحقوق محفوظة'
    };
    
    // Send admin email
    try {
      await sendTemplateEmail({
        to: process.env.ADMIN_EMAIL || 'F.alamoudi@evolvetheapp.com',
        subject: 'تسجيل عضو جديد - Evolve Fitness',
        context: adminContext
      });
      console.log('تم إرسال إيميل الإدارة بنجاح');
    } catch (emailError) {
      console.error('خطأ في إرسال إيميل الإدارة:', emailError);
    }
    
    // Send user confirmation email
    try {
      await sendTemplateEmail({
        to: email,
        subject: 'مرحباً بك في Evolve Fitness',
        context: userContext
      });
      console.log('تم إرسال إيميل التأكيد للمستخدم بنجاح');
    } catch (emailError) {
      console.error('خطأ في إرسال إيميل التأكيد:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'تم تسجيلك بنجاح! سيتواصل معك فريقنا قريباً.'
    });
    
  } catch (error) {
    console.error('خطأ في تسجيل المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};