import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SingleMeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMeals, setRelatedMeals] = useState([]);

  useEffect(() => {
    const loadMeal = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:5000/api/meals/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setMeal(data.data.meal);
          // Load related meals
          loadRelatedMeals(data.data.meal.category);
        } else {
          throw new Error(data.message || 'فشل في تحميل الوجبة');
        }
      } catch (error) {
        console.error('Error loading meal:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const loadRelatedMeals = async (category) => {
      try {
        const response = await fetch(`http://localhost:5000/api/meals?category=${category}&limit=4`);
        const data = await response.json();
        
        if (data.success) {
          // Filter out current meal
          const filtered = data.data.meals.filter(m => m.id !== id);
          setRelatedMeals(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error('Error loading related meals:', error);
      }
    };

    if (id) {
      loadMeal();
    }
  }, [id]);

  const getMealText = (textObj, fallback = '') => {
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[i18n.language] || textObj.en || textObj.ar || fallback;
    }
    return textObj || fallback;
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-medium">{t('loading') || 'جاري التحميل...'}</p>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">😕</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            {t('meal_not_found') || 'الوجبة غير موجودة'}
          </h3>
          <p className="text-gray-500 mb-8">
            {error || t('meal_not_found_desc') || 'لم يتم العثور على الوجبة المطلوبة'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              {t('go_back') || 'العودة'}
            </button>
            <Link
              to="/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              {t('view_menu') || 'عرض القائمة'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = getMealText(meal.name);
  const description = getMealText(meal.description);
  const usage = getMealText(meal.usage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Breadcrumb */}
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              {t('home') || 'الرئيسية'}
            </Link>
            <span>/</span>
            <Link to="/menu" className="hover:text-orange-600 transition-colors">
              {t('menu') || 'القائمة'}
            </Link>
            <span>/</span>
            <span className="text-orange-600 font-medium">{name}</span>
          </nav>
        </div>
      </div>

      {/* Meal Details */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Section */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                  src={meal.image?.startsWith('http') ? meal.image : `http://localhost:5000${meal.image}`}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/2.jpg';
                  }}
                />
              </div>
              
              {/* Rating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="font-bold text-gray-700">{meal.rating || '4.5'}</span>
                <span className="text-gray-500 text-sm">({Math.floor(Math.random() * 100) + 50} تقييم)</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    {meal.category === 'salads' && '🥗 سلطات'}
                    {meal.category === 'main' && '🍖 أطباق رئيسية'}
                    {meal.category === 'drinks' && '🥤 مشروبات'}
                    {meal.category === 'snacks' && '🥜 وجبات خفيفة'}
                    {meal.category === 'desserts' && '🍰 حلويات'}
                  </span>
                  <div className="text-3xl font-bold text-green-600">
                    {meal.price} {t('currency') || 'ريال'}
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                  {name}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-md">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm text-gray-500">{t('prep_time') || 'وقت التحضير'}</div>
                  <div className="font-semibold">{meal.prepTime || '15 دقيقة'}</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-md">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="text-sm text-gray-500">{t('calories') || 'السعرات'}</div>
                  <div className="font-semibold">{meal.calories || '300'} سعرة</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-md">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-sm text-gray-500">{t('rating') || 'التقييم'}</div>
                  <div className="font-semibold">{meal.rating || '4.5'}/5</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-md">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-sm text-gray-500">{t('status') || 'الحالة'}</div>
                  <div className="font-semibold text-green-600">{t('available') || 'متاح'}</div>
                </div>
              </div>

              {/* Usage */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {t('usage') || 'الاستخدام'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {usage}
                </p>
              </div>

              {/* Nutritional Benefits */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💪</span>
                  {t('benefits') || 'الفوائد الغذائية'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{t('high_protein') || 'غني بالبروتين'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{t('low_fat') || 'قليل الدهون'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{t('fresh_ingredients') || 'مكونات طازجة'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{t('no_preservatives') || 'بدون مواد حافظة'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {t('go_back') || 'العودة'}
                </button>
                <Link
                  to="/menu"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {t('view_more_meals') || 'عرض المزيد من الوجبات'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Meals */}
      {relatedMeals.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                {t('related_meals') || 'وجبات مشابهة'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedMeals.map(relatedMeal => {
                  const relatedName = getMealText(relatedMeal.name);
                  const relatedDescription = getMealText(relatedMeal.description);
                  
                  return (
                    <Link
                      key={relatedMeal.id}
                      to={`/meal/${relatedMeal.id}`}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-orange-50 to-orange-100">
                        <img
                          src={relatedMeal.image?.startsWith('http') ? relatedMeal.image : `http://localhost:5000${relatedMeal.image}`}
                          alt={relatedName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = '/images/2.jpg';
                          }}
                        />
                        <div className="absolute bottom-3 right-3 bg-green-500/90 text-white px-3 py-1 rounded-full font-bold text-sm">
                          {relatedMeal.price} {t('currency') || 'ريال'}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                          {relatedName}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedDescription}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-semibold">{relatedMeal.rating || '4.5'}</span>
                          </div>
                          <span className="text-orange-600 font-medium text-sm">
                            {t('view_details') || 'عرض التفاصيل'} ←
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleMeal;