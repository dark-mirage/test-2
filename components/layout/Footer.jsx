"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/format/cn";
import styles from "./Footer.module.css";

const CART_STORAGE_KEY = "loyaltymarket_cart_v1";
const CART_UPDATED_EVENT = "loyaltymarket_cart_updated";

function getCartTotalQuantityFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce((sum, entry) => {
      const x = typeof entry === "object" && entry !== null ? entry : {};
      const q = typeof x.quantity === "number" ? x.quantity : 0;
      return sum + Math.max(0, q);
    }, 0);
  } catch {
    return 0;
  }
}

export default function Footer() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCartCount(getCartTotalQuantityFromStorage());
    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener(CART_UPDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CART_UPDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const badgeText = cartCount > 99 ? "99+" : String(cartCount);
  const activeTab =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/poizon")
        ? "poizon"
        : pathname.startsWith("/catalog")
          ? "catalog"
          : pathname.startsWith("/favorites")
            ? "heart"
            : pathname.startsWith("/trash")
              ? "trash"
              : pathname.startsWith("/profile")
                ? "user"
                : "";

  // Базовый путь к иконкам — поправьте здесь, если иконки лежат не в public/icons/footer
  const ICONS_PATH = "/icons/footer";
  const HomeIcon = "/icons/footer/home.svg";

  const iconClass = (isActive) =>
    cn(styles.icon, isActive ? styles.iconActive : styles.iconMuted);

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <Link href="/">
          <button className={cn(styles.btn, styles.spacer40)}>
            <img
              src={HomeIcon}
              alt="home"
              width={24}
              height={24}
              className={iconClass(activeTab === "home")}
            />
          </button>
        </Link>

        <Link href="/poizon">
          <button className={cn(styles.btn, styles.spacer45)}>
            <img
              src={`${ICONS_PATH}/Poizon.svg`}
              alt="Poizon"
              width={16}
              height={24}
              className={iconClass(activeTab === "poizon")}
            />
          </button>
        </Link>

        <Link href="/catalog">
          <button className={cn(styles.btn, styles.spacer44)}>
            <img
              src={`${ICONS_PATH}/Search.svg`}
              alt="catalog"
              width={32}
              height={18}
              className={iconClass(activeTab === "catalog")}
            />
          </button>
        </Link>

        <Link href="/favorites">
          <button className={cn(styles.btn, styles.spacer48)}>
            <img
              src={`${ICONS_PATH}/Heart.svg`}
              alt="heart"
              width={20}
              height={20}
              className={iconClass(activeTab === "heart")}
            />
          </button>
        </Link>

        <Link href="/trash">
          <button className={cn(styles.btn, styles.spacer47)}>
            <span className={styles.badgeWrap}>
              <img
                src={`${ICONS_PATH}/Trach.svg`}
                alt="trach"
                width={20}
                height={24}
                className={iconClass(activeTab === "trash")}
              />
              {cartCount > 0 ? (
                <span className={styles.badge}>{badgeText}</span>
              ) : null}
            </span>
          </button>
        </Link>

        <Link href="/profile">
          <button className={styles.btn}>
            <img
              src={`${ICONS_PATH}/User.svg`}
              alt="user"
              width={20}
              height={24}
              className={iconClass(activeTab === "user")}
            />
          </button>
        </Link>
      </div>
    </div>
  );
}
