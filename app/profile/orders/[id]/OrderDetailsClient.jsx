"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";
import { getMockOrderById } from "../mockOrders";

function formatRub(amount) {
  try {
    return new Intl.NumberFormat("ru-RU").format(amount) + " ₽";
  } catch {
    return String(amount) + " ₽";
  }
}

function InfoRow({ icon, title, primary, secondary }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.infoText}>
        <div className={styles.infoTitle}>{title}</div>
        <div className={styles.infoPrimary}>{primary}</div>
        {secondary ? (
          <div className={styles.infoSecondary}>{secondary}</div>
        ) : null}
      </div>
    </div>
  );
}

function ProductRow({ item }) {
  return (
    <div className={styles.productRow}>
      <div className={styles.productThumbWrap} aria-hidden="true">
        <img
          src={item?.src}
          alt=""
          className={
            item?.muted ? styles.productThumbMuted : styles.productThumb
          }
          loading="lazy"
        />
      </div>
      <div className={styles.productMeta}>
        <div className={styles.productName}>{item?.name || "Товар"}</div>
        <div className={styles.productSub}>
          {item?.size ? `Размер: ${item.size}` : "Размер: —"}
          {item?.article ? ` · Артикул: ${item.article}` : ""}
        </div>
        {item?.priceRub ? (
          <div className={styles.productPrice}>{formatRub(item.priceRub)}</div>
        ) : null}
      </div>
    </div>
  );
}

function ActionRow({ label }) {
  return (
    <button type="button" className={styles.actionRow}>
      <span className={styles.actionLabel}>{label}</span>
      <img
        src="/icons/global/small-arrow.svg"
        alt=""
        aria-hidden="true"
        className={styles.actionChevron}
      />
    </button>
  );
}

export default function OrderDetailsClient({ id }) {
  const params = useParams();
  const resolvedId = id ?? params?.id;

  const order = useMemo(() => getMockOrderById(resolvedId), [resolvedId]);

  useEffect(() => {
    document.title = "Заказ";
  }, []);

  if (!order) {
    return (
      <div className={`tg-viewport ${styles.page}`}>
        <header className={styles.header}>
          <h3 className={styles.title}>Заказ</h3>
        </header>
        <main className={styles.main}>
          <div className={styles.emptyCard} role="status" aria-live="polite">
            Заказ не найден
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products = Array.isArray(order?.items) ? order.items : [];
  const totals = order?.totals;

  return (
    <div className={`tg-viewport ${styles.page}`}>
      <header className={styles.header}>
        <h3 className={styles.title}>{order.orderDateTitle || "Заказ"}</h3>
        {order.orderNumberShort ? (
          <div className={styles.orderNo}>{order.orderNumberShort}</div>
        ) : null}
      </header>

      <main className={styles.main}>
        <section className={styles.statusBlock}>
          <div className={styles.statusTitle}>{order.statusTitle}</div>
          {order.receivedAt ? (
            <div className={styles.statusDate}>{order.receivedAt}</div>
          ) : null}
        </section>

        <section className={styles.infoCard}>
          <InfoRow
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title={order?.pickupPoint?.title || "Пункт выдачи"}
            primary={order?.pickupPoint?.address || "—"}
            secondary={order?.pickupPoint?.meta || ""}
          />

          <div className={styles.divider} />

          <InfoRow
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 11a4 4 0 100-8 4 4 0 000 8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            title={order?.recipient?.title || "Получатель"}
            primary={order?.recipient?.name || "—"}
            secondary={order?.recipient?.meta || ""}
          />
        </section>

        <section className={styles.productsList} aria-label="Товары">
          {products.map((p, idx) => (
            <ProductRow key={p?.id ?? `${idx}`} item={p} />
          ))}
        </section>

        {totals ? (
          <section className={styles.totalsCard}>
            <div className={styles.totalRowTop}>
              <div className={styles.totalLabel}>{totals.itemsLabel}</div>
              <div className={styles.totalValue}>
                {formatRub(totals.totalRub)}
              </div>
            </div>

            <div className={styles.totalRow}>
              <div className={styles.totalLabelMuted}>Скидка</div>
              <div className={styles.totalValueMuted}>
                {formatRub(totals.discountRub)}
              </div>
            </div>

            {totals.promocode ? (
              <div className={styles.totalSubRow}>
                <div className={styles.totalSubLeft}>
                  <span className={styles.bullet}>•</span>
                  <span>Промокод {totals.promocode.code}</span>
                </div>
                <div className={styles.totalSubRight}>
                  {formatRub(totals.promocode.rub)}
                </div>
              </div>
            ) : null}

            <div className={styles.totalSubRow}>
              <div className={styles.totalSubLeft}>
                <span className={styles.bullet}>•</span>
                <span>Подарочные баллы</span>
              </div>
              <div className={styles.totalSubRight}>
                {formatRub(totals.giftPointsRub)}
              </div>
            </div>

            <div className={styles.totalRow}>
              <div className={styles.totalLabelMuted}>Доставка</div>
              <div className={styles.totalValueMuted}>
                {formatRub(totals.shippingRub)}
              </div>
            </div>

            <div className={styles.totalSubRow}>
              <div className={styles.totalSubLeft}>
                <span className={styles.bullet}>•</span>
                <span>{totals.shippingFrom}</span>
              </div>
              <div className={styles.totalSubRight}>
                {formatRub(totals.shippingRub)}
              </div>
            </div>

            <div className={styles.totalDivider} />

            <div className={styles.totalRowBottom}>
              <div className={styles.totalFinalLabel}>Итого</div>
              <div className={styles.totalFinalValue}>
                {formatRub(totals.finalRub)}
              </div>
            </div>
          </section>
        ) : null}

        <section className={styles.actionsCard}>
          <ActionRow label="Доставка и отслеживание" />
          <div className={styles.actionsDivider} />
          <ActionRow label="Условия возврата" />
        </section>

        <button type="button" className={styles.supportBtn}>
          Чат с поддержкой
        </button>
      </main>

      <Footer />
    </div>
  );
}
