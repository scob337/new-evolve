import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  InputField, 
  TextareaField, 
  RadioGroup, 
  CheckboxField, 
  SectionHeader 
} from '../components/FormComponents';

const Register = () => {
  const [formData, setFormData] = useState({
    // المعلومات الأساسية
    fullName: '',
    age: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    gender: '',
    phoneNumber: '',
    
    // الأهداف والاشتراك
    occupation: '',
    subscriptionGoal: '',
    otherGoal: '',
    subscriptionPeriod: '',
    
    // النشاط الرياضي
    currentSport: '',
    fitnessLevel: '',
    weeklyWorkoutDays: '',
    weeklySchedule: '',
    
    // الصحة العامة
    healthIssues: '',
    lastBloodTest: '',
    abnormalResults: '',
    currentSupplements: '',
    medications: '',
    
    // نمط الحياة
    dailySteps: '',
    sleepHours: '',
    dietExperience: '',
    reasonForStopping: '',
    bodyHistory: '',
    
    // التغذية
    foodRestrictions: '',
    mealPreparation: '',
    dairyIssues: '',
    
    // معلومات شخصية
    maritalStatus: '',
    additionalInfo: '',
    
    // الالتزام والموافقة
    commitmentToProgram: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
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
    
    // التحقق من الحقول المطلوبة
    const requiredFields = [
      { field: 'fullName', message: 'الاسم الثلاثي مطلوب' },
      { field: 'age', message: 'العمر مطلوب' },
      { field: 'dateOfBirth', message: 'تاريخ الميلاد مطلوب' },
      { field: 'height', message: 'الطول مطلوب' },
      { field: 'weight', message: 'الوزن مطلوب' },
      { field: 'gender', message: 'الجنس مطلوب' },
      { field: 'phoneNumber', message: 'رقم الهاتف مطلوب' },
      { field: 'occupation', message: 'المهنة مطلوبة' },
      { field: 'subscriptionGoal', message: 'هدف الاشتراك مطلوب' },
      { field: 'commitmentToProgram', message: 'يرجى الإجابة على سؤال الالتزام بالبرنامج' }
    ];
    
    requiredFields.forEach(({ field, message }) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = message;
      }
    });
    
    // التحقق من رقم الهاتف
    const phoneRegex = /^[0-9]{10,15}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/[\s-+()]/g, ''))) {
      newErrors.phoneNumber = 'يرجى إدخال رقم هاتف صحيح';
    }
    
    // التحقق من العمر
    const age = parseInt(formData.age);
    if (formData.age && (age < 16 || age > 80)) {
      newErrors.age = 'العمر يجب أن يكون بين 16 و 80 سنة';
    }
    
    // التحقق من الطول
    const height = parseInt(formData.height);
    if (formData.height && (height < 120 || height > 220)) {
      newErrors.height = 'الطول يجب أن يكون بين 120 و 220 سم';
    }
    
    // التحقق من الوزن
    const weight = parseInt(formData.weight);
    if (formData.weight && (weight < 30 || weight > 200)) {
      newErrors.weight = 'الوزن يجب أن يكون بين 30 و 200 كجم';
    }
    
    // التحقق من الموافقة على الشروط
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'يجب الموافقة على الشروط والأحكام للمتابعة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDataForSubmission = (data) => {
    return {
      ...data,
      // تحويل القيم إلى نصوص واضحة
      gender: data.gender === 'male' ? 'ذكر / Male' : data.gender === 'female' ? 'أنثى / Female' : data.gender,
      subscriptionGoal: {
        'fat_loss': 'خسارة الدهون / Fat Loss',
        'muscle_gain': 'بناء العضل / Muscle Gain',
        'both': 'خسارة الدهون وبناء العضل / Both',
        'other': 'هدف آخر / Other'
      }[data.subscriptionGoal] || data.subscriptionGoal,
      commitmentToProgram: {
        'yes': 'نعم، سألتزم بالبرنامج / Yes, I will commit',
        'maybe': 'ربما، حسب الظروف / Maybe, depending on circumstances',
        'no': 'لا، لست متأكد / No, I\'m not sure'
      }[data.commitmentToProgram] || data.commitmentToProgram,
      termsAccepted: data.termsAccepted ? 'موافق / Agreed' : 'غير موافق / Not Agreed'
    };
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
      const formattedData = formatDataForSubmission(formData);
      
      const response = await fetch("https://formsubmit.co/ajax/f.alamoudi@evolvetheapp.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formattedData,
          _subject: "تسجيل جديد في EVOLVE - استمارة التغذية الشاملة",
          _template: "table"
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.message || 'فشل في التسجيل');
      }
      
    } catch (error) {
      console.error('خطأ في التسجيل:', error);
      setErrors({ submit: error.message || 'فشل في التسجيل. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Page
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-orange-100">
            <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              تم التسجيل بنجاح!
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              شكراً لك على اختيار EVOLVE. تم استلام استمارتك بنجاح وسيتواصل معك فريقنا المختص خلال 24 ساعة لبدء رحلتك المخصصة في التغذية الصحية.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8">
              <p className="text-orange-700 font-semibold text-lg">
                💡 نصيحة: تأكد من فحص بريدك الإلكتروني بانتظام للحصول على تحديثات برنامجك الغذائي
              </p>
            </div>
            <Link 
              to="/" 
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition duration-300 shadow-xl transform hover:scale-105"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form Options
  const genderOptions = [
    { value: 'male', label: 'ذكر / Male' },
    { value: 'female', label: 'أنثى / Female' }
  ];

  const goalOptions = [
    { value: 'fat_loss', label: 'خسارة الدهون / Fat Loss' },
    { value: 'muscle_gain', label: 'بناء العضل / Muscle Gain' },
    { value: 'both', label: 'خسارة الدهون وبناء العضل / Both' },
    { value: 'other', label: 'هدف آخر / Other Goal' }
  ];

  const commitmentOptions = [
    { value: 'yes', label: 'نعم، سألتزم بالبرنامج / Yes, I will commit' },
    { value: 'maybe', label: 'ربما، حسب الظروف / Maybe, depending on circumstances' },
    { value: 'no', label: 'لا، لست متأكد / No, I\'m not sure' }
  ];

  const fitnessLevelOptions = [
    { value: 'beginner', label: 'مبتدئ / Beginner' },
    { value: 'intermediate', label: 'متوسط / Intermediate' },
    { value: 'advanced', label: 'متقدم / Advanced' },
    { value: 'professional', label: 'محترف / Professional' }
  ];

  const mealPrepOptions = [
    { value: 'self', label: 'سأجهز وجباتي بنفسي / I will prepare my meals myself' },
    { value: 'restaurant', label: 'سأشترك في مطعم / I will subscribe to a restaurant' },
    { value: 'mixed', label: 'مختلط / Mixed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50" dir="rtl">
      {/* Hero Section */}
<section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
  <div className="absolute inset-0 bg-black opacity-10"></div>
  <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center text-white space-y-8">
      
      <h1 className="text-5xl sm:text-6xl font-bold drop-shadow-2xl leading-tight">
        <div className="flex flex-col  justify-center items-center gap-4">
          <span>استمارة التغذية الشاملة</span> 
          <span className="text-3xl sm:text-4xl text-orange-100">Comprehensive Nutrition Form</span>
        </div>
      </h1>
      
      <p className="text-xl sm:text-2xl text-orange-100 leading-relaxed max-w-4xl mx-auto">
        <span className="block">ابدأ رحلتك المخصصة في التغذية الصحية مع EVOLVE</span>
        <span className="block">Start your personalized healthy nutrition journey with EVOLVE</span>
        <span className="block mt-2">برنامج غذائي مصمم خصيصاً لك</span>
        <span className="block">A nutrition program tailored specifically for you</span>
      </p>
      
      <div className="mt-8 flex justify-center">
        <div className="bg-white bg-opacity-20 rounded-2xl px-8 py-4 backdrop-blur-sm">
          <p className="text-lg font-semibold">
            خدمة مميزة للعملاء المتميزين / Premium service for distinguished clients
          </p>
        </div>
      </div>

    </div>
  </div>
</section>


      {/* Registration Form */}
      <section >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
            <div className="p-8 md:p-16">
              
              {/* عرض رسائل الخطأ العامة */}
              {errors.submit && (
                <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-500 ml-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 font-semibold text-lg">{errors.submit}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-16">
                {/* المعلومات الأساسية */}
                <div>
                  <SectionHeader title="المعلومات الأساسية / Basic Information" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                      label="الاسم الثلاثي / Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      error={errors.fullName}
                      placeholder="أدخل اسمك الثلاثي كاملاً / Enter your full name"
                      required
                    />
                    
                    <InputField
                      label="العمر / Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      error={errors.age}
                      placeholder="25"
                      min="16"
                      max="80"
                      required
                    />
                    
                    <InputField
                      label="تاريخ الميلاد / Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      error={errors.dateOfBirth}
                      required
                    />
                    
                    <InputField
                      label="الطول (سم) / Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleInputChange}
                      error={errors.height}
                      placeholder="170"
                      min="120"
                      max="220"
                      required
                    />
                    
                    <InputField
                      label="الوزن (كجم) / Weight (kg)"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                      error={errors.weight}
                      placeholder="70"
                      min="30"
                      max="200"
                      required
                    />
                    
                    <InputField
                      label="رقم الهاتف / Phone Number"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      error={errors.phoneNumber}
                      placeholder="05xxxxxxxx"
                      required
                    />
                  </div>
                  
                  <div className="mt-8">
                    <RadioGroup
                      label="الجنس / Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      options={genderOptions}
                      error={errors.gender}
                      required
                    />
                  </div>
                </div>

                {/* المهنة والأهداف */}
                <div>
                  <SectionHeader title="المهنة والأهداف / Occupation & Goals" />
                  
                  <div className="space-y-8">
                    <TextareaField
                      label="المهنة؟ وهل هي مكتبية أم ميدانية؟ / Occupation? Is it desk-based or fieldwork?"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      error={errors.occupation}
                      placeholder="مثال: مهندس برمجيات - عمل مكتبي 8 ساعات يومياً / Example: Software Engineer - Desk job 8 hours daily"
                      rows={3}
                      required
                    />
                    
                    <RadioGroup
                      label="ما هو هدفك من الاشتراك؟ / What is your goal from the subscription?"
                      name="subscriptionGoal"
                      value={formData.subscriptionGoal}
                      onChange={handleInputChange}
                      options={goalOptions}
                      error={errors.subscriptionGoal}
                      required
                    />
                    
                    {formData.subscriptionGoal === 'other' && (
                      <TextareaField
                        label="إذا كان هدفك هدف آخر، الرجاء ذكره / If your goal is other, please specify"
                        name="otherGoal"
                        value={formData.otherGoal}
                        onChange={handleInputChange}
                        error={errors.otherGoal}
                        placeholder="اذكر هدفك بالتفصيل... / Specify your goal in detail..."
                        rows={3}
                      />
                    )}
                    
                    <InputField
                      label="ما هي مدة الاشتراك التي تريدها؟ / What is the desired subscription period?"
                      name="subscriptionPeriod"
                      value={formData.subscriptionPeriod}
                      onChange={handleInputChange}
                      error={errors.subscriptionPeriod}
                      placeholder="مثال: 3 أشهر، 6 أشهر، سنة / Example: 3 months, 6 months, 1 year"
                    />
                  </div>
                </div>

                {/* النشاط الرياضي */}
                <div>
                  <SectionHeader title="النشاط الرياضي / Physical Activity" />
                  
                  <div className="space-y-8">
                    <InputField
                      label="إذا كنت تمارس الرياضة حالياً، ما هي رياضتك؟ / If you currently exercise, what is your sport?"
                      name="currentSport"
                      value={formData.currentSport}
                      onChange={handleInputChange}
                      error={errors.currentSport}
                      placeholder="مثال: كمال أجسام، جري، سباحة، كرة قدم... / Example: Bodybuilding, Running, Swimming, Football..."
                    />
                    
                    <RadioGroup
                      label="ما هو مستواك الرياضي؟ / What is your fitness level?"
                      name="fitnessLevel"
                      value={formData.fitnessLevel}
                      onChange={handleInputChange}
                      options={fitnessLevelOptions}
                      error={errors.fitnessLevel}
                    />
                    
                    <InputField
                      label="كم يوم في الأسبوع تتمرن حالياً؟ / How many days a week do you currently exercise?"
                      name="weeklyWorkoutDays"
                      type="number"
                      value={formData.weeklyWorkoutDays}
                      onChange={handleInputChange}
                      error={errors.weeklyWorkoutDays}
                      placeholder="مثال: 3 أيام / Example: 3 days"
                      min="0"
                      max="7"
                    />
                    
                    <TextareaField
                      label="إذا كنت تتمرن حالياً، ما هو جدولك الأسبوعي؟ الرجاء ذكر أنواع التمارين، المدة، وتكرارها / If you currently exercise, what is your weekly workout schedule? Please specify types, duration, and frequency"
                      name="weeklySchedule"
                      value={formData.weeklySchedule}
                      onChange={handleInputChange}
                      error={errors.weeklySchedule}
                      placeholder="مثال: الأحد والثلاثاء والخميس - تمارين أوزان لمدة ساعة ونصف، الجمعة - كارديو لمدة 45 دقيقة / Example: Sunday, Tuesday, Thursday - Weight training for 1.5 hours, Friday - Cardio for 45 minutes"
                      rows={4}
                    />
                  </div>
                </div>

                {/* الصحة العامة */}
                <div>
                  <SectionHeader title="الصحة العامة / General Health" />
                  
                  <div className="space-y-8">
                    <TextareaField
                      label="هل تعاني من مشاكل صحية؟ الرجاء ذكرها بالكامل إن وجدت / Do you suffer from any health issues? Please list them if any"
                      name="healthIssues"
                      value={formData.healthIssues}
                      onChange={handleInputChange}
                      error={errors.healthIssues}
                      placeholder="مثال: ضغط الدم، السكري، مشاكل الغدة الدرقية، الحساسية... أو اكتب 'لا يوجد' إذا لم تكن تعاني من أي مشاكل / Example: Blood pressure, diabetes, thyroid issues, allergies... or write 'None' if you don't have any issues"
                      rows={4}
                    />
                    
                    <TextareaField
                      label="متى قمت بآخر فحص دم؟ وماذا كانت النتائج؟ / When was your last blood test? What were the results?"
                      name="lastBloodTest"
                      value={formData.lastBloodTest}
                      onChange={handleInputChange}
                      error={errors.lastBloodTest}
                      placeholder="مثال: منذ 6 أشهر - جميع النتائج طبيعية عدا فيتامين د منخفض / Example: 6 months ago - All results normal except low vitamin D"
                      rows={3}
                    />
                    
                    <TextareaField
                      label="ما هي النتائج الخارجة عن المعدل الطبيعي؟ / What were the abnormal results?"
                      name="abnormalResults"
                      value={formData.abnormalResults}
                      onChange={handleInputChange}
                      error={errors.abnormalResults}
                      placeholder="مثال: فيتامين د: 15 (المعدل الطبيعي 30-100)، الكوليسترول: 250 / Example: Vitamin D: 15 (Normal range 30-100), Cholesterol: 250"
                      rows={3}
                    />
                    
                    <TextareaField
                      label="ما هي المكملات التي تأخذها حالياً؟ / What supplements are you currently taking?"
                      name="currentSupplements"
                      value={formData.currentSupplements}
                      onChange={handleInputChange}
                      error={errors.currentSupplements}
                      placeholder="مثال: فيتامين د 5000 وحدة يومياً، أوميغا 3، بروتين واي... أو اكتب 'لا يوجد' / Example: Vitamin D 5000 IU daily, Omega 3, Whey protein... or write 'None'"
                      rows={3}
                    />
                    
                    <TextareaField
                      label="هل تأخذ أدوية معينة؟ الرجاء ذكر جميعها / Are you taking any medications? Please list all"
                      name="medications"
                      value={formData.medications}
                      onChange={handleInputChange}
                      error={errors.medications}
                      placeholder="مثال: دواء ضغط الدم، أدوية الغدة الدرقية... أو اكتب 'لا يوجد' / Example: Blood pressure medication, thyroid medication... or write 'None'"
                      rows={3}
                    />
                  </div>
                </div>

                {/* نمط الحياة */}
                <div>
                  <SectionHeader title="نمط الحياة / Lifestyle" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                      label="كم خطوة تمشي في اليوم تقريباً؟ / Approximately how many steps do you take daily?"
                      name="dailySteps"
                      type="number"
                      value={formData.dailySteps}
                      onChange={handleInputChange}
                      error={errors.dailySteps}
                      placeholder="مثال: 5000 خطوة / Example: 5000 steps"
                    />
                    
                    <InputField
                      label="كم ساعة تنام؟ / How many hours do you sleep?"
                      name="sleepHours"
                      type="number"
                      value={formData.sleepHours}
                      onChange={handleInputChange}
                      error={errors.sleepHours}
                      placeholder="مثال: 7 ساعات / Example: 7 hours"
                      min="4"
                      max="12"
                      step="0.5"
                    />
                  </div>
                  
                  <div className="space-y-8 mt-8">
                    <TextareaField
                      label="تجربتك السابقة مع الدايت والرياضة؟ / Your past experience with diet and exercise?"
                      name="dietExperience"
                      value={formData.dietExperience}
                      onChange={handleInputChange}
                      error={errors.dietExperience}
                      placeholder="اذكر تجاربك السابقة مع الأنظمة الغذائية والرياضة، ما نجح وما لم ينجح... / Mention your previous experiences with diets and exercise, what worked and what didn't..."
                      rows={4}
                    />
                    
                    <TextareaField
                      label="إذا توقفت عن الدايت والرياضة، ما هو سبب توقفك؟ / If you stopped diet and exercise, what was the reason?"
                      name="reasonForStopping"
                      value={formData.reasonForStopping}
                      onChange={handleInputChange}
                      error={errors.reasonForStopping}
                      placeholder="مثال: ضغط العمل، عدم رؤية نتائج، صعوبة الالتزام، ظروف شخصية... / Example: Work pressure, not seeing results, difficulty committing, personal circumstances..."
                      rows={3}
                    />
                    
                    <TextareaField
                      label="ماضي الجسم؟ الرجاء ذكر كيف كان جسمك من قبل وكيف وصلت إلى هذه المرحلة؟ / Body history? Please describe how your body was before and how you reached your current state"
                      name="bodyHistory"
                      value={formData.bodyHistory}
                      onChange={handleInputChange}
                      error={errors.bodyHistory}
                      placeholder="اذكر تاريخ وزنك وشكل جسمك، متى بدأت تلاحظ التغيير، الأسباب... / Mention your weight and body shape history, when you started noticing changes, reasons..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* التغذية */}
                <div>
                  <SectionHeader title="التغذية / Nutrition" />
                  
                  <div className="space-y-8">
                    <TextareaField
                      label="هل هناك أطعمة لا تأكلها؟ بسبب الحساسية أو المذاق؟ / Are there any foods you don't eat? Due to allergies or taste?"
                      name="foodRestrictions"
                      value={formData.foodRestrictions}
                      onChange={handleInputChange}
                      error={errors.foodRestrictions}
                      placeholder="مثال: حساسية من المكسرات، لا أحب السمك، نباتي... أو اكتب 'لا يوجد' / Example: Allergic to nuts, don't like fish, vegetarian... or write 'None'"
                      rows={3}
                    />
                    
                    <RadioGroup
                      label="هل ستجهز وجباتك بنفسك أم ستشترك بمطعم؟ / Will you prepare your meals or subscribe to a meal service?"
                      name="mealPreparation"
                      value={formData.mealPreparation}
                      onChange={handleInputChange}
                      options={mealPrepOptions}
                      error={errors.mealPreparation}
                    />
                    
                    <TextareaField
                      label="هل لديك مشاكل مع مشتقات الألبان؟ / Do you have issues with dairy products?"
                      name="dairyIssues"
                      value={formData.dairyIssues}
                      onChange={handleInputChange}
                      error={errors.dairyIssues}
                      placeholder="مثال: عدم تحمل اللاكتوز، حساسية من الحليب، لا توجد مشاكل... / Example: Lactose intolerance, milk allergy, no issues..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* معلومات شخصية إضافية */}
                <div>
                  <SectionHeader title="معلومات إضافية / Additional Information" />
                  
                  <div className="space-y-8">
                    <InputField
                      label="الحالة الاجتماعية؟ / Marital status?"
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      error={errors.maritalStatus}
                      placeholder="مثال: أعزب، متزوج، مطلق... / Example: Single, Married, Divorced..."
                    />
                    
                    <TextareaField
                      label="هل لديك أي شيء تريد من أخصائي التغذية أن يعرفه؟ / Anything else you'd like the nutritionist to know?"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      error={errors.additionalInfo}
                      placeholder="أي معلومات إضافية تعتقد أنها مهمة لبرنامجك الغذائي، تفضيلات خاصة، ظروف معينة... / Any additional information you think is important for your nutrition program, special preferences, specific circumstances..."
                      rows={4}
                    />
                  </div>
                </div>
                
                {/* الالتزام والموافقة */}
                <div>
                  <SectionHeader title="الالتزام والموافقة / Commitment & Agreement" />
                  
                  <div className="space-y-8">
                    <RadioGroup
                      label="هل ستلتزم بالبرنامج المقدم من أخصائي التغذية؟ / Will you commit to the program provided by the nutritionist?"
                      name="commitmentToProgram"
                      value={formData.commitmentToProgram}
                      onChange={handleInputChange}
                      options={commitmentOptions}
                      error={errors.commitmentToProgram}
                      required
                    />
                    
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
                      <CheckboxField
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        error={errors.termsAccepted}
                        label={
                          <div className="text-lg leading-relaxed">
                            <span className="font-bold text-orange-600 text-xl block mb-3">
                              أوافق على الشروط والأحكام:
                            </span>
                            <p className="text-gray-700 mb-4">
                              لقد قرأت جميع الشروط والأحكام أعلاه وأتعهد بالالتزام بها، وجميع المعلومات التي تم تزويدها من قبلي صحيحة.
                            </p>
                            <p className="text-gray-500 text-base italic">
                              I have read and agree to the terms and conditions above. All provided information is correct.
                            </p>
                          </div>
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-12">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:from-orange-600 hover:to-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-105 disabled:hover:scale-100 border-2 border-orange-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-4 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <span>
                        إرسال الاستمارة
                        <span className="block text-lg font-normal mt-1">Submit Form</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;