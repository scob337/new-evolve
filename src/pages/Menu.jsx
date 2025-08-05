import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Menu = () => {
  const { t, i18n } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load meals data
  useEffect(() => {
    const loadMeals = async () => {
      try {
        // Try to load Arabic meals first, then fallback to English
        let mealsData = [];
        try {
          const response = await fetch('/meals-ar.json');
          if (response.ok) {
            mealsData = await response.json();
          }
        } catch (error) {
          console.log('Arabic meals not found, loading default meals');
        }
        
        // If no Arabic meals or empty, load default meals
        if (mealsData.length === 0) {
          try {
            const response = await fetch('/meals.json');
            if (response.ok) {
              mealsData = await response.json();
            }
          } catch (error) {
            console.log('Default meals not found, using sample data');
            // Sample data if no files found
            mealsData = [
              {
                id: 1,
                name: t('protein_salad'),
                image: '/images/2.jpg',
                description: t('protein_salad_description'),
                usage: t('healthy_lunch'),
                price: 25,
                category: 'salads'
              },
              {
                id: 2,
                name: t('grilled_chicken'),
                image: '/images/2.jpg',
                description: t('grilled_chicken_description'),
                usage: t('balanced_dinner'),
                price: 35,
                category: 'main'
              },
              {
                id: 3,
                name: t('protein_smoothie'),
                image: '/images/2.jpg',
                description: t('protein_smoothie_description'),
                usage: t('post_workout_snack'),
                price: 15,
                category: 'drinks'
              },
              {
                id: 4,
                name: t('grilled_salmon'),
                image: '/images/2.jpg',
                description: t('grilled_salmon_description'),
                usage: t('premium_dinner'),
                price: 45,
                category: 'main'
              },
              {
                id: 5,
                name: t('quinoa_salad'),
                image: '/images/2.jpg',
                description: t('quinoa_salad_description'),
                usage: t('healthy_vegetarian'),
                price: 22,
                category: 'salads'
              },
              {
                id: 6,
                name: t('green_juice'),
                image: '/images/2.jpg',
                description: t('green_juice_description'),
                usage: t('detox_drink'),
                price: 12,
                category: 'drinks'
              },
              {
                id: 7,
                name: t('grilled_beef'),
                image: '/images/2.jpg',
                description: t('grilled_beef_description'),
                usage: t('high_protein_meal'),
                price: 50,
                category: 'main'
              },
              {
                id: 8,
                name: t('energy_balls'),
                image: '/images/2.jpg',
                description: t('energy_balls_description'),
                usage: t('healthy_snack'),
                price: 8,
                category: 'snacks'
              },
              {
                id: 9,
                name: t('healthy_cheesecake'),
                image: '/images/2.jpg',
                description: t('healthy_cheesecake_description'),
                usage: t('healthy_dessert'),
                price: 18,
                category: 'desserts'
              }
            ];
          }
        }
        
        setMeals(mealsData);
        setFilteredMeals(mealsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading meals:', error);
        setLoading(false);
      }
    };

    loadMeals();
  }, [i18n.language]);

  // Filter meals based on search and category
  useEffect(() => {
    let filtered = meals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(meal => meal.category === selectedCategory);
    }

    setFilteredMeals(filtered);
  }, [searchTerm, selectedCategory, meals]);

  const categories = [
    { id: 'all', name: t('all_categories') },
    { id: 'salads', name: t('salads') },
    { id: 'main', name: t('main_courses') },
    { id: 'drinks', name: t('drinks') },
    { id: 'snacks', name: t('snacks') },
    { id: 'desserts', name: t('desserts') }
  ];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6" data-aos="fade-up">
              {t('our_menu')}
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              {t('menu_hero_description')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t('search_meals')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meals Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMeals.length === 0 ? (
            <div className="text-center py-20">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.582-4.29-3.53 0-.773.244-1.49.673-2.08L6 7.5A7.966 7.966 0 004.5 12C4.5 16.142 7.858 19.5 12 19.5s7.5-3.358 7.5-7.5c0-1.747-.6-3.352-1.607-4.62L16.5 9.5c.429.59.673 1.307.673 2.08C17.173 13.418 15.223 15 12.883 15z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('no_meals_found')}</h3>
              <p className="text-gray-600 mb-6">{t('try_different_search')}</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                {t('clear_filters')}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('available_meals')} ({filteredMeals.length})
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMeals.map((meal, index) => (
                  <div 
                    key={meal.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-meal.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                        ${meal.price}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {meal.name}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {meal.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-full">
                          {meal.usage}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${meal.price}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Link
                          to={`/meal/${meal.id}`}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold text-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        >
                          {t('view_details')}
                        </Link>
                        <Link
                          to="/register"
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold text-center hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                        >
                          {t('order_now')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Nutrition Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('nutrition_commitment')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('nutrition_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('fresh_ingredients')}
              </h3>
              <p className="text-gray-600">
                {t('fresh_ingredients_desc')}
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('balanced_nutrition')}
              </h3>
              <p className="text-gray-600">
                {t('balanced_nutrition_desc')}
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('expert_prepared')}
              </h3>
              <p className="text-gray-600">
                {t('expert_prepared_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" data-aos="fade-up">
            {t('ready_to_order')}
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            {t('order_description')}
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {t('start_ordering')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Menu;