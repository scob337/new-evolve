import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    // البيانات الشخصية
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    
    // أهداف الصحة
    primaryGoal: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    
    // نمط الحياة
    workoutFrequency: '',
    sleepHours: '',
    stressLevel: '',
    smokingStatus: '',
    
    // التفضيلات والدعم
    dietaryRestrictions: '',
    hasDietaryRestrictions: false,
    communicationPreference: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // مسح الخطأ عند بدء الكتابة
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // التحقق من البيانات الشخصية
    if (!formData.firstName.trim()) newErrors.firstName = t('first_name_required');
    if (!formData.lastName.trim()) newErrors.lastName = t('last_name_required');
    if (!formData.email.trim()) newErrors.email = t('email_required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('email_invalid');
    if (!formData.phone.trim()) newErrors.phone = t('phone_required');
    if (!formData.age.trim()) newErrors.age = t('age_required');
    if (!formData.gender) newErrors.gender = t('gender_required');
    
    // التحقق من أهداف الصحة
    if (!formData.primaryGoal) newErrors.primaryGoal = t('primary_goal_required');
    if (!formData.currentWeight.trim()) newErrors.currentWeight = t('current_weight_required');
    if (!formData.targetWeight.trim()) newErrors.targetWeight = t('target_weight_required');
    if (!formData.height.trim()) newErrors.height = t('height_required');
    
    // التحقق من نمط الحياة
    if (!formData.workoutFrequency) newErrors.workoutFrequency = t('workout_frequency_required');
    if (!formData.sleepHours) newErrors.sleepHours = t('sleep_hours_required');
    
    // التحقق من التفضيلات والدعم
    if (!formData.communicationPreference) newErrors.communicationPreference = t('communication_preference_required');
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = t('emergency_contact_required');
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = t('emergency_phone_required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // التمرير إلى أول خطأ
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.message || t('registration_error'));
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || t('registration_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('registration_success_title')}</h2>
            <p className="text-lg text-gray-600 mb-8">{t('registration_success_message')}</p>
            <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-300">
              {t('back_to_home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* قسم العنوان */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4" data-aos="fade-up">
              {t('join_evolve')}
            </h1>
            <p className="text-xl text-orange-100" data-aos="fade-up" data-aos-delay="200">
              {t('registration_description')}
            </p>
          </div>
        </div>
      </section>

      {/* نموذج التسجيل */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
            <form onSubmit={handleSubmit}>
              {/* البيانات الشخصية */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('personal_information')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('first_name')} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enter_first_name')}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('last_name')} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enter_last_name')}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('age')} *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.age ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enter_age')}
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('gender')} *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t('select_gender')}</option>
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('enter_email')}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('enter_phone')}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              {/* أهداف الصحة */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('health_goals')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('primary_goal')} *
                  </label>
                  <select
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.primaryGoal ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('select_goal')}</option>
                    <option value="weight_loss">{t('weight_loss')}</option>
                    <option value="muscle_gain">{t('muscle_gain')}</option>
                    <option value="maintenance">{t('maintenance')}</option>
                    <option value="athletic_performance">{t('athletic_performance')}</option>
                    <option value="general_health">{t('general_health')}</option>
                  </select>
                  {errors.primaryGoal && <p className="text-red-500 text-sm mt-1">{errors.primaryGoal}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('current_weight')} (kg) *
                    </label>
                    <input
                      type="number"
                      name="currentWeight"
                      value={formData.currentWeight}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.currentWeight ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="70"
                    />
                    {errors.currentWeight && <p className="text-red-500 text-sm mt-1">{errors.currentWeight}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('target_weight')} (kg) *
                    </label>
                    <input
                      type="number"
                      name="targetWeight"
                      value={formData.targetWeight}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.targetWeight ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="65"
                    />
                    {errors.targetWeight && <p className="text-red-500 text-sm mt-1">{errors.targetWeight}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('height')} (cm) *
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.height ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="170"
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                  </div>
                </div>
              </div>
              
              {/* نمط الحياة */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('lifestyle_habits')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('workout_frequency')} *
                    </label>
                    <select
                      name="workoutFrequency"
                      value={formData.workoutFrequency}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.workoutFrequency ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t('select_frequency')}</option>
                      <option value="never">{t('never')}</option>
                      <option value="1-2">{t('1_2_times_week')}</option>
                      <option value="3-4">{t('3_4_times_week')}</option>
                      <option value="5+">{t('5_plus_times_week')}</option>
                    </select>
                    {errors.workoutFrequency && <p className="text-red-500 text-sm mt-1">{errors.workoutFrequency}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('sleep_hours')} *
                    </label>
                    <select
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.sleepHours ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t('select_sleep_hours')}</option>
                      <option value="less_than_5">{t('less_than_5')}</option>
                      <option value="5-6">{t('5_6_hours')}</option>
                      <option value="7-8">{t('7_8_hours')}</option>
                      <option value="8+">{t('8_plus_hours')}</option>
                    </select>
                    {errors.sleepHours && <p className="text-red-500 text-sm mt-1">{errors.sleepHours}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('stress_level')}
                    </label>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <label className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="radio"
                          name="stressLevel"
                          value="yes"
                          checked={formData.stressLevel === 'yes'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{t('yes')}</span>
                      </label>
                      <label className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="radio"
                          name="stressLevel"
                          value="no"
                          checked={formData.stressLevel === 'no'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{t('no')}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('smoking_status')}
                    </label>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <label className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="radio"
                          name="smokingStatus"
                          value="yes"
                          checked={formData.smokingStatus === 'yes'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{t('yes')}</span>
                      </label>
                      <label className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="radio"
                          name="smokingStatus"
                          value="no"
                          checked={formData.smokingStatus === 'no'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{t('no')}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* التفضيلات والدعم */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('preferences_support')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('dietary_restrictions')}
                  </label>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mb-2">
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="hasDietaryRestrictions"
                        value="true"
                        checked={formData.hasDietaryRestrictions === true}
                        onChange={() => setFormData({...formData, hasDietaryRestrictions: true})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{t('yes')}</span>
                    </label>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="hasDietaryRestrictions"
                        value="false"
                        checked={formData.hasDietaryRestrictions === false}
                        onChange={() => setFormData({...formData, hasDietaryRestrictions: false})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{t('no')}</span>
                    </label>
                  </div>
                  {formData.hasDietaryRestrictions && (
                    <input
                      type="text"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={t('enter_dietary_restrictions')}
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('communication_preference')} *
                  </label>
                  <select
                    name="communicationPreference"
                    value={formData.communicationPreference}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.communicationPreference ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('select_communication')}</option>
                    <option value="email">{t('email')}</option>
                    <option value="phone">{t('phone')}</option>
                    <option value="whatsapp">{t('whatsapp')}</option>
                    <option value="app">{t('mobile_app')}</option>
                  </select>
                  {errors.communicationPreference && <p className="text-red-500 text-sm mt-1">{errors.communicationPreference}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('emergency_contact')} *
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('emergency_contact_name')}
                    />
                    {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('emergency_phone')} *
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('emergency_contact_phone')}
                    />
                    {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                  </div>
                </div>
              </div>
              
              {/* زر الإرسال */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('submitting') : t('complete_registration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;