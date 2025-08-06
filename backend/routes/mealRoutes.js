// في دالة البحث والفلترة
if (search) {
  where.OR = [
    { nameAr: { contains: search } },
    { nameEn: { contains: search } },
    { descriptionAr: { contains: search } },
    { descriptionEn: { contains: search } }
  ];
}

// في الترتيب
let orderBy = {};
if (sortBy === 'name') {
  orderBy = { nameAr: 'asc' }; // أو حسب اللغة المطلوبة
} else if (sortBy === 'price') {
  orderBy = { price: sortOrder || 'asc' };
}