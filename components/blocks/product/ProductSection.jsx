"use client";
import ProductCard from "./ProductCard";

import { cn } from "@/lib/format/cn";
import styles from "./ProductSection.module.css";

export default function ProductSection({
  title = "",
  products = [],
  onToggleFavorite = (_id) => {},
  layout = "grid",
  hideFavoriteButton = false,
  headerVariant = "title",
  tabs = ["Для вас", "Похожие"],
  activeTab,
  onTabChange,
}) {
  const currentTab = activeTab ?? title ?? tabs?.[0] ?? "";
  if (layout === "horizontal") {
    return (
      <section className={styles.sectionHorizontal}>
        {title ? (
          <div className={styles.header}>
            <h2 className={styles.titleHorizontal}>{title}</h2>
            <button type="button" className={styles.allBtn}>
              <span className={styles.allText}>все</span>
              <img
                className={styles.arrow}
                src="/icons/global/arrow.svg"
                alt="arrow"
              />
            </button>
          </div>
        ) : null}
        <div className={cn(styles.row, "scrollbar-hide")}>
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleFavorite={onToggleFavorite}
              variant="compact"
              hideFavoriteButton={hideFavoriteButton}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.sectionGrid}>
      {headerVariant === "tabs" && Array.isArray(tabs) && tabs.length ? (
        <div className={styles.tabsHeader} role="tablist" aria-label="Раздел">
          {tabs.map((tab) => {
            const isActive = tab === currentTab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn(styles.chip, isActive && styles.chipActive)}
                onClick={() => onTabChange?.(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      ) : title ? (
        <div className={styles.header}>
          <h2 className={styles.titleGrid}>{title}</h2>
        </div>
      ) : null}
      <div className={styles.grid}>
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleFavorite={onToggleFavorite}
            variant="normal"
            hideFavoriteButton={hideFavoriteButton}
          />
        ))}
      </div>
    </section>
  );
}
