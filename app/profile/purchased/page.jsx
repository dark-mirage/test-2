"use client";
import Footer from "@/components/layout/Footer";
import ProductSection from "@/components/blocks/product/ProductSection";
import BottomSheet from "@/components/ui/BottomSheet";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { mockPurchasedProducts } from "./mockPurchasedProducts";

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

const RATINGS_KEY = "lm:purchasedRatings";

export default function PurchasedPage() {
  const router = useRouter();

  useEffect(() => {
    // Telegram WebApp topbar title odatda document.title dan olinadi.
    document.title = "Купленные товары";
  }, []);

  const [purchasedProducts, setPurchasedProducts] = useState(() => {
    const base = mockPurchasedProducts.map((p) => ({ ...p }));

    if (typeof window === "undefined") return base;

    try {
      const raw = localStorage.getItem(RATINGS_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
        return base;
      }

      return base.map((p) => ({
        ...p,
        rating: typeof saved[p.id] === "number" ? saved[p.id] : (p.rating ?? 0),
      }));
    } catch {
      return base;
    }
  });

  const toggleFavorite = (id) => {
    setPurchasedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, isFavorite: !product.isFavorite }
          : product,
      ),
    );
  };

  const setRating = (id, rating) => {
    if (!id) return;
    setPurchasedProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, rating } : product,
      ),
    );

    try {
      const raw = localStorage.getItem(RATINGS_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const next =
        saved && typeof saved === "object" && !Array.isArray(saved)
          ? { ...saved }
          : {};
      next[id] = rating;
      localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleStarSelect = (id, rating) => {
    setRating(id, rating);
    if (!id) return;
    router.push(`/profile/purchased/review/${id}?rating=${rating}`);
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
            cardProps={{
              showStars: true,
              starsInteractive: true,
              onStarSelect: handleStarSelect,
            }}
          />

          <ProductSection
            title="Для вас"
            products={displayedProducts}
            onToggleFavorite={toggleFavorite}
            layout="grid"
            cardProps={{
              showStars: true,
              starsInteractive: true,
              onStarSelect: handleStarSelect,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
