'use client'
import React from 'react'
import styles from './ProductDelivery.module.css';
import cx from 'clsx';

export default function ProductDelivery({
  deliveryDate,
  country,
  pickupPrice
}) {
  return (
    <div className={styles.c1}>
      <div className={styles.c2}>
        <div className={cx(styles.c3, styles.tw1)}>
          {/* Иконка грузовика */}
          <div className={styles.c4}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 3H15V13H1V3Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 7H19L22 10V13H15V7Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="5" cy="17" r="2" stroke="#2D2D2D" strokeWidth="2"/>
              <circle cx="19" cy="17" r="2" stroke="#2D2D2D" strokeWidth="2"/>
            </svg>
          </div>

          {/* Информация о доставке */}
          <div className={styles.c5}>
            <h3 className={styles.c6} style={{ fontFamily: 'Inter' }}>
              ДОСТАВКА
            </h3>
            <div className={cx(styles.c7, styles.tw2)}>
              <div className={cx(styles.c8, styles.tw3)} />
              <div>
                <p className={styles.c9} style={{ fontFamily: 'Inter' }}>
                  {deliveryDate}, {country}
                </p>
                {pickupPrice && (
                  <p className={styles.c10} style={{ fontFamily: 'Inter' }}>
                    В пункт выдачи от {pickupPrice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

