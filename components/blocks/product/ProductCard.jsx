"use client";
import { cn } from "@/lib/format/cn";
import { useRouter } from "next/navigation";

import styles from "./ProductCard.module.css";
import cx from "clsx";

export default function ProductCard({
  product,
  onToggleFavorite,
  variant = "normal",
  hideFavoriteButton = false,
  showStars = false,
  starsInteractive = false,
  onRatingChange,
  onStarSelect,
}) {
  const isCompact = variant === "compact";
  const router = useRouter();
  const openProduct = () => {
    if (!product?.id) return;
    router.push(`/product/${product.id}`);
  };

  const installmentText = (() => {
    if (!product) return "";
    if (typeof product.installment === "string" && product.installment.trim()) {
      return product.installment.trim();
    }

    const raw = String(product.price || "");
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    const total = Number(digits);
    if (!Number.isFinite(total) || total <= 0) return "";
    const per = Math.ceil(total / 4);
    const formatted = per.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `4 × ${formatted} ₽ в сплит`;
  })();

  const deliveryLabel =
    (typeof product?.deliveryDate === "string" &&
      product.deliveryDate.trim()) ||
    (typeof product?.deliveryText === "string" &&
      product.deliveryText.trim()) ||
    "Доставка";

  const currentRating = (() => {
    const n = Number(product?.rating ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5, Math.trunc(n)));
  })();

  return (
    <div
      className={cn(styles.root, isCompact ? styles.compact : styles.normal)}
      onClick={openProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProduct();
        }
      }}
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

        {showStars && !isCompact ? (
          <div className={styles.starsRow} aria-label="Оценка" role="group">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              const isActive = value <= currentRating;

              if (!starsInteractive) {
                return (
                  <img
                    key={i}
                    src="/icons/product/Star.svg"
                    alt=""
                    className={isActive ? styles.starActive : styles.star}
                    loading="lazy"
                    aria-hidden="true"
                  />
                );
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={styles.starBtn}
                  aria-label={`Оценить на ${value}`}
                  aria-pressed={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRatingChange?.(product?.id, value);
                    onStarSelect?.(product?.id, value);
                  }}
                >
                  <img
                    src="/icons/product/Star.svg"
                    alt=""
                    className={isActive ? styles.starActive : styles.star}
                    loading="lazy"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        {!hideFavoriteButton ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
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
        {installmentText ? (
          <div className={styles.installment}>{installmentText}</div>
        ) : null}
        <div className={styles.name}>{product.name}</div>
      </div>

      {/* Кнопка доставки */}
      <button type="button" className={styles.deliveryBtn}>
        <span className={styles.deliveryText}>{deliveryLabel}</span>
      </button>
    </div>
  );
}
