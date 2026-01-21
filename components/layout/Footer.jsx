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

const ICONS_PATH = "/icons/footer";

const tabs = [
  {
    key: "home",
    href: "/",
    icon: `${ICONS_PATH}/home.svg`,
    alt: "home",
    w: 24,
    h: 24,
  },
  {
    key: "poizon",
    href: "/poizon",
    icon: `${ICONS_PATH}/Poizon.svg`,
    alt: "Poizon",
    w: 16,
    h: 24,
  },
  {
    key: "catalog",
    href: "/catalog",
    icon: `${ICONS_PATH}/Search.svg`,
    alt: "catalog",
    w: 32,
    h: 18,
  },
  {
    key: "heart",
    href: "/favorites",
    icon: `${ICONS_PATH}/Heart.svg`,
    alt: "favorites",
    w: 20,
    h: 20,
  },
  {
    key: "trash",
    href: "/trash",
    icon: `${ICONS_PATH}/Trach.svg`,
    alt: "cart",
    w: 20,
    h: 24,
    withBadge: true,
  },
  {
    key: "user",
    href: "/profile",
    icon: `${ICONS_PATH}/User.svg`,
    alt: "profile",
    w: 20,
    h: 24,
  },
];

function getActiveTab(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/poizon")) return "poizon";
  if (pathname.startsWith("/catalog")) return "catalog";
  if (pathname.startsWith("/favorites")) return "heart";
  if (pathname.startsWith("/trash")) return "trash";
  if (pathname.startsWith("/profile")) return "user";
  return "";
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

  const activeTab = getActiveTab(pathname);
  const badgeText = cartCount > 99 ? "99+" : String(cartCount);

  return (
    <nav className={styles.root} aria-label="Bottom navigation">
      <div className={styles.inner}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(styles.link, isActive && styles.linkActive)}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.iconWrap}>
                <img
                  src={tab.icon}
                  alt={tab.alt}
                  width={tab.w}
                  height={tab.h}
                  className={cn(
                    styles.icon,
                    isActive ? styles.iconActive : styles.iconMuted,
                  )}
                />

                {tab.withBadge && cartCount > 0 ? (
                  <span className={styles.badge}>{badgeText}</span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
