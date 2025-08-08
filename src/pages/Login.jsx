import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputField } from '../components/FormComponents';
import Cookies from 'js-cookie';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // استرجاع بيانات المستخدم من متغيرات البيئة
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الخطأ عندما يبدأ المستخدم في الكتابة
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // مسح رسالة خطأ تسجيل الدخول
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // التحقق من اسم المستخدم
    if (!formData.username.trim()) {
      newErrors.username = isRTL ? 'اسم المستخدم مطلوب' : 'Username is required';
    }
    
    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // التحقق من بيانات تسجيل الدخول
    if (formData.username === adminUsername && formData.password === adminPassword) {
      // تسجيل الدخول بنجاح
      // تخزين حالة تسجيل الدخول في الكوكيز بدلاً من localStorage
      Cookies.set('hasLoggedIn', 'true', { expires: 7 }); // تنتهي صلاحيتها بعد 7 أيام
      navigate('/dashboard');
    } else {
      // فشل تسجيل الدخول
      setLoginError(isRTL ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isRTL ? 'تسجيل الدخول' : 'Sign in'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRTL ? 'أدخل بيانات الدخول للوصول إلى لوحة التحكم' : 'Enter your credentials to access the dashboard'}
          </p>
        </div>
        
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <InputField
              label={isRTL ? 'اسم المستخدم' : 'Username'}
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
              required
              autoComplete="username"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            
            <InputField
              label={isRTL ? 'كلمة المرور' : 'Password'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
              required
              autoComplete="current-password"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                </span>
              ) : (
                <span>{isRTL ? 'تسجيل الدخول' : 'Sign in'}</span>
              )}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <Link to="/" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
              {isRTL ? 'العودة إلى الصفحة الرئيسية' : 'Back to home page'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;