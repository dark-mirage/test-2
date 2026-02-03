"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cartApi } from "@/lib/api";

/**
 * Хук для работы с корзиной через API
 */
export function useApiCart() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);

  // Загрузить корзину с сервера
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.get();
      setCart(data);
      return data;
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError(err.message);
      // Если ошибка авторизации, возвращаем пустую корзину
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setCart(null);
      }
      return null;
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  // Загрузить корзину при монтировании
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Добавить товар в корзину
  const addItem = useCallback(async (productId, quantity = 1, sizeId = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.addItem({
        product_id: productId,
        quantity,
        ...(sizeId && { size_id: sizeId }),
      });
      setCart(data);
      return data;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновить количество товара
  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.updateItem(itemId, { quantity });
      setCart(data);
      return data;
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удалить товар из корзины
  const removeItem = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.removeItem(itemId);
      setCart(data);
      return data;
    } catch (err) {
      console.error('Failed to remove cart item:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Очистить корзину
  const clear = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.clear();
      setCart(data);
      return data;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Преобразовать данные корзины API в формат для компонентов
  const items = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      priceRub: item.product.price,
      quantity: item.quantity,
      image: item.product.photos?.[0] 
        ? `/api/v1/products/get_photo/${item.product.photos[0].filename}`
        : '/products/shoes-1.png',
      size: item.size?.size || null,
      article: item.product.id?.toString() || null,
      shippingText: `Доставка из Китая до РФ 0₽`,
      deliveryText: "Послезавтра, из наличия",
      isFavorite: false,
      lineTotal: item.line_total,
    }));
  }, [cart]);

  const totalQuantity = useMemo(
    () => cart?.total_items || 0,
    [cart]
  );

  const subtotalRub = useMemo(
    () => cart?.total_amount || 0,
    [cart]
  );

  return {
    ready,
    loading,
    error,
    cart,
    items,
    totalQuantity,
    subtotalRub,
    addItem,
    updateItem,
    removeItem,
    clear,
    refresh: loadCart,
  };
}

