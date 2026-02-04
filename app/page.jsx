"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchLatestProducts, fetchProducts } from "@/lib/store/slices/productsSlice";
import { fetchFavorites, toggleFavoriteProduct } from "@/lib/store/slices/favoritesSlice";
import { productsApi } from "@/lib/api";
import SearchBar from "@/components/blocks/search/SearchBar";
import Footer from "@/components/layout/Footer";
import CategoryTabs from "@/components/blocks/home/CategoryTabs";
import FriendsSection from "@/components/blocks/home/FriendsSection";
import HomeDeliveryStatusCard from "@/components/blocks/home/HomeDeliveryStatusCard";
import ProductSection from "@/components/blocks/product/ProductSection";
import "@/lib/utils/apiTest"; // Добавляем тестовую утилиту

import styles from "./page.module.css";

// Преобразовать продукт из API в формат для компонента
function transformProduct(product, favoriteIds = new Set()) {
  const firstPhoto = product.photos?.[0];
  const imageUrl = firstPhoto 
    ? productsApi.getPhoto(firstPhoto.filename)
    : "/products/shoes-1.png";
  
  return {
    id: product.id,
    name: product.name,
    brand: product.brand?.name || "Unknown",
    price: new Intl.NumberFormat("ru-RU").format(product.price) + " ₽",
    image: imageUrl,
    isFavorite: favoriteIds.has(product.id),
    deliveryDate: product.delivery === "China" ? "30 марта" : "Послезавтра",
  };
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { latest, items, loading: productsLoading } = useAppSelector((state) => state.products);
  const { favoriteProductIds, loading: favoritesLoading } = useAppSelector((state) => state.favorites);

  // Загрузить избранное
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  // Загрузить товары
  useEffect(() => {
    dispatch(fetchLatestProducts(5));
    dispatch(fetchProducts({ limit: 8, skip: 0 }));
  }, [dispatch]);

  // Преобразуем массив в Set для удобства проверки
  const favoriteIds = new Set(favoriteProductIds);
  const loading = productsLoading || favoritesLoading;

  // Преобразовать товары для отображения
  const recentProducts = latest.slice(0, 5).map(p => transformProduct(p, favoriteIds));
  const recommendedProducts = items.slice(0, 8).map(p => transformProduct(p, favoriteIds));

  const toggleFavorite = async (id) => {
    dispatch(toggleFavoriteProduct(id));
  };

  if (loading) {
    return (
      <div className="lm-app-bg" style={{ minHeight: "var(--tg-viewport-height)" }}>
        <div className={styles.container}>
          <SearchBar navigateOnFocusTo="/search" readOnly />
          <div style={{ padding: "2rem", textAlign: "center" }}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="lm-app-bg"
      style={{ minHeight: "var(--tg-viewport-height)" }}
    >
      <div className={styles.container}>
        <SearchBar navigateOnFocusTo="/search" readOnly />
        <CategoryTabs />
        <FriendsSection />

        <div className={styles.sectionSpacing}>
          <HomeDeliveryStatusCard />
        </div>

        {recentProducts.length > 0 && (
          <ProductSection
            title="Только что купили"
            products={recentProducts}
            onToggleFavorite={toggleFavorite}
            layout="horizontal"
          />
        )}

        {recommendedProducts.length > 0 && (
          <ProductSection
            title="Для вас"
            products={recommendedProducts}
            onToggleFavorite={toggleFavorite}
            layout="grid"
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
