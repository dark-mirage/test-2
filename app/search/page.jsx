"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListFilter, Search, SlidersHorizontal, Trash2 } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Layout";
import ProductSection from "@/components/blocks/product/ProductSection";
import SearchBar from "@/components/blocks/search/SearchBar";
import SelectSheet from "@/components/blocks/search/SelectSheet";
import PriceSheet from "@/components/blocks/search/PriceSheet";
import FiltersSheet from "@/components/blocks/search/FiltersSheet";
import { cn } from "@/lib/format/cn";

import styles from "./page.module.css";

export default function SearchPage() {
  const inputRef = useRef(null);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const blurCloseTimerRef = useRef(null);

  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const reopenFiltersAfterPickerRef = useRef(false);

  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState(null);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });

  const [delivery, setDelivery] = useState({
    inStock: false,
    fromChina: false,
  });
  const [original, setOriginal] = useState(false);

  const [products, setProducts] = useState(() => [
    {
      id: 1,
      name: "Туфли Prada Monolith Brushed Original Bla...",
      brand: "Prada",
      category: "Обувь",
      type: "Туфли",
      price: "112 490 ₽",
      image: "/products/shoes-1.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 2,
      name: "Лонгслив Comme Des Garcons Play",
      brand: "Comme Des Garcons",
      category: "Одежда",
      type: "Лонгсливы",
      price: "12 990 ₽",
      image: "/products/t-shirt-1.png",
      isFavorite: true,
      deliveryDate: "Послезавтра",
    },
    {
      id: 3,
      name: "Футболка Daze",
      brand: "Daze",
      category: "Одежда",
      type: "Футболки",
      price: "2 890 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 4,
      name: "Кроссовки Nike Dunk Low",
      brand: "Nike",
      category: "Обувь",
      type: "Кроссовки",
      price: "12 990 ₽",
      image: "/products/shoes-2.png",
      isFavorite: true,
      deliveryDate: "Послезавтра",
    },
    {
      id: 5,
      name: "Nike Худи",
      brand: "Nike",
      category: "Одежда",
      type: "Худи",
      price: "8 990 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "Послезавтра",
    },
    {
      id: 6,
      name: "Футболка Gall...",
      brand: "Gall",
      category: "Одежда",
      type: "Футболки",
      price: "2 890 ₽",
      image: "/products/t-shirt-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 7,
      name: "Кроссовки Puma Speedcat",
      brand: "Puma",
      category: "Обувь",
      type: "Кроссовки",
      price: "14 990 ₽",
      image: "/products/shoes-2.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: 8,
      name: "Кеды Maison Margiela",
      brand: "Maison Margiela",
      category: "Обувь",
      type: "Кеды",
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

  useEffect(() => {
    const paramQuery = searchParams.get("query");
    if (paramQuery != null) {
      setQuery(paramQuery);
    }
  }, [searchParams]);

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

  const priceToNumber = (value) => {
    const n = Number(String(value || "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const categoryOptions = useMemo(() => {
    const valuesSet = new Set(products.map((p) => p.category).filter(Boolean));
    valuesSet.add("Аксессуары");
    const values = Array.from(valuesSet).sort((a, b) =>
      String(a).localeCompare(String(b)),
    );
    return [
      { value: null, label: "Любая" },
      ...values.map((v) => ({ value: v, label: v })),
    ];
  }, [products]);

  const typeOptions = useMemo(() => {
    return [
      { kind: "section", label: "ОДЕЖДА" },
      { value: "Футболки", label: "Футболки" },
      { value: "Худи", label: "Худи" },
      { value: "Зип-худи", label: "Зип-худи" },
      { value: "Джинсы", label: "Джинсы" },
      { value: "Штаны", label: "Штаны" },
      { value: "Шорты", label: "Шорты" },
      { value: "Майки", label: "Майки" },
      { value: "Лонгсливы", label: "Лонгсливы" },
      { value: "Свитшоты", label: "Свитшоты" },
      { value: "Свитеры", label: "Свитеры" },
      { value: "Рубашки", label: "Рубашки" },
      { value: "Ветровки", label: "Ветровки" },
      { value: "Бомберы", label: "Бомберы" },
      { value: "Куртки", label: "Куртки" },
      { value: "Пуховики", label: "Пуховики" },
      { value: "Жилеты", label: "Жилеты" },
      { value: "Носки", label: "Носки" },
      { value: "Нижнее бельё", label: "Нижнее бельё" },

      { kind: "section", label: "ОБУВЬ" },
      { value: "Кроссовки", label: "Кроссовки" },
      { value: "Кеды", label: "Кеды" },
      { value: "Туфли", label: "Туфли" },
    ];
  }, []);

  const brandOptions = useMemo(() => {
    const values = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean)),
    ).sort((a, b) => String(a).localeCompare(String(b)));
    return values.map((v) => ({ value: v, label: v }));
  }, [products]);

  const priceBounds = useMemo(() => {
    let min = null;
    let max = null;
    for (const p of products) {
      const price = priceToNumber(p.price);
      if (!price) continue;
      if (min == null || price < min) min = price;
      if (max == null || price > max) max = price;
    }
    return { min, max };
  }, [products]);

  const formatNum = (n) => (n == null ? "" : Number(n).toLocaleString("ru-RU"));

  const priceLabel = useMemo(() => {
    const min = priceRange?.min ?? null;
    const max = priceRange?.max ?? null;
    if (min == null && max == null) return "Цена";
    if (min != null && max != null)
      return `${formatNum(min)}–${formatNum(max)} ₽`;
    if (min != null) return `От ${formatNum(min)} ₽`;
    return `До ${formatNum(max)} ₽`;
  }, [priceRange?.max, priceRange?.min]);

  const brandChipLabel = useMemo(() => {
    if (!brands?.length) return "Бренд";
    if (brands.length === 1) return brands[0];
    return `${brands[0]} +${brands.length - 1}`;
  }, [brands]);

  const typeChipLabel = useMemo(() => {
    if (!types?.length) return "Тип";
    if (types.length === 1) return types[0];
    return `${types[0]} +${types.length - 1}`;
  }, [types]);

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

    const filtered = products.filter((p) => {
      const hay = `${p.name || ""} ${p.brand || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;

      if (category && p.category !== category) return false;
      if (types?.length && !types.includes(p.type)) return false;
      if (brands?.length && !brands.includes(p.brand)) return false;

      const min = priceRange?.min ?? null;
      const max = priceRange?.max ?? null;
      if (min != null || max != null) {
        const price = priceToNumber(p.price);
        if (min != null && price < min) return false;
        if (max != null && price > max) return false;
      }

      return true;
    });

    if (sort === "price_asc") {
      return [...filtered].sort(
        (a, b) => priceToNumber(a.price) - priceToNumber(b.price),
      );
    }

    if (sort === "price_desc") {
      return [...filtered].sort(
        (a, b) => priceToNumber(b.price) - priceToNumber(a.price),
      );
    }

    return filtered;
  }, [
    brands,
    category,
    priceRange?.max,
    priceRange?.min,
    products,
    query,
    sort,
    types,
  ]);

  const closeTypeSheet = () => {
    setTypeOpen(false);
    if (reopenFiltersAfterPickerRef.current) {
      reopenFiltersAfterPickerRef.current = false;
      setFiltersOpen(true);
    }
  };

  const closeBrandSheet = () => {
    setBrandOpen(false);
    if (reopenFiltersAfterPickerRef.current) {
      reopenFiltersAfterPickerRef.current = false;
      setFiltersOpen(true);
    }
  };

  const filterCategories = useMemo(() => {
    const set = new Set(["Одежда", "Обувь", "Аксессуары"]);
    for (const opt of categoryOptions) {
      if (opt?.value) set.add(opt.value);
    }
    return Array.from(set).slice(0, 3);
  }, [categoryOptions]);

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
                      onClick={() => setSortOpen(true)}
                    >
                      <ListFilter size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.iconChip}
                      aria-label="Фильтры"
                      onClick={() => setFiltersOpen(true)}
                    >
                      <SlidersHorizontal size={18} aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      className={cn(
                        styles.filterChip,
                        category ? styles.filterChipActive : null,
                      )}
                      onClick={() => setCategoryOpen(true)}
                    >
                      <span>{category || "Категория"}</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        styles.filterChip,
                        types?.length ? styles.filterChipActive : null,
                      )}
                      onClick={() => setTypeOpen(true)}
                    >
                      <span>{typeChipLabel}</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        styles.filterChip,
                        brands?.length ? styles.filterChipActive : null,
                      )}
                      onClick={() => setBrandOpen(true)}
                    >
                      <span>{brandChipLabel}</span>
                      <span className={styles.chev} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        styles.filterChip,
                        priceRange?.min != null || priceRange?.max != null
                          ? styles.filterChipActive
                          : null,
                      )}
                      onClick={() => setPriceOpen(true)}
                    >
                      <span>{priceLabel}</span>
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

        <SelectSheet
          open={sortOpen}
          onClose={() => setSortOpen(false)}
          title="Показывать сначала"
          options={[
            { value: "popular", label: "Популярные" },
            { value: "price_asc", label: "Подешевле" },
            { value: "price_desc", label: "Подороже" },
          ]}
          value={sort}
          onApply={(v) => setSort(v)}
        />

        <SelectSheet
          open={categoryOpen}
          onClose={() => setCategoryOpen(false)}
          title="Категория"
          options={categoryOptions}
          value={category}
          onApply={(v) => setCategory(v)}
        />

        <SelectSheet
          open={typeOpen}
          onClose={closeTypeSheet}
          title="Тип"
          options={typeOptions}
          multiple
          control="check"
          showSelectedChips
          value={types}
          onApply={(v) => setTypes(Array.isArray(v) ? v : [])}
        />

        <SelectSheet
          open={brandOpen}
          onClose={closeBrandSheet}
          title="Бренд"
          options={brandOptions}
          multiple
          value={brands}
          searchable
          searchPlaceholder="Найти бренд"
          groupBy="alpha"
          onApply={(v) => setBrands(Array.isArray(v) ? v : [])}
        />

        <PriceSheet
          open={priceOpen}
          onClose={() => setPriceOpen(false)}
          title="Цена"
          value={priceRange}
          minPlaceholder={priceBounds.min}
          maxPlaceholder={priceBounds.max}
          onApply={(v) => setPriceRange(v)}
        />

        <FiltersSheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          categories={filterCategories}
          value={{
            category,
            types,
            brands,
            priceRange,
            delivery,
            original,
          }}
          priceBounds={priceBounds}
          onApply={(next) => {
            setCategory(next.category ?? null);
            setTypes(Array.isArray(next.types) ? next.types : []);
            setBrands(Array.isArray(next.brands) ? next.brands : []);
            setPriceRange(next.priceRange ?? { min: null, max: null });
            setDelivery(next.delivery ?? { inStock: false, fromChina: false });
            setOriginal(Boolean(next.original));
          }}
          onOpenTypePicker={() => {
            reopenFiltersAfterPickerRef.current = true;
            setFiltersOpen(false);
            setTypeOpen(true);
          }}
          onOpenBrandPicker={() => {
            reopenFiltersAfterPickerRef.current = true;
            setFiltersOpen(false);
            setBrandOpen(true);
          }}
        />
      </Container>
    </main>
  );
}
