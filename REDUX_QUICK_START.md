# ⚡ Redux - Быстрый старт

## ✅ Что сделано

1. ✅ Redux Toolkit установлен и настроен
2. ✅ Все API подключены через Redux слайсы
3. ✅ Redux Provider подключен к приложению
4. ✅ Главная страница обновлена для использования Redux

## 📦 Установка

Выполните:

```bash
npm install
```

## 🎯 Использование

### В компоненте:

```javascript
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productsSlice";

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 10 }));
  }, [dispatch]);

  return <div>{/* Ваш код */}</div>;
}
```

## 📚 Все доступные слайсы

- `productsSlice` - товары
- `categoriesSlice` - категории  
- `brandsSlice` - бренды
- `cartSlice` - корзина
- `favoritesSlice` - избранное
- `ordersSlice` - заказы
- `userSlice` - пользователь

## 📖 Подробная документация

См. `REDUX_SETUP.md` для полной документации.

---

**Готово!** Redux подключен и готов к использованию! 🚀

