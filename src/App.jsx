import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import MealDetail from './pages/MealDetail';
import MenuP from './pages/Menu';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // استيراد مكون ProtectedRoute

function App() {
  const { i18n } = useTranslation();
  // استخدام اللغة المخزنة في localStorage أو اللغة الافتراضية
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  useEffect(() => {
    // تحديث اللغة في i18n عند تحميل التطبيق
    i18n.changeLanguage(currentLanguage);
  }, []);

  useEffect(() => {
    // تحديث اتجاه المستند بناءً على اللغة
    const isRTL = currentLanguage === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // إضافة فئة اللغة إلى الجسم
    document.body.className = isRTL ? 'rtl' : 'ltr';
    
    // إضافة فئة CSS للـ HTML element
    document.documentElement.className = isRTL ? 'rtl' : 'ltr';
    
    // تخزين اللغة في localStorage
    localStorage.setItem('language', currentLanguage);
    
    // تحديث خصائص CSS المخصصة للاتجاه
    document.documentElement.style.setProperty('--text-align', isRTL ? 'right' : 'left');
    document.documentElement.style.setProperty('--flex-direction', isRTL ? 'row-reverse' : 'row');
  }, [currentLanguage]);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLanguage(newLang);
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className={`App ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header 
          currentLanguage={currentLanguage} 
          toggleLanguage={toggleLanguage} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/menu" element={<MenuP />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/meal/:id" element={<MealDetail />} />
          </Routes>
        </main>
        
        <Footer currentLanguage={currentLanguage} />
      </div>
    </Router>
  );
}

export default App;