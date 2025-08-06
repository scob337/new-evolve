const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // إنشاء مستخدم مدير للاختبار
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@evolve.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@evolve.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'admin'
    }
  });

  // بيانات الوجبات من الصور
  const meals = [
    {
      nameAr: 'بان كيك بالفواكه',
      nameEn: 'Pancakes with Fruits',
      descriptionAr: 'فطار صحي ولذيذ مع قطع الفواكه الطازجة',
      descriptionEn: 'Healthy and delicious breakfast with fresh fruit pieces',
      usageAr: 'اخلطي المكونات الجافة، أضيفي المكونات السائلة، اطبخي على نار هادئة حتى تنضج، قدميها مع الفواكه والعسل',
      usageEn: 'Mix dry ingredients, add wet ingredients, cook on low heat until done, serve with fruits and honey',
      category: 'breakfast',
      price: 399,
      calories: 57,
      protein: 12.6,
      carbs: 8.44,
      fat: 0,
      prepTime: 15,
      ingredients: ['زبدة حيوانية', 'حليب', 'بيض', 'سكر', 'دقيق أبيض', 'دقيق أسمر', 'شوفان', 'بيكنج بودر', 'فانيليا سائل', 'عسل', 'فواكه مشكلة'],
      image: '/images/pancakes.jpg',
      isActive: true
    },
    {
      nameAr: 'فول الفلافل بقديد مع الخبز العربي',
      nameEn: 'Falafel Beans with Dried Meat and Arabic Bread',
      descriptionAr: 'وجبة تقليدية غنية بالبروتين والألياف',
      descriptionEn: 'Traditional meal rich in protein and fiber',
      usageAr: 'انقعي الفول ليلة كاملة، اسلقيه حتى ينضج، أضيفي البهارات والخضار، دعيه ينضج على نار هادئة',
      usageEn: 'Soak beans overnight, boil until tender, add spices and vegetables, let simmer on low heat',
      category: 'breakfast',
      price: 454,
      calories: 189,
      protein: 15.24,
      carbs: 12.07,
      fat: 0,
      prepTime: 30,
      ingredients: ['زيت كانولا وزيتون', 'بصل', 'معجون طماطم', 'طماطم', 'فول', 'فلفل حار', 'كزبرة طازجة', 'كزبرة ناشفة', 'كمون', 'بهار مشكل', 'فلفل أسود', 'ملح', 'كركم', 'ثوم طازج', 'حل أبيض', 'طحينة'],
      image: '/images/falafel-beans.jpg',
      isActive: true
    }
    // ... add other meals with the same structure
  ];

  // إدخال الوجبات
  for (const meal of meals) {
    await prisma.meal.create({
      data: meal
    });
  }

  console.log('تم إدخال البيانات بنجاح!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });