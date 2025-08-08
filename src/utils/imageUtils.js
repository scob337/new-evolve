// دالة مساعدة لتحويل مسار الصورة إلى URL كامل
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-meal.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://evolvetheapp.com${imagePath}`;
};