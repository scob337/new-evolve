import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = ({ currentLanguage }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="footer-logo" data-aos="fade-up">
                    <img src="/images/evolve-logo.svg" alt="EVOLVE Logo" className="h-12 mb-4"/>
                    <p className="text-gray-300 mb-4">{t('footer_desc')}</p>
                    <div className="flex space-x-4 rtl:space-x-reverse">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/evolve.saudi" className="text-gray-400 hover:text-white transition-colors">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>

                <div className="footer-links" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-lg font-semibold mb-4">{t('quick_links')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">{t('home')}</Link></li>
                        {/* <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{t('about')}</Link></li> */}
                        {/* <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">{t('services')}</Link></li> */}
                        <li><Link to="/menu" className="text-gray-400 hover:text-white transition-colors">{t('menu')}</Link></li>
                        {/* <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('contact')}</Link></li> */}
                        {/* <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">{t('register')}</Link></li> */}
                    </ul>
                </div>

                <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
                    <h3 className="text-lg font-semibold mb-4">{t('our_services')}</h3>
                    <ul className="space-y-2">
                        <li className="text-gray-400">{t('service1_title')}</li>
                        <li className="text-gray-400">{t('service2_title')}</li>
                        <li className="text-gray-400">{t('service4_title')}</li>
                        <li className="text-gray-400">{t('service5_title')}</li>
                    </ul>
                </div>

                <div className="footer-hours" data-aos="fade-up" data-aos-delay="300">
                    <h3 className="text-lg font-semibold mb-4">{t('hours')}</h3>
                    <ul className="space-y-2">
                        <li className="text-gray-400">{t('mon_fri')}</li>
                        <li className="text-gray-400">{t('saturday')}</li>
                        <li className="text-gray-400">{t('sunday')}</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-400">{t('copyright')}</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;