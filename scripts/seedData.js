/**
 * Скрипт для заполнения базы тестовыми данными
 * 
 * Использование:
 * 1. Убедитесь, что бекенд доступен: https://loyaltymarket.ru:7890
 * 2. Запустите: node scripts/seedData.js
 * 
 * Или используйте через браузер (см. seedDataBrowser.js)
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://loyaltymarket.ru:7890';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    throw new Error(error.detail?.[0]?.msg || error.message || `HTTP ${response.status}`);
  }
  
  return await response.json();
}

async function createTestData() {
  console.log('🌱 Начинаю создание тестовых данных...\n');

  const results = {
    categories: [],
    types: [],
    brands: [],
    products: []
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
        const data = await fetchAPI('/api/v1/categories', {
          method: 'POST',
          body: JSON.stringify(cat)
        });
        results.categories.push(data);
        console.log(`  ✅ ${cat.name} (ID: ${data.id})`);
      } catch (err) {
        // Если категория уже существует, попробуем получить её
        console.log(`  ⚠️  ${cat.name}: ${err.message}`);
      }
    }

    // Получить существующие категории, если не создались
    if (results.categories.length === 0) {
      const existing = await fetchAPI('/api/v1/categories');
      results.categories = existing.slice(0, 3);
      console.log(`  📋 Используем существующие категории: ${results.categories.length}`);
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
          const data = await fetchAPI('/api/v1/types', {
            method: 'POST',
            body: JSON.stringify(type)
          });
          results.types.push(data);
          console.log(`  ✅ ${type.name} (ID: ${data.id})`);
        } catch (err) {
          console.log(`  ⚠️  ${type.name}: ${err.message}`);
        }
      }
    }

    // Получить существующие типы
    if (results.types.length === 0) {
      const existing = await fetchAPI('/api/v1/types');
      results.types = existing.slice(0, 3);
      console.log(`  📋 Используем существующие типы: ${results.types.length}`);
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
        const data = await fetchAPI('/api/v1/brands', {
          method: 'POST',
          body: JSON.stringify(brand)
        });
        results.brands.push(data);
        console.log(`  ✅ ${brand.name} (ID: ${data.id})`);
      } catch (err) {
        console.log(`  ⚠️  ${brand.name}: ${err.message}`);
      }
    }

    // Получить существующие бренды
    if (results.brands.length === 0) {
      const existing = await fetchAPI('/api/v1/brands');
      results.brands = existing;
      console.log(`  📋 Используем существующие бренды: ${results.brands.length}`);
    }

    // 4. Товары нужно создавать через multipart/form-data
    console.log('\n📦 Товары:');
    console.log('  ⚠️  Товары нужно создавать через Swagger UI или форму с загрузкой фото');
    console.log('  📝 Пример данных для создания:');
    
    const exampleProducts = [
      {
        name: 'Кофта Supreme',
        price: 127899,
        category_id: results.categories[0]?.id,
        type_id: results.types[0]?.id,
        brand_id: results.brands[0]?.id,
        delivery: 'China'
      },
      {
        name: 'Кроссовки Nike Dunk Low',
        price: 12990,
        category_id: results.categories[1]?.id || results.categories[0]?.id,
        type_id: results.types[2]?.id || results.types[0]?.id,
        brand_id: results.brands[1]?.id,
        delivery: 'Orenburg'
      },
      {
        name: 'Футболка Adidas',
        price: 2890,
        category_id: results.categories[0]?.id,
        type_id: results.types[0]?.id,
        brand_id: results.brands[2]?.id,
        delivery: 'China'
      }
    ];

    exampleProducts.forEach((p, i) => {
      console.log(`\n  Товар ${i + 1}:`);
      console.log(`    Название: ${p.name}`);
      console.log(`    Цена: ${p.price} ₽`);
      console.log(`    Категория ID: ${p.category_id}`);
      console.log(`    Тип ID: ${p.type_id}`);
      console.log(`    Бренд ID: ${p.brand_id}`);
      console.log(`    Доставка: ${p.delivery}`);
    });

    console.log('\n📊 Итого создано:');
    console.log(`   ✅ Категорий: ${results.categories.length}`);
    console.log(`   ✅ Типов: ${results.types.length}`);
    console.log(`   ✅ Брендов: ${results.brands.length}`);
    console.log(`   ⚠️  Товаров: 0 (создайте вручную через Swagger)`);

    console.log('\n💡 Для создания товаров:');
    console.log('   1. Откройте: https://loyaltymarket.ru:7890/docs');
    console.log('   2. Найдите POST /api/v1/products/');
    console.log('   3. Используйте данные выше и загрузите фото');

  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    process.exit(1);
  }
}

// Запуск
if (typeof window === 'undefined') {
  // Node.js окружение
  const fetch = require('node-fetch');
  global.fetch = fetch;
  createTestData();
} else {
  // Браузерное окружение
  window.seedData = createTestData;
  console.log('💡 Для запуска выполните: seedData()');
}

