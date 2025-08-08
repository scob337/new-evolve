const errorHandler = (err, req, res, next) => {
  console.error('خطأ في الخادم:', err);
  
  // خطأ في التحقق من صحة البيانات
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صالحة',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // خطأ في قاعدة البيانات
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'البيانات موجودة مسبقاً'
    });
  }
  
  // خطأ عام
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;