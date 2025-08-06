const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearMeals() {
  try {
    console.log('حذف الوجبات القديمة...');
    const result = await prisma.meal.deleteMany({});
    console.log(`تم حذف ${result.count} وجبة`);
  } catch (error) {
    console.error('خطأ في حذف الوجبات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMeals();