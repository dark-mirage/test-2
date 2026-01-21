"use client";
import { useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Layout";
import PointsHistory from "@/components/blocks/promo/promo-points";
import PromoInfoModal from "@/components/blocks/promo/PromoInfoModal";
import { cn } from "@/lib/format/cn";

import styles from "./page.module.css";

export default function PromoPage() {
  // В реальном проекте здесь данные будут приходить с API
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <main className={cn("tg-viewport", styles.page)}>
      <Container className={styles.container}>
        <section className={styles.hero}>
          <h3 className={styles.title}>Баллы</h3>
          <div className={styles.heroInner}>
            <div className={styles.summaryRow}>
              <div className={styles.summaryItem}>
                <span className={styles.value}>600</span>
                <span className={styles.label}>Баллов</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.value}>200</span>
                <span className={styles.label}>подарочных баллов</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className={styles.infoBtn}
            >
              <div>
                <h3 className={styles.infoTitle}>1 балл = 1 ₽</h3>
                <span className={styles.infoSubtitle}>Как это работает?</span>
              </div>
              <img
                src="/icons/global/arrow.svg"
                alt="arrow"
                className={styles.arrow}
              />
            </button>
          </div>
        </section>

        <section className={styles.tableSection}>
          <article className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Уровень</th>
                  <th className={styles.th}>Заказов</th>
                  <th className={styles.th}>Оплата</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>Стартовый</td>
                  <td className={`${styles.td} ${styles.muted}`}>0-3</td>
                  <td className={`${styles.td} ${styles.muted}`}>до 10%</td>
                </tr>
                <tr>
                  <td className={styles.td}>Продвинутый</td>
                  <td className={`${styles.td} ${styles.muted}`}>3-6</td>
                  <td className={`${styles.td} ${styles.muted}`}>до 15%</td>
                </tr>
                <tr>
                  <td className={styles.td}>Премиум</td>
                  <td className={`${styles.td} ${styles.muted}`}>от 6</td>
                  <td className={`${styles.td} ${styles.muted}`}>до 20%</td>
                </tr>
              </tbody>
            </table>
          </article>
        </section>

        <PointsHistory />
        <PromoInfoModal
          open={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />
      </Container>

      <Footer />
    </main>
  );
}
