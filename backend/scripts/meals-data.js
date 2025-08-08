// بيانات الوجبات للرفع إلى MongoDB
const mealsData = [
  // وجبات الإفطار
  {
    name: 'فول القلاية',
    description: 'يقدم مع الخبز العربي',
    price: 45.4,
    calories: 454,
    protein: 15.24,
    carbs: 188.76,
    fat: 12.87,
    category: 'breakfast',
    image: '/images/foul-qalaya.jpg',
    prepTime: '30 دقيقة و 20 ثانية',
    ingredients: JSON.stringify(
       ['زيت كانولا وزيتون', 'بصل', 'معجون طماطم', 'طماطم', 'فول', 'فلفل حار', 'كزبرة طازجة', 'كزبرة ناشفة', 'كمون', 'بهار مشكل', 'فلفل أسود', 'ملح', 'كركم', 'ثوم طازج', 'خل أبيض', 'طحينة', 'فلفل أسود'],
    ),
    isActive: true,
    rating: 4.7
  },
  {
    name: 'بان كيك بالفواكه',
    description: 'يقدم مع العسل',
    price: 29.9,
    calories: 299,
    protein: 15,
    carbs: 57,
    fat: 12.6,
    category: 'breakfast',
    image: '/images/fruit-pancake.jpg',
    prepTime: 'دقيقة',
    ingredients: JSON.stringify(
      ['زبدة حيوانية', 'حليب', 'بيض', 'سكر', 'دقيق أبيض', 'دقيق أسمر', 'شوفان', 'بيكنج بودر', 'فانيلا سائلة', 'عسل', 'فواكه مشكلة'],
    ),
    isActive: true,
    rating: 4.5
  },
  {
    name: 'كلوب ساندويتش البيض بالجبن',
    description: 'يقدم مع البطاطس المقلية',
    price: 12.7,
    calories: 127,
    protein: 9.27,
    carbs: 2.97,
    fat: 8.44,
    category: 'breakfast',
    image: '/images/egg-cheese-sandwich.jpg',
    prepTime: 'دقيقة',
    ingredients: JSON.stringify(
       ['بيض مسلوق', 'مايونيز لايت', 'زيتون أسود شرائح', 'خردل', 'ليمون', 'جبن فيلادلفيا', 'ملح', 'فلفل أسود', 'أوريغانو', 'خس', 'طماطم', 'خبزتوست أسمر'],
    ),
    isActive: true,
    rating: 4.3
  },
  {
    name: 'كلوب ساندويتش الحلوم المشوي',
    description: 'يقدم مع البطاطس المقلية',
    price: 54.9,
    calories: 549,
    protein: 33,
    carbs: 72,
    fat: 16,
    category: 'breakfast',
    image: '/images/halloumi-sandwich.jpg',
    prepTime: 'دقيقة',
    ingredients: JSON.stringify(
       ['خبزتوست أسمر', 'حلوم لايت', 'عسل', 'فلفل حار مجروش', 'زيت زيتون', 'دبس الرمان', 'لبنة', 'نعناع', 'خيار', 'ريحان', 'زيتون أسود شرائح', 'ملح', 'ليمون', 'جرجير'],
    ),
    isActive: true,
    rating: 4.6
  },
  {
    name: 'ساندويتش دجاج البولوروف',
    description: 'يقدم مع البطاطس المقلية',
    price: 54.9,
    calories: 549,
    protein: 54,
    carbs: 57,
    fat: 12,
    category: 'breakfast',
    image: '/images/chicken-sandwich.jpg',
    prepTime: 'دقيقة',
    ingredients: JSON.stringify(
      ['دجاج', 'توابل الدجاج', 'تفاح أخضر', 'عنب أخضر', 'طماطم', 'بصل أبيض', 'زبيب أخضر', 'جرجير', 'صوص الرانش', 'خبز بيتا أسمر'],
    ),
    isActive: true,
    rating: 4.7
  },
  {
    name: 'كاساديا الدجاج بالتورتيلا',
    description: 'يقدم مع البطاطس المقلية',
    price: 58.0,
    calories: 580,
    protein: 37,
    carbs: 38,
    fat: 28,
    category: 'breakfast',
    image: '/images/chicken-quesadilla.jpg',
    prepTime: 'دقيقة',
    ingredients: JSON.stringify(
       ['دجاج', 'زيت زيتون وكانولا', 'ثوم', 'صويا معتدلة', 'فلفل رومي ملون', 'فلفل حار', 'ذرة محلية', 'فلفل أسود', 'ملح', 'جبن موزريلا', 'خبز تورتيلا', 'توابل الدجاج', 'كوكتيل صوص'],
    ),
    isActive: true,
    rating: 4.8
  },
  
  // الحلويات
  {
    name: 'تشيز كيك المانجا',
    description: 'يقدم بارد',
    price: 46.4,
    calories: 464.21,
    protein: 37.17,
    carbs: 26.76,
    fat: 5.52,
    category: 'desserts',
    image: '/images/mango-cheesecake.jpg',
    prepTime: 'يقدم بارد',
    ingredients: JSON.stringify(
       ['جيلاتين', 'كريمة حيوانية', 'زبدة حيوانية', 'سكر استيفيا', 'جبن فيلادلفيا', 'فانيلا', 'مانجو', 'توت شوكي'],
    ),
    isActive: true,
    rating: 4.8
  },
  {
    name: 'بيكان بالشوكولاتة',
    description: 'يقدم بارد',
    price: 12.5,
    calories: 125.30,
    protein: 2.99,
    carbs: 4.28,
    fat: 11.47,
    category: 'desserts',
    image: '/images/chocolate-pecan.jpg',
    prepTime: 'يقدم بارد',
    ingredients: JSON.stringify(
      ['جوز الهند', 'بودرة اللوز', 'زبدة', 'سكر', 'بروتين', 'زبدة الفول السوداني', 'جبن فيلادلفيا', 'شوكولاتة دارك', 'بيكان', 'فستق حلبي'],
    ),
    isActive: true,
    rating: 4.6
  },
  {
    name: 'لازي كيك الشوكولاته',
    description: 'يقدم بارد',
    price: 19.0,
    calories: 190,
    protein: 2.7,
    carbs: 24,
    fat: 6,
    category: 'desserts',
    image: '/images/chocolate-lazy-cake.jpg',
    prepTime: 'يقدم بارد',
    ingredients: JSON.stringify(
      ['بسكويت دايجستف بالألياف', 'حليب', 'كاكاو بودر', 'سكر', 'زبدة', 'شوكولاته دارك'],
    ),
    isActive: true,
    rating: 4.5
  },
  {
    name: 'كنافة بالقشطة',
    description: 'مدة التسخين 20 ثانية',
    price: 25,
    calories: 250,
    protein: 3.3,
    carbs: 250,
    fat: 12.3,
    category: 'desserts',
    image: '/images/kunafa-cream.jpg',
    prepTime: 'مدة التسخين 20 ثانية',
    ingredients: JSON.stringify(
      ['كنافة', 'سمن', 'سكر', 'حليب', 'كريمة حيوانية', 'قشطة', 'نشا', 'فستق', 'عسل'],
    ),
    isActive: true,
    rating: 4.7
  },
  {
    name: 'بياكوتا بالتوت والفراولة',
    description: 'يقدم بارد',
    price: 20.8,
    calories: 208,
    protein: 14,
    carbs: 6,
    fat: 14,
    category: 'desserts',
    image: '/images/piacotta-berry.jpg',
    prepTime: 'يقدم بارد',
    ingredients: JSON.stringify(
      ['حليب', 'كريمة حيوانية', 'فانيلا', 'سكر استيفيا', 'توت أحمر', 'فراولة', 'سكر', 'ليمون', 'جيلاتين بودر'],
    ),
    isActive: true,
    rating: 4.6
  },
  {
    name: 'كيك الشوكولاته بالجناش',
    description: 'يقدم بارد',
    price: 24.5,
    calories: 245.13,
    protein: 16.68,
    carbs: 3.65,
    fat: 19.33,
    category: 'desserts',
    image: '/images/chocolate-ganache-cake.jpg',
    prepTime: 'يقدم بارد',
    ingredients: JSON.stringify(
      ['بيض', 'سكر', 'فانيلا', 'بروتين شوكولاته', 'كاكاو بودر', 'حليب', 'زبدة حيوانية', 'كريمة حيوانية', 'زبدة', 'جوز كوكة', 'زيت زيتون والكانولا'],
    ),
    isActive: true,
    rating: 4.8
  },
  
  // السلطات
  {
    name: 'سلطة الجرجير',
    description: 'تقدم مع دريسنج البرتقال',
    price: 15.45,
    calories: 151.45,
    protein: 8.74,
    carbs: 0.07,
    fat: 12.52,
    category: 'salads',
    image: '/images/arugula-salad.jpg',
    prepTime: 'تقدم مع دريسنج البرتقال',
    ingredients: JSON.stringify(
      ['جرجير', 'عين الجمل', 'زمان', 'جبن الفيتا', 'فلفل أخضر', 'عصير البرتقال', 'خل العنب (بلسمك)', 'ليمون', 'ملح', 'زيت زيتون', 'عسل'],
    ),
    isActive: true,
    rating: 4.5
  },
  {
    name: 'سلطة البلفو تقدم مع صوص الرانش بالزعتر',
    description: 'تقدم مع صوص الرانش بالزعتر',
    price: 23.9,
    calories: 239,
    protein: 22,
    carbs: 14,
    fat: 8,
    category: 'salads',
    image: '/images/buffalo-ranch-salad.jpg',
    prepTime: 'تقدم مع صوص الرانش بالزعتر',
    ingredients: JSON.stringify(
      ['خس أمريكي', 'جزر', 'ملفوف أحمر', 'بقدونس', 'نعناع', 'نشا', 'زبدة', 'فلفل سيراشا', 'صويا معتدلة', 'شطة كريفا', 'زبادي', 'مايونيز', 'ثوم', 'أوريغانو', 'ليمون', 'ملح', 'خردل'],
    ),
    isActive: true,
    rating: 4.7
  },
  {
    name: 'سلطة الفتوش تقدم مع دريس الرمان',
    description: 'تقدم مع دريس الرمان',
    price: 2.6,
    calories: 26,
    protein: 5.57,
    carbs: 1.54,
    fat: 0.25,
    category: 'salads',
    image: '/images/fattoush-pomegranate.jpg',
    prepTime: 'تقدم مع دريس الرمان',
    ingredients: JSON.stringify(
      ['خيار', 'طماطم', 'خس', 'فلفل رومي أخضر', 'بقدونس', 'نعناع', 'فجل أحمر', 'خبز أبيض', 'زيت زيتون', 'دبس الرمان', 'ليمون', 'سماق', 'ملح', 'نعناع مجفف', 'نوم طازج'],
    ),
    isActive: true,
    rating: 4.3
  },
  {
    name: 'سلطة السيمبيرو تقدم مع الفول السوداني',
    description: 'تقدم مع الفول السوداني',
    price: 10.74,
    calories: 107.4,
    protein: 20.26,
    carbs: 5.79,
    fat: 1.08,
    category: 'salads',
    image: '/images/sombrero-peanut-salad.jpg',
    prepTime: 'تقدم مع الفول السوداني',
    ingredients: JSON.stringify(
      ['خس', 'جرجير', 'طماطم', 'خيار', 'فاصوليا حمراء', 'ذرة', 'خبز أبيض محمص بزيت الزيتون', 'فول سوداني ناعم', 'نوم طازج', 'كزبرة طازجة', 'ليمون', 'عسل', 'ملح', 'فلفل أسود'],
    ),
    isActive: true,
    rating: 4.6
  },
  {
    name: 'سلطة اليونانية تقدم مع دريسنج الليمون والزعتر',
    description: 'تقدم مع دريسنج الليمون والزعتر',
    price: 7.1,
    calories: 71,
    protein: 13,
    carbs: 3,
    fat: 1,
    category: 'salads',
    image: '/images/greek-lemon-thyme-salad.jpg',
    prepTime: 'تقدم مع دريسنج الليمون والزعتر',
    ingredients: JSON.stringify(
      ['خس', 'زيتون أسود شرائح', 'طماطم', 'خيار', 'بصل', 'جبن فيتا', 'أوريغانو', 'زيت زيتون', 'ليمون', 'عسل', 'زعتر طازج', 'ماء', 'ملح', 'نعناع مجفف'],
    ),
    isActive: true,
    rating: 4.4
  },
  {
    name: 'سلطة السيزر تقدم مع صوص البارميزان',
    description: 'تقدم مع صوص البارميزان',
    price: 13.2,
    calories: 132,
    protein: 9,
    carbs: 14,
    fat: 5,
    category: 'salads',
    image: '/images/caesar-parmesan-salad.jpg',
    prepTime: 'تقدم مع صوص البارميزان',
    ingredients: JSON.stringify(
      ['خس أمريكي', 'خس بلدي', 'دجاج مطبوخ', 'جبن بارميزان', 'خبز التوست الأبيض', 'بارميزان', 'مايونيز لايت', 'زبادي', 'حليب', 'ثوم', 'ملح', 'خردل', 'فلفل أسود', 'زعتر طازج', 'أوريغانو', 'بابريكا مدخنة'],
    ),
    isActive: true,
    rating: 4.8
  },
  
  // الغداء
  {
    name: 'صيادية السمك',
    description: 'تقدم مع الأرز الطبيعي والدقوس',
    price: 87.8,
    calories: 878,
    protein: 107.20,
    carbs: 55,
    fat: 27.15,
    category: 'lunch',
    image: '/images/fish-sayadia.jpg',
    prepTime: 'تقدم مع الأرز الطبيعي والدقوس',
    ingredients: JSON.stringify(
      ['أرز', 'فرخة أعواد', 'هيل', 'فلفل حار', 'معجون طماطم', 'ملح', 'بصل', 'زيت مخلوط', 'ثوم', 'كزبرة', 'كمون', 'فلفل أسود', 'تتبيلة البرسيت', 'تتبيلة الأسماك', 'سمك', 'صوص حار', 'صوص طحينة', 'دقيق أبيض'],
    ),
    isActive: true,
    rating: 4.9
  },
  {
    name: 'نودلز كانتون بالدجاج والخضار',
    description: 'نودلز كانتون بالدجاج والخضار',
    price: 39.18,
    calories: 397.18,
    protein: 11.28,
    carbs: 55,
    fat: 13.84,
    category: 'lunch',
    image: '/images/canton-noodles-chicken.jpg',
    prepTime: 'نودلز كانتون بالدجاج والخضار',
    ingredients: JSON.stringify(
      ['زيت زيتون والكانولا', 'بصل', 'ثوم', 'دجاج', 'صوص الصويا', 'صوص المحار', 'بهار مشكل', 'فلفل أسود', 'ملح', 'كايجون', 'طماطم', 'فلفل حار أخضر', 'فلفل رومي أخضر', 'جزر', 'ملفوف أبيض', 'ملفوف أحمر', 'بصل الأخضر', 'كزبرة طازجة', 'مسمسم أبيض', 'مكرونة اسباغيتي'],
    ),
    isActive: true,
    rating: 4.7
  },
  
  // وجبات الغداء الجديدة
  {
    name: 'كباب اللحم بقدم مع الأرز بالطماطم وصوص الطحينة والدقوس',
    description: 'السعرات الحرارية 509 سعرة',
    price: 50.9,
    calories: 509,
    protein: 25.97,
    carbs: 45,
    fat: 35.5,
    category: 'lunch',
    image: '/images/kebab-rice-tahini.jpg',
    prepTime: 'مدة التسخين دقيقة و 30 ثانية',
    ingredients: JSON.stringify(
      ['أرز', 'فرخة أعواد', 'هيل', 'فلفل حار', 'معجون طماطم', 'ملح', 'بصل', 'زيت زيتون والكانولا', 'ثوم', 'كزبرة', 'كمون', 'لحم توب سايد', 'آية', 'فلفل حار أخضر', 'بصل', 'فلفل رومي أخضر', 'كزبرة طازجة', 'ثوم', 'ملح', 'دجاج مطبوخ', 'كزبرة طازجة', 'فلفل أسود', 'بودرة الثوم']
    ),
    isActive: true,
    rating: 4.8
  },
  {
    name: 'لحم بالفول السوداني على الطريقة التقليدية',
    description: 'السعرات الحرارية 265 سعرة',
    price: 26.5,
    calories: 265,
    protein: 50.83,
    carbs: 55.2,
    fat: 29.11,
    category: 'lunch',
    image: '/images/meat-peanut-traditional.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['زيت كانولا', 'زيت زيتون', 'زبدة', 'بصل', 'جزر', 'فلفل رومي أخضر', 'ثوم', 'صوص المحار', 'صوص الصويا', 'صوص ورشستر', 'فول سوداني', 'ماء', 'نشا الذرة', 'لحم تندرلوين', 'ديمي جليز']
    ),
    isActive: true,
    rating: 4.9
  },
  {
    name: 'دجاج بالزبدة على الطريقة الهندية بقدم مع الأرز الأبيض',
    description: 'السعرات الحرارية 496 سعرة',
    price: 49.6,
    calories: 496,
    protein: 34,
    carbs: 52,
    fat: 15.2,
    category: 'lunch',
    image: '/images/butter-chicken-rice.jpg',
    prepTime: 'مدة التسخين دقيقة و 30 ثانية',
    ingredients: JSON.stringify(
      ['دجاج مسلوق', 'صوص مارينارا', 'خبز منقوع', 'حمص مسلوق', 'رمان', 'صنوبر', 'بقدونس', 'بصل', 'سماق', 'بهار مشكل', 'دبس الرمان', 'بصل', 'أرز أحمر', 'طحينة', 'زبادي', 'خل', 'فلفل أسود']
    ),
    isActive: true,
    rating: 4.7
  },
  {
    name: 'فتة الدجاج السورية بالرمان الطبيعي',
    description: 'السعرات الحرارية 496 سعرة',
    price: 49.6,
    calories: 496,
    protein: 34,
    carbs: 52,
    fat: 15.2,
    category: 'lunch',
    image: '/images/syrian-chicken-fatteh.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['دجاج مسلوق', 'صوص مارينارا', 'خبز منقوع', 'حمص مسلوق', 'رمان', 'صنوبر', 'بقدونس', 'بصل', 'سماق', 'بهار مشكل', 'دبس الرمان', 'بصل', 'أرز أحمر', 'طحينة', 'زبادي', 'خل', 'فلفل أسود']
    ),
    isActive: true,
    rating: 4.6
  },
  
  // وجبات العشاء الجديدة
  {
    name: 'برجر اللحم يقدم مع بطاطس مسلوقة وصوص الكوكتيل',
    description: 'السعرات الحرارية 843 سعرة',
    price: 84.3,
    calories: 843,
    protein: 48,
    carbs: 48,
    fat: 48,
    category: 'dinner',
    image: '/images/meat-burger-potato.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['لحم توب سايد', 'آية', 'بصل أحمر', 'ملح', 'فلفل أسود', 'بهار مشكل', 'بصل أبيض', 'كزبرة', 'خس أمريكي', 'طماطم', 'كوكتيل صوص', 'خبز برجر البطاطس', 'بودرة الثوم', 'بطاطس وجزر', 'كوكتيل صوص']
    ),
    isActive: true,
    rating: 4.8
  },
  {
    name: 'لزانيا الخضار مع سمك السلمون بالمشوي بالليمون',
    description: 'السعرات الحرارية 1384.2 سعرة',
    price: 138.42,
    calories: 1384.2,
    protein: 45.92,
    carbs: 47.1,
    fat: 31.03,
    category: 'dinner',
    image: '/images/vegetable-lasagna-salmon.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['لزانيا', 'صوص البشاميل', 'كوسة', 'جزر', 'فلفل رومي ملون', 'صوص المارينارا', 'سلمون', 'توابل الأسماك', 'بصل', 'سلمون', 'ليمون', 'كريمة']
    ),
    isActive: true,
    rating: 4.9
  },
  {
    name: 'برجر الدجاج يقدم مع بطاطس مشوية وصوص الكوكتيل',
    description: 'السعرات الحرارية 729 سعرة',
    price: 72.9,
    calories: 729,
    protein: 92,
    carbs: 79,
    fat: 25,
    category: 'dinner',
    image: '/images/chicken-burger-potato.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['دجاج', 'ملفوف أحمر', 'ملفوف أبيض', 'خس أمريكي', 'دقيق أبيض', 'كوكتيل صوص', 'خبز برجر البطاطس', 'كوكتيل صوص', 'بطاطس وجزر']
    ),
    isActive: true,
    rating: 4.7
  },
  {
    name: 'شيش طاووق الدجاج يقدم مع الأرز بالطماطم',
    description: 'السعرات الحرارية 574 سعرة',
    price: 57.4,
    calories: 574,
    protein: 45.5,
    carbs: 67.23,
    fat: 17.95,
    category: 'dinner',
    image: '/images/chicken-shish-tawook.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['دجاج وزيتون', 'فلفل حار أخضر', 'شطة تركي', 'فلفل رومي أحمر', 'برتقال', 'ليمون', 'خردل', 'بصل', 'ثوم', 'فلفل أبيض', 'بهار مشكل', 'كزبرة', 'كمون', 'ملح', 'كركم', 'دجاج']
    ),
    isActive: true,
    rating: 4.8
  },
  {
    name: 'كبسة الدجاج السعودية المحلية تقدم مع الأرز وسلطة الريتا',
    description: 'السعرات الحرارية 554 سعرة',
    price: 55.4,
    calories: 554,
    protein: 55.2,
    carbs: 29.11,
    fat: 50.83,
    category: 'dinner',
    image: '/images/saudi-chicken-kabsa.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['أرز', 'زيت', 'بصل', 'قرفة', 'هيل', 'معجون طماطم', 'طماطم', 'ثوم', 'زنجبيل', 'كمون', 'كزبرة', 'بهار مشكل', 'ملح', 'جزر', 'زبيب أصفر', 'زبيب أسود', 'بقدونس', 'دجاج', 'زبادي']
    ),
    isActive: true,
    rating: 4.9
  },
  {
    name: 'كعك سمك التونة مع الخضار المشوي',
    description: 'السعرات الحرارية 357 سعرة',
    price: 35.7,
    calories: 357,
    protein: 78,
    carbs: 29,
    fat: 14,
    category: 'dinner',
    image: '/images/tuna-cake-vegetables.jpg',
    prepTime: 'مدة التسخين دقيقة و 3 ثانية',
    ingredients: JSON.stringify(
      ['خبز أسمر', 'تونة معلبة', 'خردل', 'جبن فيتا أبيض', 'بيض', 'كزبرة طازجة', 'ملح', 'أوريغانو', 'زيت مخلوط', 'بصل', 'كوسة', 'جزر', 'فلفل رومي أحمر']
    ),
    isActive: true,
    rating: 4.6
  }
];

export default mealsData;