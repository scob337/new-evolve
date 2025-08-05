const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// إنشاء ناقل البريد الإلكتروني
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// إعداد محرك القوالب
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./src/templates/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/templates/'),
  extName: '.handlebars',
};

transporter.use('compile', hbs(handlebarOptions));

/**
 * إرسال بريد إلكتروني باستخدام قالب
 * @param {Object} options - خيارات البريد الإلكتروني
 * @param {string} options.to - عنوان المستلم
 * @param {string} options.subject - موضوع البريد الإلكتروني
 * @param {string} options.template - اسم ملف القالب
 * @param {Object} options.context - البيانات المراد تمريرها إلى القالب
 * @returns {Promise}
 */
const sendTemplateEmail = async (options) => {
    const mailOptions = {
    from: options.from || process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    template: options.template,
    context: options.context
  };

  return transporter.sendMail(mailOptions);
};

const sendEmail = async (options) => {
  const mailOptions = {
    from: options.from || process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendTemplateEmail,
  sendEmail
};