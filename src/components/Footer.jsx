import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = ({ currentLanguage }) => {
  const { t } = useTranslation();

  return (
    <footer>
        <div className="container">
            <div className="footer-content">
                <div className="footer-logo" data-aos="fade-up">
                    <img src="images/evolve-logo.svg" alt="EVOLVE Logo"/>
                    <p data-translate="tagline">Redefining Athletic Excellence in Saudi Arabia</p>
                    <div className="social-links">
                        <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/evolve.saudi" className="social-link"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>

                <div className="footer-links" data-aos="fade-up" data-aos-delay="100">
                    <h3 data-translate="quick_links">Quick Links</h3>
                    <ul>
                        <li><a href="#home" data-translate="home">Home</a></li>
                        <li><a href="#about" data-translate="about_us">About Us</a></li>
                        <li><a href="#services" data-translate="services_footer">Services</a></li>
                                              <li><a href="index.html#contact" data-translate="contact">Contact</a></li>
                    <li><a href="register.html" className="active" data-translate="register_nav">Register</a></li>
                    </ul>
                </div>

                <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
                    <h3 data-translate="services_footer">Services</h3>
                    <ul>
                        <li data-translate="training_programs">Training Programs</li>
                        <li data-translate="nutrition_plans">Nutrition Plans</li>
                        <li data-translate="one_on_one">1-on-1 Coaching</li>
                        <li data-translate="corporate_packages">Corporate Packages</li>
                    </ul>
                </div>

                <div className="footer-hours" data-aos="fade-up" data-aos-delay="300">
                    <h3 data-translate="opening_hours">Opening Hours</h3>
                    <ul>
                        <li data-translate="monday_friday">Monday - Friday: 6am - 10pm</li>
                        <li data-translate="saturday">Saturday: 8am - 8pm</li>
                        <li data-translate="sunday">Sunday: 8am - 6pm</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; <script>document.write(new Date().getFullYear())</script> EVOLVE. <span data-translate="rights_reserved">All Rights Reserved.</span></p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;