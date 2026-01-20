"use client";
import { cn } from "@/lib/format/cn";

import styles from "./ProductCard.module.css";
import cx from "clsx";

export default function ProductCard({
  product,
  onToggleFavorite,
  variant = "normal",
  hideFavoriteButton = false,
}) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(styles.root, isCompact ? styles.compact : styles.normal)}
    >
      <div
        className={cn(
          styles.imageWrap,
          isCompact ? styles.imageWrapCompact : styles.imageWrapNormal,
        )}
      >
        <div className={styles.center}>
          {typeof product.image === "string" &&
          /\.(png|jpe?g|svg|webp|avif)$/i.test(product.image) ? (
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />
          ) : (
            <div className={cx(styles.c1, styles.tw1)}>{product.image}</div>
          )}
        </div>
        {!hideFavoriteButton ? (
          <button
            onClick={() => onToggleFavorite(product.id)}
            type="button"
            className={styles.favoriteBtn}
            aria-pressed={product.isFavorite}
          >
            <img
              src={
                product.isFavorite
                  ? "/icons/global/active-heart.svg"
                  : "/icons/global/not-active-heart.svg"
              }
              alt={product.isFavorite ? "liked" : "not liked"}
              className={styles.favoriteIcon}
            />
          </button>
        ) : (
          <button
            onClick={() => onToggleFavorite(product.id)}
            type="button"
            className={styles.favoriteBtn}
            aria-label="Добавить в избранное"
          >
            <img
              src="/icons/global/not-active-heart.svg"
              alt="Добавить в избранное"
              className={styles.favoriteIcon}
            />
          </button>
        )}
      </div>
      {variant === "normal" && (
        <img
          className={styles.dots}
          src="/icons/product/dots-mini-slider.svg"
          alt="dots"
        />
      )}

      <div className={cn(styles.meta, isCompact && styles.metaCompact)}>
        <div className={styles.price}>{product.price}</div>
        <div className={styles.name}>{product.name}</div>
      </div>

      {/* Кнопка даты доставки */}
      {product.deliveryDate && (
        <button type="button" className={styles.deliveryBtn}>
          <span className={styles.deliveryText}>{product.deliveryDate}</span>
        </button>
      )}
    </div>
  );
}
