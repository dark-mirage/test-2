# 🚀 Redux Toolkit - Установка и использование

## ✅ Что сделано

1. ✅ Установлены зависимости в `package.json`:
   - `@reduxjs/toolkit`
   - `react-redux`

2. ✅ Создана структура Redux:
   - `lib/store/store.js` - главный store
   - `lib/store/hooks.js` - типизированные хуки
   - `lib/store/slices/` - слайсы для всех сущностей:
     - `productsSlice.js` - товары
     - `categoriesSlice.js` - категории
     - `brandsSlice.js` - бренды
     - `cartSlice.js` - корзина
     - `favoritesSlice.js` - избранное
     - `ordersSlice.js` - заказы
     - `userSlice.js` - пользователь

3. ✅ Подключен Redux Provider в `app/layout.tsx`

4. ✅ Обновлена главная страница (`app/page.jsx`) для использования Redux

---

## 📦 Установка пакетов

Выполните в терминале:

```bash
npm install
```

Или если нужно установить вручную:

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 🎯 Как использовать Redux в компонентах

### Пример 1: Получить данные и загрузить их

```javascript
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productsSlice";

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 10 }));
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      {items.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Пример 2: Добавить товар в корзину

```javascript
import { useAppDispatch } from "@/lib/store/hooks";
import { addItemToCart } from "@/lib/store/slices/cartSlice";

function AddToCartButton({ productId, size }) {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addItemToCart({ 
      product_id: productId, 
      size, 
      quantity: 1 
    }));
  };

  return <button onClick={handleAdd}>Добавить в корзину</button>;
}
```

### Пример 3: Переключить избранное

```javascript
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleFavoriteProduct } from "@/lib/store/slices/favoritesSlice";

function FavoriteButton({ productId }) {
  const dispatch = useAppDispatch();
  const { favoriteProductIds } = useAppSelector((state) => state.favorites);
  const isFavorite = favoriteProductIds.has(productId);

  const handleToggle = () => {
    dispatch(toggleFavoriteProduct(productId));
  };

  return (
    <button onClick={handleToggle}>
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## 📚 Доступные действия (Actions)

### Products (Товары)

```javascript
import { 
  fetchProducts, 
  fetchLatestProducts, 
  fetchProductById,
  setFilters,
  clearFilters,
  clearCurrentProduct
} from "@/lib/store/slices/productsSlice";

// Использование:
dispatch(fetchProducts({ limit: 10, skip: 0 }));
dispatch(fetchLatestProducts(12));
dispatch(fetchProductById(productId));
dispatch(setFilters({ category_id: 1 }));
```

### Categories (Категории)

```javascript
import { fetchCategories } from "@/lib/store/slices/categoriesSlice";

dispatch(fetchCategories());
```

### Brands (Бренды)

```javascript
import { 
  fetchBrands, 
  searchBrands, 
  fetchBrandById 
} from "@/lib/store/slices/brandsSlice";

dispatch(fetchBrands());
dispatch(searchBrands({ query: "Nike", limit: 20 }));
dispatch(fetchBrandById(brandId));
```

### Cart (Корзина)

```javascript
import { 
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "@/lib/store/slices/cartSlice";

dispatch(fetchCart());
dispatch(addItemToCart({ product_id: 1, size: "M", quantity: 1 }));
dispatch(updateCartItem({ item_id: 1, quantity: 2 }));
dispatch(removeCartItem(itemId));
dispatch(clearCart());
```

### Favorites (Избранное)

```javascript
import { 
  fetchFavorites,
  fetchFavoriteBrands,
  fetchFavoriteProducts,
  toggleFavoriteProduct,
  toggleFavoriteBrand
} from "@/lib/store/slices/favoritesSlice";

dispatch(fetchFavorites());
dispatch(toggleFavoriteProduct(productId));
dispatch(toggleFavoriteBrand(brandId));
```

### Orders (Заказы)

```javascript
import { 
  fetchOrders,
  fetchOrderById,
  createOrder
} from "@/lib/store/slices/ordersSlice";

dispatch(fetchOrders());
dispatch(fetchOrderById(orderId));
dispatch(createOrder(orderData));
```

### User (Пользователь)

```javascript
import { 
  fetchCurrentUser,
  updateUser
} from "@/lib/store/slices/userSlice";

dispatch(fetchCurrentUser());
dispatch(updateUser(userData));
```

---

## 🔍 Селекторы (Selectors)

### Получить данные из store

```javascript
const { useAppSelector } = require("@/lib/store/hooks");

// Товары
const { items, latest, currentProduct, loading, error } = useAppSelector(
  (state) => state.products
);

// Категории
const { items: categories, loading } = useAppSelector(
  (state) => state.categories
);

// Бренды
const { items: brands, currentBrand, loading } = useAppSelector(
  (state) => state.brands
);

// Корзина
const { items: cartItems, total, loading } = useAppSelector(
  (state) => state.cart
);

// Избранное
const { products, brands, favoriteProductIds, loading } = useAppSelector(
  (state) => state.favorites
);

// Заказы
const { items: orders, currentOrder, loading } = useAppSelector(
  (state) => state.orders
);

// Пользователь
const { currentUser, loading } = useAppSelector(
  (state) => state.user
);
```

---

## ⚠️ Важные замечания

1. **Все компоненты должны быть "use client"** - Redux работает только на клиенте

2. **Авторизация обрабатывается автоматически** - если пользователь не авторизован, слайсы возвращают пустые данные вместо ошибок

3. **Загрузка данных происходит автоматически** - после dispatch действия данные загружаются и обновляются в store

4. **Ошибки авторизации (401/403) не показываются** - они обрабатываются как "пользователь не авторизован"

---

## 🔄 Миграция с хуков на Redux

### Было (с хуками):

```javascript
import { useApiCart } from "@/lib/hooks/useApiCart";

function MyComponent() {
  const { items, addItem, loading } = useApiCart();
  // ...
}
```

### Стало (с Redux):

```javascript
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCart, addItemToCart } from "@/lib/store/slices/cartSlice";

function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(addItemToCart({ product_id: 1, size: "M", quantity: 1 }));
  };
  // ...
}
```

---

## 📝 Следующие шаги

1. ✅ Установить пакеты: `npm install`
2. ✅ Обновить остальные компоненты для использования Redux
3. ✅ Удалить старые хуки после миграции (опционально)

---

## 🐛 Отладка

### Redux DevTools

Установите расширение Redux DevTools для браузера:
- Chrome: https://chrome.google.com/webstore/detail/redux-devtools
- Firefox: https://addons.mozilla.org/firefox/addon/reduxdevtools/

После установки вы сможете видеть все действия и состояние store в реальном времени.

---

Готово! Redux подключен и готов к использованию! 🎉

