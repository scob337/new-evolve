const nodemailer = require('nodemailer');

// إنشاء transporter لـ Mailtrap
const createTransporter = () => {
  const config = {
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT),
    secure: process.env.MAILTRAP_SECURE === 'true', // false for 587, true for 465
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    },
    debug: process.env.DEBUG_EMAIL === 'true',
    logger: process.env.DEBUG_EMAIL === 'true'
  };

  console.log('🔧 إعداد Mailtrap Transporter:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    debug: config.debug
  });

return nodemailer.createTransport(config);
};

/**
 * إرسال بريد إلكتروني باستخدام Mailtrap مع معالجة محسنة للأخطاء
 * @param {Object} options - خيارات البريد الإلكتروني
 */
const sendTemplateEmail = async (options) => {
  // التحقق من المتطلبات الأساسية
  if (!options.to) {
    const error = new Error('عنوان البريد الإلكتروني للمستقبل مطلوب');
    error.code = 'MISSING_RECIPIENT';
    throw error;
  }

  if (!options.subject) {
    const error = new Error('موضوع البريد الإلكتروني مطلوب');
    error.code = 'MISSING_SUBJECT';
    throw error;
  }

  // التحقق من إعدادات Mailtrap
  const requiredEnvVars = {
    'MAILTRAP_HOST': process.env.MAILTRAP_HOST,
    'MAILTRAP_PORT': process.env.MAILTRAP_PORT,
    'MAILTRAP_USER': process.env.MAILTRAP_USER,
    'MAILTRAP_PASS': process.env.MAILTRAP_PASS
  };

  const missingVars = [];
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    const error = new Error(`متغيرات البيئة المطلوبة لـ Mailtrap مفقودة: ${missingVars.join(', ')}`);
    error.code = 'MISSING_MAILTRAP_CONFIG';
    error.missingVars = missingVars;
    throw error;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Evolve Fitness',
      address: options.email || process.env.EMAIL_FROM
    },
    to: options.to,
    subject: options.subject,
    html: generateEmailHTML(options.context),
    text: generateEmailText(options.context)
  };

  try {
    console.log(`🔄 محاولة إرسال بريد إلكتروني عبر Mailtrap إلى: ${options.to}`);
    console.log(`📧 الموضوع: ${options.subject}`);
    console.log(`👤 المرسل: ${mailOptions.from.name} <${mailOptions.from.address}>`);
    
    // التحقق من اتصال SMTP
    console.log('🔍 التحقق من اتصال Mailtrap...');
    await transporter.verify();
    console.log('✅ تم التحقق من اتصال Mailtrap بنجاح');
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ تم إرسال الإيميل بنجاح عبر Mailtrap إلى:', options.to);
    console.log('📊 معرف الرسالة:', result.messageId);
    console.log('📋 استجابة الخادم:', result.response);
    
    return { 
      success: true, 
      messageId: result.messageId,
      response: result.response,
      to: options.to,
      provider: 'Mailtrap'
    };
  } catch (error) {
    console.error('❌ خطأ في إرسال الإيميل عبر Mailtrap:', error.message);
    
    // معالجة أخطاء Mailtrap/SMTP المختلفة
    let userFriendlyMessage = 'حدث خطأ أثناء إرسال البريد الإلكتروني';
    let errorCode = 'MAILTRAP_ERROR';
    
    if (error.code === 'EAUTH') {
      userFriendlyMessage = 'خطأ في بيانات المصادقة لـ Mailtrap (اسم المستخدم أو كلمة المرور)';
      errorCode = 'MAILTRAP_AUTH_ERROR';
    } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
      userFriendlyMessage = 'فشل في الاتصال بخادم Mailtrap';
      errorCode = 'MAILTRAP_CONNECTION_ERROR';
    } else if (error.code === 'ETIMEDOUT') {
      userFriendlyMessage = 'انتهت مهلة الاتصال بخادم Mailtrap';
      errorCode = 'MAILTRAP_TIMEOUT';
    } else if (error.code === 'EENVELOPE') {
      userFriendlyMessage = 'خطأ في عناوين البريد الإلكتروني (المرسل أو المستقبل)';
      errorCode = 'INVALID_EMAIL_ADDRESSES';
    } else if (error.responseCode >= 400 && error.responseCode < 500) {
      userFriendlyMessage = 'خطأ في بيانات البريد الإلكتروني المرسلة';
      errorCode = 'INVALID_EMAIL_DATA';
    } else if (error.responseCode >= 500) {
      userFriendlyMessage = 'خطأ في خادم Mailtrap، يرجى المحاولة لاحقاً';
      errorCode = 'MAILTRAP_SERVER_ERROR';
    }
    
    console.error('📋 تفاصيل الخطأ:');
    console.error('- الكود:', error.code);
    console.error('- كود الاستجابة:', error.responseCode);
    console.error('- الأمر:', error.command);
    
    const enhancedError = new Error(userFriendlyMessage);
    enhancedError.code = errorCode;
    enhancedError.originalError = {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      command: error.command
    };
    enhancedError.recipient = options.to;
    enhancedError.provider = 'Mailtrap';
    
    throw enhancedError;
  }
};

const sendEmail = async (options) => {
  // التحقق من المتطلبات الأساسية
  if (!options.to) {
    const error = new Error('عنوان البريد الإلكتروني للمستقبل مطلوب');
    error.code = 'MISSING_RECIPIENT';
    throw error;
  }

  if (!options.subject) {
    const error = new Error('موضوع البريد الإلكتروني مطلوب');
    error.code = 'MISSING_SUBJECT';
    throw error;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Evolve Fitness',
      address: options.from || process.env.EMAIL_FROM
    },
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    console.log(`🔄 محاولة إرسال بريد إلكتروني بسيط عبر Mailtrap إلى: ${options.to}`);
    
    // التحقق من اتصال SMTP
    await transporter.verify();
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ تم إرسال الإيميل البسيط بنجاح عبر Mailtrap إلى:', options.to);
    console.log('📊 معرف الرسالة:', result.messageId);
    
    return { 
      success: true, 
      messageId: result.messageId,
      response: result.response,
      to: options.to,
      provider: 'Mailtrap'
    };
  } catch (error) {
    console.error('❌ خطأ في إرسال الإيميل البسيط عبر Mailtrap:', error.message);
    
    // نفس معالجة الأخطاء كما في sendTemplateEmail
    let userFriendlyMessage = 'حدث خطأ أثناء إرسال البريد الإلكتروني';
    let errorCode = 'MAILTRAP_ERROR';
    
    if (error.code === 'EAUTH') {
      userFriendlyMessage = 'خطأ في بيانات المصادقة لـ Mailtrap';
      errorCode = 'MAILTRAP_AUTH_ERROR';
    } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
      userFriendlyMessage = 'فشل في الاتصال بخادم Mailtrap';
      errorCode = 'MAILTRAP_CONNECTION_ERROR';
    }
    
    const enhancedError = new Error(userFriendlyMessage);
    enhancedError.code = errorCode;
    enhancedError.originalError = error;
    enhancedError.recipient = options.to;
    enhancedError.provider = 'Mailtrap';
    
    throw enhancedError;
  }
};

const generateEmailHTML = (context) => {
  const {
    dir = 'rtl',
    lang = 'ar',
    title = 'Evolve Fitness',
    greeting = 'مرحباً',
    fullName = '',
    firstName = '',
    lastName = '',
    intro = '',
    personalInfoTitle = 'المعلومات الشخصية',
    nameLabel = 'الاسم',
    emailLabel = 'البريد الإلكتروني',
    phoneLabel = 'الهاتف',
    genderLabel = 'الجنس',
    ageLabel = 'العمر',
    heightLabel = 'الطول',
    weightLabel = 'الوزن',
    occupationLabel = 'المهنة',
    cityCountryLabel = 'المدينة والدولة',
    goalsTitle = 'الأهداف الصحية',
    targetWeightLabel = 'الوزن المستهدف',
    targetDateLabel = 'التاريخ المستهدف',
    motivationLevelLabel = 'مستوى الدافعية',
    weightLossReasonsLabel = 'أسباب فقدان الوزن',
    lifestyleTitle = 'نمط الحياة والعادات',
    medicalConditionsLabel = 'الحالات الطبية',
    medicationsLabel = 'الأدوية',
    foodAllergiesLabel = 'حساسية الطعام',
    mealsPerDayLabel = 'عدد الوجبات يومياً',
    waterIntakeLabel = 'شرب الماء',
    sleepHoursLabel = 'ساعات النوم',
    exerciseFrequencyLabel = 'تكرار التمارين',
    exerciseTypesLabel = 'أنواع التمارين',
    preferencesTitle = 'التفضيلات والدعم',
    mealPlanPreferenceLabel = 'تفضيل خطة الوجبات',
    trainingInterestLabel = 'اهتمامات التدريب',
    dietaryRestrictionsLabel = 'القيود الغذائية',
    coachGenderPreferenceLabel = 'تفضيل جنس المدرب',
    supportLevelLabel = 'مستوى الدعم',
    stressLevelLabel = 'مستوى التوتر',
    smokingStatusLabel = 'حالة التدخين',
    alcoholConsumptionLabel = 'استهلاك الكحول',
    biggestChallengeLabel = 'أكبر تحدي',
    pastSuccessesLabel = 'النجاحات السابقة',
    hasSupportLabel = 'وجود دعم',
    nextStepsText = '',
    outroText = '',
    rightsText = 'جميع الحقوق محفوظة',
    currentYear = new Date().getFullYear(),
    email = '',
    mobile = '',
    phone = '',
    age = '',
    gender = '',
    height = '',
    weight = '',
    occupation = '',
    cityCountry = '',
    targetWeight = '',
    targetDate = '',
    motivationLevel = '',
    weightLossReasons = '',
    medicalConditions = '',
    medications = '',
    hasMedications = '',
    foodAllergies = '',
    hasFoodAllergies = '',
    mealsPerDay = '',
    waterIntake = '',
    sleepHours = '',
    exerciseFrequency = '',
    exerciseTypes = '',
    mealPlanPreference = '',
    trainingInterest = '',
    dietaryRestrictions = '',
    hasDietaryRestrictions = '',
    coachGenderPreference = '',
    supportLevel = '',
    stressLevel = '',
    smokingStatus = '',
    alcoholConsumption = '',
    biggestChallenge = '',
    pastSuccesses = '',
    hasSupport = ''
  } = context;

  return `
<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2c5aa0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c5aa0;
            margin: 0;
            font-size: 28px;
        }
        .greeting {
            font-size: 18px;
            color: #2c5aa0;
            margin-bottom: 20px;
        }
        .intro {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 25px;
            border-left: 4px solid #2c5aa0;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            color: #2c5aa0;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e0e0e0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        .info-item {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #e0e0e0;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
        }
        .full-width {
            grid-column: 1 / -1;
        }
        .next-steps {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 5px;
            border-left: 4px solid #28a745;
            margin: 25px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        
        <div class="greeting">
            ${greeting} ${fullName || firstName}
        </div>
        
        ${intro ? `<div class="intro">${intro}</div>` : ''}
        
        <div class="section">
            <div class="section-title">${personalInfoTitle}</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">${nameLabel}</div>
                    <div class="info-value">${fullName || `${firstName} ${lastName}`.trim()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${emailLabel}</div>
                    <div class="info-value">${email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${phoneLabel}</div>
                    <div class="info-value">${mobile || phone}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${genderLabel}</div>
                    <div class="info-value">${gender}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${ageLabel}</div>
                    <div class="info-value">${age}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${heightLabel}</div>
                    <div class="info-value">${height} سم</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${weightLabel}</div>
                    <div class="info-value">${weight} كجم</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${occupationLabel}</div>
                    <div class="info-value">${occupation}</div>
                </div>
                <div class="info-item full-width">
                    <div class="info-label">${cityCountryLabel}</div>
                    <div class="info-value">${cityCountry}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">${goalsTitle}</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">${targetWeightLabel}</div>
                    <div class="info-value">${targetWeight} كجم</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${targetDateLabel}</div>
                    <div class="info-value">${targetDate}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${motivationLevelLabel}</div>
                    <div class="info-value">${motivationLevel}/10</div>
                </div>
                <div class="info-item full-width">
                    <div class="info-label">${weightLossReasonsLabel}</div>
                    <div class="info-value">${weightLossReasons}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">${lifestyleTitle}</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">${medicalConditionsLabel}</div>
                    <div class="info-value">${medicalConditions}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${medicationsLabel}</div>
                    <div class="info-value">${medications}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${foodAllergiesLabel}</div>
                    <div class="info-value">${foodAllergies}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${mealsPerDayLabel}</div>
                    <div class="info-value">${mealsPerDay}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${waterIntakeLabel}</div>
                    <div class="info-value">${waterIntake}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${sleepHoursLabel}</div>
                    <div class="info-value">${sleepHours}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${exerciseFrequencyLabel}</div>
                    <div class="info-value">${exerciseFrequency}</div>
                </div>
                <div class="info-item full-width">
                    <div class="info-label">${exerciseTypesLabel}</div>
                    <div class="info-value">${exerciseTypes}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">${preferencesTitle}</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">${mealPlanPreferenceLabel}</div>
                    <div class="info-value">${mealPlanPreference}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${trainingInterestLabel}</div>
                    <div class="info-value">${trainingInterest}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${dietaryRestrictionsLabel}</div>
                    <div class="info-value">${dietaryRestrictions}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${coachGenderPreferenceLabel}</div>
                    <div class="info-value">${coachGenderPreference}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${supportLevelLabel}</div>
                    <div class="info-value">${supportLevel}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${stressLevelLabel}</div>
                    <div class="info-value">${stressLevel}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${smokingStatusLabel}</div>
                    <div class="info-value">${smokingStatus}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${alcoholConsumptionLabel}</div>
                    <div class="info-value">${alcoholConsumption}</div>
                </div>
                <div class="info-item full-width">
                    <div class="info-label">${biggestChallengeLabel}</div>
                    <div class="info-value">${biggestChallenge}</div>
                </div>
                <div class="info-item full-width">
                    <div class="info-label">${pastSuccessesLabel}</div>
                    <div class="info-value">${pastSuccesses}</div>
                </div>
            </div>
        </div>
        
        ${nextStepsText ? `<div class="next-steps">${nextStepsText}</div>` : ''}
        
        ${outroText ? `<div class="intro">${outroText}</div>` : ''}
        
        <div class="footer">
            <p>${rightsText} © ${currentYear} - Evolve Fitness</p>
        </div>
    </div>
</body>
</html>
  `;
};

const generateEmailText = (context) => {
  const {
    title = 'Evolve Fitness',
    greeting = 'مرحباً',
    fullName = '',
    firstName = '',
    intro = '',
    personalInfoTitle = 'المعلومات الشخصية',
    nameLabel = 'الاسم',
    emailLabel = 'البريد الإلكتروني',
    phoneLabel = 'الهاتف',
    genderLabel = 'الجنس',
    ageLabel = 'العمر',
    heightLabel = 'الطول',
    weightLabel = 'الوزن',
    occupationLabel = 'المهنة',
    cityCountryLabel = 'المدينة والدولة',
    goalsTitle = 'الأهداف الصحية',
    targetWeightLabel = 'الوزن المستهدف',
    targetDateLabel = 'التاريخ المستهدف',
    motivationLevelLabel = 'مستوى الدافعية',
    weightLossReasonsLabel = 'أسباب فقدان الوزن',
    nextStepsText = '',
    outroText = '',
    rightsText = 'جميع الحقوق محفوظة',
    currentYear = new Date().getFullYear(),
    email = '',
    mobile = '',
    phone = '',
    age = '',
    gender = '',
    height = '',
    weight = '',
    occupation = '',
    cityCountry = '',
    targetWeight = '',
    targetDate = '',
    motivationLevel = '',
    weightLossReasons = ''
  } = context;

  return `
${title}
${'='.repeat(title.length)}

${greeting} ${fullName || firstName}

${intro ? intro + '\n\n' : ''}

${personalInfoTitle}:
${'-'.repeat(personalInfoTitle.length)}
${nameLabel}: ${fullName || `${firstName} ${context.lastName || ''}`.trim()}
${emailLabel}: ${email}
${phoneLabel}: ${mobile || phone}
${genderLabel}: ${gender}
${ageLabel}: ${age}
${heightLabel}: ${height} سم
${weightLabel}: ${weight} كجم
${occupationLabel}: ${occupation}
${cityCountryLabel}: ${cityCountry}

${goalsTitle}:
${'-'.repeat(goalsTitle.length)}
${targetWeightLabel}: ${targetWeight} كجم
${targetDateLabel}: ${targetDate}
${motivationLevelLabel}: ${motivationLevel}/10
${weightLossReasonsLabel}: ${weightLossReasons}

${nextStepsText ? nextStepsText + '\n\n' : ''}
${outroText ? outroText + '\n\n' : ''}

${rightsText} © ${currentYear} - Evolve Fitness
  `;
};

module.exports = {
  sendTemplateEmail,
  sendEmail
};