const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mealsData = [
  // الحلويات
  {
    nameAr: 'بياناكوتا بالتوت والفراولة',
    nameEn: 'Panna Cotta with Berries and Strawberry',
    descriptionAr: 'حلوى إيطالية كريمية بالتوت الأحمر والفراولة الطازجة',
    descriptionEn: 'Italian creamy dessert with red berries and fresh strawberry',
    price: 25.00,
    calories: 208,
    protein: 6,
    carbs: 14,
    fat: 14,
    category: 'desserts',
    image: '/images/panna-cotta.jpg',
    ingredients: JSON.stringify({
      ar: ['حليب', 'كريمة حيوانية', 'فانيلا', 'سكر استيفيا', 'توت أحمر', 'فراولة', 'سكر', 'ليمون', 'جيلاتين بودر'],
      en: ['Milk', 'Heavy cream', 'Vanilla', 'Stevia sugar', 'Red berries', 'Strawberry', 'Sugar', 'Lemon', 'Gelatin powder']
    }),
    prepTime: '30 دقيقة',
    difficulty: 'متوسط',
    isActive: true,
    rating: 4.5
  },
  {
    nameAr: 'كيك الشوكولاتة بالجبنة',
    nameEn: 'Chocolate Cheese Cake',
    descriptionAr: 'كيك شوكولاتة غني بالجبنة الكريمية والطعم الرائع',
    descriptionEn: 'Rich chocolate cake with creamy cheese and amazing taste',
    price: 30.00,
    calories: 245,
    protein: 4,
    carbs: 17,
    fat: 19,
    category: 'desserts',
    image: '/images/chocolate-cheese-cake.jpg',
    ingredients: JSON.stringify({
      ar: ['بيض', 'سكر', 'فانيلا', 'بروتين شوكولاتة', 'كاكاو بودر', 'حليب', 'بالتيك بودر', 'زيت مخلوط', 'محسن كيك', 'شوكولاتة دارك', 'كريمة حيوانية', 'زبدة', 'حلوى كوكيز', 'زيت زيتون والكانولا'],
      en: ['Eggs', 'Sugar', 'Vanilla', 'Chocolate protein', 'Cocoa powder', 'Milk', 'Baltic powder', 'Mixed oil', 'Cake improver', 'Dark chocolate', 'Heavy cream', 'Butter', 'Cookie candy', 'Olive and canola oil']
    }),
    prepTime: '45 دقيقة',
    difficulty: 'صعب'
  },
  
  // السلطات
  {
    nameAr: 'سلطة الجرجير مع دريسنج البرتقال',
    nameEn: 'Arugula Salad with Orange Dressing',
    descriptionAr: 'سلطة جرجير طازجة مع عين الجمل وجبن الفيتا ودريسنج البرتقال',
    descriptionEn: 'Fresh arugula salad with walnuts, feta cheese and orange dressing',
    price: 22.00,
    calories: 151,
    protein: 0,
    carbs: 9,
    fat: 14,
    category: 'salads',
    image: '/images/arugula-orange-salad.jpg',
    ingredients: JSON.stringify({
      ar: ['جرجير', 'عين الجمل', 'زمان', 'جبن الفيتا', 'فلفل أخضر', 'عصير البرتقال', 'خل العنب (بلسمك)', 'ليمون', 'ملح', 'زيت زيتون', 'عسل'],
      en: ['Arugula', 'Walnuts', 'Pomegranate', 'Feta cheese', 'Green pepper', 'Orange juice', 'Balsamic vinegar', 'Lemon', 'Salt', 'Olive oil', 'Honey']
    }),
    prepTime: '15 دقيقة',
    difficulty: 'سهل'
  },
  {
    nameAr: 'سلطة البلاو مع صوص الرانش بالزعتر',
    nameEn: 'Bulgur Salad with Thyme Ranch Sauce',
    descriptionAr: 'سلطة البلاو الصحية مع الخضار الطازجة وصوص الرانش بالزعتر',
    descriptionEn: 'Healthy bulgur salad with fresh vegetables and thyme ranch sauce',
    price: 28.00,
    calories: 239,
    protein: 14,
    carbs: 22,
    fat: 8,
    category: 'salads',
    image: '/images/bulgur-ranch-salad.jpg',
    ingredients: JSON.stringify({
      ar: ['خس أمريكي', 'جزر', 'ملفوف أحمر', 'بقدونس', 'نعناع', 'نشا', 'زبدة', 'فلفل سيراتشا', 'صويا معتدلة', 'شطة تركيا', 'زبادي', 'مايونيز', 'ثوم', 'أوريغانو', 'ليمون', 'ملح', 'خردل'],
      en: ['American lettuce', 'Carrots', 'Red cabbage', 'Parsley', 'Mint', 'Starch', 'Butter', 'Sriracha pepper', 'Mild soy sauce', 'Turkish chili', 'Yogurt', 'Mayonnaise', 'Garlic', 'Oregano', 'Lemon', 'Salt', 'Mustard']
    }),
    prepTime: '20 دقيقة',
    difficulty: 'متوسط'
  },
  {
    nameAr: 'سلطة السمبريرو مع الفول السوداني',
    nameEn: 'Sombrero Salad with Peanuts',
    descriptionAr: 'سلطة مكسيكية بالفاصوليا الحمراء والذرة والفول السوداني',
    descriptionEn: 'Mexican salad with red beans, corn and peanuts',
    price: 24.00,
    calories: 106,
    protein: 6,
    carbs: 20,
    fat: 1,
    category: 'salads',
    image: '/images/sombrero-peanut-salad.jpg',
    ingredients: JSON.stringify({
      ar: ['خس', 'جرجير', 'طماطم', 'خيار', 'فاصوليا حمراء', 'ذرة', 'خبز أبيض محمص بزيت الزيتون', 'فول سوداني ناعم', 'ثوم طازج', 'كزبرة طازجة', 'ليمون', 'عسل', 'ملح', 'فلفل أسود'],
      en: ['Lettuce', 'Arugula', 'Tomatoes', 'Cucumber', 'Red beans', 'Corn', 'White bread toasted with olive oil', 'Smooth peanuts', 'Fresh garlic', 'Fresh coriander', 'Lemon', 'Honey', 'Salt', 'Black pepper']
    }),
    prepTime: '15 دقيقة',
    difficulty: 'سهل'
  },
  {
    nameAr: 'سلطة الفتوش مع دريسنج الرمان',
    nameEn: 'Fattoush Salad with Pomegranate Dressing',
    descriptionAr: 'سلطة فتوش تقليدية مع دريسنج دبس الرمان والسماق',
    descriptionEn: 'Traditional fattoush salad with pomegranate molasses and sumac dressing',
    price: 20.00,
    calories: 26,
    protein: 2,
    carbs: 6,
    fat: 0,
    category: 'salads',
    image: '/images/fattoush-pomegranate.jpg',
    ingredients: JSON.stringify({
      ar: ['خيار', 'طماطم', 'خس', 'فلفل رومي أخضر', 'بقدونس', 'نعناع', 'فجل أحمر', 'خبز أبيض', 'زيت زيتون', 'دبس الرمان', 'ليمون', 'سماق', 'ملح', 'نعناع مجفف', 'ثوم طازج'],
      en: ['Cucumber', 'Tomatoes', 'Lettuce', 'Green bell pepper', 'Parsley', 'Mint', 'Red radish', 'White bread', 'Olive oil', 'Pomegranate molasses', 'Lemon', 'Sumac', 'Salt', 'Dried mint', 'Fresh garlic']
    }),
    prepTime: '10 دقائق',
    difficulty: 'سهل'
  },
  {
    nameAr: 'سلطة السيزر مع صوص البارميزان',
    nameEn: 'Caesar Salad with Parmesan Sauce',
    descriptionAr: 'سلطة سيزر كلاسيكية مع الدجاج المشوي وجبن البارميزان',
    descriptionEn: 'Classic Caesar salad with grilled chicken and parmesan cheese',
    price: 32.00,
    calories: 132,
    protein: 14,
    carbs: 9,
    fat: 5,
    category: 'salads',
    image: '/images/caesar-parmesan.jpg',
    ingredients: JSON.stringify({
      ar: ['خس أمريكي', 'خس بلدي', 'دجاج مطبوخ', 'جبن بارميزان', 'خبز التوست الأبيض', 'بارميزان', 'مايونيز لايت', 'زبادي', 'حليب', 'ثوم', 'ملح', 'ليمون', 'خردل', 'فلفل أسود', 'زعتر طازج', 'أوريغانو', 'بابريكا مدخنة'],
      en: ['American lettuce', 'Local lettuce', 'Cooked chicken', 'Parmesan cheese', 'White toast bread', 'Parmesan', 'Light mayonnaise', 'Yogurt', 'Milk', 'Garlic', 'Salt', 'Lemon', 'Mustard', 'Black pepper', 'Fresh thyme', 'Oregano', 'Smoked paprika']
    }),
    prepTime: '20 دقيقة',
    difficulty: 'متوسط'
  },
  {
    nameAr: 'سلطة اليونانية مع دريسنج الليمون والزعتر',
    nameEn: 'Greek Salad with Lemon Thyme Dressing',
    descriptionAr: 'سلطة يونانية تقليدية مع جبن الفيتا والزيتون ودريسنج الليمون',
    descriptionEn: 'Traditional Greek salad with feta cheese, olives and lemon dressing',
    price: 26.00,
    calories: 71,
    protein: 3,
    carbs: 13,
    fat: 1,
    category: 'salads',
    image: '/images/greek-lemon-thyme.jpg',
    ingredients: JSON.stringify({
      ar: ['خس', 'زيتون أسود شرائح', 'طماطم', 'خيار', 'بصل', 'جبن فيتا', 'أوريغانو', 'زيت زيتون', 'ليمون', 'عسل', 'زعتر طازج', 'ماء', 'ملح', 'نعناع مجفف'],
      en: ['Lettuce', 'Black olive slices', 'Tomatoes', 'Cucumber', 'Onion', 'Feta cheese', 'Oregano', 'Olive oil', 'Lemon', 'Honey', 'Fresh thyme', 'Water', 'Salt', 'Dried mint']
    }),
    prepTime: '15 دقيقة',
    difficulty: 'سهل'
  },
  
  // الغداء
  {
    nameAr: 'صيادية السمك مع الطحينة والدقوس',
    nameEn: 'Fish Sayyadieh with Tahini and Dakous',
    descriptionAr: 'طبق سمك تقليدي مع الأرز المبهر والطحينة والدقوس',
    descriptionEn: 'Traditional fish dish with spiced rice, tahini and dakous',
    price: 45.00,
    calories: 878,
    protein: 55,
    carbs: 107,
    fat: 27,
    category: 'main',
    image: '/images/fish-sayyadieh.jpg',
    ingredients: JSON.stringify({
      ar: ['أرز', 'فرخة أعواد', 'هيل', 'فلفل حار', 'معجون طماطم', 'ملح', 'بصل', 'زيت مخلوط', 'ثوم', 'كزبرة', 'كمون', 'فلفل أسود', 'تتبيلة البرسيت', 'تتبيلة الأسماك', 'سمك', 'صوص حار', 'صوص طحينة', 'دقيق أبيض'],
      en: ['Rice', 'Chicken sticks', 'Cardamom', 'Hot pepper', 'Tomato paste', 'Salt', 'Onion', 'Mixed oil', 'Garlic', 'Coriander', 'Cumin', 'Black pepper', 'Parsley seasoning', 'Fish seasoning', 'Fish', 'Hot sauce', 'Tahini sauce', 'White flour']
    }),
    prepTime: '60 دقيقة',
    difficulty: 'صعب'
  },
  {
    nameAr: 'نودلز كانتون بالدجاج والخضار',
    nameEn: 'Canton Noodles with Chicken and Vegetables',
    descriptionAr: 'نودلز آسيوية بالدجاج والخضار المشكلة مع صوص الصويا',
    descriptionEn: 'Asian noodles with chicken and mixed vegetables with soy sauce',
    price: 38.00,
    calories: 397,
    protein: 55,
    carbs: 11,
    fat: 14,
    category: 'main',
    image: '/images/canton-noodles.jpg',
    ingredients: JSON.stringify({
      ar: ['زيت زيتون والكانولا', 'بصل', 'ثوم', 'دجاج', 'صوص الصويا', 'صوص المحار', 'بهار مشكل', 'فلفل أسود', 'ملح', 'كابوتشا', 'طماطم', 'فلفل حار أخضر', 'فلفل رومي أخضر', 'جزر', 'ملفوف أبيض', 'ملفوف أحمر', 'بصل الخضر', 'كزبرة طازجة', 'سمسم أبيض', 'مكرونة إسباغيتي'],
      en: ['Olive and canola oil', 'Onion', 'Garlic', 'Chicken', 'Soy sauce', 'Oyster sauce', 'Mixed spices', 'Black pepper', 'Salt', 'Kabocha', 'Tomatoes', 'Green hot pepper', 'Green bell pepper', 'Carrots', 'White cabbage', 'Red cabbage', 'Green onions', 'Fresh coriander', 'White sesame', 'Spaghetti pasta']
    }),
    prepTime: '30 دقيقة',
    difficulty: 'متوسط'
  }
];

async function insertMeals() {
  try {
    console.log('بدء إدخال الوجبات...');
    
    for (const mealData of mealsData) {
      const meal = await prisma.meal.create({
        data: mealData
      });
      console.log(`تم إدخال الوجبة: ${meal.nameAr}`);
    }
    
    console.log('تم إدخال جميع الوجبات بنجاح!');
  } catch (error) {
    console.error('خطأ في إدخال الوجبات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertMeals();