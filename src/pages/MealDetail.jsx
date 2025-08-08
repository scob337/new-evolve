import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MealDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('nutrition');
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadMealDetail();
  }, [id]);

  // بيانات الوجبات النموذجية
  const getSampleMeals = () => {
    return [
      {
        id: '1',
        name: 'سلطة البروتين المتوازنة',
        nameEn: 'Balanced Protein Salad',
        name_ar: 'سلطة البروتين المتوازنة',
        description: 'سلطة صحية غنية بالبروتين مع الخضروات الطازجة والصوص الخاص',
        description_ar: 'سلطة صحية غنية بالبروتين مع الخضروات الطازجة والصوص الخاص',
        image: '/images/2.jpg',
        price: 28,
        calories: 320,
        protein: 25,
        carbs: 15,
        fat: 18,
        fiber: 8,
        sugar: 6,
        sodium: 450,
        ingredients: ['خس طازج', 'دجاج مشوي', 'طماطم كرزية', 'جبن فيتا', 'زيتون أسود', 'صوص البلسميك'],
        allergens: ['منتجات الألبان'],
        preparation_time: '15 دقيقة',
        difficulty: 'سهل',
        tags: ['صحي', 'بروتين عالي', 'قليل الكربوهيدرات']
      },
      {
        id: '2',
        name: 'دجاج مشوي بالأعشاب',
        nameEn: 'Herb Grilled Chicken',
        name_ar: 'دجاج مشوي بالأعشاب',
        description: 'قطع دجاج طرية مشوية مع خليط من الأعشاب الطبيعية والتوابل',
        description_ar: 'قطع دجاج طرية مشوية مع خليط من الأعشاب الطبيعية والتوابل',
        image: '/images/2.jpg',
        price: 35,
        calories: 280,
        protein: 35,
        carbs: 5,
        fat: 12,
        fiber: 2,
        sugar: 2,
        sodium: 380,
        ingredients: ['صدر دجاج', 'إكليل الجبل', 'زعتر', 'ثوم', 'زيت زيتون', 'ليمون'],
        allergens: [],
        preparation_time: '25 دقيقة',
        difficulty: 'متوسط',
        tags: ['بروتين عالي', 'قليل الكربوهيدرات', 'خالي من الجلوتين']
      },
      {
        id: '3',
        name: 'سمك السلمون المشوي',
        nameEn: 'Grilled Salmon',
        name_ar: 'سمك السلمون المشوي',
        description: 'قطعة سلمون طازجة مشوية مع الخضروات الموسمية',
        description_ar: 'قطعة سلمون طازجة مشوية مع الخضروات الموسمية',
        image: '/images/2.jpg',
        price: 45,
        calories: 350,
        protein: 30,
        carbs: 8,
        fat: 22,
        fiber: 3,
        sugar: 4,
        sodium: 420,
        ingredients: ['سلمون طازج', 'بروكلي', 'جزر', 'كوسة', 'زيت زيتون', 'ليمون'],
        allergens: ['أسماك'],
        preparation_time: '20 دقيقة',
        difficulty: 'متوسط',
        tags: ['أوميجا 3', 'صحي', 'غني بالبروتين']
      },
      {
        id: '4',
        name: 'وعاء الكينوا الصحي',
        nameEn: 'Healthy Quinoa Bowl',
        name_ar: 'وعاء الكينوا الصحي',
        description: 'وعاء مغذي من الكينوا مع الخضروات الملونة والبذور',
        description_ar: 'وعاء مغذي من الكينوا مع الخضروات الملونة والبذور',
        image: '/images/2.jpg',
        price: 32,
        calories: 380,
        protein: 15,
        carbs: 45,
        fat: 16,
        fiber: 12,
        sugar: 8,
        sodium: 320,
        ingredients: ['كينوا', 'أفوكادو', 'طماطم كرزية', 'خيار', 'بذور عباد الشمس', 'صوص الطحينة'],
        allergens: ['سمسم'],
        preparation_time: '18 دقيقة',
        difficulty: 'سهل',
        tags: ['نباتي', 'غني بالألياف', 'خالي من الجلوتين']
      }
    ];
  };

  const loadMealDetail = async () => {
    try {
      setLoading(true);
      console.log('Loading meal with ID:', id);
      
      // محاولة تحميل البيانات من الـ API أولاً
      try {
        const response = await fetch(`https://evolvetheapp.com/api/meals/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (data.success && data.data && data.data.meal) {
            setMeal(data.data.meal);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using fallback data');
      }
      
      // في حالة فشل الـ API، استخدم البيانات المحلية أو النموذجية
      let mealsData = [];
      
      // محاولة تحميل من localStorage أولاً
      const savedMeals = localStorage.getItem('meals');
      if (savedMeals) {
        try {
          mealsData = JSON.parse(savedMeals);
          console.log('Loaded from localStorage:', mealsData);
        } catch (e) {
          console.log('Error parsing localStorage data');
        }
      }
      
      // إذا لم توجد بيانات في localStorage، استخدم البيانات النموذجية
      if (mealsData.length === 0) {
        mealsData = getSampleMeals();
        console.log('Using sample data:', mealsData);
      }
      
      // البحث عن الوجبة بالـ ID
      const foundMeal = mealsData.find(m => {
        // تحويل كلا القيمتين إلى string للمقارنة
        const mealId = String(m.id);
        const searchId = String(id);
        console.log(`Comparing meal ID: ${mealId} with search ID: ${searchId}`);
        return mealId === searchId;
      });
      
      console.log('Found meal:', foundMeal);
      
      if (foundMeal) {
        setMeal(foundMeal);
      } else {
        console.log('Meal not found, available IDs:', mealsData.map(m => m.id));
        setMeal(null);
      }
    } catch (error) {
      console.error('Error loading meal detail:', error);
      setMeal(null);
    } finally {
      setLoading(false);
    }
  };


 

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-emerald-200 border-t-emerald-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-medium">{t('loading') || 'جاري التحميل...'}</p>
          <p className="text-sm text-gray-500 mt-2">{isRTL ? 'جاري تحميل تفاصيل الوجبة...' : 'Loading meal details...'}</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('meal_not_found') || 'الوجبة غير موجودة'}</h2>
          <p className="text-gray-600 mb-6">{isRTL ? `عذراً، لم نتمكن من العثور على الوجبة المطلوبة (ID: ${id})` : `Sorry, we couldn't find the requested meal (ID: ${id})`}</p>
          <div className="space-y-4">
            <Link 
              to="/menu" 
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {t('back_to_menu') || (isRTL ? 'العودة إلى القائمة' : 'Back to Menu')}
            </Link>
            <div className="text-sm text-gray-500">
              <p>{isRTL ? 'الوجبات المتاحة: 1, 2, 3, 4' : 'Available meals: 1, 2, 3, 4'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض البيانات كما هي من API دون ترجمة
  const currentName = meal.name || meal.name_ar || meal.nameEn;
  const currentDescription = meal.description || meal.description_ar;

  // معالجة البيانات
  const getIngredients = () => {
    if (meal.ingredients) {
      if (typeof meal.ingredients === 'string') {
        try {
          // محاولة تحليل JSON
          const parsed = JSON.parse(meal.ingredients);
          return i18n.language === 'ar' ? parsed.ar : parsed.en;
        } catch (e) {
          // إذا لم يكن JSON، نفترض أنها سلسلة نصية مفصولة بفواصل
          return meal.ingredients.split(/[,._\-\s]+/).map(item => item.trim()).filter(item => item);
        }
      } else if (Array.isArray(meal.ingredients)) {
        // إذا كانت مصفوفة بالفعل
        return meal.ingredients;
      }
    }
    return [];
  };
  
  const getAllergens = () => {
    if (meal.allergens && typeof meal.allergens === 'string') {
      try {
        const parsed = JSON.parse(meal.allergens);
        return i18n.language === 'ar' ? parsed.ar : parsed.en;
      } catch (e) {
        return [];
      }
    }
    return meal.allergens || [];
  };
  
  const getTags = () => {
    if (meal.tags && typeof meal.tags === 'string') {
      try {
        const parsed = JSON.parse(meal.tags);
        return i18n.language === 'ar' ? parsed.ar : parsed.en;
      } catch (e) {
        return [];
      }
    }
    return meal.tags || [];
  };
  
  const currentIngredients = getIngredients();
  const currentAllergens = getAllergens();
  const currentTags = getTags();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Back Button */}
      <div className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/menu" 
            className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200`}
          >
            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('back_to_menu') || (isRTL ? 'رجوع لقائمة الوجبات' : 'Back to Menu')}</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <img
                  src={getImageUrl(meal.image)}
                  alt={currentName}
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/images/2.jpg';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="space-y-8">
            {/* Meal Title and Description */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{currentName}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{currentDescription}</p>
            </div>



            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'nutrition', label: t('nutrition_facts') || (isRTL ? 'القيم الغذائية' : 'Nutrition Facts'), icon: '🥗' },
                  { id: 'ingredients', label: t('ingredients') || (isRTL ? 'المكونات' : 'Ingredients'), icon: '🥄' },
                  { id: 'usage', label: t('usage') || (isRTL ? 'طريقة الاستخدام' : 'Usage'), icon: '📝' },
                  { id: 'allergens', label: t('allergens') || (isRTL ? 'مسببات الحساسية' : 'Allergens'), icon: '⚠️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700 border-b-3 border-emerald-500'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={isRTL ? 'ml-2' : 'mr-2'}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'nutrition' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                        <div className="text-2xl font-bold text-emerald-600">{meal.protein || '25'}g</div>
                        <div className="text-sm text-gray-600 font-medium">{t('protein') || (isRTL ? 'بروتين' : 'Protein')}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{meal.carbs || '15'}g</div>
                        <div className="text-sm text-gray-600 font-medium">{t('carbs') || (isRTL ? 'كربوهيدرات' : 'Carbs')}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                        <div className="text-2xl font-bold text-amber-600">{meal.fat || '18'}g</div>
                        <div className="text-sm text-gray-600 font-medium">{t('fat') || (isRTL ? 'دهون' : 'Fat')}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{meal.fiber || '8'}g</div>
                        <div className="text-sm text-gray-600 font-medium">{t('fiber') || (isRTL ? 'ألياف' : 'Fiber')}</div>
                      </div>
                    </div>
                    
                    {(meal.sugar || meal.sodium) && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
                          <div className="text-lg font-bold text-rose-600">{meal.sugar || '6'}g</div>
                          <div className="text-sm text-gray-600 font-medium">{t('sugar') || (isRTL ? 'سكر' : 'Sugar')}</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <div className="text-lg font-bold text-gray-600">{meal.sodium || '450'}mg</div>
                          <div className="text-sm text-gray-600 font-medium">{t('sodium') || (isRTL ? 'صوديوم' : 'Sodium')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div>
                    {currentIngredients && currentIngredients.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentIngredients.map((ingredient, index) => (
                          <div key={index} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200`}>
                            <span className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></span>
                            <span className="text-gray-700 font-medium">{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📝</span>
                        {t('no_ingredients_available') || (isRTL ? 'لا توجد مكونات متاحة' : 'No ingredients available')}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div>
                    {meal.usage ? (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <p className="text-gray-700 leading-relaxed">{meal.usage}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📝</span>
                        {t('no_usage_available') || (isRTL ? 'لا توجد طريقة استخدام متاحة' : 'No usage instructions available')}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'allergens' && (
                  <div>
                    {currentAllergens && currentAllergens.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {currentAllergens.map((allergen, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 shadow-sm"
                          >
                            <span className={isRTL ? 'ml-2' : 'mr-2'}>⚠️</span>
                            {allergen}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">✅</span>
                        <p className="font-medium">{t('no_allergens') || (isRTL ? 'لا توجد مسببات حساسية معروفة' : 'No known allergens')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-meal.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://evolvetheapp.com${imagePath}`;
};




