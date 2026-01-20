"use client";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/blocks/search/SearchBar";
import { useState } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CatalogTabs from "@/components/blocks/catalog/CatalogTabs";
import BrandsList from "@/components/blocks/catalog/BrandsList";

import styles from "./page.module.css";

export default function CatalogPage() {
  const categories = [
    {
      id: "clothes",
      title: "одежда",
      imageSrc: "/icons/catalog/catalog-icon-1.svg",
      altText: "Одежда",
    },
    {
      id: "shoes",
      title: "обувь",
      imageSrc: "/icons/catalog/catalog-icon-2.svg",
      altText: "Обувь",
    },
    {
      id: "accessories",
      title: "аксессуары",
      imageSrc: "/icons/catalog/catalog-icon-3.svg",
      altText: "Аксессуары",
    },
  ];

  const [activeTab, setActiveTab] = useState("catalog");

  return (
    <div className={styles.root}>
      <Header title="Поиск" />

      <div className={styles.tabsWrap}>
        <CatalogTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className={styles.searchWrap}>
        <SearchBar />
      </div>
      <main className={styles.main}>
        {activeTab === "catalog" ? (
          <div className={styles.categories}>
            {categories.map((category) => (
              <Link key={category.id} href={`/catalog/${category.id}`}>
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>{category.title}</h3>
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={category.imageSrc}
                      alt={category.altText}
                      width={239}
                      height={239}
                      className={styles.cardImage}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <BrandsList />
        )}
      </main>
      <Footer />
    </div>
  );
}
