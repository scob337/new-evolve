const { validationResult } = require('express-validator');
const { sendTemplateEmail } = require('../utils/emailService');

/**
 * معالجة تقديم نموذج الاتصال
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 */
exports.submitContactForm = async (req, res) => {
  try {
    // التحقق من صحة المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, subject, message } = req.body;
    const currentYear = new Date().getFullYear();
    
    // إرسال بريد إلكتروني إلى المسؤول
    await sendTemplateEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `نموذج اتصال جديد: ${subject}`,
      template: 'contact', // إضافة الـ template
      context: {
        dir: 'rtl',
        lang: 'ar',
        title: 'رسالة اتصال جديدة',
        greeting: 'مرحباً',
        intro: 'لقد تلقيت رسالة جديدة من نموذج الاتصال على موقع Evolve Fitness:',
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        phoneLabel: 'الهاتف',
        subjectLabel: 'الموضوع',
        messageLabel: 'الرسالة',
        name,
        email,
        phone,
        subject,
        message,
        outro: 'يرجى الرد على هذه الرسالة في أقرب وقت ممكن.',
        year: currentYear,
        rightsText: 'جميع الحقوق محفوظة'
      }
    });
    
    // إرسال بريد إلكتروني تأكيد إلى المستخدم
    await sendTemplateEmail({
      to: email,
      subject: 'شكراً لتواصلك مع Evolve Fitness',
      template: 'contact',
      context: {
        dir: 'rtl',
        lang: 'ar',
        title: 'تم استلام رسالتك',
        greeting: `مرحباً ${name}`,
        intro: 'شكراً لتواصلك معنا. لقد تلقينا رسالتك وسنرد عليك في أقرب وقت ممكن.',
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        phoneLabel: 'الهاتف',
        subjectLabel: 'الموضوع',
        messageLabel: 'الرسالة',
        name,
        email,
        phone,
        subject,
        message,
        outro: 'نشكرك على اهتمامك بخدماتنا وسنتواصل معك قريباً.',
        year: currentYear,
        rightsText: 'جميع الحقوق محفوظة'
      }
    });

    res.status(200).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إرسال نموذج الاتصال:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.'
    });
  }
};