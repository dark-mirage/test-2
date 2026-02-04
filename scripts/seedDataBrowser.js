/**
 * Скрипт для заполнения базы тестовыми данными (для браузера)
 * 
 * Использование:
 * 1. Откройте приложение в браузере
 * 2. Откройте консоль (F12)
 * 3. Скопируйте и выполните этот скрипт
 * 
 * Или импортируйте в компонент для создания админ-панели
 */

// Импортируем API клиент
// Используйте в консоли браузера после импорта модуля

export async function seedData() {
  console.log('🌱 Начинаю создание тестовых данных...\n');

  const results = {
    categories: [],
    types: [],
    brands: []
  };

  try {
    // 1. Создать категории
    console.log('📁 Создание категорий...');
    const categories = [
      { name: 'Одежда' },
      { name: 'Обувь' },
      { name: 'Аксессуары' }
    ];

    for (const cat of categories) {
      try {
        const data = await categoriesApi.create(cat);
        results.categories.push(data);
        console.log(`  ✅ ${cat.name} (ID: ${data.id})`);
      } catch (err) {
        console.log(`  ⚠️  ${cat.name}: ${err.message}`);
      }
    }

    // Получить существующие категории, если не создались
    if (results.categories.length === 0) {
      const existing = await categoriesApi.getAll();
      results.categories = existing.slice(0, 3);
      console.log(`  📋 Используем существующие: ${results.categories.length} категорий`);
    }

    // 2. Создать типы
    console.log('\n🏷️  Создание типов...');
    const categoryId = results.categories[0]?.id;
    if (categoryId) {
      const types = [
        { name: 'Футболки', category_id: categoryId },
        { name: 'Худи', category_id: categoryId },
        { name: 'Лонгсливы', category_id: categoryId },
      ];

      for (const type of types) {
        try {
          const data = await typesApi.create(type);
          results.types.push(data);
          console.log(`  ✅ ${type.name} (ID: ${data.id})`);
        } catch (err) {
          console.log(`  ⚠️  ${type.name}: ${err.message}`);
        }
      }
    }

    // Получить существующие типы
    if (results.types.length === 0) {
      const existing = await typesApi.getAll();
      results.types = existing.slice(0, 3);
      console.log(`  📋 Используем существующие: ${results.types.length} типов`);
    }

    // 3. Создать бренды
    console.log('\n🏭 Создание брендов...');
    const brands = [
      { name: 'Supreme' },
      { name: 'Nike' },
      { name: 'Adidas' },
      { name: 'Prada' },
      { name: 'Comme Des Garcons' }
    ];

    for (const brand of brands) {
      try {
        // Бренды создаются через multipart/form-data
        const data = await brandsApi.create({ name: brand.name });
        results.brands.push(data);
        console.log(`  ✅ ${brand.name} (ID: ${data.id})`);
      } catch (err) {
        console.log(`  ⚠️  ${brand.name}: ${err.message}`);
      }
    }

    // Получить существующие бренды
    if (results.brands.length === 0) {
      const existing = await brandsApi.getAll();
      results.brands = existing;
      console.log(`  📋 Используем существующие: ${results.brands.length} брендов`);
    }

    console.log('\n📊 Итого:');
    console.log(`   ✅ Категорий: ${results.categories.length}`);
    console.log(`   ✅ Типов: ${results.types.length}`);
    console.log(`   ✅ Брендов: ${results.brands.length}`);

    console.log('\n💡 Для создания товаров используйте Swagger UI:');
    console.log('   https://loyaltymarket.ru:7890/docs');
    console.log('   POST /api/v1/products/ (требует загрузки фото)');

    return results;
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    throw error;
  }
}

// Добавляем в window для использования в консоли
if (typeof window !== 'undefined') {
  window.seedData = seedData;
  console.log('💡 Для создания тестовых данных выполните: seedData()');
}

