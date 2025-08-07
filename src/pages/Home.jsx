import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useState } from 'react'; // إضافة useState
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const { t } = useTranslation();

  // إضافة state للـ contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // دالة معالجة تغيير المدخلات
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // دالة إرسال نموذج الاتصال
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // التحقق من صحة البيانات
    const errors = {};
    if (!contactForm.name.trim()) {
      errors.name = 'الاسم مطلوب';
    }
    if (!contactForm.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    if (!contactForm.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
    }
    if (!contactForm.message.trim()) {
      errors.message = 'الرسالة مطلوبة';
    }

    if (Object.keys(errors).length > 0) {
      setSubmitMessage('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/f.alamoudi@evolvetheapp.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...contactForm,
          _subject: "رسالة جديدة من موقع EVOLVE - الصفحة الرئيسية",
          _template: "table",
          _captcha: "false"
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا، سنرد عليك في أقرب وقت ممكن.');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'حدث خطأ أثناء إرسال الرسالة');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage('حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // تكوين تأثيرات الحركة
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // بيانات الشرائح للقسم الرئيسي
  const heroSlides = [
    { image: '/images/slide1.png', alt: 'Gym Training' },
    { image: '/images/slide2.png', alt: 'Strength Training' },
    { image: '/images/slide3.png', alt: 'Fitness Equipment' },
    { image: '/images/slide4.png', alt: 'Fitness Equipment' }
  ];

  // بيانات الميزات في قسم "من نحن"
  const features = [
    {
      icon: 'fas fa-check',
      colorClass: '',
      titleKey: 'vision_title',
      textKey: 'vision_text'
    },
    {
      icon: 'fas fa-bolt',
      colorClass: 'orange',
      titleKey: 'mission_title',
      textKey: 'mission_text'
    }
  ];

  // بيانات الخدمات
  const services = [
    {
      icon: 'fas fa-mobile-alt',
      titleKey: 'service3_title', // تطبيق EVOLVE
      items: ['service3_item1', 'service3_item2', 'service3_item3']
    },
    {
      icon: 'fas fa-apple-whole',
      titleKey: 'service2_title', // التغذية الرياضية
      items: ['service2_item1', 'service2_item2', 'service2_item3']
    },
    {
      icon: 'fas fa-dumbbell',
      titleKey: 'service1_title', // برامج التدريب النخبوية
      items: ['service1_item1', 'service1_item2', 'service1_item3']
    },
    {
      icon: 'fas fa-chart-line',
      titleKey: 'service6_title', // تحليلات الأداء
      items: ['service6_item1', 'service6_item2', 'service6_item3']
    },
    {
      icon: 'fas fa-building',
      titleKey: 'service5_title', // الباقات المؤسسية
      items: ['service5_item1', 'service5_item2', 'service5_item3']
    },
    {
      icon: 'fas fa-users',
      titleKey: 'service4_title', // التدريب الشخصي 1-on-1
      items: ['service4_item1', 'service4_item2', 'service4_item3']
    }
  ];

  // بيانات معلومات الاتصال
  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      titleKey: 'address',
      textKey: 'address_text'
    },
    {
      icon: 'fas fa-phone',
      titleKey: 'phone',
      text: '0557983554'
    },
    {
      icon: 'fas fa-envelope',
      titleKey: 'email',
      text: 'Info@evolvetheapp.com'
    }
  ];

  return (
    <div >
      {/* قسم الصفحة الرئيسية مع شرائح العرض */}
      <section id="home" className="hero">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000 }}
          className="hero-carousel"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img src={slide.image} alt={slide.alt} className="hero-bg" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="hero-overlay"></div>
      </section>
      
      {/* قسم من نحن */}
      <section id="about" className="about">
        <div className="container">
          <motion.div 
            className="section-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="section-title">
              {t('about_evolve').split(' ').map((word, index) => (
                index === 1 ? <span key={index}>{word}</span> : word + ' '
              ))}
            </h2>
          </motion.div>
          <div className="divider"></div>
          
          <div className="about-content">
            <motion.div 
              className="about-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3>{t('about_title')}</h3>
              <p>{t('about_p1')}</p>
              <p>{t('about_p2')}</p>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="feature-box"
                    variants={fadeInUp}
                  >
                    <div className={`feature-icon ${feature.colorClass}`}>
                      <i className={feature.icon}></i>
                    </div>
                    <div className="feature-text">
                      <h4>{t(feature.titleKey)}</h4>
                      <p>{t(feature.textKey)}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img src="/images/2.jpg" alt="Gym Training" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section id="services" className="services">
        <div className="container">
          <motion.div 
            className="section-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="section-title">
              {t('our_services').split(' ').map((word, index) => (
                index === 1 ? <span key={index}>{word}</span> : word + ' '
              ))}
            </h2>
          </motion.div>
          <div className="divider"></div>
          <motion.p 
            className="services-intro"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {t('services_intro')}
          </motion.p>

          <motion.div 
            className="services-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                className="service-card"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h3>{t(service.titleKey)}</h3>
                <ul>
                  {service.items.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-chevron-right"></i> 
                      <span>{t(item)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* قسم الدعوة للعمل */}
      <section className="cta">
        <div className="cta-overlay"></div>
        <div className="container">
          <motion.div 
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp}>{t('cta_title')}</motion.h2>
            <motion.p variants={fadeInUp}>{t('cta_text')}</motion.p>
            <motion.a 
              href="#contact" 
              className="btn"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('get_started_now')}
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* قسم الاتصال */}
      <section id="contact" className="contact">
        <div className="container">
          <motion.div 
            className="section-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="section-title">
              {t('contact_us').split(' ').map((word, index) => (
                index === 1 ? <span key={index}>{word}</span> : word + ' '
              ))}
            </h2>
          </motion.div>
          <div className="divider"></div>

          <div className="contact-content">
            <motion.div 
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3>{t('get_in_touch')}</h3>
              <p>{t('contact_intro')}</p>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    className="contact-item"
                    variants={fadeInUp}
                  >
                    <div className="contact-icon">
                      <i className={info.icon}></i>
                    </div>
                    <div className="contact-text">
                      <h4>{t(info.titleKey)}</h4>
                      <p>{info.textKey ? t(info.textKey) : info.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* نموذج الاتصال */}
            <motion.div 
              className="contact-form"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3>{t('send_message')}</h3>
              
              {/* رسالة النتيجة */}
              {submitMessage && (
                <div className={`form-notification ${
                  submitMessage.includes('بنجاح') ? 'success' : 'error'
                }`}>
                  {submitMessage}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t('name')}</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      placeholder={t('enter_full_name')} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('email')}</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      placeholder={t('enter_email')} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">{t('phone')}</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={contactForm.phone}
                      onChange={handleContactInputChange}
                      placeholder={t('enter_phone')} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">{t('message')}</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    placeholder={t('enter_message')} 
                    required
                  ></textarea>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                      </span>
                      <span>{t('sending')}</span>
                    </>
                  ) : (
                    <span>{t('send_message')}</span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* زر العودة للأعلى */}
      <motion.a 
        href="#" 
        id="back-to-top" 
        className="back-to-top"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        whileHover={{ y: -5 }}
        aria-label={t('back_to_top')}
        title={t('back_to_top')}
      >
        <i className="fas fa-chevron-up"></i>
        <span className="sr-only">{t('back_to_top')}</span>
      </motion.a>
    </div>
  );
};

export default Home;