"use client";
import Footer from "@/components/layout/Footer";
import ProductSection from "@/components/blocks/product/ProductSection";
import BottomSheet from "@/components/ui/BottomSheet";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

function parsePriceRub(value) {
  const raw = String(value ?? "");
  const digits = raw.replace(/[^0-9]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

const SORT_OPTIONS = [
  { key: "new", label: "Новые" },
  { key: "old", label: "Старые" },
  { key: "cheap", label: "Подешевле" },
  { key: "expensive", label: "Подороже" },
];

export default function PurchasedPage() {
  useEffect(() => {
    // Telegram WebApp topbar title odatda document.title dan olinadi.
    document.title = "Купленные товары";
  }, []);

  const [purchasedProducts, setPurchasedProducts] = useState([
    {
      id: 1,
      name: "Туфли Prada Monolith Brushed Original Bla...",
      brand: "Prada",
      price: "112 490 ₽",
      image: "/products/shoes-1.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 2,
      name: "Лонгслив Comme Des Garcons Play",
      brand: "Comme Des Garcons",
      price: "12 990 ₽",
      image: "/products/t-shirt-1.png",
      isFavorite: true,
      deliveryDate: "Послезавтра",
    },
    {
      id: 3,
      name: "Футболка Daze",
      brand: "Daze",
      price: "2 890 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 4,
      name: "Кроссовки Nike Dunk Low",
      brand: "Nike",
      price: "12 990 ₽",
      image: "/products/shoes-2.png",
      isFavorite: true,
      deliveryDate: "Послезавтра",
    },
    {
      id: 5,
      name: "Куртка зимняя",
      brand: "NoName",
      price: "15 990 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 6,
      name: "Лонгслив Comme Des Garçons Play",
      brand: "Comme Des Garcons",
      price: "2 890 ₽",
      image: "/products/t-shirt-1.png",
      isFavorite: false,
      deliveryDate: "Послезавтра",
    },
  ]);

  const toggleFavorite = (id) => {
    setPurchasedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, isFavorite: !product.isFavorite }
          : product,
      ),
    );
  };

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState("new");
  const [pendingSortKey, setPendingSortKey] = useState(sortKey);

  const sortLabel =
    SORT_OPTIONS.find((x) => x.key === sortKey)?.label ?? "Новые";

  const displayedProducts = useMemo(() => {
    const list = Array.isArray(purchasedProducts) ? [...purchasedProducts] : [];

    switch (sortKey) {
      case "old":
        list.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));
        break;
      case "cheap":
        list.sort((a, b) => parsePriceRub(a?.price) - parsePriceRub(b?.price));
        break;
      case "expensive":
        list.sort((a, b) => parsePriceRub(b?.price) - parsePriceRub(a?.price));
        break;
      case "new":
      default:
        list.sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
        break;
    }

    return list;
  }, [purchasedProducts, sortKey]);

  return (
    <div className="tg-viewport">
      <main className={styles.c1}>
        <h3 className={styles.title}>Купленные товары</h3>
        <div className={styles.c2}>
          <button
            className={styles.filterBtn}
            type="button"
            onClick={() => {
              setPendingSortKey(sortKey);
              setIsSortOpen(true);
            }}
          >
            <img src="/icons/global/filterIcon.svg" alt="icon" />
            <span>{sortLabel}</span>
          </button>

          <BottomSheet
            open={isSortOpen}
            title="Показывать сначала"
            onClose={() => setIsSortOpen(false)}
            footer={
              <div className={styles.sheetFooter}>
                <button
                  type="button"
                  className={styles.sheetBtnSecondary}
                  onClick={() => {
                    setPendingSortKey(sortKey);
                    setIsSortOpen(false);
                  }}
                >
                  Отменить
                </button>
                <button
                  type="button"
                  className={styles.sheetBtnPrimary}
                  onClick={() => {
                    setSortKey(pendingSortKey);
                    setIsSortOpen(false);
                  }}
                >
                  Применить
                </button>
              </div>
            }
          >
            <div className={styles.sheetList}>
              {SORT_OPTIONS.map((opt) => {
                const checked = opt.key === pendingSortKey;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className={styles.sheetRow}
                    onClick={() => setPendingSortKey(opt.key)}
                  >
                    <span className={styles.sheetLabel}>{opt.label}</span>
                    <span
                      className={
                        checked
                          ? `${styles.radio} ${styles.radioChecked}`
                          : styles.radio
                      }
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </BottomSheet>

          <ProductSection
            products={displayedProducts}
            onToggleFavorite={toggleFavorite}
            layout="grid"
            cardProps={{ showStars: true }}
          />

          <ProductSection
            title="Для вас"
            products={displayedProducts}
            onToggleFavorite={toggleFavorite}
            layout="grid"
            cardProps={{ showStars: true }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
