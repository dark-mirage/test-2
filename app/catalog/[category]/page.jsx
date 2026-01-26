"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import SearchBar from "@/components/blocks/search/SearchBar";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CatalogTabs from "@/components/blocks/catalog/CatalogTabs";
import BrandsList from "@/components/blocks/catalog/BrandsList";

import styles from "./page.module.css";

const categoryData = {
  clothes: {
    title: "Одежда",
    subcategories: [
      "футболки",
      "худи",
      "зип-худи",
      "джинсы",
      "штаны",
      "Шорты",
      "Майки",
      "лонгсливы",
      "свитшоты",
      "свитеры",
      "рубашки",
      "ветровки",
      "бомберы",
      "куртки",
      "Пуховики",
      "Жилеты",
      "Носки",
      "Нижнее бельё",
    ],
  },
  shoes: {
    title: "Обувь",
    subcategories: [
      "кроссовки",
      "кеды",
      "ботинки",
      "туфли",
      "сандалии",
      "сапоги",
    ],
  },
  accessories: {
    title: "Аксессуары",
    subcategories: ["сумки", "рюкзаки", "часы", "очки", "ремни", "кошельки"],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.category;
  const category = categoryData[categoryId];
  const [activeTab, setActiveTab] = useState("catalog");

  if (!category) {
    return (
      <div className={styles.error}>
        <p>Категория не найдена</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h3 className={styles.searchTitle}>Каталог</h3>
      <SearchBar />


      <main className={styles.main}>
        {activeTab === "catalog" ? (
          <>
            {/* Заголовок категории и кнопка "все" */}
            <div className={styles.sectionHeader}>
              <div className={styles.headerRow}>
                <h1 className={styles.title}>{category.title}</h1>
                <button type="button" className={styles.allBtn}>
                  <span className={styles.allText}>все</span>
                  <div className={styles.allIconWrap}>
                    <Image
                      src="/icons/global/Wrap.svg"
                      alt=""
                      width={16}
                      height={15}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Список подкатегорий */}
            <div className={styles.listOuter}>
              <div className={styles.list}>
                {/* Разделитель сверху */}
                <div className={`${styles.divider} ${styles.dividerTop}`} />

                {/* Подкатегории */}
                <div className={styles.items}>
                  {category.subcategories.map((subcategory, index) => (
                    <div key={subcategory}>
                      <div className={styles.itemRow}>
                        <span className={styles.subcategory}>
                          {subcategory}
                        </span>
                        <div className={styles.chevron}>
                          <Image
                            src="/icons/global/Wrap.svg"
                            alt=""
                            width={7}
                            height={11}
                          />
                        </div>
                      </div>
                      {/* Разделитель */}
                      {index < category.subcategories.length - 1 && (
                        <div className={styles.divider} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <BrandsList />
        )}
      </main>
      <Footer />
    </div>
  );
}
