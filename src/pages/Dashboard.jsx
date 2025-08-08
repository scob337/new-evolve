import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // إضافة حالات التحميل والأخطاء للعمليات
  const [addingMeal, setAddingMeal] = useState(false);
  const [updatingMeal, setUpdatingMeal] = useState(false);
  const [deletingMeal, setDeletingMeal] = useState(null); // ID الوجبة التي يتم حذفها
  const [operationError, setOperationError] = useState(null);
  const [operationSuccess, setOperationSuccess] = useState(null);
  
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
    name: '',
    description: '',
    usage: '',
    price: '',
    category: '',
    image: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    prepTime: '',
    rating: '4.5',
    ingredients: '' // إضافة حقل المكونات
  });
  const handleLogout = () => {
    // مسح الكوكيز
    Cookies.remove('hasLoggedIn');
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    navigate('/login');
  };

  const handlePrintQR = async (meal) => {
    try {
      // إنشاء URL للوجبة
      const mealUrl = `${window.location.origin}/meal/${meal.id}`;
      
      // إنشاء QR code
      const qrCodeDataUrl = await QRCode.toDataURL(mealUrl, {
        width: 100,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // إنشاء عنصر HTML مؤقت لعرض المحتوى
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.direction = 'rtl'; // دعم RTL للغة العربية
      tempDiv.style.textAlign = 'right';
      
      // إضافة محتوى البطاقة
      tempDiv.innerHTML = `
        <div style="padding: 20px; width: 600px;">
          <h1 style="font-size: 24px; text-align: center;">Evolve QR Code</h1>
          <h2 style="font-size: 20px; text-align: right; margin-top: 20px;">${getMealName(meal)}</h2>
          <div style="text-align: center; margin: 20px 0;">
            <img src="${qrCodeDataUrl}" style="width: 200px; height: 200px;" />
          </div>
          <p style="font-size: 12px; text-align: right;">URL: ${mealUrl}</p>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // استخدام html2canvas لتحويل العنصر إلى صورة
      const canvas = await html2canvas(tempDiv, {
        allowTaint: true,
        useCORS: true,
        scale: 2 // جودة أعلى
      });
      
      // إزالة العنصر المؤقت
      document.body.removeChild(tempDiv);
      
      // إنشاء PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // إضافة الصورة إلى PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
      
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
      
      const response = await fetch('https://evolvetheapp.com/api/meals');
      const data = await response.json();
      console.log(data)
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
    
    setAddingMeal(true);
    setOperationError(null);
    setOperationSuccess(null);
    
    try {
      const formData = new FormData();
      
      // إضافة جميع الحقول
      formData.append('name', newMeal.name);
      formData.append('description', newMeal.description);
      formData.append('usage', newMeal.usage);
      formData.append('price', parseFloat(newMeal.price));
      formData.append('category', newMeal.category);
      
      if (newMeal.calories) formData.append('calories', parseInt(newMeal.calories));
      if (newMeal.protein) formData.append('protein', parseInt(newMeal.protein));
      if (newMeal.carbs) formData.append('carbs', parseInt(newMeal.carbs));
      if (newMeal.fat) formData.append('fat', parseInt(newMeal.fat));
      if (newMeal.prepTime) formData.append('prepTime', newMeal.prepTime);
      if (newMeal.rating) formData.append('rating', parseFloat(newMeal.rating));
      
      // إضافة المكونات
      if (newMeal.ingredients) {
        const ingredientsArray = newMeal.ingredients.split(/[,._\-\s]+/).map(item => item.trim()).filter(item => item);
        const ingredientsJson = JSON.stringify({
          ar: ingredientsArray,
          en: ingredientsArray
        });
        formData.append('ingredients', ingredientsJson);
      }
      
      // إضافة الصورة المحلية إذا تم اختيارها
      if (newMeal.imageFile) {
        formData.append('image', newMeal.imageFile);
      } else if (newMeal.image) {
        formData.append('image', newMeal.image);
      }
      
      const response = await fetch('https://evolvetheapp.com/api/meals', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // إعادة تحميل الوجبات من API
        await loadMealsFromAPI();
        
        // إعادة تعيين نموذج الوجبة الجديدة
        setNewMeal({
          name: '',
          description: '',
          usage: '',
          price: '',
          category: '',
          image: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          prepTime: '',
          rating: '4.5',
          ingredients: ''
        });
        
        setShowAddMeal(false);
        setOperationSuccess(t('meal_added_successfully') || 'تم إضافة الوجبة بنجاح');
        
        // إخفاء رسالة النجاح بعد 3 ثوان
        setTimeout(() => setOperationSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'فشل في إضافة الوجبة');
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      setOperationError(t('error_adding_meal') || 'حدث خطأ أثناء إضافة الوجبة');
      
      // إخفاء رسالة الخطأ بعد 5 ثوان
      setTimeout(() => setOperationError(null), 5000);
    } finally {
      setAddingMeal(false);
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal({
      id: meal.id,
      name: meal.name || '',
      description: meal.description || '',
      usage: meal.usage || '',
      price: meal.price || '',
      category: meal.category || '',
      image: meal.image || '',
      calories: meal.calories || '',
      protein: meal.protein || '',
      carbs: meal.carbs || '',
      fat: meal.fat || '',
      prepTime: meal.prepTime || '',
      rating: meal.rating || '4.5'
    });
    setShowEditMeal(true);
  };

  const handleUpdateMeal = async (e) => {
    e.preventDefault();
    
    setUpdatingMeal(true);
    setOperationError(null);
    setOperationSuccess(null);
    
    try {
      const formData = new FormData();
      
      // إضافة جميع الحقول
      formData.append('name', editingMeal.name);
      formData.append('description', editingMeal.description);
      formData.append('usage', editingMeal.usage);
      formData.append('price', parseFloat(editingMeal.price));
      formData.append('category', editingMeal.category);
      
      if (editingMeal.calories) formData.append('calories', parseInt(editingMeal.calories));
      if (editingMeal.protein) formData.append('protein', parseInt(editingMeal.protein));
      if (editingMeal.carbs) formData.append('carbs', parseInt(editingMeal.carbs));
      if (editingMeal.fat) formData.append('fat', parseInt(editingMeal.fat));
      if (editingMeal.prepTime) formData.append('prepTime', editingMeal.prepTime);
      if (editingMeal.rating) formData.append('rating', parseFloat(editingMeal.rating));
      
      // إضافة المكونات
      if (editingMeal.ingredients) {
        const ingredientsArray = editingMeal.ingredients.split(/[,._\-\s]+/).map(item => item.trim()).filter(item => item);
        const ingredientsJson = JSON.stringify({
          ar: ingredientsArray,
          en: ingredientsArray
        });
        formData.append('ingredients', ingredientsJson);
      }
      
      // إضافة الصورة المحلية إذا تم اختيارها
      if (editingMeal.imageFile) {
        formData.append('image', editingMeal.imageFile);
      } else if (editingMeal.image) {
        formData.append('image', editingMeal.image);
      }
      
      const response = await fetch(`https://evolvetheapp.com/api/meals/${editingMeal.id}`, {
        method: 'PUT',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // إعادة تحميل الوجبات من API
        await loadMealsFromAPI();
        
        setShowEditMeal(false);
        setEditingMeal(null);
        setOperationSuccess(t('meal_updated_successfully') || 'تم تحديث الوجبة بنجاح');
        
        // إخفاء رسالة النجاح بعد 3 ثوان
        setTimeout(() => setOperationSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'فشل في تحديث الوجبة');
      }
    } catch (error) {
      console.error('Error updating meal:', error);
      setOperationError(t('error_updating_meal') || 'حدث خطأ أثناء تحديث الوجبة');
      
      // إخفاء رسالة الخطأ بعد 5 ثوان
      setTimeout(() => setOperationError(null), 5000);
    } finally {
      setUpdatingMeal(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm(t('confirm_delete_meal') || 'هل أنت متأكد من حذف هذه الوجبة؟')) {
      setDeletingMeal(mealId);
      setOperationError(null);
      setOperationSuccess(null);
      
      try {
        const response = await fetch(`https://evolvetheapp.com/api/meals/${mealId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Reload meals from API
          await loadMealsFromAPI();
          setOperationSuccess(t('meal_deleted_successfully') || 'تم حذف الوجبة بنجاح');
          
          // إخفاء رسالة النجاح بعد 3 ثوان
          setTimeout(() => setOperationSuccess(null), 3000);
        } else {
          throw new Error(data.message || 'فشل في حذف الوجبة');
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
        setOperationError(t('error_deleting_meal') || 'حدث خطأ أثناء حذف الوجبة');
        
        // إخفاء رسالة الخطأ بعد 5 ثوان
        setTimeout(() => setOperationError(null), 5000);
      } finally {
        setDeletingMeal(null);
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
    { value: 'desserts', label: t('desserts') },
    
    { value: 'breakfast', label: t('Breakfast') },
    { value: 'lunch', label: t('Lunch') },
    { value: 'dinner', label: t('Dinner') },
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
              &nbsp;

              <Link
                to="/menu"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                {t('view_menu')}
              </Link>
              &nbsp;

              &nbsp;
              <button
                onClick={() => setShowAddMeal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                {t('add_new_meal')}
              </button>
              &nbsp;
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                {t('logout') || 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رسائل النجاح والخطأ */}
        {operationSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {operationSuccess}
          </div>
        )}
        
        {operationError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {operationError}
          </div>
        )}

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
                            src={getImageUrl(meal.image)}
                            alt={getMealName(meal)}
                            onError={(e) => {
                              e.target.src = '/images/default-meal.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getMealName(meal)}
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
                      <div className="flex flex-wrap gap-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditMeal(meal)}
                          disabled={updatingMeal || deletingMeal === meal.id}
                          className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-md text-blue-600 hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingMeal ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('updating')}
                            </div>
                          ) : (
                            t('edit')
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          disabled={deletingMeal === meal.id || updatingMeal}
                          className="px-3 py-1 bg-red-50 border border-red-300 rounded-md text-red-600 hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingMeal === meal.id ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('deleting')}
                            </div>
                          ) : (
                            t('delete')
                          )}
                        </button>
                        
                        <button
                          onClick={() => handlePrintQR(meal)}
                          disabled={deletingMeal === meal.id || updatingMeal}
                          className="px-3 py-1 bg-green-50 border border-green-300 rounded-md text-green-600 hover:bg-green-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="طباعة QR Code"
                        >
                          QR
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

              <form onSubmit={handleAddMeal} className="space-y-6" encType="multipart/form-data">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('meal_name')}
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
                    {t('description')}
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
                    {t('usage')}
                  </label>
                  <textarea
                    value={newMeal.usage}
                    onChange={(e) => setNewMeal({...newMeal, usage: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
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
                    {t('ingredients')}
                  </label>
                  <textarea
                    value={newMeal.ingredients}
                    onChange={(e) => setNewMeal({...newMeal, ingredients: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={t('enter_ingredients_separated') || 'أدخل المكونات مفصولة بفواصل'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('image_upload')}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewMeal({...newMeal, imageFile: e.target.files[0]})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {newMeal.image && (
                      <div className="text-sm text-gray-500">
                        {t('or_use_url') || 'أو استخدم الرابط'}
                      </div>
                    )}
                  </div>
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
                    disabled={addingMeal}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingMeal ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('adding_meal') || 'جاري الإضافة...'}
                      </div>
                    ) : (
                      t('add_meal')
                    )}
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

              <form onSubmit={handleUpdateMeal} className="space-y-6" encType="multipart/form-data">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('meal_name')}
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
                    {t('description')}
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
                    {t('usage')}
                  </label>
                  <textarea
                    value={editingMeal.usage}
                    onChange={(e) => setEditingMeal({...editingMeal, usage: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ingredients')}
                  </label>
                  <textarea
                    value={editingMeal.ingredients}
                    onChange={(e) => setEditingMeal({...editingMeal, ingredients: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={t('enter_ingredients_separated') || 'أدخل المكونات مفصولة بفواصل'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('image_upload')}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingMeal({...editingMeal, imageFile: e.target.files[0]})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {editingMeal.image && (
                      <div className="text-sm text-gray-500">
                        {t('current_image') || 'الصورة الحالية'}: {editingMeal.image.substring(editingMeal.image.lastIndexOf('/') + 1)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('image_url')}
                  </label>
                  <input
                    type="url"
                    value={editingMeal.image}
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
                    disabled={updatingMeal}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingMeal ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('updating_meal') || 'جاري التحديث...'}
                      </div>
                    ) : (
                      t('update_meal')
                    )}
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

// بعد تعريف المتغيرات وقبل useEffect

// دالة مساعدة لتحويل مسار الصورة إلى URL كامل
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-meal.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://evolvetheapp.com${imagePath}`;
};

