'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ProductInfo.module.css';
import cx from 'clsx';

export default function ProductInfo({
  productName,
  brand,
  brandLink,
  images = [],
  currentImageIndex = 0,
  onImageChange
}) {
  return (
    <div className={styles.c1}>
      {/* Название товара */}
      <h1 className={styles.c2} style={{ fontFamily: 'Inter' }}>
        {productName}
      </h1>
      
      {/* Бренд */}
      {brandLink ? (
        <Link 
          href={brandLink}
          className={styles.c3}
          style={{ fontFamily: 'Inter' }}
        >
          {brand}
        </Link>
      ) : (
        <p className={styles.c4} style={{ fontFamily: 'Inter' }}>
          {brand}
        </p>
      )}

      {images.length > 1 && (
        <div className={cx(styles.c5, "scrollbar-hide")}>
          <div className={cx(styles.c6, styles.tw1)}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageChange?.(index)}
                className={cx(
                  styles.thumbButton,
                  index === currentImageIndex
                    ? styles.thumbActive
                    : styles.thumbInactive
                )}
                style={{ width: '80px', height: '80px' }}
              >
                <Image
                  src={image}
                  alt={`Миниатюра ${index + 1}`}
                  fill
                  className={styles.c7}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
