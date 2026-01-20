"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FavoriteBrandsSection from "@/components/blocks/favorites/brands/FavoriteBrandsSection";
import BrandsFilter from "@/components/blocks/favorites/brands/BrandsFilter";
import BrandsSearch from "@/components/blocks/favorites/brands/BrandsSearch";
import AllBrandsList from "@/components/blocks/favorites/brands/AllBrandsList";
import Link from "next/link";
import styles from "./page.module.css";
import cx from "clsx";

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState();

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

  const filterLetters = ["А", "Б"];

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
    <>
      <Header title="Бренды" />
      <main className={styles.c1}>
        {/* Секция избранных брендов */}
        {favoriteBrands.length > 0 && (
          <FavoriteBrandsSection brands={favoriteBrands} />
        )}

        {/* Секция всех брендов */}
        <div className={styles.c2}>
          <Link href="/favorites/brands">
            <h2 className={styles.c3}>Все</h2>
          </Link>

          {/* Поисковая строка */}
          <div className={styles.c4}>
            <BrandsSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Найти бренд"
            />
          </div>

          {/* Фильтры и список брендов */}
          <div className={cx(styles.c5, styles.tw1)}>
            {/* Фильтры по буквам */}
            <BrandsFilter
              letters={filterLetters}
              selectedLetter={selectedLetter}
              onSelectLetter={setSelectedLetter}
            />

            {/* Список брендов */}
            <AllBrandsList
              brands={filteredBrands}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
