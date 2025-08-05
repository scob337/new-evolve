const sgMail = require('@sendgrid/mail');

// إعداد SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * إرسال بريد إلكتروني باستخدام SendGrid
 * @param {Object} options - خيارات البريد الإلكتروني
 */
const sendTemplateEmail = async (options) => {
  const msg = {
    to: options.to,
    from: options.email || process.env.EMAIL_FROM, // يمكن تمرير from مخصص
    subject: options.subject,
    html: generateEmailHTML(options.context),
    text: generateEmailText(options.context)
  };

  try {
    await sgMail.send(msg);
    console.log('تم إرسال الإيميل بنجاح إلى:', options.to);
    return { success: true };
  } catch (error) {
    console.error('خطأ في إرسال الإيميل:', error);
    if (error.response) {
      console.error('تفاصيل الخطأ:', error.response.body);
    }
    throw error;
  }
};

const sendEmail = async (options) => {
  const msg = {
    to: options.to,
    from: options.from || process.env.EMAIL_FROM,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    await sgMail.send(msg);
    console.log('تم إرسال الإيميل بنجاح إلى:', options.to);
    return { success: true };
  } catch (error) {
    console.error('خطأ في إرسال الإيميل:', error);
    throw error;
  }
};

// دالة لتوليد HTML للإيميل
const generateEmailHTML = (context) => {
  return `
<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${context.title}</title>
<style>
  body { 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    line-height: 1.6; 
    color: #333; 
    margin: 0; 
    padding: 0;
    background-color: #f4f4f4;
    direction: rtl;
    text-align: right;
  }
  .container { 
    max-width: 700px; 
    margin: 0 auto; 
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }
  .header { 
    background: linear-gradient(135deg, #ff6b35, #f7931e); 
    color: white; 
    padding: 30px 20px; 
    text-align: center; 
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
  }
  .content { 
    padding: 30px; 
    background: white; 
  }
  .section { 
    margin-bottom: 25px; 
    padding: 20px;
    background: #f9f9f9;
    border-right: 4px solid #ff6b35;
    border-radius: 8px;
  }
  .section h3 {
    color: #ff6b35;
    margin-top: 0;
    font-size: 18px;
    border-bottom: 2px solid #ff6b35;
    padding-bottom: 10px;
    text-align: right;
  }
  .info-row {
    margin-bottom: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: flex-start;
    text-align: right;
    width: 100%;
  }
  .info-row:last-child {
    border-bottom: none;
  }
  .label { 
    font-weight: bold; 
    color: #ff6b35; 
    min-width: 200px;
    margin-left: 15px;
    flex-shrink: 0;
    text-align: right;
    padding-right: 0;
  }
  .value {
    color: #333;
    flex: 1;
    text-align: right;
    word-wrap: break-word;
    margin-right: 0;
    padding-right: 0;
  }
  .content {
    padding: 30px;
    background: white;
    text-align: right;
    direction: rtl;
  }
  .section {
    margin-bottom: 25px;
    padding: 20px;
    background: #f9f9f9;
    border-right: 4px solid #ff6b35;
    border-radius: 8px;
    text-align: right;
    direction: rtl;
  }
  .section h3 {
    color: #ff6b35;
    margin-top: 0;
    font-size: 18px;
    border-bottom: 2px solid #ff6b35;
    padding-bottom: 10px;
    text-align: right;
    margin-right: 0;
    padding-right: 0;
  }
  .multi-value {
    direction: rtl;
    text-align: right;
  }
  .footer { 
    text-align: center; 
    padding: 20px; 
    color: #666; 
    background: #f4f4f4;
    font-size: 14px;
    direction: rtl;
  }
  .logo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  /* إضافة خصائص إضافية للنصوص العربية */
  .arabic-text {
    direction: rtl;
    text-align: right;
    unicode-bidi: bidi-override;
  }
  
  /* تحسين عرض النصوص الطويلة */
  .value.multi-value {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
</head>
<body dir="rtl">
<div class="container">
  <div class="header">
    <div class="logo">🏋️ Evolve Fitness</div>
    <h1 class="arabic-text">${context.title}</h1>
  </div>
  <div class="content">
    <p style="font-size: 18px; color: #ff6b35; font-weight: bold; text-align: right; direction: rtl;">${context.greeting}</p>
    <p style="font-size: 16px; line-height: 1.8; text-align: right; direction: rtl;">${context.intro}</p>
    
    <div class="section">
      <h3>المعلومات الشخصية</h3>
      <div class="info-row">
        <span class="value">${context.fullName || 'غير محدد'}</span>
        <span class="label">:الاسم الكامل</span>
      </div>
      <div class="info-row">
        <span class="value">${context.email || 'غير محدد'}</span>
        <span class="label">:البريد الإلكتروني</span>
      </div>
      <div class="info-row">
        <span class="value">${context.mobile || 'غير محدد'}</span>
        <span class="label">:رقم الهاتف</span>
      </div>
      <div class="info-row">
        <span class="value">${context.age || 'غير محدد'} سنة</span>
        <span class="label">:العمر</span>
      </div>
      <div class="info-row">
        <span class="value">${context.gender === 'male' ? 'ذكر' : context.gender === 'female' ? 'أنثى' : 'غير محدد'}</span>
        <span class="label">:الجنس</span>
      </div>
      <div class="info-row">
        <span class="value">${context.height || 'غير محدد'} سم</span>
        <span class="label">:الطول</span>
      </div>
      <div class="info-row">
        <span class="value">${context.weight || 'غير محدد'} كجم</span>
        <span class="label">:الوزن الحالي</span>
      </div>
      <div class="info-row">
        <span class="value">${context.occupation || 'غير محدد'}</span>
        <span class="label">:المهنة</span>
      </div>
      <div class="info-row">
        <span class="value">${context.cityCountry || 'غير محدد'}</span>
        <span class="label">:المدينة والدولة</span>
      </div>
    </div>

    <!-- الأهداف والدوافع -->
    <div class="section">
      <h3>الأهداف والدوافع</h3>
      <div class="info-row">
        <span class="value">${context.targetWeight || 'غير محدد'} كجم</span>
        <span class="label">:الوزن المستهدف</span>
      </div>
      <div class="info-row">
        <span class="value">${context.targetDate || 'غير محدد'}</span>
        <span class="label">:التاريخ المستهدف</span>
      </div>
      <div class="info-row">
        <span class="value multi-value">${context.weightLossReasons ? context.weightLossReasons.replace(/,/g, ' - ') : 'غير محدد'}</span>
        <span class="label">:أسباب فقدان الوزن</span>
      </div>
      <div class="info-row">
        <span class="value">${context.motivationLevel || 'غير محدد'}</span>
        <span class="label">:مستوى الدافعية</span>
      </div>
    </div>

    <!-- المعلومات الصحية والطبية -->
    <div class="section">
      <h3>المعلومات الصحية والطبية</h3>
      <div class="info-row">
        <span class="value multi-value">${context.medicalConditions ? context.medicalConditions.replace(/,/g, ' - ') : 'لا توجد'}</span>
        <span class="label">:الحالات الطبية</span>
      </div>
      <div class="info-row">
        <span class="value">${context.hasMedications ? 'نعم' : 'لا'}</span>
        <span class="label">:يتناول أدوية</span>
      </div>
      ${context.hasMedications && context.medications ? `
      <div class="info-row">
        <span class="value">${context.medications}</span>
        <span class="label">:الأدوية</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="value">${context.hasFoodAllergies ? 'نعم' : 'لا'}</span>
        <span class="label">:لديه حساسية غذائية</span>
      </div>
      ${context.hasFoodAllergies && context.foodAllergies ? `
      <div class="info-row">
        <span class="value">${context.foodAllergies}</span>
        <span class="label">:الحساسية الغذائية</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="value">${context.doctorClearance || 'غير محدد'}</span>
        <span class="label">:موافقة الطبيب</span>
      </div>
    </div>

    <!-- العادات الغذائية الحالية -->
    <div class="section">
      <h3>العادات الغذائية الحالية</h3>
      <div class="info-row">
        <span class="value">${context.mealsPerDay || 'غير محدد'}</span>
        <span class="label">:عدد الوجبات يومياً</span>
      </div>
      <div class="info-row">
        <span class="value">${context.eatingOutFrequency || 'غير محدد'}</span>
        <span class="label">:تكرار تناول الطعام خارج المنزل</span>
      </div>
      <div class="info-row">
        <span class="value">${context.sugaryDrinks || 'غير محدد'}</span>
        <span class="label">:المشروبات السكرية</span>
      </div>
      <div class="info-row">
        <span class="value">${context.waterIntake || 'غير محدد'}</span>
        <span class="label">:كمية الماء يومياً</span>
      </div>
    </div>

    <!-- نمط الحياة والعادات -->
    <div class="section">
      <h3>نمط الحياة والعادات</h3>
      <div class="info-row">
        <span class="value">${context.sleepHours || 'غير محدد'}</span>
        <span class="label">:ساعات النوم</span>
      </div>
      <div class="info-row">
        <span class="value">${context.exerciseFrequency || 'غير محدد'}</span>
        <span class="label">:تكرار التمارين</span>
      </div>
      <div class="info-row">
        <span class="value multi-value">${context.exerciseTypes ? context.exerciseTypes.replace(/,/g, ' - ') : 'غير محدد'}</span>
        <span class="label">:أنواع التمارين</span>
      </div>
      <div class="info-row">
        <span class="value">${context.stressLevel || 'غير محدد'}</span>
        <span class="label">:مستوى التوتر</span>
      </div>
      <div class="info-row">
        <span class="value">${context.smokingStatus || 'غير محدد'}</span>
        <span class="label">:حالة التدخين</span>
      </div>
      <div class="info-row">
        <span class="value">${context.alcoholConsumption || 'غير محدد'}</span>
        <span class="label">:استهلاك الكحول</span>
      </div>
    </div>

    <!-- التفضيلات والدعم -->
    <div class="section">
      <h3>التفضيلات والدعم</h3>
      <div class="info-row">
        <span class="value">${context.mealPlanPreference || 'غير محدد'}</span>
        <span class="label">:تفضيل خطة الوجبات</span>
      </div>
      <div class="info-row">
        <span class="value multi-value">${context.trainingInterest ? context.trainingInterest.replace(/,/g, ' - ') : 'غير محدد'}</span>
        <span class="label">:اهتمامات التدريب</span>
      </div>
      <div class="info-row">
        <span class="value">${context.hasDietaryRestrictions ? 'نعم' : 'لا'}</span>
        <span class="label">:لديه قيود غذائية</span>
      </div>
      ${context.hasDietaryRestrictions && context.dietaryRestrictions ? `
      <div class="info-row">
        <span class="value">${context.dietaryRestrictions}</span>
        <span class="label">:القيود الغذائية</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="value">${context.coachGenderPreference || 'غير محدد'}</span>
        <span class="label">:تفضيل جنس المدرب</span>
      </div>
      <div class="info-row">
        <span class="value">${context.supportLevel || 'غير محدد'}</span>
        <span class="label">:مستوى الدعم المطلوب</span>
      </div>
    </div>

    <!-- التحديات والنجاحات -->
    <div class="section">
      <h3>التحديات والنجاحات السابقة</h3>
      <div class="info-row">
        <span class="value">${context.biggestChallenge || 'غير محدد'}</span>
        <span class="label">:أكبر التحديات</span>
      </div>
      <div class="info-row">
        <span class="value">${context.pastSuccesses || 'غير محدد'}</span>
        <span class="label">:النجاحات السابقة</span>
      </div>
      <div class="info-row">
        <span class="value">${context.hasSupport || 'غير محدد'}</span>
        <span class="label">:لديه دعم من الأهل/الأصدقاء</span>
      </div>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; margin: 25px 0; text-align: right; direction: rtl;">${context.nextStepsText}</p>
    
    <p style="font-size: 16px; color: #ff6b35; font-weight: bold; text-align: center; direction: rtl;">${context.outroText}</p>
  </div>
  <div class="footer">
    <p>&copy; ${context.year} Evolve Fitness. ${context.rightsText}</p>
    <p>🏋️ رحلتك نحو صحة أفضل تبدأ من هنا</p>
  </div>
</div>
</body>
</html>
  `;
};

// دالة لتوليد النص العادي
const generateEmailText = (context) => {
  return `
🏋️ EVOLVE FITNESS
${context.title}

${context.greeting},

${context.intro}

📋 ${context.personalInfoTitle}:
${context.nameLabel}: ${context.firstName} ${context.lastName}
${context.emailLabel}: ${context.email}
${context.phoneLabel}: ${context.phone}
${context.genderLabel}: ${context.gender}

🎯 ${context.goalsTitle}:
${context.primaryGoalLabel}: ${context.primaryGoal}
${context.currentWeightLabel}: ${context.currentWeight}
${context.targetWeightLabel}: ${context.targetWeight}
${context.heightLabel}: ${context.height}

💪 ${context.lifestyleTitle}:
${context.workoutFrequencyLabel}: ${context.workoutFrequency}
${context.sleepHoursLabel}: ${context.sleepHours}
${context.stressLevelLabel}: ${context.stressLevel}
${context.smokingStatusLabel}: ${context.smokingStatus}

⚙️ ${context.preferencesTitle}:
${context.communicationPreferenceLabel}: ${context.communicationPreference}
${context.emergencyContactLabel}: ${context.emergencyContact}
${context.emergencyPhoneLabel}: ${context.emergencyPhone}

${context.nextStepsText}

🔗 ${context.callToActionText}: ${context.callToActionUrl}

${context.outroText}

© ${context.year} Evolve Fitness. ${context.rightsText}
🏋️ Your Journey to Better Health Starts Here
  `;
};

module.exports = {
  sendTemplateEmail,
  sendEmail
};