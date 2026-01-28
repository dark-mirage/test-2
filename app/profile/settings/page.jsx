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
    });
    return () => cancelAnimationFrame(frame);
  }, [recipient, recipientSheetOpen]);

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
    setRecipient({
      fio: String(recipientDraft.fio || "").trim(),
      phone: String(recipientDraft.phone || "").trim(),
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
                className={styles.input}
                value={recipientDraft.fio}
                onChange={(e) =>
                  setRecipientDraft((prev) => ({
                    ...prev,
                    fio: e.target.value,
                  }))
                }
                placeholder="ФИО"
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Телефон</span>
              <input
                className={styles.input}
                value={recipientDraft.phone}
                onChange={(e) =>
                  setRecipientDraft((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="Телефон"
                inputMode="tel"
                autoComplete="tel"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Электронная почта</span>
              <input
                className={styles.input}
                value={recipientDraft.email}
                onChange={(e) =>
                  setRecipientDraft((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Электронная почта"
                inputMode="email"
                autoComplete="email"
              />
            </label>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
