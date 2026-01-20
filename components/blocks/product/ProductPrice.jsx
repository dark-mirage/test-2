'use client'
import React from 'react'
import Image from 'next/image'
import styles from './ProductPrice.module.css';
import cx from 'clsx';

export default function ProductPrice({
  price,
  splitPayment,
  deliveryInfo
}) {
  return (
    <div className={styles.c1}>
      <div className={styles.c2}>
        {/* Цена */}
        <div className={styles.c3}>
          <h2 className={styles.c4} style={{ fontFamily: 'Inter' }}>
            {price}
          </h2>
          {deliveryInfo && (
            <div className={cx(styles.c5, styles.tw1)}>
              <p className={styles.c6} style={{ fontFamily: 'Inter' }}>
                {deliveryInfo}
              </p>
              <div className={cx(styles.c7, styles.tw2)}>
                <Image
                  src="/icons/global/logo-icon.svg"
                  alt=""
                  width={13.45}
                  height={13.45}
                  className={styles.c8}
                />
              </div>
            </div>
          )}
        </div>

        {/* Рассрочка / Оплата частями */}
        {splitPayment && (
          <div className={styles.c9}>
            <div>
              <div className={cx(styles.c10, styles.tw3)}>
                <span className={styles.c11} style={{ fontFamily: 'Inter' }}>
                  {splitPayment.count}
                </span>
                <span className={styles.c12} style={{ fontFamily: 'Inter' }}>
                  {splitPayment.amount}₽ в сплит
                </span>
              </div>
              <p className={styles.c13} style={{ fontFamily: 'Inter' }}>
                {splitPayment.text || 'без переплаты'}
              </p>
            </div>
            <div className={cx(styles.c14, styles.tw4)}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.88 4.06L11.25 4.06L11.25 10.94L1.88 10.94L1.88 4.06Z" stroke="black" strokeWidth="1.25"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

