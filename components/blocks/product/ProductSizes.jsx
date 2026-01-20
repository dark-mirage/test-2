'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import styles from './ProductSizes.module.css';
import cx from 'clsx';

export default function ProductSizes({ 
  sizes, 
  availableSizes = [], 
  onSizeSelect 
}) {
  const [selectedSize, setSelectedSize] = useState(null)

  const handleSizeClick = (size) => {
    const isAvailable = availableSizes.length === 0 || availableSizes.includes(size)
    if (isAvailable) {
      setSelectedSize(size)
      onSizeSelect?.(size)
    }
  }

  const isSizeAvailable = (size) => {
    return availableSizes.length === 0 || availableSizes.includes(size)
  }

  return (
    <div className={styles.c1}>
      <div className={cx(styles.c2, styles.tw1)}>
        {/* Заголовок */}
        <div className={cx(styles.c3, styles.tw2)}>
          <h3 className={styles.c4} style={{ fontFamily: 'Inter' }}>
            Размер EU
          </h3>
        </div>
        
        {/* Кнопки размеров */}
        <div className={cx(styles.c5, styles.tw3)}>
          {sizes.map((size) => {
            const isAvailable = isSizeAvailable(size)
            const isSelected = selectedSize === size

            return (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                disabled={!isAvailable}
                className={cx(
                  styles.sizeButton,
                  !isAvailable
                    ? styles.sizeDisabled
                    : isSelected
                    ? styles.sizeSelected
                    : styles.sizeDefault
                )}
                style={{ fontFamily: 'Inter' }}
              >
                {size}
              </button>
            )
          })}
        </div>
        
        {/* Кнопка таблицы размеров */}
        <button
          className={cx(styles.c6, styles.tw4)}
          style={{ fontFamily: 'Inter' }}
        >
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
  )
}
