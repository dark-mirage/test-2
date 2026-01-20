'use client'
import React from 'react'
import ReviewCard from './ReviewCard'
import styles from './ReviewsGrid.module.css'

/**
 * Компонент сетки отзывов (2 колонки)
 */
export default function ReviewsGrid({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          Пока нет отзывов
        </p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}





