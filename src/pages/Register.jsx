import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '', // إضافة حقل الإيميل
    mobile: '', // إضافة حقل الموبايل
    age: '',
    gender: '',
    height: '',
    weight: '',
    occupation: '',
    cityCountry: '',
    
    // Goals & Motivation
    targetWeight: '',
    targetDate: '',
    weightLossReasons: [],
    motivationLevel: '',
    
    // Health & Medical
    medicalConditions: [],
    medications: '',
    hasMedications: false,
    foodAllergies: '',
    hasFoodAllergies: false,
    doctorClearance: '',
    
    // Current Habits
    mealsPerDay: '',
    eatingOutFrequency: '',
    sugaryDrinks: '',
    waterIntake: '',
    sleepHours: '',
    exerciseFrequency: '',
    exerciseTypes: [],
    
    // Preferences & Support
    mealPlanPreference: '',
    trainingInterest: [],
    dietaryRestrictions: '',
    hasDietaryRestrictions: false,
    coachGenderPreference: '',
    supportLevel: '',
    
    // Lifestyle & Readiness
    stressLevel: '',
    smokingStatus: '',
    alcoholConsumption: '',
    biggestChallenge: '',
    pastSuccesses: '',
    hasSupport: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'weightLossReasons' || name === 'medicalConditions' || name === 'exerciseTypes' || name === 'trainingInterest') {
        // Handle checkbox arrays
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        // Handle single checkboxes
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      // Handle other input types
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Helper function للتحقق من القيم
    const isEmpty = (value) => {
      if (typeof value === 'string') {
        return !value.trim();
      }
      return !value && value !== 0;
    };
    
    // Basic Information validation
    if (isEmpty(formData.fullName)) newErrors.fullName = 'Full name is required';
    if (isEmpty(formData.email)) newErrors.email = 'Email is required';
    if (isEmpty(formData.mobile)) newErrors.mobile = 'Mobile is required';
    if (isEmpty(formData.age)) newErrors.age = 'Age is required';
    if (isEmpty(formData.gender)) newErrors.gender = 'Gender is required';
    if (isEmpty(formData.height)) newErrors.height = 'Height is required';
    if (isEmpty(formData.weight)) newErrors.weight = 'Weight is required';
    if (isEmpty(formData.occupation)) newErrors.occupation = 'Occupation is required';
    if (isEmpty(formData.cityCountry)) newErrors.cityCountry = 'City & Country is required';
    
    // Goals & Motivation validation
    if (isEmpty(formData.targetWeight)) newErrors.targetWeight = 'Target weight is required';
    if (isEmpty(formData.targetDate)) newErrors.targetDate = 'Target date is required';
    if (isEmpty(formData.motivationLevel)) newErrors.motivationLevel = 'Motivation level is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
        throw new Error(data.message || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className=" min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-lg text-gray-600 mb-8">Thank you for registering with EVOLVE. We will contact you shortly to begin your fitness journey.</p>
            <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              Evolve Weight Loss Intake Survey
            </h1>
            <p className="text-xl text-orange-100">
              Complete this survey to start your personalized weight loss journey
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-8">
            <form onSubmit={handleSubmit}>
              
              {/* Basic Information */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  {/* إضافة حقل الإيميل */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  {/* إضافة حقل الموبايل */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your mobile number"
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.age ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your age"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Female</span>
                      </label>
                    </div>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm) *
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.weight ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="70"
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation *
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.occupation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your occupation"
                    />
                    {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City & Country *
                    </label>
                    <input
                      type="text"
                      name="cityCountry"
                      value={formData.cityCountry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.cityCountry ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Riyadh, Saudi Arabia"
                    />
                    {errors.cityCountry && <p className="text-red-500 text-sm mt-1">{errors.cityCountry}</p>}
                  </div>
                </div>
              </div>

              {/* Goals & Motivation */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">Goals & Motivation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What is your target weight? (kg) *
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
                      By when do you hope to achieve this? *
                    </label>
                    <input
                      type="date"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.targetDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.targetDate && <p className="text-red-500 text-sm mt-1">{errors.targetDate}</p>}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Why do you want to lose weight? (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Improve health',
                      'Improve appearance', 
                      'Increase energy',
                      'Boost confidence',
                      'Prepare for an event',
                      'Doctor\'s recommendation'
                    ].map((reason) => (
                      <label key={reason} className="flex items-center">
                        <input
                          type="checkbox"
                          name="weightLossReasons"
                          value={reason}
                          checked={formData.weightLossReasons.includes(reason)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="weightLossReasons"
                          value="other"
                          checked={formData.weightLossReasons.includes('other')}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Other:</span>
                        <input
                          type="text"
                          name="otherReason"
                          value={formData.otherReason || ''}
                          onChange={handleInputChange}
                          className="ml-2 flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Specify other reason"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    On a scale from 1–10, how motivated are you to lose weight? *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[1,2,3,4,5,6,7,8,9,10].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="motivationLevel"
                          value={level.toString()}
                          checked={formData.motivationLevel === level.toString()}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-1 text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                  {errors.motivationLevel && <p className="text-red-500 text-sm mt-1">{errors.motivationLevel}</p>}
                </div>
              </div>

              {/* Health & Medical */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">Health & Medical</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have any of the following conditions? (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Diabetes',
                      'High blood pressure',
                      'High cholesterol',
                      'PCOS',
                      'Thyroid issues',
                      'Joint problems',
                      'Sleep apnea'
                    ].map((condition) => (
                      <label key={condition} className="flex items-center">
                        <input
                          type="checkbox"
                          name="medicalConditions"
                          value={condition}
                          checked={formData.medicalConditions.includes(condition)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{condition}</span>
                      </label>
                    ))}
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="medicalConditions"
                          value="other"
                          checked={formData.medicalConditions.includes('other')}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Other:</span>
                        <input
                          type="text"
                          name="otherCondition"
                          value={formData.otherCondition || ''}
                          onChange={handleInputChange}
                          className="ml-2 flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Specify other condition"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Are you currently taking any medications?
                    </label>
                    <div className="flex items-center space-x-6 mb-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasMedications"
                          value="true"
                          checked={formData.hasMedications === true}
                          onChange={() => setFormData({...formData, hasMedications: true})}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasMedications"
                          value="false"
                          checked={formData.hasMedications === false}
                          onChange={() => setFormData({...formData, hasMedications: false})}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {formData.hasMedications && (
                      <input
                        type="text"
                        name="medications"
                        value={formData.medications}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="List your medications"
                      />
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you have any food allergies or intolerances?
                    </label>
                    <div className="flex items-center space-x-6 mb-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasFoodAllergies"
                          value="true"
                          checked={formData.hasFoodAllergies === true}
                          onChange={() => setFormData({...formData, hasFoodAllergies: true})}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasFoodAllergies"
                          value="false"
                          checked={formData.hasFoodAllergies === false}
                          onChange={() => setFormData({...formData, hasFoodAllergies: false})}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {formData.hasFoodAllergies && (
                      <input
                        type="text"
                        name="foodAllergies"
                        value={formData.foodAllergies}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="List your food allergies"
                      />
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have clearance from a doctor to begin a diet or fitness plan?
                  </label>
                  <div className="flex items-center space-x-6">
                    {['Yes', 'No', 'Not sure'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="doctorClearance"
                          value={option.toLowerCase()}
                          checked={formData.doctorClearance === option.toLowerCase()}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Habits */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">Current Habits</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How many meals do you eat per day?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['1', '2', '3', '4+'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="mealsPerDay"
                            value={option}
                            checked={formData.mealsPerDay === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How often do you eat out or order food weekly?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Never', '1–2 times', '3–5 times', 'Daily'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="eatingOutFrequency"
                            value={option}
                            checked={formData.eatingOutFrequency === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you consume sugary drinks (soda/juice/energy drinks)?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['Rarely', 'Sometimes', 'Daily'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="sugaryDrinks"
                            value={option}
                            checked={formData.sugaryDrinks === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      On average, how much water do you drink per day?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['< 1L', '1–2L', '2–3L', '3+L'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="waterIntake"
                            value={option}
                            checked={formData.waterIntake === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How many hours of sleep do you get on average?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['< 5', '5–6', '7–8', '8+'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="sleepHours"
                            value={option}
                            checked={formData.sleepHours === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How often do you exercise per week?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Never', '1–2x', '3–4x', '5+'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="exerciseFrequency"
                            value={option}
                            checked={formData.exerciseFrequency === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What type of exercise do you currently do (if any)?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Walking',
                      'Gym',
                      'Home workouts',
                      'Swimming',
                      'Cycling'
                    ].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          name="exerciseTypes"
                          value={type}
                          checked={formData.exerciseTypes.includes(type)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="exerciseTypes"
                          value="other"
                          checked={formData.exerciseTypes.includes('other')}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Other:</span>
                        <input
                          type="text"
                          name="otherExercise"
                          value={formData.otherExercise || ''}
                          onChange={handleInputChange}
                          className="ml-2 flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Specify other exercise"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences & Support */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">Preferences & Support</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you prefer:
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'A structured meal plan',
                      'Flexible eating with guidance',
                      'Meal delivery'
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="mealPlanPreference"
                          value={option}
                          checked={formData.mealPlanPreference === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Are you interested in:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Personal training',
                      'Group training',
                      'Online training',
                      'Nutrition consultation only'
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          name="trainingInterest"
                          value={option}
                          checked={formData.trainingInterest.includes(option)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have any religious or dietary restrictions?
                  </label>
                  <div className="flex items-center space-x-6 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasDietaryRestrictions"
                        value="true"
                        checked={formData.hasDietaryRestrictions === true}
                        onChange={() => setFormData({...formData, hasDietaryRestrictions: true})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasDietaryRestrictions"
                        value="false"
                        checked={formData.hasDietaryRestrictions === false}
                        onChange={() => setFormData({...formData, hasDietaryRestrictions: false})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                  {formData.hasDietaryRestrictions && (
                    <input
                      type="text"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Specify your dietary restrictions"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Would you prefer a coach of a specific gender?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['Male', 'Female', 'No preference'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="coachGenderPreference"
                            value={option}
                            checked={formData.coachGenderPreference === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How much support do you want from your coach?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Daily check-ins', 'Weekly check-ins', 'Monthly', 'Only as needed'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="supportLevel"
                            value={option}
                            checked={formData.supportLevel === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lifestyle & Readiness */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">Lifestyle & Readiness</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you feel stressed regularly?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['Yes', 'No'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="stressLevel"
                            value={option}
                            checked={formData.stressLevel === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you smoke or vape?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['Yes', 'No'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="smokingStatus"
                            value={option}
                            checked={formData.smokingStatus === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you drink alcohol?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['Yes', 'No', 'Occasionally'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="alcoholConsumption"
                            value={option}
                            checked={formData.alcoholConsumption === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you have a support system (friends/family)?
                    </label>
                    <div className="flex items-center space-x-6">
                      {['Yes', 'No'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="hasSupport"
                            value={option}
                            checked={formData.hasSupport === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your biggest challenge when trying to lose weight?
                  </label>
                  <textarea
                    name="biggestChallenge"
                    value={formData.biggestChallenge}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe your biggest challenge..."
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What has worked for you in the past, if anything?
                  </label>
                  <textarea
                    name="pastSuccesses"
                    value={formData.pastSuccesses}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe what has worked for you before..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-12 py-4 rounded-lg font-medium text-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Survey...' : 'Submit Survey'}
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