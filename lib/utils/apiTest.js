/**
 * Утилита для тестирования API
 * Используйте в консоли браузера: window.testAPI()
 */

import { 
  productsApi, 
  favoritesApi, 
  cartApi, 
  ordersApi,
  usersApi,
  brandsApi,
  categoriesApi 
} from '@/lib/api';

export async function testAPI() {
  console.log('🧪 Начинаю тестирование API...\n');
  
  const results = {
    success: [],
    errors: []
  };

  // Тест 1: Получить текущего пользователя
  try {
    console.log('1️⃣ Тест: Получить текущего пользователя');
    const user = await usersApi.getCurrent();
    console.log('✅ Успешно:', user);
    results.success.push('usersApi.getCurrent()');
  } catch (err) {
    const errorMsg = err.message || '';
    if (errorMsg.includes('Authentication') || errorMsg.includes('401') || errorMsg.includes('403')) {
      console.log('⚠️  Требуется авторизация (это нормально)');
    } else {
      console.error('❌ Ошибка:', errorMsg);
    }
    results.errors.push({ test: 'usersApi.getCurrent()', error: errorMsg });
  }

  // Тест 2: Получить товары
  try {
    console.log('\n2️⃣ Тест: Получить список товаров');
    const products = await productsApi.getAll({ limit: 5 });
    console.log('✅ Успешно: получено товаров:', products.length);
    console.log('Пример товара:', products[0]);
    results.success.push('productsApi.getAll()');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    results.errors.push({ test: 'productsApi.getAll()', error: err.message });
  }

  // Тест 3: Получить последние товары
  try {
    console.log('\n3️⃣ Тест: Получить последние товары');
    const latest = await productsApi.getLatest(3);
    console.log('✅ Успешно: получено товаров:', latest.length);
    results.success.push('productsApi.getLatest()');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    results.errors.push({ test: 'productsApi.getLatest()', error: err.message });
  }

  // Тест 4: Получить категории
  try {
    console.log('\n4️⃣ Тест: Получить категории');
    const categories = await categoriesApi.getAll();
    console.log('✅ Успешно: получено категорий:', categories.length);
    results.success.push('categoriesApi.getAll()');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    results.errors.push({ test: 'categoriesApi.getAll()', error: err.message });
  }

  // Тест 5: Получить бренды
  try {
    console.log('\n5️⃣ Тест: Получить бренды');
    const brands = await brandsApi.getAll();
    console.log('✅ Успешно: получено брендов:', brands.length);
    results.success.push('brandsApi.getAll()');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    results.errors.push({ test: 'brandsApi.getAll()', error: err.message });
  }

  // Тест 6: Получить корзину
  try {
    console.log('\n6️⃣ Тест: Получить корзину');
    const cart = await cartApi.get();
    console.log('✅ Успешно:', cart);
    results.success.push('cartApi.get()');
  } catch (err) {
    const errorMsg = err.message || '';
    if (errorMsg.includes('Authentication') || errorMsg.includes('401') || errorMsg.includes('403')) {
      console.log('⚠️  Требуется авторизация (это нормально)');
    } else {
      console.error('❌ Ошибка:', errorMsg);
    }
    results.errors.push({ test: 'cartApi.get()', error: errorMsg });
  }

  // Тест 7: Получить избранное
  try {
    console.log('\n7️⃣ Тест: Получить избранное');
    const favorites = await favoritesApi.getAll();
    console.log('✅ Успешно: получено избранного:', favorites.length);
    results.success.push('favoritesApi.getAll()');
  } catch (err) {
    const errorMsg = err.message || '';
    if (errorMsg.includes('Authentication') || errorMsg.includes('401') || errorMsg.includes('403')) {
      console.log('⚠️  Требуется авторизация (это нормально)');
    } else {
      console.error('❌ Ошибка:', errorMsg);
    }
    results.errors.push({ test: 'favoritesApi.getAll()', error: errorMsg });
  }

  // Итоги
  console.log('\n📊 ИТОГИ ТЕСТИРОВАНИЯ:');
  console.log(`✅ Успешно: ${results.success.length} тестов`);
  console.log(`❌ Ошибок: ${results.errors.length} тестов`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Ошибки (это нормально, если вы не авторизованы):');
    results.errors.forEach(({ test, error }) => {
      if (error.includes('Authentication') || error.includes('401') || error.includes('403')) {
        console.log(`  - ${test}: Требуется авторизация (это нормально)`);
      } else {
        console.log(`  - ${test}: ${error}`);
      }
    });
  }

  console.log('\n💡 Для добавления товаров:');
  console.log('   1. Откройте: https://loyaltymarket.ru:7890/docs');
  console.log('   2. Используйте POST /api/v1/products/');
  console.log('   3. Или выполните: seedData() в консоли');

  return results;
}

// Добавляем в window для использования в консоли
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
  console.log('💡 Для тестирования API выполните: testAPI()');
}

