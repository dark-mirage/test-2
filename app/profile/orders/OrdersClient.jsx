"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

function formatRub(amount) {
  try {
    return new Intl.NumberFormat("ru-RU").format(amount) + "₽";
  } catch {
    return String(amount) + "₽";
  }
}

function pluralizeRu(n, one, few, many) {
  const x = Math.abs(Number(n)) % 100;
  const x1 = x % 10;
  if (x > 10 && x < 20) return many;
  if (x1 > 1 && x1 < 5) return few;
  if (x1 === 1) return one;
  return many;
}

function StatusHeader({ title, progress, orderNumber }) {
  return (
    <div className={styles.statusRow}>
      <div className={styles.statusLeft}>
        <div className={styles.statusTitle}>
          {title}
          <img
            src="/icons/global/small-arrow.svg"
            alt=""
            className={styles.chevron}
          />
        </div>
        {progress ? (
          <div className={styles.statusProgress}>{progress}</div>
        ) : null}
      </div>
      <div className={styles.orderNumber}>{orderNumber}</div>
    </div>
  );
}

function ProductThumb({ src, muted = false }) {
  return (
    <div className={styles.thumbWrap}>
      <img
        src={src}
        alt=""
        className={muted ? styles.thumbMuted : styles.thumb}
        loading="lazy"
      />
    </div>
  );
}

function StarsRow() {
  return (
    <div className={styles.stars} aria-label="Оценка заказа">
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src="/icons/product/Star.svg"
          alt=""
          className={styles.star}
        />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const thumbs = (order.items ?? []).slice(0, 5);

  return (
    <section className={styles.card}>
      <StatusHeader
        title={order.statusTitle}
        progress={order.progress}
        orderNumber={order.orderNumber}
      />

      {order.subtitle ? (
        <div className={styles.subtitle}>{order.subtitle}</div>
      ) : null}

      <div className={styles.thumbsRow}>
        {thumbs.map((x, idx) => (
          <ProductThumb
            key={`${order.id}_${idx}`}
            src={x.src}
            muted={Boolean(x.muted)}
          />
        ))}
      </div>

      <div className={styles.metaRow}>
        <div className={styles.metaText}>
          {order.itemsCount}{" "}
          {pluralizeRu(order.itemsCount, "товар", "товара", "товаров")}
          <span className={styles.dot}>·</span>
          {formatRub(order.totalRub)}
        </div>
      </div>

      {order.showRating ? <StarsRow /> : null}
    </section>
  );
}

export default function OrdersClient() {
  useEffect(() => {
    // Telegram iOS/Android webview ko'pincha header title'ni `document.title`dan oladi.
    document.title = "Заказы";
  }, []);

  const orders = useMemo(
    () => [
      {
        id: "o1",
        statusTitle: "Оформлен",
        progress: "2 из 2",
        orderNumber: "Заказ №42974781892",
        itemsCount: 2,
        totalRub: 3720,
        items: [
          { src: "/products/t-shirt-1.png" },
          { src: "/products/t-shirt-2.png" },
        ],
      },
      {
        id: "o2",
        statusTitle: "В пути",
        progress: "4 из 5",
        orderNumber: "Заказ №42974781892",
        itemsCount: 5,
        totalRub: 3720,
        items: [
          { src: "/products/t-shirt-1.png" },
          { src: "/products/t-shirt-2.png" },
          { src: "/products/shoes-1.png" },
          { src: "/products/shoes-2.png" },
          { src: "/products/t-shirt-1.png", muted: true },
        ],
      },
      {
        id: "o3",
        statusTitle: "В пути",
        orderNumber: "Заказ №42974781894",
        subtitle: "Отказ в выпуске посылки по причине отсутствия корректных...",
        itemsCount: 1,
        totalRub: 1715,
        items: [{ src: "/products/shoes-2.png" }],
      },
      {
        id: "o4",
        statusTitle: "В пункте выдачи",
        progress: "4 из 5",
        orderNumber: "Заказ №42974781890",
        itemsCount: 2,
        totalRub: 13720,
        items: [
          { src: "/products/t-shirt-1.png" },
          { src: "/products/t-shirt-2.png" },
          { src: "/products/shoes-1.png" },
          { src: "/products/shoes-2.png", muted: true },
          { src: "/products/t-shirt-1.png" },
        ],
      },
      {
        id: "o5",
        statusTitle: "Отменён",
        orderNumber: "Заказ №42974781893",
        subtitle: "Нет в продаже",
        itemsCount: 2,
        totalRub: 1715,
        items: [
          { src: "/products/shoes-2.png" },
          { src: "/products/shoes-2.png" },
        ],
      },
      {
        id: "o6",
        statusTitle: "Отменён",
        progress: "2 из 2",
        orderNumber: "Заказ №42974781893",
        itemsCount: 2,
        totalRub: 1715,
        items: [
          { src: "/products/shoes-2.png" },
          { src: "/products/shoes-2.png" },
        ],
      },
      {
        id: "o7",
        statusTitle: "Получен",
        progress: "1 из 2",
        orderNumber: "Заказ №42974781891",
        itemsCount: 2,
        totalRub: 13720,
        items: [
          { src: "/products/t-shirt-1.png" },
          { src: "/products/t-shirt-1.png", muted: true },
        ],
        showRating: true,
      },
    ],
    [],
  );

  return (
    <div className={`tg-viewport ${styles.page}`}>
      <h3 className={styles.ordersClientstitle}>Заказы</h3>
      <main className={styles.main}>
        <Link href="/profile/purchased" className={styles.topLink}>
          <span className={styles.topLinkLeft}>
            <img
              src="/icons/profile/bag-icon.svg"
              alt=""
              className={styles.topLinkIcon}
            />
            <span className={styles.topLinkText}>Купленные товары</span>
          </span>
          <img
            src="/icons/global/small-arrow.svg"
            alt=""
            className={styles.topLinkChevron}
          />
        </Link>

        <div className={styles.list}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
