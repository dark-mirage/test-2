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
}) {
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
      {title ? (
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
