'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import styles from './ProductImageGallery.module.css';
import cx from 'clsx';

export default function ProductImageGallery({
  images,
  productName,
  isFavorite = false,
  onToggleFavorite,
  currentImageIndex: externalImageIndex,
  onImageChange
}) {
  const [internalImageIndex, setInternalImageIndex] = useState(0)
  const currentImageIndex = externalImageIndex !== undefined ? externalImageIndex : internalImageIndex
  
  const setCurrentImageIndex = (index) => {
    if (onImageChange) {
      onImageChange(index)
    } else {
      setInternalImageIndex(index)
    }
  }
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)

  const minSwipeDistance = 50

  // Обработчики для тач-устройств
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // Обработчики для мыши
  const onMouseDown = (e) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const onMouseMove = () => {
    if (!isDragging || dragStart === null) return
  }

  const onMouseUp = (e) => {
    if (!isDragging || dragStart === null) return
    
    const distance = dragStart - e.clientX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }

    setIsDragging(false)
    setDragStart(null)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  return (
    <div className={styles.c1}>
      {/* Основное изображение */}
      <div 
        className={styles.c2}
        style={{ height: '395px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div 
          className={cx(styles.c3, styles.transitionTransform)}
          style={{ 
            transform: `translateX(-${currentImageIndex * 100}%)`,
            width: `${images.length * 100}%`,
            height: '100%'
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.c4}
              style={{ width: `${100 / images.length}%`, height: '100%' }}
            >
              <Image
                src={image}
                alt={`${productName} - изображение ${index + 1}`}
                fill
                className={styles.c5}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Кнопки избранного и поделиться */}
        <div className={styles.c6} style={{ right: '17px', bottom: '45px' }}>
          <div className={cx(styles.c7, styles.tw1)}>
            {/* Избранное */}
            <button
              onClick={onToggleFavorite}
              className={cx(styles.c8, styles.tw2)}
              aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <Image
                src={isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
                alt="Избранное"
                width={22}
                height={20}
                className={cx(styles.c9, styles.tw3)}
              />
            </button>
            
            {/* Поделиться */}
            <button
              className={cx(styles.c10, styles.tw4)}
              aria-label="Поделиться"
            >
              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.86L16.94 18.86" stroke="#2D2D2D" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}
