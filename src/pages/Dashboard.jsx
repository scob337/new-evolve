import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const Dashboard = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showEditMeal, setShowEditMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalUsers: 1250,
    totalOrders: 3420,
    revenue: 45680
  });
  const [newMeal, setNewMeal] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    usageEn: '',
    usageAr: '',
    price: '',
    category: '',
    image: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    prepTime: '',
    rating: '4.5'
  });

   const handlePrintQR = async (meal) => {
    try {
      // إنشاء URL للوجبة
      const mealUrl = `${window.location.origin}/meal/${meal.id}`;
      
      // إنشاء QR code
      const qrCodeDataUrl = await QRCode.toDataURL(mealUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // إنشاء PDF
      const pdf = new jsPDF();
      
      // إضافة عنوان
      pdf.setFontSize(20);
      pdf.text('Evolve QR Code', 20, 30);
      
      // إضافة اسم الوجبة
      pdf.setFontSize(16);
      const mealName = meal.nameEn || meal.name ;
      pdf.text(` ${meal.nameEn}`, 20, 50);
      
      // إضافة QR code
      pdf.addImage(qrCodeDataUrl, 'PNG', 20, 60, 50, 50);
      
      // إضافة URL
      pdf.setFontSize(10);
      pdf.text(`URL: ${mealUrl}`, 20, 120);
      

      // طباعة PDF
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('حدث خطأ أثناء إنشاء رمز QR');
    }
  };

  // Load meals from API on component mount
  useEffect(() => {
    loadMealsFromAPI();
  }, []);

  const loadMealsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/meals');
      const data = await response.json();
      
      if (data.success) {
        setMeals(data.data.meals);
        setStats(prev => ({
          ...prev,
          totalMeals: data.data.meals.length
        }));
      } else {
        throw new Error(data.message || 'فشل في تحميل الوجبات');
      }
    } catch (error) {
      console.error('Error loading meals:', error);
      setError(error.message);
      // Fallback to localStorage if API fails
      const savedMeals = localStorage.getItem('meals');
      if (savedMeals) {
        const localMeals = JSON.parse(savedMeals);
        setMeals(localMeals);
        setStats(prev => ({
          ...prev,
          totalMeals: localMeals.length
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Add all required fields
      formData.append('nameEn', newMeal.nameEn);
      formData.append('nameAr', newMeal.nameAr);
      formData.append('descriptionEn', newMeal.descriptionEn);
      formData.append('descriptionAr', newMeal.descriptionAr);
      formData.append('usageEn', newMeal.usageEn);
      formData.append('usageAr', newMeal.usageAr);
      formData.append('price', parseFloat(newMeal.price));
      formData.append('category', newMeal.category);
      
      // Add optional fields
      if (newMeal.calories) formData.append('calories', parseInt(newMeal.calories));
      if (newMeal.prepTime) formData.append('prepTime', newMeal.prepTime);
      if (newMeal.rating) formData.append('rating', parseFloat(newMeal.rating));
      
      // Note: For image upload, you'll need to handle file input
      // For now, we'll skip image upload in dashboard
      
      const response = await fetch('http://localhost:5000/api/meals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // You'll need admin authentication
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload meals from API
        await loadMealsFromAPI();
        
        // Reset form
        setNewMeal({
          nameEn: '',
          nameAr: '',
          descriptionEn: '',
          descriptionAr: '',
          usageEn: '',
          usageAr: '',
          price: '',
          category: '',
          image: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          prepTime: '',
          rating: '4.5'
        });
        setShowAddMeal(false);
        
        alert(t('meal_added_successfully') || 'تم إضافة الوجبة بنجاح');
      } else {
        throw new Error(data.message || 'فشل في إضافة الوجبة');
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      alert(t('error_adding_meal') || 'حدث خطأ أثناء إضافة الوجبة');
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal({
      id: meal.id,
      nameEn: meal.nameEn || (meal.name && meal.name.en) || '',
      nameAr: meal.nameAr || (meal.name && meal.name.ar) || '',
      descriptionEn: meal.descriptionEn || (meal.description && meal.description.en) || '',
      descriptionAr: meal.descriptionAr || (meal.description && meal.description.ar) || '',
      usageEn: meal.usageEn || (meal.usage && meal.usage.en) || '',
      usageAr: meal.usageAr || (meal.usage && meal.usage.ar) || '',
      price: meal.price || '',
      category: meal.category || '',
      calories: meal.calories || '',
      prepTime: meal.prepTime || '',
      rating: meal.rating || '4.5'
    });
    setShowEditMeal(true);
  };

  const handleUpdateMeal = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Add all fields
      formData.append('nameEn', editingMeal.nameEn);
      formData.append('nameAr', editingMeal.nameAr);
      formData.append('descriptionEn', editingMeal.descriptionEn);
      formData.append('descriptionAr', editingMeal.descriptionAr);
      formData.append('usageEn', editingMeal.usageEn);
      formData.append('usageAr', editingMeal.usageAr);
      formData.append('price', parseFloat(editingMeal.price));
      formData.append('category', editingMeal.category);
      
      if (editingMeal.calories) formData.append('calories', parseInt(editingMeal.calories));
      if (editingMeal.prepTime) formData.append('prepTime', editingMeal.prepTime);
      if (editingMeal.rating) formData.append('rating', parseFloat(editingMeal.rating));
      
      const response = await fetch(`http://localhost:5000/api/meals/${editingMeal.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload meals from API
        await loadMealsFromAPI();
        
        setShowEditMeal(false);
        setEditingMeal(null);
        
        alert(t('meal_updated_successfully') || 'تم تحديث الوجبة بنجاح');
      } else {
        throw new Error(data.message || 'فشل في تحديث الوجبة');
      }
    } catch (error) {
      console.error('Error updating meal:', error);
      alert(t('error_updating_meal') || 'حدث خطأ أثناء تحديث الوجبة');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm(t('confirm_delete_meal') || 'هل أنت متأكد من حذف هذه الوجبة؟')) {
      try {
        const response = await fetch(`http://localhost:5000/api/meals/${mealId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Reload meals from API
          await loadMealsFromAPI();
          
          alert(t('meal_deleted_successfully') || 'تم حذف الوجبة بنجاح');
        } else {
          throw new Error(data.message || 'فشل في حذف الوجبة');
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
        alert(t('error_deleting_meal') || 'حدث خطأ أثناء حذف الوجبة');
      }
    }
  };

  // Helper function to get meal name based on language
  const getMealName = (meal) => {
    if (meal.nameAr && meal.nameEn) {
      return t('language') === 'ar' ? meal.nameAr : meal.nameEn;
    }
    if (meal.name && typeof meal.name === 'object') {
      return meal.name[t('language')] || meal.name.en || meal.name.ar;
    }
    return meal.name || meal.nameEn || meal.nameAr || 'اسم غير متوفر';
  };

  // Helper function to get meal description
  const getMealDescription = (meal) => {
    if (meal.descriptionAr && meal.descriptionEn) {
      return t('language') === 'ar' ? meal.descriptionAr : meal.descriptionEn;
    }
    if (meal.description && typeof meal.description === 'object') {
      return meal.description[t('language')] || meal.description.en || meal.description.ar;
    }
    return meal.description || meal.descriptionEn || meal.descriptionAr || 'وصف غير متوفر';
  };

  const filteredMeals = meals.filter(meal => {
    const mealName = getMealName(meal).toLowerCase();
    const mealDescription = getMealDescription(meal).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = mealName.includes(searchLower) || mealDescription.includes(searchLower);
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
                            src={meal.image || '/images/default-meal.jpg'}
                            alt={meal.nameEn}
                            onError={(e) => {
                              e.target.src = '/images/default-meal.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {meal.name}
                          </div>
                            <div className="text-sm text-gray-500">
                              {meal.nameEn}
                            </div>
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t(meal.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${meal.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {meal.calories} cal
                    </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditMeal(meal)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {t('edit')}
                      </button>

                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('delete')}
                      </button>
                                            <button
                        onClick={() => handlePrintQR(meal)}
                        className="text-green-600 hover:text-green-900 ml-4"
                        title="طباعة QR Code"
                      >
                       QR
                      </button>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ingredients')}
                    </label>
                    <textarea
                      value={newMeal.ingredients}
                      onChange={(e) => setNewMeal({...newMeal, ingredients: e.target.value})}
                      rows={3}
                      placeholder={t('ingredients_placeholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('allergens')}
                    </label>
                    <textarea
                      value={newMeal.allergens}
                      onChange={(e) => setNewMeal({...newMeal, allergens: e.target.value})}
                      rows={3}
                      placeholder={t('allergens_placeholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

      {/* Edit Meal Modal */}
      {showEditMeal && editingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('edit_meal')}
                </h3>
                <button
                  onClick={() => {
                    setShowEditMeal(false);
                    setEditingMeal(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateMeal} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('meal_name_en')}
                    </label>
                    <input
                      type="text"
                      value={editingMeal.name}
                      onChange={(e) => setEditingMeal({...editingMeal, name: e.target.value})}
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
                      value={editingMeal.name_ar || ''}
                      onChange={(e) => setEditingMeal({...editingMeal, name_ar: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('description_en')}
                    </label>
                    <textarea
                      value={editingMeal.description}
                      onChange={(e) => setEditingMeal({...editingMeal, description: e.target.value})}
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
                      value={editingMeal.description_ar || ''}
                      onChange={(e) => setEditingMeal({...editingMeal, description_ar: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      value={editingMeal.price}
                      onChange={(e) => setEditingMeal({...editingMeal, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('category')}
                    </label>
                    <select
                      value={editingMeal.category}
                      onChange={(e) => setEditingMeal({...editingMeal, category: e.target.value})}
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
                      value={editingMeal.calories}
                      onChange={(e) => setEditingMeal({...editingMeal, calories: e.target.value})}
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
                      value={editingMeal.protein}
                      onChange={(e) => setEditingMeal({...editingMeal, protein: e.target.value})}
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
                      value={editingMeal.carbs}
                      onChange={(e) => setEditingMeal({...editingMeal, carbs: e.target.value})}
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
                      value={editingMeal.fat}
                      onChange={(e) => setEditingMeal({...editingMeal, fat: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ingredients')}
                    </label>
                    <textarea
                      value={editingMeal.ingredients || ''}
                      onChange={(e) => setEditingMeal({...editingMeal, ingredients: e.target.value})}
                      rows={3}
                      placeholder={t('ingredients_placeholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('allergens')}
                    </label>
                    <textarea
                      value={editingMeal.allergens || ''}
                      onChange={(e) => setEditingMeal({...editingMeal, allergens: e.target.value})}
                      rows={3}
                      placeholder={t('allergens_placeholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('image_url')}
                  </label>
                  <input
                    type="url"
                    value={editingMeal.image || ''}
                    onChange={(e) => setEditingMeal({...editingMeal, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditMeal(false);
                      setEditingMeal(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    {t('update_meal')}
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
