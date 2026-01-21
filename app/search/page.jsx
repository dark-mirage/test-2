"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Layout";
import { cn } from "@/lib/format/cn";

import styles from "./page.module.css";

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    // Placeholder for future search suggestions.
    return [];
  }, [query]);

  const onClear = () => setQuery("");

  return (
    <main className={cn("tg-viewport", styles.page)}>
      <Container className={styles.container}>
        <header className={styles.topBar}>
          <div className={styles.title}>
            <span>Поиск</span>
          </div>
        </header>

        <div className={styles.searchWrap}>
          <div className={styles.searchBar}>
            <Search
              size={20}
              className={styles.searchIcon}
              aria-hidden="true"
            />

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск"
              className={styles.searchInput}
              inputMode="search"
              enterKeyHint="search"
            />

            {query ? (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={onClear}
                aria-label="Очистить"
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

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
            {filtered.length === 0 ? <div className={styles.empty} /> : null}
          </section>
        )}

        <Footer />
      </Container>
    </main>
  );
}
