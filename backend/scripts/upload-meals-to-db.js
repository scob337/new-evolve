import { PrismaClient } from '@prisma/client';
import mealsData from './meals-data.js';

const prisma = new PrismaClient();

async function uploadMealsToDatabase() {
  try {
    console.log('بدء رفع الوجبات إلى قاعدة البيانات...');
    console.log(`عدد الوجبات المراد رفعها: ${mealsData.length}`);
    let successCount = 0;
    let errorCount = 0;
    
    for (const mealData of mealsData) {
      try {
        const meal = await prisma.meal.create({
          data: {
            name: mealData.name,
            description: mealData.description,
            price: mealData.price,
            calories: mealData.calories,
            protein: mealData.protein,
            carbs: mealData.carbs,
            fat: mealData.fat,
            category: mealData.category,
            image: mealData.image,
            prepTime: mealData.prepTime,
            ingredients: mealData.ingredients,
            isActive: mealData.isActive || true,
            rating: mealData.rating || 4.5
          }
        });
        
        console.log(`✅ تم رفع الوجبة: ${meal.name}`);
        successCount++;
      } catch (error) {
        console.error(`❌ خطأ في رفع الوجبة: ${mealData.name}`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n=== تقرير الرفع ===');
    console.log(`✅ تم رفع ${successCount} وجبة بنجاح`);
    console.log(`❌ فشل في رفع ${errorCount} وجبة`);
    console.log(`📊 إجمالي الوجبات: ${mealsData.length}`);
    
    if (errorCount === 0) {
      console.log('🎉 تم رفع جميع الوجبات بنجاح!');
    }
    
  } catch (error) {
    console.error('خطأ عام في رفع الوجبات:', error);
  } finally {
    await prisma.$disconnect();
    console.log('تم قطع الاتصال مع قاعدة البيانات');
  }
}

// تشغيل الدالة
uploadMealsToDatabase()
  .then(() => {
    console.log('انتهت عملية الرفع');
    process.exit(0);
  })
  .catch((error) => {
    console.error('خطأ في تشغيل السكريبت:', error);
    process.exit(1);
  });