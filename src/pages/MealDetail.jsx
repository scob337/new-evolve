import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MealDetail = () => {
  const { id } = useParams();
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
      // Try to load from local storage first
      const savedMeals = localStorage.getItem('meals');
      let mealsData = [];
      
      if (savedMeals) {
        mealsData = JSON.parse(savedMeals);
      } else {
        // Fallback to sample data
        mealsData = [
          {
            id: 1,
            name: 'Protein Power Salad',
            name_ar: 'سلطة البروتين القوية',
            description: 'Fresh mixed greens with grilled chicken breast, quinoa, avocado, cherry tomatoes, and our signature protein dressing',
            description_ar: 'خضروات ورقية طازجة مع صدر دجاج مشوي وكينوا وأفوكادو وطماطم كرزية وصلصة البروتين المميزة',
            price: 25,
            category: 'salads',
            image: '/images/2.jpg',
            calories: 420,
            protein: 45,
            carbs: 18,
            fat: 12,
            fiber: 8,
            sugar: 6,
            sodium: 380,
            ingredients: ['Grilled chicken breast', 'Mixed greens', 'Quinoa', 'Avocado', 'Cherry tomatoes', 'Cucumber', 'Protein dressing'],
            ingredients_ar: ['صدر دجاج مشوي', 'خضروات ورقية مختلطة', 'كينوا', 'أفوكادو', 'طماطم كرزية', 'خيار', 'صلصة البروتين'],
            allergens: ['None'],
            allergens_ar: ['لا يوجد'],
            prep_time: '15 minutes',
            prep_time_ar: '15 دقيقة',
            difficulty: 'Easy',
            difficulty_ar: 'سهل'
          },
          {
            id: 2,
            name: 'Grilled Chicken Supreme',
            name_ar: 'دجاج مشوي سوبريم',
            description: 'Perfectly grilled chicken breast with roasted vegetables, brown rice, and our special herb sauce',
            description_ar: 'صدر دجاج مشوي بالكمال مع خضروات محمصة وأرز بني وصلصة الأعشاب الخاصة',
            price: 35,
            category: 'main',
            image: '/images/2.jpg',
            calories: 520,
            protein: 55,
            carbs: 35,
            fat: 15,
            fiber: 6,
            sugar: 8,
            sodium: 420,
            ingredients: ['Grilled chicken breast', 'Brown rice', 'Broccoli', 'Carrots', 'Bell peppers', 'Herb sauce'],
            ingredients_ar: ['صدر دجاج مشوي', 'أرز بني', 'بروكلي', 'جزر', 'فلفل ملون', 'صلصة الأعشاب'],
            allergens: ['None'],
            allergens_ar: ['لا يوجد'],
            prep_time: '25 minutes',
            prep_time_ar: '25 دقيقة',
            difficulty: 'Medium',
            difficulty_ar: 'متوسط'
          },
          {
            id: 3,
            name: 'Power Protein Smoothie',
            name_ar: 'سموثي البروتين القوي',
            description: 'Delicious protein smoothie with fresh fruits, oats, and premium protein powder',
            description_ar: 'سموثي بروتين لذيذ مع فواكه طازجة وشوفان وبودرة بروتين فاخرة',
            price: 15,
            category: 'drinks',
            image: '/images/2.jpg',
            calories: 280,
            protein: 25,
            carbs: 28,
            fat: 6,
            fiber: 4,
            sugar: 18,
            sodium: 120,
            ingredients: ['Protein powder', 'Banana', 'Berries', 'Oats', 'Almond milk', 'Honey'],
            ingredients_ar: ['بودرة البروتين', 'موز', 'توت', 'شوفان', 'حليب اللوز', 'عسل'],
            allergens: ['Tree nuts'],
            allergens_ar: ['المكسرات'],
            prep_time: '5 minutes',
            prep_time_ar: '5 دقائق',
            difficulty: 'Easy',
            difficulty_ar: 'سهل',
            tags: ['High Protein', 'Low Carb', 'Gluten Free'],
            tags_ar: ['عالي البروتين', 'قليل الكربوهيدرات', 'خالي من الجلوتين']
          },
          {
            id: 4,
            name: 'Quinoa Power Bowl',
            name_ar: 'وعاء الكينوا القوي',
            description: 'Nutritious quinoa with roasted vegetables, chickpeas, avocado, and tahini dressing',
            description_ar: 'كينوا مغذية مع خضروات محمصة وحمص وأفوكادو وصلصة الطحينة',
            price: 38,
            category: 'bowls',
            image: '/images/meal2.jpg',
            calories: 420,
            protein: 18,
            carbs: 45,
            fat: 12,
            fiber: 8,
            sugar: 6,
            sodium: 380,
            ingredients: ['Quinoa', 'Roasted vegetables', 'Chickpeas', 'Avocado', 'Tahini dressing'],
            ingredients_ar: ['كينوا', 'خضروات محمصة', 'حمص', 'أفوكادو', 'صلصة طحينة'],
            allergens: ['Sesame'],
            allergens_ar: ['سمسم'],
            preparation_time: '20 minutes',
            preparation_time_ar: '20 دقيقة',
            difficulty: 'Medium',
            difficulty_ar: 'متوسط',
            tags: ['Vegan', 'High Fiber', 'Protein Rich'],
            tags_ar: ['نباتي', 'عالي الألياف', 'غني بالبروتين']
          }
        ];
      }
      
      const foundMeal = mealsData.find(m => m.id === parseInt(id));
      if (foundMeal) {
        setMeal(foundMeal);

      } else {
        navigate('/menu');
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
  const currentIngredients = i18n.language === 'ar' ? meal.ingredients_ar : meal.ingredients;
  const currentAllergens = i18n.language === 'ar' ? meal.allergens_ar : meal.allergens;
  const currentTags = i18n.language === 'ar' ? meal.tags_ar : meal.tags;
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
                <span className="text-gray-900 font-medium">{currentName}</span>
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
                {currentIngredients && currentIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
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

            {/* Order Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('order_options')}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('quantity')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">{t('total')}:</span>
                    <span className="text-2xl font-bold text-orange-500">
                      ${(meal.price * quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {t('add_to_cart')}
                  </button>
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