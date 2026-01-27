"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { mockPurchasedProducts } from "../../mockPurchasedProducts";

function clampRating(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, Math.trunc(n)));
}

export default function ReviewClient({ id }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = "Оцените товар";
  }, []);

  const product = useMemo(() => {
    const pid = Number(id);
    if (!Number.isFinite(pid)) return null;
    return mockPurchasedProducts.find((p) => p.id === pid) ?? null;
  }, [id]);

  const initialRating = clampRating(searchParams?.get("rating"));
  const [rating, setRating] = useState(initialRating);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [comment, setComment] = useState("");
  const [filesCount, setFilesCount] = useState(0);

  const canSubmit = rating > 0;

  return (
    <div className="tg-viewport">
      <main className={styles.root}>
        <h1 className={styles.title}>Оцените товар</h1>

        <section className={styles.productRow}>
          <div className={styles.thumbWrap}>
            {product?.image ? (
              <img
                src={product.image}
                alt={product?.name ?? ""}
                className={styles.thumb}
              />
            ) : (
              <div className={styles.thumbFallback} />
            )}
          </div>
          <div className={styles.productMeta}>
            <div className={styles.productName}>{product?.name ?? ""}</div>
            <div className={styles.productSub}>
              Размер: L · Артикул: 4465457
            </div>
            <div className={styles.productPrice}>{product?.price ?? ""}</div>
          </div>
        </section>

        <div className={styles.starsRow} aria-label="Оценка" role="group">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const active = value <= rating;
            return (
              <button
                key={value}
                type="button"
                className={styles.starBtn}
                aria-label={`Оценить на ${value}`}
                aria-pressed={active}
                onClick={() => setRating(value)}
              >
                <img
                  src="/icons/product/Star.svg"
                  alt=""
                  aria-hidden="true"
                  className={active ? styles.starActive : styles.star}
                />
              </button>
            );
          })}
        </div>

        <div className={styles.form}>
          <textarea
            className={styles.field}
            placeholder="Достоинства"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            rows={2}
          />
          <textarea
            className={styles.field}
            placeholder="Недостатки"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            rows={2}
          />
          <textarea
            className={styles.field}
            placeholder="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.fileInput}
            onChange={(e) => setFilesCount(e.target.files?.length ?? 0)}
          />

          <button
            type="button"
            className={styles.photoTile}
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src="/icons/product/upload.svg"
              alt=""
              aria-hidden="true"
              className={styles.photoIcon}
            />
            <div className={styles.photoLabel}>Фото</div>
            {filesCount > 0 ? (
              <div className={styles.photoCount}>Выбрано: {filesCount}</div>
            ) : null}
          </button>
        </div>

        <div className={styles.bottomBar}>
          <button
            type="button"
            className={canSubmit ? styles.submitBtn : styles.submitBtnDisabled}
            disabled={!canSubmit}
            onClick={() => {
              // TODO: send to API when backend exists
              router.back();
            }}
          >
            Отправить
          </button>
        </div>
      </main>
    </div>
  );
}
