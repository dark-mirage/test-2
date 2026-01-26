"use client";
import React, { useState } from "react";
import Footer from "@/components/layout/Footer";
import FavoriteBrandsSection from "@/components/blocks/favorites/brands/FavoriteBrandsSection";
import BrandsSearch from "@/components/blocks/favorites/brands/BrandsSearch";
import AllBrandsList from "@/components/blocks/favorites/brands/AllBrandsList";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function BrandsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const [favoriteBrands, setFavoriteBrands] = useState([
    {
      id: 1,
      name: "Supreme",
      image: "/icons/favourites/brands/supreme.svg",
      isFavorite: true,
    },
    {
      id: 2,
      name: "Adidas",
      image: "/icons/favourites/brands/adidas.svg",
      isFavorite: true,
    },
    {
      id: 3,
      name: "Stone Island",
      image: "/icons/favourites/brands/stone-island.svg",
      isFavorite: true,
    },
    {
      id: 4,
      name: "Nike",
      image: "/icons/favourites/brands/supreme.svg",
      isFavorite: true,
    },
    {
      id: 5,
      name: "Puma",
      image: "/icons/favourites/brands/adidas.svg",
      isFavorite: true,
    },
  ]);

  const [allBrands, setAllBrands] = useState([
    {
      id: 6,
      name: "Supreme",
      image: "/icons/favourites/brands/supreme.svg",
      isFavorite: false,
    },
    {
      id: 7,
      name: "Adidas",
      image: "/icons/favourites/brands/adidas.svg",
      isFavorite: false,
    },
    {
      id: 8,
      name: "Stone Island",
      image: "/icons/favourites/brands/stone-island.svg",
      isFavorite: false,
    },
    {
      id: 9,
      name: "Nike",
      image: "/icons/favourites/brands/supreme.svg",
      isFavorite: false,
    },
  ]);

  const handleToggleFavorite = (id) => {
    const brand = allBrands.find((b) => b.id === id);
    if (brand) {
      if (brand.isFavorite) {
        // Удаляем из избранных
        setAllBrands(
          allBrands.map((b) => (b.id === id ? { ...b, isFavorite: false } : b)),
        );
        setFavoriteBrands(favoriteBrands.filter((b) => b.id !== id));
      } else {
        // Добавляем в избранные
        setAllBrands(
          allBrands.map((b) => (b.id === id ? { ...b, isFavorite: true } : b)),
        );
        setFavoriteBrands([...favoriteBrands, { ...brand, isFavorite: true }]);
      }
    }
  };

  // Фильтрация брендов по поиску
  const filteredBrands = allBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageMain}>
      <h3 className={styles.pageTitle}>Бренды</h3>
      <div className={styles.page}>
        <main className={styles.content}>
          {favoriteBrands.length > 0 ? (
            <FavoriteBrandsSection brands={favoriteBrands} />
          ) : null}

          <section className={styles.allCard}>
            <h2 className={styles.sectionTitle}>Все</h2>

            <div className={styles.searchWrap}>
              <BrandsSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Найти бренд"
              />
            </div>

            <AllBrandsList
              brands={filteredBrands}
              onToggleFavorite={handleToggleFavorite}
            />
          </section>
        </main>

        <Footer />
      </div>
      <Footer />
    </div>
  );
}
