'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import styles from './ReviewsHeader.module.css'

/**
 * Компонент заголовка страницы отзывов
 */
export default function ReviewsHeader({ brandName, onBack }) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>
        Отзывы на {brandName}
      </h1>
      {onBack ? (
        <button
          onClick={onBack}
          className={styles.back}
          aria-label="Назад"
        >
          <ChevronRight size={20} />
        </button>
      ) : (
        <Link
          href="/"
          className={styles.back}
          aria-label="Назад"
        >
          <ChevronRight size={20} />
        </Link>
      )}
    </div>
  )
}





