const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMealSchema() {
  try {
    console.log('بدء تحديث هيكل الوجبات...');
    
    // الحصول على جميع الوجبات
    const meals = await prisma.meal.findMany();
    console.log(`تم العثور على ${meals.length} وجبة`);
    
    // تحديث كل وجبة
    for (const meal of meals) {
      console.log(`معالجة الوجبة: ${meal.id}`);
      console.log(`البيانات الحالية: nameAr=${meal.nameAr}, nameEn=${meal.nameEn}, name=${meal.name}`);
      
      const updatedName = meal.nameAr || meal.nameEn || 'بدون اسم';
      const updatedDescription = meal.descriptionAr || meal.descriptionEn || '';
      const updatedUsage = meal.usageAr || meal.usageEn || '';
      
      console.log(`البيانات المحدثة: name=${updatedName}`);
      
      await prisma.meal.update({
        where: { id: meal.id },
        data: {
          name: updatedName,
          description: updatedDescription,
          usage: updatedUsage
        }
      });
      console.log(`تم تحديث الوجبة: ${updatedName}`);
    }
    
    console.log('تم تحديث جميع الوجبات بنجاح!');
  } catch (error) {
    console.error('خطأ في تحديث الوجبات:', error);
    // طباعة تفاصيل الخطأ
    if (error.meta) {
      console.error('تفاصيل الخطأ:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMealSchema() {
  try {
    console.log('بدء تحديث هيكل الوجبات...');
    
    // الحصول على جميع الوجبات
    const meals = await prisma.meal.findMany();
    console.log(`تم العثور على ${meals.length} وجبة`);
    
    // تحديث كل وجبة
    for (const meal of meals) {
      console.log(`معالجة الوجبة: ${meal.id}`);
      console.log(`البيانات الحالية: nameAr=${meal.nameAr}, nameEn=${meal.nameEn}, name=${meal.name}`);
      
      const updatedName = meal.nameAr || meal.nameEn || 'بدون اسم';
      const updatedDescription = meal.descriptionAr || meal.descriptionEn || '';
      const updatedUsage = meal.usageAr || meal.usageEn || '';
      
      console.log(`البيانات المحدثة: name=${updatedName}`);
      
      await prisma.meal.update({
        where: { id: meal.id },
        data: {
          name: updatedName,
          description: updatedDescription,
          usage: updatedUsage
        }
      });
      console.log(`تم تحديث الوجبة: ${updatedName}`);
    }
    
    console.log('تم تحديث جميع الوجبات بنجاح!');
  } catch (error) {
    console.error('خطأ في تحديث الوجبات:', error);
    // طباعة تفاصيل الخطأ
    if (error.meta) {
      console.error('تفاصيل الخطأ:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateMealSchema();