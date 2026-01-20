'use client'
import React from 'react'
import { Star } from 'lucide-react'
import styles from './ReviewsRatingSummary.module.css'

/**
 * Компонент сводки рейтинга с распределением по звездам
 */
export default function ReviewsRatingSummary({
  averageRating,
  totalReviews,
  ratingStats,
  productImages = [],
}) {
  const renderSmallStars = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <Star
        key={index}
        className={styles.starSm}
      />
    ))
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {/* Левая часть - Общий рейтинг */}
        <div className={styles.left}>
          <div className={styles.avgRow}>
            <span className={styles.avg}>
              {averageRating.toFixed(1)}
            </span>
            <Star className={styles.starLg} />
          </div>
          <span className={styles.total}>
            {totalReviews} {totalReviews === 1 ? 'отзыв' : totalReviews < 5 ? 'отзыва' : 'отзывов'}
          </span>
        </div>

        {/* Центральная часть - Распределение рейтингов */}
        <div className={styles.stats}>
          {ratingStats.map((stat) => (
            <div key={stat.stars} className={styles.statRow}>
              <div className={styles.smallStars}>
                {renderSmallStars(stat.stars)}
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Правая часть - Изображения товаров */}
        {productImages.length > 0 && (
          <div className={styles.images}>
            {productImages.slice(0, 2).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Товар ${index + 1}`}
                className={styles.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}





