const { sendEmail } = require('./emailService');

/**
 * فحص صحة إعدادات البريد الإلكتروني
 */
const checkEmailHealth = async () => {
  console.log('🔍 بدء فحص صحة خدمة البريد الإلكتروني...');
  
  // التحقق من متغيرات البيئة
  const requiredEnvVars = {
    'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY,
    'EMAIL_FROM': process.env.EMAIL_FROM,
    'ADMIN_EMAIL': process.env.ADMIN_EMAIL
  };
  
  const missingVars = [];
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }
  
  if (missingVars.length > 0) {
    console.error('❌ متغيرات البيئة المفقودة:', missingVars);
    return {
      success: false,
      error: 'متغيرات البيئة المطلوبة مفقودة',
      missingVars
    };
  }
  
  // اختبار إرسال بريد إلكتروني تجريبي
  try {
    const testResult = await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'اختبار صحة خدمة البريد الإلكتروني',
      text: 'هذه رسالة اختبار للتأكد من عمل خدمة البريد الإلكتروني بشكل صحيح.',
      html: '<p>هذه رسالة اختبار للتأكد من عمل خدمة البريد الإلكتروني بشكل صحيح.</p>'
    });
    
    console.log('✅ تم إرسال البريد الإلكتروني التجريبي بنجاح');
    return {
      success: true,
      messageId: testResult.messageId,
      message: 'خدمة البريد الإلكتروني تعمل بشكل صحيح'
    };
  } catch (error) {
    console.error('❌ فشل في إرسال البريد الإلكتروني التجريبي:', error.message);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

module.exports = {
  checkEmailHealth
};