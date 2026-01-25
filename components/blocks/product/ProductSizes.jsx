"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./ProductSizes.module.css";
import cx from "clsx";

export default function ProductSizes({
  sizes,
  availableSizes = [],
  onSizeSelect,
  theme = "light",
  hideTitle = false,
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const isDark = theme === "dark";

  const handleSizeClick = (size) => {
    const isAvailable =
      availableSizes.length === 0 || availableSizes.includes(size);
    if (isAvailable) {
      setSelectedSize(size);
      onSizeSelect?.(size);
    }
  };

  const isSizeAvailable = (size) => {
    return availableSizes.length === 0 || availableSizes.includes(size);
  };

  return (
    <div className={cx(styles.c1, isDark && styles.dark)}>
      <div className={cx(styles.c2, styles.tw1)}>
        <div className={cx(styles.c3, styles.tw2)}>
          <h3 className={styles.c4}>Размер - EU</h3>
        </div>

        <div
          className={cx(styles.c5, styles.tw3, isDark && styles.sizesRowDark)}
        >
          {sizes.map((size) => {
            const isAvailable = isSizeAvailable(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                disabled={!isAvailable}
                className={cx(
                  styles.sizeButton,
                  isDark && styles.sizeButtonDark,
                  !isAvailable
                    ? styles.sizeDisabled
                    : isSelected
                      ? styles.sizeSelected
                      : styles.sizeDefault,
                )}
                style={{ fontFamily: "Inter" }}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Кнопка таблицы размеров */}
        <button className={styles.c6}>
          <span>Таблица размеров</span>

          <Image
            src="/icons/global/Wrap.svg"
            alt=""
            width={3.38}
            height={5.91}
            className={cx(styles.c7, styles.tw5)}
          />
        </button>
      </div>
    </div>
  );
}
