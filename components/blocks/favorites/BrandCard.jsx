'use client'
import React from 'react';
import styles from './BrandCard.module.css';
import cx from 'clsx';

export default function BrandCard({ 
  name, 
  image, 
  isFavorite = false, 
  onToggleFavorite 
}) {
  return (
    <div className={cx(styles.c1, styles.tw1)}>
      {/* Изображение бренда */}
      {image && (
        <div className={cx(styles.c2, styles.tw2)}>
          <img 
            src={image} 
            alt={name}
            className={styles.c3}
          />
        </div>
      )}

      {/* Текст бренда */}
      <div className={cx(styles.c4, styles.tw3)}>
        <span className={styles.c5}>
          {name}
        </span>
        <span className={styles.c6}>
          Бренд
        </span>
      </div>

      {/* Кнопка избранного */}
      <button
        onClick={onToggleFavorite}
        className={cx(styles.c7, styles.tw4)}
        aria-pressed={isFavorite}
      >
        <img
          src={isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
          alt={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          className={styles.c8}
        />
      </button>
    </div>
  );
}

