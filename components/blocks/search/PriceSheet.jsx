"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import BottomSheet from "@/components/ui/BottomSheet";

import styles from "./PriceSheet.module.css";

const MAX_DIGITS = 9;

function toDigits(value) {
  const digits = String(value || "").replace(/[^0-9]/g, "");
  return digits.slice(0, MAX_DIGITS);
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

function formatNumberFromDigits(digits) {
  const n = Number(digits);
  if (!digits || !Number.isFinite(n)) return "";
  return formatNumber(n);
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
  const [minFocused, setMinFocused] = useState(false);
  const [maxFocused, setMaxFocused] = useState(false);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    let frame = 0;
    if (open && !wasOpen) {
      frame = requestAnimationFrame(() => {
        setMinDigits(initial.minDigits);
        setMaxDigits(initial.maxDigits);
        setMinFocused(false);
        setMaxFocused(false);
      });
    }
    prevOpenRef.current = open;
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [initial.maxDigits, initial.minDigits, open]);

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
                value={
                  minFocused ? minDigits : formatNumberFromDigits(minDigits)
                }
                onChange={(e) => setMinDigits(toDigits(e.target.value))}
                onFocus={() => setMinFocused(true)}
                onBlur={() => setMinFocused(false)}
                inputMode="numeric"
                enterKeyHint="done"
                aria-label={minLabel}
              />
              <span className={styles.ruble} aria-hidden="true">
                ₽
              </span>
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
                value={
                  maxFocused ? maxDigits : formatNumberFromDigits(maxDigits)
                }
                onChange={(e) => setMaxDigits(toDigits(e.target.value))}
                onFocus={() => setMaxFocused(true)}
                onBlur={() => setMaxFocused(false)}
                inputMode="numeric"
                enterKeyHint="done"
                aria-label={maxLabel}
              />
              <span className={styles.ruble} aria-hidden="true">
                ₽
              </span>
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
