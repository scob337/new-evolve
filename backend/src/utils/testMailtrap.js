const { sendEmail } = require('./emailService');

/**
 * اختبار إعدادات Mailtrap
 */
const testMailtrapConnection = async () => {
  console.log('🧪 بدء اختبار اتصال Mailtrap...');
  
  try {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'f.alamoudi@evolvetheapp.com',
      subject: '🧪 اختبار Mailtrap - Evolve Fitness',
      text: 'هذه رسالة اختبار للتأكد من عمل Mailtrap بشكل صحيح.',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c5aa0; text-align: center;">🧪 اختبار Mailtrap</h2>
          <p>مرحباً،</p>
          <p>هذه رسالة اختبار للتأكد من عمل <strong>Mailtrap</strong> بشكل صحيح مع تطبيق Evolve Fitness.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">✅ تم الاختبار بنجاح!</h3>
            <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-EG')}</p>
            <p><strong>الخدمة:</strong> Mailtrap</p>
            <p><strong>الحالة:</strong> متصل ويعمل بشكل صحيح</p>
          </div>
          <p>يمكنك الآن استخدام النظام لإرسال رسائل التسجيل والتأكيد.</p>
          <hr style="margin: 30px 0;">
          <p style="text-align: center; color: #6c757d; font-size: 12px;">
            Evolve Fitness © ${new Date().getFullYear()}
          </p>
        </div>
      `
    });
    
    console.log('✅ تم إرسال رسالة الاختبار بنجاح!');
    console.log('📊 تفاصيل الإرسال:', result);
    
    return {
      success: true,
      message: 'Mailtrap يعمل بشكل صحيح',
      details: result
    };
  } catch (error) {
    console.error('❌ فشل اختبار Mailtrap:', error.message);
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.originalError
    };
  }
};

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  require('dotenv').config();
  testMailtrapConnection()
    .then(result => {
      console.log('\n📋 نتيجة الاختبار:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ خطأ في تشغيل الاختبار:', error);
      process.exit(1);
    });
}

module.exports = {
  testMailtrapConnection
};