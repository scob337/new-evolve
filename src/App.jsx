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
import { Menu } from '@headlessui/react';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import MealDetail from './pages/MealDetail';
import Register from './pages/Register';  
import MenuP from './pages/Menu';

function App() {
  const { i18n } = useTranslation();
  // استخدام اللغة المخزنة في localStorage أو اللغة الافتراضية
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || i18n.language;
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
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // إضافة فئة اللغة إلى الجسم
    document.body.className = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // تخزين اللغة في localStorage
    localStorage.setItem('language', currentLanguage);
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
      <div className="App">
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
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meal/:id" element={<MealDetail />} />
          </Routes>
        </main>
        
        <Footer currentLanguage={currentLanguage} />
      </div>
    </Router>
  );
}

export default App;