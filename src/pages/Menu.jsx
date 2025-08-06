import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MenuP = () => {
  const { t, i18n } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);

  // Load meals from API
  useEffect(() => {
    const loadMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://evolvetheapp.com/api/meals');
        const data = await response.json();
        
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
      // ... باقي البيانات النموذجية
    ];
  };

  // Enhanced filtering and sorting
  const processedMeals = useMemo(() => {
    let filtered = meals;

    // Filter by search term
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
               usage.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(meal => meal.category === selectedCategory);
    }

    // Sort meals
    // في دالة processedMeals، إصلاح منطق الترتيب
    filtered.sort((a, b) => {
    switch (sortBy) {
    case 'price-low':
    return (a.price || 0) - (b.price || 0);
    case 'price-high':
    return (b.price || 0) - (a.price || 0);
    case 'rating':
    return (b.rating || 0) - (a.rating || 0);
    case 'name':
    default:
    // معالجة محسنة لأسماء الوجبات
    let nameA = '';
    let nameB = '';
    
    // للبيانات النموذجية (name كائن)
    if (typeof a.name === 'object' && a.name) {
    nameA = a.name[i18n.language] || a.name.en || a.name.ar || '';
    }
    // لبيانات الـ API (nameAr, nameEn)
    else if (a.nameAr || a.nameEn) {
    nameA = i18n.language === 'ar' ? (a.nameAr || a.nameEn || '') : (a.nameEn || a.nameAr || '');
    }
    // للبيانات البسيطة (name كنص)
    else {
    nameA = a.name || '';
    }
    
    // نفس المنطق للعنصر الثاني
    if (typeof b.name === 'object' && b.name) {
    nameB = b.name[i18n.language] || b.name.en || b.name.ar || '';
    }
    else if (b.nameAr || b.nameEn) {
    nameB = i18n.language === 'ar' ? (b.nameAr || b.nameEn || '') : (b.nameEn || b.nameAr || '');
    }
    else {
    nameB = b.name || '';
    }
    
    // التأكد من أن القيم نصوص قبل المقارنة
    return String(nameA).localeCompare(String(nameB));
    }
    });

    return filtered;
  }, [meals, searchTerm, selectedCategory, sortBy, i18n.language]);

  useEffect(() => {
    setFilteredMeals(processedMeals);
  }, [processedMeals]);

  const categories = [
    { id: 'all', name: t('all_categories') || 'جميع الفئات', icon: '🍽️' },
    { id: 'salads', name: t('salads') || 'السلطات', icon: '🥗' },
    { id: 'main', name: t('main_courses') || 'الأطباق الرئيسية', icon: '🍖' },
    { id: 'drinks', name: t('drinks') || 'المشروبات', icon: '🥤' },
    { id: 'snacks', name: t('snacks') || 'الوجبات الخفيفة', icon: '🥜' },
    { id: 'desserts', name: t('desserts') || 'الحلويات', icon: '🍰' }
  ];

  const sortOptions = [
    { value: 'name', label: t('sort_by_name') || 'ترتيب بالاسم' },
    { value: 'price-low', label: t('price_low_high') || 'السعر: من الأقل للأعلى' },
    { value: 'price-high', label: t('price_high_low') || 'السعر: من الأعلى للأقل' },
    { value: 'rating', label: t('sort_by_rating') || 'ترتيب بالتقييم' }
  ];

  // Enhanced Meal Card Component
  // تحسين MealCard component
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
  
  // إضافة دالة للحصول على معلومات الاستخدام
  const getUsage = () => {
  if (typeof meal.usage === 'object') {
  return meal.usage[i18n.language] || meal.usage.en || meal.usage.ar || 'للوجبات اليومية';
  }
  return meal.usage || meal.ingredients || 'للوجبات اليومية';
  };
  
  const name = getName();
  const description = getDescription();
  const usage = getUsage(); // إضافة هذا السطر
  
  return (
  <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 backdrop-blur-sm">
  {/* Image Container with Overlay */}
  <div className="relative w-full h-64 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
  // في مكون عرض الصورة
  <img 
  src={meal.image || '/images/default-meal.jpg'} 
  alt={meal.nameAr || meal.nameEn}
  onError={(e) => {
  e.target.src = '/images/default-meal.jpg'; // صورة افتراضية
  }}
  />
  {/* Overlay with Rating */}
  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
  <span className="text-yellow-500 text-sm">⭐</span>
  <span className="text-sm font-semibold text-gray-700">{meal.rating || '4.5'}</span>
  </div>
  {/* Category Badge */}
  <div className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
  {categories.find(cat => cat.id === meal.category)?.icon} {categories.find(cat => cat.id === meal.category)?.name}
  </div>
  {/* Price Badge */}
  <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold">
  {meal.price} {t('currency') || 'ريال'}
  </div>
  </div>
  
  {/* Content */}
  <div className="p-6">
  <div className="mb-4">
  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
  {name}
  </h3>
  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
  {description}
  </p>
  </div>
  {/* Meal Info */}
  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
  <div className="flex items-center gap-1">
  <span>⏱️</span>
  <span>{meal.prepTime || '15 دقيقة'}</span>
  </div>
  <div className="flex items-center gap-1">
  <span>🔥</span>
  <span>{meal.calories || '300'} سعرة</span>
  </div>
  </div>
  
  {/* إزالة أو تعليق هذا القسم */}
  {/*
  <div className="mb-4">
  <p className="text-gray-600 text-sm">
  <span className="font-semibold text-orange-600">{t('usage') || 'الاستخدام'}:</span> {usage}
  </p>
  </div>
  */}
  
  {/* Action Buttons */}
  <div className="flex gap-3">
  <Link 
  to={`/meal/${meal.id}`}
  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
  >
  {t('view_details') || 'عرض التفاصيل'}
  </Link>
  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-orange-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-105">
  ❤️
  </button>
  </div>
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


      {/* Filters Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-20 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search and Sort Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              {/* Search Input */}
              <div className="w-full lg:w-96 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder={t('search_meals') || 'ابحث عن الوجبات...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/90 backdrop-blur-sm"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="w-full lg:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  ☰
                </button>
              </div>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Counter */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              {t('showing_results') || 'عرض'} <span className="font-bold text-orange-600">{filteredMeals.length}</span> {t('of') || 'من'} <span className="font-bold">{meals.length}</span> {t('meals') || 'وجبة'}
              {selectedCategory !== 'all' && (
                <span className="text-orange-600"> في فئة {categories.find(cat => cat.id === selectedCategory)?.name}</span>
              )}
            </p>
          </div>
          
          {/* Meals Grid/List */}
          {filteredMeals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {t('no_meals_found') || 'لم يتم العثور على وجبات'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t('try_different_search') || 'جرب البحث بكلمات مختلفة أو اختر فئة أخرى'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {t('clear_filters') || 'مسح الفلاتر'}
              </button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
            }`}>
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
