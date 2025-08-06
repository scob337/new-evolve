import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MealDetail = () => {
  const { id } = useParams(); // استخراج id من URL
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    size: 'regular',
    extras: []
  });

  useEffect(() => {
    loadMealDetail();
  }, [id]);

  const loadMealDetail = async () => {
    try {
      setLoading(true);
      
      // محاولة تحميل البيانات من الـ API أولاً
      const response = await fetch(`http://localhost:5000/api/meals/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.success && data.data) {
          setMeal(data.data?.meal);
          return;
        }
      }
      
      // في حالة فشل الـ API، استخدم البيانات المحلية
      const savedMeals = localStorage.getItem('meals');
      let mealsData = [];
      
      if (savedMeals) {
        mealsData = JSON.parse(savedMeals);
      } else {
        // Fallback to sample data
        mealsData = [/* بيانات تجريبية */];
      }
      
      const foundMeal = mealsData.find(m => m.id === parseInt(id));
      if (foundMeal) {
        setMeal(foundMeal);
      } else {
        navigate('/menu'); // إعادة توجيه إذا لم توجد الوجبة
      }
    } catch (error) {
      console.error('Error loading meal detail:', error);
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: meal.id,
      name: i18n.language === 'ar' ? meal.name_ar : meal.name,
      price: meal.price,
      quantity,
      options: selectedOptions,
      image: meal.image
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(item => 
      item.id === cartItem.id && 
      JSON.stringify(item.options) === JSON.stringify(cartItem.options)
    );
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(t('added_to_cart'));
  };



  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('meal_not_found')}</h2>
          <Link to="/menu" className="text-orange-500 hover:text-orange-600">
            {t('back_to_menu')}
          </Link>
        </div>
      </div>
    );
  }

  const currentName = i18n.language === 'ar' ? meal.name_ar : meal.name;
  const currentDescription = i18n.language === 'ar' ? meal.description_ar : meal.description;

  // إصلاح معالجة المكونات
  const getIngredients = () => {
    // إذا كانت البيانات من API وتحتوي على ingredients كـ JSON string
    if (meal.ingredients && typeof meal.ingredients === 'string') {
      try {
        const parsed = JSON.parse(meal.ingredients);
        return i18n.language === 'ar' ? parsed.ar : parsed.en;
      } catch (e) {
        console.error('Error parsing ingredients:', e);
        return [];
      }
    }
    
    // إذا كانت البيانات تحتوي على حقول منفصلة
    if (meal.ingredients_ar || meal.ingredients) {
      return i18n.language === 'ar' ? meal.ingredients_ar : meal.ingredients;
    }
    
    // إذا لم توجد مكونات، إرجاع مصفوفة فارغة
    return [];
  };
  
  const currentIngredients = getIngredients();
  
  // تطبيق نفس المنطق على باقي الحقول
  const getAllergens = () => {
    if (meal.allergens && typeof meal.allergens === 'string') {
      try {
        const parsed = JSON.parse(meal.allergens);
        return i18n.language === 'ar' ? parsed.ar : parsed.en;
      } catch (e) {
        return [];
      }
    }
    return i18n.language === 'ar' ? meal.allergens_ar : meal.allergens || [];
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
    return i18n.language === 'ar' ? meal.tags_ar : meal.tags || [];
  };
  
  const currentAllergens = getAllergens();
  const currentTags = getTags();
  const currentPreparationTime = i18n.language === 'ar' ? meal.preparation_time_ar : meal.preparation_time;
  const currentDifficulty = i18n.language === 'ar' ? meal.difficulty_ar : meal.difficulty;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  {t('home')}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link to="/menu" className="text-gray-500 hover:text-gray-700">
                  {t('menu')}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{meal.nameEn}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={meal.image || '/images/placeholder-meal.jpg'}
                alt={currentName}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholder-meal.jpg';
                }}
              />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {currentTags && currentTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentName}</h1>
              <p className="text-xl text-gray-600 mb-6">{currentDescription}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-orange-500">${meal.price}</span>

              </div>
            </div>

            {/* Nutrition Info */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('nutrition_facts')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{meal.calories}</div>
                  <div className="text-sm text-gray-600">{t('calories')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{meal.protein}g</div>
                  <div className="text-sm text-gray-600">{t('protein')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{meal.carbs}g</div>
                  <div className="text-sm text-gray-600">{t('carbs')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{meal.fat}g</div>
                  <div className="text-sm text-gray-600">{t('fat')}</div>
                </div>
              </div>
              
              {meal.fiber && (
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{meal.fiber}g</div>
                    <div className="text-sm text-gray-600">{t('fiber')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{meal.sugar}g</div>
                    <div className="text-sm text-gray-600">{t('sugar')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-500">{meal.sodium}mg</div>
                    <div className="text-sm text-gray-600">{t('sodium')}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('ingredients')}</h3>
              <ul className="space-y-2">
                {currentIngredients && Array.isArray(currentIngredients) && currentIngredients.length > 0 ? (
                  currentIngredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">{t('no_ingredients_available')}</li>
                )}
              </ul>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('preparation_info')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('prep_time')}:</span>
                    <span className="font-medium">{currentPreparationTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('difficulty')}:</span>
                    <span className="font-medium">{currentDifficulty}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('allergen_info')}</h3>
                <div className="space-y-2">
                  {currentAllergens && currentAllergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 mr-2"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            </div>


            </div>
        </div>
      </div>


    </div>
  );
};

export default MealDetail;