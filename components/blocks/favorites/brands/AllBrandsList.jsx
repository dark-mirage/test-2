'use client'
import React from 'react';
import styles from './AllBrandsList.module.css';
import cx from 'clsx';

export default function AllBrandsList({ brands, onToggleFavorite }) {
  return (
    <ul className={cx(styles.c1, styles.tw1)}>
      {brands.map((brand) => (
        <li key={brand.id} className={cx(styles.c2, styles.tw2)}>
          {/* Левая часть: изображение и текст */}
          <div className={cx(styles.c3, styles.tw3)}>
            {/* Изображение бренда */}
            {brand.image && (
              <div className={cx(styles.c4, styles.tw4)}>
                <img
                  src={brand.image} 
                  alt={brand.name}
                  className={styles.c5}
                />
              </div>
            )}

            {/* Текст бренда */}
            <div className={cx(styles.c6, styles.tw5)}>
              <span className={styles.c7}>
                {brand.name}
              </span>
              <span className={styles.c8}>
                Бренд
              </span>
            </div>
          </div>

          {/* Кнопка избранного */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(brand.id)}
              className={cx(styles.c9, styles.tw6)}
              aria-pressed={brand.isFavorite}
            >
              <img
                src={brand.isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
                alt={brand.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                className={styles.c10}
              />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

