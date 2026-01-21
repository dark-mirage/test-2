"use client";

import { useMemo, useState } from "react";

import BottomSheet from "@/components/ui/BottomSheet";

import styles from "./PriceSheet.module.css";

function toDigits(value) {
  return String(value || "").replace(/[^0-9]/g, "");
}

function digitsToNumber(value) {
  const n = Number(toDigits(value));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("ru-RU");
}

function formatRublesFromDigits(digits) {
  const n = Number(digits);
  if (!digits || !Number.isFinite(n)) return "";
  return `${formatNumber(n)} ₽`;
}

export default function PriceSheet({
  open,
  onClose,
  title = "Цена",
  value,
  minPlaceholder,
  maxPlaceholder,
  onApply,
}) {
  const initial = useMemo(() => {
    const min = value?.min ?? null;
    const max = value?.max ?? null;
    return {
      minDigits: min ? String(min) : "",
      maxDigits: max ? String(max) : "",
      min,
      max,
    };
  }, [value?.max, value?.min]);

  return (
    <PriceSheetInner
      key={open ? "open" : "closed"}
      open={open}
      onClose={onClose}
      title={title}
      initial={initial}
      minPlaceholder={minPlaceholder}
      maxPlaceholder={maxPlaceholder}
      onApply={onApply}
    />
  );
}

function PriceSheetInner({
  open,
  onClose,
  title,
  initial,
  minPlaceholder,
  maxPlaceholder,
  onApply,
}) {
  const [minDigits, setMinDigits] = useState(initial.minDigits);
  const [maxDigits, setMaxDigits] = useState(initial.maxDigits);

  const draftMin = useMemo(() => digitsToNumber(minDigits), [minDigits]);
  const draftMax = useMemo(() => digitsToNumber(maxDigits), [maxDigits]);

  const changed = useMemo(() => {
    const aMin = initial.min ?? null;
    const aMax = initial.max ?? null;
    return aMin !== draftMin || aMax !== draftMax;
  }, [draftMax, draftMin, initial.max, initial.min]);

  const apply = () => {
    if (!changed) {
      onClose?.();
      return;
    }

    let nextMin = draftMin;
    let nextMax = draftMax;

    if (nextMin != null && nextMax != null && nextMin > nextMax) {
      const t = nextMin;
      nextMin = nextMax;
      nextMax = t;
    }

    onApply?.({ min: nextMin, max: nextMax });
    onClose?.();
  };

  const minLabel = useMemo(() => {
    const p =
      minPlaceholder != null ? `От ${formatNumber(minPlaceholder)} ₽` : "От";
    return p;
  }, [minPlaceholder]);

  const maxLabel = useMemo(() => {
    const p =
      maxPlaceholder != null ? `До ${formatNumber(maxPlaceholder)} ₽` : "До";
    return p;
  }, [maxPlaceholder]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      footer={
        changed ? (
          <div className={styles.footerRow}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Отменить
            </button>
            <button type="button" className={styles.applyBtn} onClick={apply}>
              Применить
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.cancelBtnFull}
            onClick={onClose}
          >
            Отмена
          </button>
        )
      }
    >
      <div className={styles.wrap}>
        <div className={styles.row}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>{minLabel}</div>
            <div className={styles.fieldRow}>
              <input
                className={styles.input}
                value={formatRublesFromDigits(minDigits)}
                onChange={(e) => setMinDigits(toDigits(e.target.value))}
                inputMode="numeric"
                enterKeyHint="done"
                aria-label={minLabel}
                maxLength={9}
              />
              {minDigits ? (
                <button
                  type="button"
                  className={styles.clearBtn}
                  aria-label="Очистить"
                  onClick={() => setMinDigits("")}
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>{maxLabel}</div>
            <div className={styles.fieldRow}>
              <input
                className={styles.input}
                value={formatRublesFromDigits(maxDigits)}
                onChange={(e) => setMaxDigits(toDigits(e.target.value))}
                inputMode="numeric"
                enterKeyHint="done"
                maxLength={9}
                aria-label={maxLabel}
              />
              {maxDigits ? (
                <button
                  type="button"
                  className={styles.clearBtn}
                  aria-label="Очистить"
                  onClick={() => setMaxDigits("")}
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
