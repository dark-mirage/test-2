"use client";
import { useState, useEffect } from "react";

import SearchBar from "@/components/blocks/search/SearchBar";
import Footer from "@/components/layout/Footer";
import CategoryTabs from "@/components/blocks/home/CategoryTabs";
import FriendsSection from "@/components/blocks/home/FriendsSection";
import HomeDeliveryStatusCard from "@/components/blocks/home/HomeDeliveryStatusCard";
import ProductSection from "@/components/blocks/product/ProductSection";
import { productsApi, favoritesApi } from "@/lib/api";

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
  const [recentProducts, setRecentProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Загрузить избранное
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favorites = await favoritesApi.getAll({ item_type: "product" });
        const ids = new Set(favorites.map(f => f.product_id).filter(Boolean));
        setFavoriteIds(ids);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    }
    loadFavorites();
  }, []);

  // Загрузить последние товары
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const [latest, all] = await Promise.all([
          productsApi.getLatest(5),
          productsApi.getAll({ limit: 8, skip: 0 }),
        ]);
        
        setRecentProducts(latest.map(p => transformProduct(p, favoriteIds)));
        setRecommendedProducts(all.map(p => transformProduct(p, favoriteIds)));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [favoriteIds]);

  const toggleFavorite = async (id) => {
    const isFavorite = favoriteIds.has(id);
    try {
      if (isFavorite) {
        // Найти favorite_id и удалить
        const favorites = await favoritesApi.getAll({ item_type: "product" });
        const favorite = favorites.find(f => f.product_id === id);
        if (favorite) {
          await favoritesApi.remove(favorite.id);
          setFavoriteIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      } else {
        // Добавить в избранное
        await favoritesApi.add({ user_id: 1, product_id: id }); // TODO: получить user_id из сессии
        setFavoriteIds(prev => new Set(prev).add(id));
      }
      
      // Обновить локальное состояние
      setRecentProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
      );
      setRecommendedProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
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
