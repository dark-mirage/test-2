"use client";
import React from "react";
import Image from "next/image";
import styles from "./ProductPrice.module.css";

export default function ProductPrice({ price, splitPayment, deliveryInfo }) {
  const splitAmount = splitPayment?.amount ?? "";
  const splitAmountText = String(splitAmount).includes("₽")
    ? String(splitAmount)
    : `${splitAmount}₽`;

  return (
    <div className={styles.c1}>
      <div className={styles.c2}>
        {/* Цена */}
        <div className={styles.c3}>
          <h2 className={styles.c4}>{price}</h2>
          {deliveryInfo && (
            <div className={styles.c5}>
              <p className={styles.c6}>{deliveryInfo}</p>
              <span
                className={styles.infoIcon}
                data-tooltip={deliveryInfo}
                tabIndex={0}
                aria-label="Информация о доставке"
              >
                i
              </span>
            </div>
          )}
        </div>

        {/* Рассрочка / Оплата частями */}
        {splitPayment && (
          <div className={styles.splitRow}>
            <div className={styles.splitLeft}>
              <span className={styles.splitIcon} aria-hidden="true">
                <Image src="/icons/global/split.svg" alt="" fill />
              </span>
              <div className={styles.splitText}>
                <div className={styles.splitTop}>
                  <span className={styles.splitTopText}>
                    {splitPayment.count}×{splitAmountText} в сплит
                  </span>
                </div>
                <p className={styles.splitSub}>
                  {splitPayment.text || "Без переплаты"}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles.splitAction}
              aria-label="Настройки"
            >
              <Image
                src="/icons/product/constructor-icon.svg"
                alt=""
                width={18}
                height={18}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
