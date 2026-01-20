"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrandsSection from "@/components/blocks/favorites/BrandsSection";
import EmptyState from "@/components/blocks/favorites/EmptyState";
import ProductSection from "@/components/blocks/product/ProductSection";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "Supreme",
      image: "icons/favourites/brands/supreme.svg",
      isFavorite: true,
    },
    {
      id: 2,
      name: "Adidas",
      image: "icons/favourites/brands/adidas.svg",
      isFavorite: true,
    },
    {
      id: 3,
      name: "Stone Island",
      image: "icons/favourites/brands/stone-island.svg",
      isFavorite: true,
    },
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Лонгслив Comme des Garcons Play",
      brand: "Comme des Garcons",
      price: "2 890 ₽",
      image: "/products/t-shirt-1.png",
      isFavorite: true,
      deliveryDate: "30 марта",
    },
    {
      id: 2,
      name: "Туфли Prada Monolith Brushed Original Bla...",
      brand: "Prada",
      price: "112 490 ₽",
      image: "/products/shoes-1.png",
      isFavorite: true,
      deliveryDate: "Послезавтра",
    },
    {
      id: 3,
      name: "Футболка Daze",
      brand: "Daze",
      price: "2 890 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: true,
      deliveryDate: "Послезавтра",
    },
    {
      id: 4,
      name: "Кроссовки Nike Dunk Low",
      brand: "Nike",
      price: "12 990 ₽",
      image: "/products/shoes-2.png",
      isFavorite: true,
      deliveryDate: "30 марта",
    },
  ]);

  const [recommendedProducts, setRecommendedProducts] = useState([
    {
      id: 5,
      name: "Куртка The North Face",
      brand: "The North Face",
      price: "15 990 ₽",
      image: "/products/t-shirt-1.png",
      isFavorite: false,
    },
    {
      id: 6,
      name: "Джинсы Levi's 501",
      brand: "Levi's",
      price: "8 990 ₽",
      image: "/products/shoes-1.png",
      isFavorite: false,
    },
    {
      id: 7,
      name: "Рюкзак Herschel",
      brand: "Herschel",
      price: "4 590 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
    },
    {
      id: 8,
      name: "Кроссовки New Balance",
      brand: "New Balance",
      price: "9 990 ₽",
      image: "/products/shoes-2.png",
      isFavorite: false,
    },
  ]);

  const handleToggleBrandFavorite = (id) => {
    setBrands(
      brands.map((brand) =>
        brand.id === id ? { ...brand, isFavorite: !brand.isFavorite } : brand,
      ),
    );
  };

  const handleToggleProductFavorite = (id) => {
    // Проверяем, есть ли товар в избранных
    const favoriteProduct = products.find((p) => p.id === id);
    if (favoriteProduct) {
      // Если товар в избранных, удаляем его
      setProducts(products.filter((product) => product.id !== id));
    } else {
      // Если товар в рекомендуемых, перемещаем в избранные
      const recommendedProduct = recommendedProducts.find((p) => p.id === id);
      if (recommendedProduct) {
        setRecommendedProducts(
          recommendedProducts.filter((product) => product.id !== id),
        );
        setProducts([
          ...products,
          {
            ...recommendedProduct,
            isFavorite: true,
            deliveryDate: "Послезавтра",
          },
        ]);
      }
    }
  };

  const hasFavorites = products.length > 0 || brands.some((b) => b.isFavorite);

  return (
    <>
      <Header title="Избранное" />
      <main className={styles.c1}>
        {/* Секция брендов */}
        {brands.some((b) => b.isFavorite) && (
          <BrandsSection
            brands={brands.filter((b) => b.isFavorite)}
            onToggleFavorite={handleToggleBrandFavorite}
          />
        )}

        {/* Пустое состояние или товары */}
        {!hasFavorites ? (
          <EmptyState />
        ) : (
          <>
            {/* Секция товаров */}
            {products.length > 0 && (
              <div className={styles.c2}>
                <ProductSection
                  products={products}
                  onToggleFavorite={handleToggleProductFavorite}
                  layout="grid"
                />
              </div>
            )}
          </>
        )}
        <ProductSection
          title="Для вас"
          products={recommendedProducts}
          onToggleFavorite={handleToggleProductFavorite}
          layout="grid"
          hideFavoriteButton={true}
        />
      </main>
      <Footer />
    </>
  );
}
