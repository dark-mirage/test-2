"use client";

import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";

import styles from "./page.module.css";

export default function SettingsPage() {
  const pickupPoints = useMemo(
    () => [
      {
        id: "griboedova-52-a",
        address: "Набережная канала Грибоедова, 52",
        meta: "CDEK • 7 дней хранения",
      },
      {
        id: "griboedova-52-b",
        address: "Набережная канала Грибоедова, 52",
        meta: "CDEK • 7 дней хранения",
      },
    ],
    [],
  );

  const [pickupSheetOpen, setPickupSheetOpen] = useState(false);
  const [pickupPointId, setPickupPointId] = useState(null);
  const [pickupDraftId, setPickupDraftId] = useState(null);

  const [recipientSheetOpen, setRecipientSheetOpen] = useState(false);
  const [recipient, setRecipient] = useState({ fio: "", phone: "", email: "" });
  const [recipientDraft, setRecipientDraft] = useState({
    fio: "",
    phone: "",
    email: "",
  });
  const [recipientTouched, setRecipientTouched] = useState({
    fio: false,
    phone: false,
    email: false,
  });
  const [recipientSubmitAttempted, setRecipientSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!pickupSheetOpen) return;
    const frame = requestAnimationFrame(() => {
      setPickupDraftId(pickupPointId);
    });
    return () => cancelAnimationFrame(frame);
  }, [pickupPointId, pickupSheetOpen]);

  useEffect(() => {
    if (!recipientSheetOpen) return;
    const frame = requestAnimationFrame(() => {
      setRecipientDraft({
        fio: recipient?.fio || "",
        phone: recipient?.phone || "",
        email: recipient?.email || "",
      });
      setRecipientTouched({ fio: false, phone: false, email: false });
      setRecipientSubmitAttempted(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [recipient, recipientSheetOpen]);

  const normalizePhoneDigits = (value) => String(value || "").replace(/\D/g, "");

  const formatRuPhone = (value) => {
    let digits = normalizePhoneDigits(value);

    // Support users typing: 8..., 7..., +7..., or just 9...
    if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
    if (digits.startsWith("7")) digits = digits.slice(1);

    // We want up to 10 national digits after +7
    digits = digits.slice(0, 10);

    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 8);
    const p4 = digits.slice(8, 10);

    let out = "+7";
    if (p1) out += ` ${p1}`;
    if (p2) out += ` ${p2}`;
    if (p3) out += `-${p3}`;
    if (p4) out += `-${p4}`;
    return out;
  };

  const isValidPhone = (value) => {
    const digits = normalizePhoneDigits(value);
    // Accept +7XXXXXXXXXX or 7XXXXXXXXXX or 8XXXXXXXXXX (after normalization)
    if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
      return true;
    }
    // Also accept just 10 digits (national) as user may omit +7
    if (digits.length === 10) return true;
    return false;
  };

  const isValidEmail = (value) => {
    const s = String(value || "").trim();
    if (!s) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(s);
  };

  const isValidFio = (value) => {
    const s = String(value || "").trim();
    if (!s) return true;
    // Screenshot shows Latin name as invalid; enforce Cyrillic letters.
    if (!/^[А-Яа-яЁё\-\s]+$/.test(s)) return false;
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return false;
    return parts.every((p) => p.replace(/-/g, "").length >= 2);
  };

  const recipientErrors = useMemo(() => {
    const fio = String(recipientDraft.fio || "");
    const phone = String(recipientDraft.phone || "");
    const email = String(recipientDraft.email || "");

    return {
      fio: fio.trim() && !isValidFio(fio) ? "Неверный формат" : "",
      phone:
        phone.trim() && !isValidPhone(phone)
          ? "Укажите в формате +7 XXX XXX-XX-XX"
          : "",
      email: email.trim() && !isValidEmail(email) ? "Неверный формат" : "",
    };
  }, [recipientDraft.email, recipientDraft.fio, recipientDraft.phone]);

  const showRecipientError = (key) =>
    Boolean(recipientErrors[key]) && (recipientSubmitAttempted || recipientTouched[key]);

  const selectedPickup = useMemo(() => {
    if (!pickupPointId) return null;
    return pickupPoints.find((p) => p.id === pickupPointId) || null;
  }, [pickupPointId, pickupPoints]);

  const recipientLabel = useMemo(() => {
    const fio = String(recipient?.fio || "").trim();
    if (fio) return fio;
    const phone = String(recipient?.phone || "").trim();
    if (phone) return phone;
    const email = String(recipient?.email || "").trim();
    if (email) return email;
    return "";
  }, [recipient]);

  const savePickup = () => {
    setPickupPointId(pickupDraftId || null);
    setPickupSheetOpen(false);
  };

  const saveRecipient = () => {
    setRecipientSubmitAttempted(true);

    const hasErrors = Boolean(
      recipientErrors.fio || recipientErrors.phone || recipientErrors.email,
    );
    if (hasErrors) return;

    setRecipient({
      fio: String(recipientDraft.fio || "").trim(),
      phone: formatRuPhone(recipientDraft.phone),
      email: String(recipientDraft.email || "").trim(),
    });
    setRecipientSheetOpen(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Header title="Настройки" />

        <div className={styles.profile}>
          <div className={styles.avatarWrap}>
            <img
              src="/img/profileLogo.png"
              alt="Evgeny"
              className={styles.avatar}
              loading="lazy"
            />
          </div>
          <div className={styles.name}>Evgeny</div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.cardWrapper} aria-label="Настройки">
          <div className={styles.card}>
            <button
              type="button"
              className={styles.row}
              onClick={() => {
                setPickupSheetOpen(true);
              }}
            >
              <div className={styles.rowLeft}>
                <img
                  src="/icons/global/location.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.rowIcon}
                />
                <div className={styles.rowText}>
                  <div className={styles.rowLabel}>Пункт выдачи</div>
                  <div className={styles.rowValue}>
                    {selectedPickup?.address || "Не выбран"}
                  </div>
                </div>
              </div>

              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                aria-hidden="true"
                className={styles.rowArrow}
              />
            </button>

            <div className={styles.divider} aria-hidden="true" />

            <button
              type="button"
              className={styles.row}
              onClick={() => {
                setRecipientSheetOpen(true);
              }}
            >
              <div className={styles.rowLeft}>
                <img
                  src="/icons/global/user.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.rowIcon}
                />
                <div className={styles.rowText}>
                  <div className={styles.rowLabel}>Получатель</div>
                  <div className={styles.rowValue}>
                    {recipientLabel || "Не указан"}
                  </div>
                </div>
              </div>

              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                aria-hidden="true"
                className={styles.rowArrow}
              />
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <BottomSheet
        open={pickupSheetOpen}
        onClose={() => setPickupSheetOpen(false)}
        title="Пункт выдачи"
        footer={
          <Button
            type="button"
            className={styles.sheetSaveBtn}
            onClick={savePickup}
          >
            Сохранить
          </Button>
        }
      >
        <div
          className={styles.sheetList}
          role="radiogroup"
          aria-label="Пункты выдачи"
        >
          {pickupPoints.map((p) => {
            const checked = p.id === pickupDraftId;
            return (
              <div
                key={p.id}
                role="radio"
                aria-checked={checked}
                className={styles.pickupRow}
                onClick={() => setPickupDraftId(p.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPickupDraftId(p.id);
                  }
                }}
              >
                <span
                  className={`${styles.pickupRadio} ${checked ? styles.pickupRadioChecked : ""}`}
                  aria-hidden="true"
                />

                <span className={styles.pickupText}>
                  <span className={styles.pickupAddress}>{p.address}</span>
                  <span className={styles.pickupMeta}>{p.meta}</span>
                </span>

                <button
                  type="button"
                  className={styles.pickupEditBtn}
                  aria-label="Редактировать"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: edit pickup point
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.06 4.94 17.81 8.69"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })}

          <button
            type="button"
            className={styles.pickupAddRow}
            onClick={() => {
              // TODO: add pickup point
            }}
          >
            <span className={styles.pickupAddIcon} aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className={styles.pickupAddText}>Добавить пункт выдачи</span>
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={recipientSheetOpen}
        onClose={() => setRecipientSheetOpen(false)}
        title="Получатель"
        footer={
          <Button
            type="button"
            className={styles.sheetSaveBtn}
            onClick={saveRecipient}
          >
            Сохранить
          </Button>
        }
      >
        <div className={styles.recipientSheet} aria-label="Данные получателя">
          <div className={styles.recipientHint}>
            <span className={styles.recipientHintIcon} aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 10.5v5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
              </svg>
            </span>
            <div className={styles.recipientHintText}>
              <div className={styles.recipientHintTitle}>
                Указывайте настоящие данные
              </div>
              <div className={styles.recipientHintSub}>
                При получении заказа потребуется паспорт
              </div>
            </div>
          </div>

          <div className={styles.recipientFields}>
            <label className={styles.field}>
              <span className={styles.srOnly}>ФИО</span>
              <input
                className={`${styles.input} ${showRecipientError("fio") ? styles.inputError : ""}`}
                value={recipientDraft.fio}
                onChange={(e) =>
                  setRecipientDraft((prev) => ({
                    ...prev,
                    fio: e.target.value,
                  }))
                }
                onBlur={() =>
                  setRecipientTouched((prev) => ({ ...prev, fio: true }))
                }
                placeholder="ФИО"
                autoComplete="name"
              />
              {showRecipientError("fio") ? (
                <div className={styles.errorText} role="status">
                  {recipientErrors.fio}
                </div>
              ) : null}
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Телефон</span>
              <input
                className={`${styles.input} ${showRecipientError("phone") ? styles.inputError : ""}`}
                value={recipientDraft.phone}
                onChange={(e) =>
                  setRecipientDraft((prev) => ({
                    ...prev,
                    phone: formatRuPhone(e.target.value),
                  }))
                }
                onBlur={() =>
                  setRecipientTouched((prev) => ({ ...prev, phone: true }))
                }
                placeholder="Телефон"
                inputMode="tel"
                autoComplete="tel"
              />
              {showRecipientError("phone") ? (
                <div className={styles.errorText} role="status">
                  {recipientErrors.phone}
                </div>
              ) : null}
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Электронная почта</span>
              <input
                className={`${styles.input} ${showRecipientError("email") ? styles.inputError : ""}`}
                value={recipientDraft.email}
                onChange={(e) =>
                  setRecipientDraft((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                onBlur={() =>
                  setRecipientTouched((prev) => ({ ...prev, email: true }))
                }
                placeholder="Электронная почта"
                inputMode="email"
                autoComplete="email"
              />
              {showRecipientError("email") ? (
                <div className={styles.errorText} role="status">
                  {recipientErrors.email}
                </div>
              ) : null}
            </label>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
