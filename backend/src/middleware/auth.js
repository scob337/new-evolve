import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'رمز الوصول مطلوب'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // مؤقتاً بدون التحقق من قاعدة البيانات
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'رمز وصول غير صالح'
    });
  }
};

export const requireAdmin = (req, res, next) => {
  next(); // مؤقتاً بدون التحقق من الصلاحيات
};

// إزالة module.exports واستخدام export بدلاً منه
// export { authenticateToken, requireAdmin }; // اختياري لأن الدوال مُصدرة بالفعل