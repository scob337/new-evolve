import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    price: '',
    category: '',
    image: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: [],
    allergens: []
  });

  // Load meals data
  useEffect(() => {
    loadMeals();
    loadStats();
  }, []);

  const loadMeals = async () => {
    try {
      // Try to load from local storage first
      const savedMeals = localStorage.getItem('meals');
      if (savedMeals) {
        const mealsData = JSON.parse(savedMeals);
        setMeals(mealsData);
        return;
      }

      // Fallback to sample data
      const sampleMeals = [
        {
          id: 1,
          name: 'Grilled Chicken Salad',
          name_ar: 'سلطة الدجاج المشوي',
          description: 'Fresh mixed greens with grilled chicken breast',
          description_ar: 'خضروات ورقية طازجة مع صدر دجاج مشوي',
          price: 45,
          category: 'salads',
          image: '/images/meal1.jpg',
          calories: 320,
          protein: 35,
          carbs: 12,
          fat: 8,
          ingredients: ['chicken', 'lettuce', 'tomatoes', 'cucumber'],
          allergens: []
        },
        {
          id: 2,
          name: 'Quinoa Power Bowl',
          name_ar: 'وعاء الكينوا القوي',
          description: 'Nutritious quinoa with vegetables and protein',
          description_ar: 'كينوا مغذية مع الخضروات والبروتين',
          price: 38,
          category: 'bowls',
          image: '/images/meal2.jpg',
          calories: 420,
          protein: 18,
          carbs: 45,
          fat: 12,
          ingredients: ['quinoa', 'vegetables', 'chickpeas'],
          allergens: []
        }
      ];
      setMeals(sampleMeals);
      localStorage.setItem('meals', JSON.stringify(sampleMeals));
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const loadStats = () => {
    // Simulate loading stats
    setStats({
      totalMeals: 24,
      totalUsers: 156,
      totalOrders: 89,
      revenue: 12450
    });
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    
    const mealData = {
      ...newMeal,
      id: Date.now(),
      price: parseFloat(newMeal.price),
      calories: parseInt(newMeal.calories),
      protein: parseFloat(newMeal.protein),
      carbs: parseFloat(newMeal.carbs),
      fat: parseFloat(newMeal.fat),
      ingredients: newMeal.ingredients.filter(ing => ing.trim() !== ''),
      allergens: newMeal.allergens.filter(all => all.trim() !== '')
    };

    const updatedMeals = [...meals, mealData];
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    
    // Reset form
    setNewMeal({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      price: '',
      category: '',
      image: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      ingredients: [],
      allergens: []
    });
    setShowAddMeal(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalMeals: prev.totalMeals + 1
    }));
  };

  const handleDeleteMeal = (mealId) => {
    if (window.confirm(t('confirm_delete_meal'))) {
      const updatedMeals = meals.filter(meal => meal.id !== mealId);
      setMeals(updatedMeals);
      localStorage.setItem('meals', JSON.stringify(updatedMeals));
      
      setStats(prev => ({
        ...prev,
        totalMeals: prev.totalMeals - 1
      }));
    }
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.name_ar.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: t('all_categories') },
    { value: 'salads', label: t('salads') },
    { value: 'bowls', label: t('bowls') },
    { value: 'proteins', label: t('proteins') },
    { value: 'desserts', label: t('desserts') }
  ];

  const statCards = [
    {
      title: t('total_meals'),
      value: stats.totalMeals,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: t('total_users'),
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: t('total_orders'),
      value: stats.totalOrders,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9.5A1.5 1.5 0 017.5 8h5A1.5 1.5 0 0114 9.5v1a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 016 10.5v-1z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      change: '+15%'
    },
    {
      title: t('revenue'),
      value: `$${stats.revenue.toLocaleString()}`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      change: '+22%'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('admin_dashboard')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('dashboard_welcome')}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/menu"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                {t('view_menu')}
              </Link>
              <button
                onClick={() => setShowAddMeal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                {t('add_new_meal')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} {t('from_last_month')}
                  </p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Meals Management */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('meals_management')}
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('search_meals')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Meals Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('meal')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('calories')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMeals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={meal.image || '/images/placeholder-meal.jpg'}
                            alt={meal.name}
                            onError={(e) => {
                              e.target.src = '/images/placeholder-meal.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {meal.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {meal.name_ar}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {t(meal.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${meal.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {meal.calories} {t('cal')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('add_new_meal')}
                </h3>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddMeal} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('meal_name_en')}
                    </label>
                    <input
                      type="text"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('meal_name_ar')}
                    </label>
                    <input
                      type="text"
                      value={newMeal.name_ar}
                      onChange={(e) => setNewMeal({...newMeal, name_ar: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('description_en')}
                    </label>
                    <textarea
                      value={newMeal.description}
                      onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('description_ar')}
                    </label>
                    <textarea
                      value={newMeal.description_ar}
                      onChange={(e) => setNewMeal({...newMeal, description_ar: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('price')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMeal.price}
                      onChange={(e) => setNewMeal({...newMeal, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('category')}
                    </label>
                    <select
                      value={newMeal.category}
                      onChange={(e) => setNewMeal({...newMeal, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">{t('select_category')}</option>
                      <option value="salads">{t('salads')}</option>
                      <option value="bowls">{t('bowls')}</option>
                      <option value="proteins">{t('proteins')}</option>
                      <option value="desserts">{t('desserts')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('calories')}
                    </label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('protein')} (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('carbs')} (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('fat')} (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newMeal.fat}
                      onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('image_url')}
                  </label>
                  <input
                    type="url"
                    value={newMeal.image}
                    onChange={(e) => setNewMeal({...newMeal, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMeal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    {t('add_meal')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;