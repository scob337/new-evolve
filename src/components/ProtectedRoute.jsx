import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // التحقق من حالة تسجيل الدخول من الكوكيز
    const hasLoggedIn = Cookies.get('hasLoggedIn') === 'true';
    
    if (!hasLoggedIn) {
      // إذا لم يكن المستخدم مسجلاً، قم بتوجيهه إلى صفحة تسجيل الدخول
      navigate('/login');
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;