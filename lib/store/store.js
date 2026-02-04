import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './slices/productsSlice';
import categoriesSlice from './slices/categoriesSlice';
import brandsSlice from './slices/brandsSlice';
import cartSlice from './slices/cartSlice';
import favoritesSlice from './slices/favoritesSlice';
import ordersSlice from './slices/ordersSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    categories: categoriesSlice,
    brands: brandsSlice,
    cart: cartSlice,
    favorites: favoritesSlice,
    orders: ordersSlice,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем эти типы действий, так как они могут содержать функции
        ignoredActions: ['cart/addItem/pending', 'cart/updateItem/pending', 'cart/removeItem/pending'],
      },
    }),
});

// Типы для TypeScript (если проект будет переведен на TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

