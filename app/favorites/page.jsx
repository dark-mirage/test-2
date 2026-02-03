"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrandsSection from "@/components/blocks/favorites/BrandsSection";
import EmptyState from "@/components/blocks/favorites/EmptyState";
import ProductSection from "@/components/blocks/product/ProductSection";
import { favoritesApi, productsApi, brandsApi } from "@/lib/api";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const { userId } = useCurrentUser();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!userId) return;
      try {
        setLoading(true);
        const [favoriteProducts, favoriteBrands, allProducts] = await Promise.all([
          favoritesApi.getAll({ item_type: "product" }),
          favoritesApi.getAll({ item_type: "brand" }),
          productsApi.getAll({ limit: 4 }),
        ]);

        // Загрузить товары
        const productData = await Promise.all(
          favoriteProducts
            .filter(f => f.product_id)
            .map(async (f) => {
              try {
                const product = await productsApi.getById(f.product_id);
                const firstPhoto = product.photos?.[0];
                return {
                  id: product.id,
                  name: product.name,
                  brand: product.brand?.name || "Unknown",
                  price: new Intl.NumberFormat("ru-RU").format(product.price) + " ₽",
                  image: firstPhoto ? productsApi.getPhoto(firstPhoto.filename) : "/products/shoes-1.png",
                  isFavorite: true,
                  deliveryDate: product.delivery === "China" ? "30 марта" : "Послезавтра",
                  favoriteId: f.id,
                };
              } catch {
                return null;
              }
            })
        );
        setProducts(productData.filter(Boolean));

        // Загрузить бренды
        const brandData = await Promise.all(
          favoriteBrands
            .filter(f => f.brand_id)
            .map(async (f) => {
              try {
                const brand = await brandsApi.getById(f.brand_id);
                return {
                  id: brand.id,
                  name: brand.name,
                  image: brand.logo ? brandsApi.getLogo(brand.logo) : "icons/favourites/brands/supreme.svg",
                  isFavorite: true,
                  favoriteId: f.id,
                };
              } catch {
                return null;
              }
            })
        );
        setBrands(brandData.filter(Boolean));

        // Рекомендуемые товары
        const favoriteProductIds = new Set(favoriteProducts.map(f => f.product_id).filter(Boolean));
        setRecommendedProducts(allProducts
          .filter(p => !favoriteProductIds.has(p.id))
          .slice(0, 4)
          .map(p => {
            const firstPhoto = p.photos?.[0];
            return {
              id: p.id,
              name: p.name,
              brand: p.brand?.name || "Unknown",
              price: new Intl.NumberFormat("ru-RU").format(p.price) + " ₽",
              image: firstPhoto ? productsApi.getPhoto(firstPhoto.filename) : "/products/shoes-1.png",
              isFavorite: false,
            };
          })
        );
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [userId]);

  const handleToggleBrandFavorite = async (id) => {
    const brand = brands.find(b => b.id === id);
    if (!brand || !userId) return;
    
    try {
      if (brand.isFavorite && brand.favoriteId) {
        await favoritesApi.remove(brand.favoriteId);
        setBrands(brands.filter(b => b.id !== id));
      } else {
        await favoritesApi.add({ user_id: userId, brand_id: id });
        const brandData = await brandsApi.getById(id);
        setBrands([...brands, {
          id: brandData.id,
          name: brandData.name,
          image: brandData.logo ? brandsApi.getLogo(brandData.logo) : "icons/favourites/brands/supreme.svg",
          isFavorite: true,
        }]);
      }
    } catch (err) {
      console.error("Failed to toggle brand favorite:", err);
    }
  };

  const handleToggleProductFavorite = async (id) => {
    const product = products.find(p => p.id === id);
    if (!userId) return;
    
    try {
      if (product && product.isFavorite && product.favoriteId) {
        await favoritesApi.remove(product.favoriteId);
        setProducts(products.filter(p => p.id !== id));
      } else {
        await favoritesApi.add({ user_id: userId, product_id: id });
        const productData = await productsApi.getById(id);
        const firstPhoto = productData.photos?.[0];
        setProducts([...products, {
          id: productData.id,
          name: productData.name,
          brand: productData.brand?.name || "Unknown",
          price: new Intl.NumberFormat("ru-RU").format(productData.price) + " ₽",
          image: firstPhoto ? productsApi.getPhoto(firstPhoto.filename) : "/products/shoes-1.png",
          isFavorite: true,
          deliveryDate: productData.delivery === "China" ? "30 марта" : "Послезавтра",
        }]);
      }
    } catch (err) {
      console.error("Failed to toggle product favorite:", err);
    }
  };

  const hasFavorites = products.length > 0 || brands.some((b) => b.isFavorite);

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.c1}>
          <div style={{ padding: "2rem", textAlign: "center" }}>Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.c1}>
        <div className={styles.header}>
          <Header title="Избранное" />
          {brands.some((b) => b.isFavorite) && (
            <BrandsSection
              brands={brands.filter((b) => b.isFavorite)}
              onToggleFavorite={handleToggleBrandFavorite}
            />
          )}
        </div>

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
    </div>
  );
}
