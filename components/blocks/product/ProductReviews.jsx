'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ProductReviews.module.css';
import cx from 'clsx';

export default function ProductReviews({
  brandName,
  reviews,
  ratingDistribution,
  onViewAll
}) {
  // Расчет общего рейтинга и количества отзывов
  const { averageRating, totalReviews } = useMemo(() => {
    const { 5: r5 = 0, 4: r4 = 0, 3: r3 = 0, 2: r2 = 0, 1: r1 = 0 } = ratingDistribution
    const total = r5 + r4 + r3 + r2 + r1
    const sum = r5 * 5 + r4 * 4 + r3 * 3 + r2 * 2 + r1 * 1
    const average = total > 0 ? sum / total : 0
    return {
      averageRating: Math.round(average * 10) / 10,
      totalReviews: total
    }
  }, [ratingDistribution])

  // Рендер звезд
  const renderStars = (rating) => {
    return (
      <div className={cx(styles.c1, styles.tw1)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cx(styles.c2, styles.tw2)}
            viewBox="0 0 14 14"
            fill={star <= rating ? '#2D2D2D' : 'none'}
            stroke="#2D2D2D"
            strokeWidth={star <= rating ? 0 : 1}
          >
            <path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" />
          </svg>
        ))}
      </div>
    )
  }

  // Рендер гистограммы рейтинга (вертикальная стопка горизонтальных баров)
  const renderRatingBars = () => {
    const { 5: r5 = 0, 4: r4 = 0, 3: r3 = 0, 2: r2 = 0, 1: r1 = 0 } = ratingDistribution
    const maxCount = Math.max(r5, r4, r3, r2, r1)
    
    const bars = [
      { stars: 5, count: r5 },
      { stars: 4, count: r4 },
      { stars: 3, count: r3 },
      { stars: 2, count: r2 },
      { stars: 1, count: r1 },
    ]

    return (
      <div className={cx(styles.c3, styles.tw3)} style={{ width: '45px', height: '48.61px' }}>
        {bars.map((bar, index) => {
          const width = maxCount > 0 ? (bar.count / maxCount) * 100 : 0
          
          return (
            <div key={index} className={styles.c4} style={{ height: '8.61px', width: '100%' }}>
              {/* Полоса заполнения */}
              <div
                className={cx(styles.c5, styles.tw4)}
                style={{
                  width: `${width}%`,
                  height: '100%',
                  backgroundColor: '#2D2D2D',
                  zIndex: 1,
                }}
              />
              {/* Фон полосы (серый) */}
              <div
                className={cx(styles.c6, styles.tw5)}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#E5E5E5',
                  zIndex: 0,
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.c7}>
      <div className={styles.c8}>
        {/* Заголовок */}
        <div className={styles.c9}>
          <h2 className={styles.c10} style={{ fontFamily: 'Inter' }}>
            Отзывы на {brandName}
          </h2>
          <Link href={`/reviews/${brandName.toLowerCase()}`} onClick={onViewAll}>
            <Image
              src="/icons/global/Wrap.svg"
              alt="Все отзывы"
              width={5.29}
              height={9.25}
              className={cx(styles.c11, styles.tw6)}
            />
          </Link>
        </div>

        {/* Общий рейтинг и гистограмма */}
        <div className={cx(styles.c12, styles.tw7)}>
          {/* Левый блок - Рейтинг */}
          <div className={styles.c13}>
            <div className={cx(styles.c14, styles.tw8)}>
              <span className={styles.c15} style={{ fontFamily: 'Inter' }}>
                {averageRating}
              </span>
              <svg
                className={cx(styles.c16, styles.tw9)}
                viewBox="0 0 14 14"
                fill="#2D2D2D"
              >
                <path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" />
              </svg>
            </div>
            <span className={styles.c17} style={{ fontFamily: 'Inter' }}>
              {totalReviews} {totalReviews === 1 ? 'отзыв' : totalReviews < 5 ? 'отзыва' : 'отзывов'}
            </span>
          </div>

          {/* Гистограмма рейтинга */}
          <div style={{ width: '45px' }}>
            {renderRatingBars()}
          </div>
        </div>

        {/* Превью отзывов - горизонтальный скролл */}
        <div className={cx(styles.c18, "scrollbar-hide")}>
          <div className={cx(styles.c19, styles.tw10)}>
            {reviews.map((review) => (
              <div
                key={review.id}
                className={styles.c20}
                style={{ width: '209px' }}
              >
                {/* Аватар, имя, дата, рейтинг */}
                <div className={cx(styles.c21, styles.tw11)}>
                  <div className={cx(styles.c22, styles.tw12)}>
                    <Image
                      src={review.avatar}
                      alt={review.userName}
                      width={32}
                      height={32}
                      className={styles.c23}
                    />
                  </div>
                  <div className={cx(styles.c24, styles.tw13)}>
                    {renderStars(review.rating)}
                    {review.productName && (
                      <p className={styles.c25} style={{ fontFamily: 'Inter' }}>
                        {review.productName}
                      </p>
                    )}
                    <div className={cx(styles.c26, styles.tw14)}>
                      <span className={styles.c27} style={{ fontFamily: 'Inter' }}>
                        {review.userName}
                      </span>
                      <div className={cx(styles.c28, styles.tw15)} />
                      <span className={styles.c29} style={{ fontFamily: 'Inter' }}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Текст отзыва */}
                <div className={cx(styles.c30, styles.spaceY10)}>
                  {/* Достоинства */}
                  <div>
                    <p className={styles.c31} style={{ fontFamily: 'Inter', letterSpacing: '-0.01em' }}>
                      <span className={styles.c32}>Достоинства:</span> {review.pros}
                    </p>
                  </div>

                  {/* Недостатки */}
                  <div>
                    <p className={styles.c33} style={{ fontFamily: 'Inter', letterSpacing: '-0.01em' }}>
                      <span className={styles.c34}>Недостатки:</span> {review.cons}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
