import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد Nodemailer مع Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

/**
 * إرسال بريد إلكتروني باستخدام قالب
 * @param {Object} options - خيارات البريد الإلكتروني
 * @param {string} options.to - عنوان المستلم
 * @param {string} options.subject - موضوع البريد
 * @param {string} options.template - اسم القالب (اختياري)
 * @param {Object} options.context - البيانات للقالب
 */
export const sendTemplateEmail = async ({ to, subject, template, context }) => {
  try {
    let html;
    
    if (template) {
      // قراءة قالب HTML
      const templatePath = path.join(__dirname, '..', 'templates', `${template}.handlebars`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateSource);
      html = compiledTemplate(context);
    } else {
      // إنشاء HTML بسيط إذا لم يكن هناك قالب
      html = `
        <div style="font-family: Arial, sans-serif; direction: ${context.dir || 'ltr'}; text-align: ${context.dir === 'rtl' ? 'right' : 'left'};">
          <h2>${context.title || subject}</h2>
          <p>${context.intro || ''}</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            ${Object.entries(context).map(([key, value]) => {
              if (key.includes('Label') || ['dir', 'lang', 'title', 'intro', 'outro'].includes(key)) return '';
              const label = context[key + 'Label'] || key;
              return `<p><strong>${label}:</strong> ${value}</p>`;
            }).join('')}
          </div>
          <p>${context.outro || ''}</p>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال البريد الإلكتروني بنجاح:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ خطأ في إرسال البريد الإلكتروني:', error);
    throw error;
  }
};

/**
 * التحقق من اتصال البريد الإلكتروني
 */
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ اتصال البريد الإلكتروني يعمل بشكل صحيح');
    return true;
  } catch (error) {
    console.error('❌ خطأ في اتصال البريد الإلكتروني:', error);
    return false;
  }
};