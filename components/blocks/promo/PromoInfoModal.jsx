"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import styles from "./PromoInfoModal.module.css";

/**
 * Нижнее модальное окно с описанием баллов (по макету Figma node 0-12811).
 */
export default function PromoInfoModal({ open, onClose }) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const timer = setTimeout(() => setVisible(false), 250);
    return () => clearTimeout(timer);
  }, [open]);

  if (!visible) return null;

  return createPortal(
    <div className={styles.root}>
      {/* Затемнение */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : styles.backdropClosed}`}
        onClick={onClose}
      />

      {/* Листание снизу */}
      <div
        className={`${styles.sheetWrap} ${open ? styles.sheetOpen : styles.sheetClosed}`}
      >
        <div className={styles.sheet}>
          {/* Граббер и закрытие */}
          <div className={styles.grabber} />
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className={styles.closeBtn}
          >
            <span className={styles.closeIcon}>✕</span>
          </button>

          <h3 className={styles.title}>Баллы</h3>

          <div className={styles.content}>
            <section className={styles.section}>
              <p className={styles.sectionHeader}>КАК ПОЛУЧИТЬ?</p>
              <p className={styles.muted}>
                За каждый завершённый заказ начисляется 200 баллов.
              </p>
            </section>

            <section className={styles.section}>
              <p className={styles.sectionHeader}>КАК ПОТРАТИТЬ?</p>
              <p className={styles.muted}>
                Баллами можно оплачивать часть заказа: до 10% на стартовом
                уровне, до 15% на продвинутом и до 20% на премиум.
              </p>
            </section>

            <section className={styles.section}>
              <p className={styles.sectionHeaderBig}>подарочные баллы</p>
              <div className={styles.section}>
                <p className={styles.sectionHeader}>КАК ПОЛУЧИТЬ?</p>
                <p className={styles.muted}>
                  Подарочные баллы начисляются при активации подарочной карты,
                  полученной от другого пользователя.
                </p>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionHeader}>КАК ПОТРАТИТЬ?</p>
                <p className={styles.muted}>
                  Подарочными баллами можно оплачивать до 100% стоимости заказа.
                  При их наличии они списываются первыми, пока не израсходуются
                  полностью.
                </p>
              </div>
            </section>
            <Button onClick={onClose} className={styles.button}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
