import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MenuP = () => {
  const { t, i18n } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load meals from API
  useEffect(() => {
    const loadMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5001/api/meals');
        const data = await response.json();
        console.log(data.data.meals)
        if (data.success) {
          setMeals(data.data.meals);
        } else {
          throw new Error(data.message || 'فشل في تحميل الوجبات');
        }
      } catch (error) {
        console.error('Error loading meals:', error);
        setError(error.message);
        // Fallback to sample data
        setMeals(getSampleMeals());
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  // Sample data fallback
  const getSampleMeals = () => {
    const currentLang = i18n.language || 'en';
    return [
      {
        id: '1',
        name: currentLang === 'ar' ? 'سلطة البروتين المتوازنة' : 'Balanced Protein Salad',
        image: '/images/2.jpg',
        description: currentLang === 'ar' ? 'سلطة صحية غنية بالبروتين مع الخضروات الطازجة والصوص الخاص' : 'Healthy protein-rich salad with fresh vegetables and special dressing',
        usage: currentLang === 'ar' ? 'وجبة غداء صحية ومتوازنة' : 'Healthy and balanced lunch',
        price: 28,
        category: 'salads',
        calories: 320,
        prepTime: '15 دقيقة',
        rating: 4.8
      },
      // يمكن إضافة المزيد من البيانات النموذجية هنا
    ];
  };

  // Enhanced filtering - Search only
  const processedMeals = useMemo(() => {
    let filtered = meals;

    // Filter by search term only
    if (searchTerm) {
      filtered = filtered.filter(meal => {
        const name = typeof meal.name === 'object' 
          ? meal.name[i18n.language] || meal.name.en || meal.name.ar
          : meal.name;
        const description = typeof meal.description === 'object'
          ? meal.description[i18n.language] || meal.description.en || meal.description.ar
          : meal.description;
        const usage = typeof meal.usage === 'object'
          ? meal.usage[i18n.language] || meal.usage.en || meal.usage.ar
          : meal.usage;

        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (usage && usage.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }

    return filtered;
  }, [meals, searchTerm, i18n.language]);

  useEffect(() => {
    setFilteredMeals(processedMeals);
  }, [processedMeals]);

  // Enhanced Meal Card Component
  // دالة مساعدة لتحويل مسار الصورة إلى URL كامل
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-meal.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };
  
  const MealCard = ({ meal }) => {
    // معالجة محسنة للأسماء والأوصاف
    const getName = () => {
      if (typeof meal.name === 'object') {
        return meal.name[i18n.language] || meal.name.en || meal.name.ar || 'اسم غير متوفر';
      }
      if (meal.nameAr || meal.nameEn) {
        return i18n.language === 'ar' ? (meal.nameAr || meal.nameEn) : (meal.nameEn || meal.nameAr);
      }
      return meal.name || 'اسم غير متوفر';
    };
    
    const getDescription = () => {
      if (typeof meal.description === 'object') {
        return meal.description[i18n.language] || meal.description.en || meal.description.ar || 'وصف غير متوفر';
      }
      if (meal.descriptionAr || meal.descriptionEn) {
        return i18n.language === 'ar' ? (meal.descriptionAr || meal.descriptionEn) : (meal.descriptionEn || meal.descriptionAr);
      }
      return meal.description || 'وصف غير متوفر';
    };
    
    const name = getName();
    const description = getDescription();
    
    return (
      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-100">
        {/* Image Container with Professional Overlay */}
        <div className="relative w-full h-56 overflow-hidden">
          <img 
            src={getImageUrl(meal.image)} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/images/default-meal.jpg';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
            {meal.price} {t('currency') || 'ريال'}
          </div>
        
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
              {name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          
          {/* Meal Stats */}
          <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{meal.prepTime || '15 دقيقة'}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <svg className="w-3 h-3 fill-current text-orange-500" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <span className="font-medium">{meal.calories || '300'} سعرة</span>
            </div>
          </div>
          
          {/* Action Button */}
          <Link 
            to={`/meal/${meal.id}`}
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            {t('view_details') || 'عرض التفاصيل'}
          </Link>
        </div>
      </div>
    );
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
          <p className="text-sm text-gray-500 mt-2">{t('loading_meals') || 'جاري تحميل قائمة الوجبات'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            {t('error_loading') || 'خطأ في التحميل'}
          </h3>
          <p className="text-gray-500 mb-8">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {t('retry') || 'إعادة المحاولة'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header Section with Search Only */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('our_menu') || 'قائمة الوجبات'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('menu_description') || 'اكتشف مجموعة متنوعة من الوجبات الصحية واللذيذة'}
            </p>
            

          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">

          
          {/* Meals Grid */}
          {filteredMeals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {t('no_meals_found') || 'لم يتم العثور على وجبات'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t('try_different_search') || 'جرب البحث بكلمات مختلفة'}
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {t('clear_search') || 'مسح البحث'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMeals.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuP;
