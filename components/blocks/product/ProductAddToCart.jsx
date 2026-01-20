'use client'
import React, { useState } from 'react'
import styles from './ProductAddToCart.module.css';
import cx from 'clsx';

export default function ProductAddToCart({
  onAddToCart,
  onBuyNow,
  quantity = 1,
  onQuantityChange
}) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity)

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1
      setCurrentQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleIncrease = () => {
    const newQuantity = currentQuantity + 1
    setCurrentQuantity(newQuantity)
    onQuantityChange?.(newQuantity)
  }

  return (
    <div className={cx(styles.c1, styles.tw1)}>
      <div className={cx(styles.c2, styles.tw2)}>
        {/* Счетчик количества */}
        <div className={styles.c3}>
          <button
            onClick={handleDecrease}
            disabled={currentQuantity <= 1}
            className={styles.c4}
            style={{ fontFamily: 'Inter' }}
          >
            −
          </button>
          <span className={styles.c5} style={{ fontFamily: 'Inter' }}>
            {currentQuantity}
          </span>
          <button
            onClick={handleIncrease}
            className={styles.c6}
            style={{ fontFamily: 'Inter' }}
          >
            +
          </button>
        </div>

        {/* Кнопка добавления в корзину */}
        <button
          onClick={onAddToCart}
          className={styles.c7}
        >
          <span className={styles.c8} style={{ fontFamily: 'Inter' }}>
            В корзину
          </span>
        </button>

        {/* Кнопка купить сейчас */}
        {onBuyNow && (
          <button
            onClick={onBuyNow}
            className={styles.c9}
          >
            <span className={styles.c10} style={{ fontFamily: 'Inter' }}>
              Купить сейчас
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

