"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ListFilter, Search, SlidersHorizontal, Trash2 } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Layout";
import ProductSection from "@/components/blocks/product/ProductSection";
import SearchBar from "@/components/blocks/search/SearchBar";
import { cn } from "@/lib/format/cn";

import styles from "./page.module.css";

export default function SearchPage() {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const blurCloseTimerRef = useRef(null);

  const [products, setProducts] = useState(() => [
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
      name: "Nike Худи",
      brand: "Nike",
      price: "8 990 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "Послезавтра",
    },
    {
      id: 6,
      name: "Футболка Gall...",
      brand: "Gall",
      price: "2 890 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 7,
      name: "Кроссовки Puma Speedcat",
      brand: "Puma",
      price: "14 990 ₽",
      image: "/products/shoes-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 8,
      name: "Кеды Maison Margiela",
      brand: "Maison Margiela",
      price: "36 990 ₽",
      image: "/products/shoes-1.png",
      isFavorite: false,
      deliveryDate: "Послезавтра",
    },
  ]);

  const [recent, setRecent] = useState([
    "Футболка Гоша Рубчинский",
    "Кросы Supreme",
    "Галоши",
    "Рик Овенс кеды",
    "Nike Худи",
    "Nike Худи",
    "Найк Аирфорс",
    "Кросы Пума Кетсцид",
  ]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus?.());
    return () => cancelAnimationFrame(frame);
  }, []);

  const normalize = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

  const popular = useMemo(
    () => [
      "кроссовки",
      "кроссовки puma speedcat",
      "кроссовки maison margiela",
      "кроссовки nike",
      "кроссовки adidas",
      "nike air force",
      "nike dunk low",
      "supreme",
      "puma speedcat",
      "maison margiela",
    ],
    [],
  );

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];

    const pool = [...recent, ...popular];

    const seen = new Set();
    const items = [];

    for (const raw of pool) {
      const label = String(raw || "").trim();
      if (!label) continue;

      const key = normalize(label);
      if (!key || seen.has(key)) continue;
      if (!key.includes(q)) continue;
      seen.add(key);
      items.push(label);
      if (items.length >= 10) break;
    }

    // Prefer prefix matches first (like in iOS search).
    return items.sort((a, b) => {
      const ak = normalize(a);
      const bk = normalize(b);
      const ap = ak.startsWith(q) ? 0 : 1;
      const bp = bk.startsWith(q) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return ak.localeCompare(bk);
    });
  }, [popular, query, recent]);

  const showSuggestions = isFocused && normalize(query).length > 0;
  const showResults = !showSuggestions && normalize(query).length > 0;

  const commitSearch = (value) => {
    const next = String(value || "").trim();
    if (!next) return;

    if (blurCloseTimerRef.current) {
      window.clearTimeout(blurCloseTimerRef.current);
      blurCloseTimerRef.current = null;
    }
    setIsFocused(false);

    setQuery(next);
    setRecent((prev) => {
      const key = normalize(next);
      const deduped = prev.filter((x) => normalize(x) !== key);
      return [next, ...deduped].slice(0, 12);
    });

    // Optional: keep user on this page for now.
    // If you later have a results page, you can navigate here.
    // router.push(`/search?query=${encodeURIComponent(next)}`);
  };

  const renderSuggestionLabel = (label) => {
    const q = normalize(query);
    const hay = label;
    const hayLower = hay.toLowerCase();
    const idx = q ? hayLower.indexOf(q) : -1;
    if (idx < 0 || !q)
      return <span className={styles.suggestText}>{label}</span>;

    const before = hay.slice(0, idx);
    const match = hay.slice(idx, idx + q.length);
    const after = hay.slice(idx + q.length);

    return (
      <span className={styles.suggestText}>
        {before}
        <span className={styles.suggestStrong}>{match}</span>
        <span className={styles.suggestRest}>{after}</span>
      </span>
    );
  };

  const onToggleFavorite = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
  };

  const filteredProducts = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];

    return products.filter((p) => {
      const hay = `${p.name || ""} ${p.brand || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, query]);

  return (
    <main className={cn("tg-viewport", styles.page)}>
      <Container className={styles.container}>
        <SearchBar
          inputRef={inputRef}
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (blurCloseTimerRef.current) {
              window.clearTimeout(blurCloseTimerRef.current);
              blurCloseTimerRef.current = null;
            }
            setIsFocused(true);
          }}
          onBlur={() => {
            // Delay closing so clicks on suggestions work.
            blurCloseTimerRef.current = window.setTimeout(() => {
              setIsFocused(false);
              blurCloseTimerRef.current = null;
            }, 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitSearch(query);
            }
          }}
          inputMode="search"
          enterKeyHint="search"
        />

        {showSuggestions ? (
          <div className={styles.suggestWrap}>
            <div
              className={styles.suggestList}
              role="listbox"
              aria-label="Подсказки"
            >
              {suggestions.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={styles.suggestItem}
                  onMouseDown={(e) => {
                    // Prevent input blur before click.
                    e.preventDefault();
                  }}
                  onClick={() => commitSearch(label)}
                  role="option"
                  aria-selected="false"
                >
                  <Search
                    size={18}
                    className={styles.suggestItemIcon}
                    aria-hidden="true"
                  />
                  {renderSuggestionLabel(label)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {!query ? (
          <section className={styles.recent} aria-label="Вы искали">
            <div className={styles.recentHeader}>
              <div className={styles.recentTitle}>Вы искали</div>

              <button
                type="button"
                className={styles.trashBtn}
                aria-label="Очистить историю"
                onClick={() => setRecent([])}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.chips}>
              {recent.map((label, idx) => (
                <button
                  key={`${label}-${idx}`}
                  type="button"
                  className={styles.chip}
                  onClick={() => setQuery(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.results} aria-label="Результаты">
            {showResults ? (
              <>
                <div className={styles.filtersBar} aria-label="Фильтры">
                  <div className={cn(styles.filtersRow, "scrollbar-hide")}>
                    <button
                      type="button"
                      className={styles.iconChip}
                      aria-label="Сортировка"
                    >
                      <ListFilter size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.iconChip}
                      aria-label="Фильтры"
                    >
                      <SlidersHorizontal size={18} aria-hidden="true" />
                    </button>

                    <button type="button" className={styles.filterChip}>
                      <span>Категория</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <button type="button" className={styles.filterChip}>
                      <span>Тип</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <button type="button" className={styles.filterChip}>
                      <span>Бренд</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <button type="button" className={styles.filterChip}>
                      <span>Цена</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div
                    className={styles.empty}
                    role="status"
                    aria-live="polite"
                  >
                    <div className={styles.emptyTitle}>Ничего не найдено</div>
                    <div className={styles.emptySubtitle}>
                      Но можно поискать что-то другое
                    </div>
                  </div>
                ) : (
                  <ProductSection
                    title=""
                    products={filteredProducts}
                    onToggleFavorite={onToggleFavorite}
                    layout="grid"
                  />
                )}
              </>
            ) : null}
          </section>
        )}

        <Footer />
      </Container>
    </main>
  );
}
