"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/blocks/profile/ProfileHeader";
import MenuSection from "@/components/blocks/profile/ProfileMenuSection";
import styles from "./page.module.css";
import cx from "clsx";

function MenuIcon({ src, alt = "" }) {
  return <img src={src} alt={alt} className={cx(styles.c1, styles.tw1)} />;
}

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <h3 className={styles.profileTitle}>Профиль</h3>
      <main className={styles.c2}>
        <ProfileHeader avatar="/img/profileLogo.png" name="Evgeny" />
        <div className={styles.c3}>
          <MenuSection
            items={[
              {
                text: "Добавить на экран «Домой»",
                icon: <MenuIcon src="/icons/profile/home-icon.svg" />,
                href: "/add-to-home",
                fontWeight: 500,
              },
            ]}
          />
        </div>

        <div className={styles.c4}>
          <MenuSection
            items={[
              {
                text: "Заказы",
                icon: <MenuIcon src="/icons/profile/orders-icon.svg" />,
                href: "/orders",
                fontWeight: 500,
              },
              {
                text: "Купленные товары",
                icon: <MenuIcon src="/icons/profile/bag-icon.svg" />,
                href: "/profile/orders",
                fontWeight: 500,
              },
              {
                text: "Возвраты",
                icon: <MenuIcon src="/icons/profile/undo-icon.svg" />,
                href: "/returns",
                fontWeight: 500,
              },
            ]}
          />
        </div>

        {/* Секция: Баллы */}
        <div className={styles.c5}>
          <MenuSection
            items={[
              {
                text: "Баллы",
                icon: <MenuIcon src="/icons/profile/points-icon.svg" />,
                href: "/promo",
                fontWeight: 500,
              },
              {
                text: "Пригласить друзей",
                icon: <MenuIcon src="/icons/profile/addFriends.svg" />,
                href: "/invite-friends",
                fontWeight: 500,
              },
              {
                text: "Промокоды",
                icon: <MenuIcon src="/icons/profile/promo-icon.svg" />,
                href: "/promocodes",
                fontWeight: 500,
                badge: 5,
              },
            ]}
          />
        </div>

        {/* Секция: Отзывы */}
        <div className={styles.c6}>
          <MenuSection
            items={[
              {
                text: "Отзывы",
                icon: <MenuIcon src="/icons/profile/stars-icon.svg" />,
                href: "/reviews",
                fontWeight: 500,
              },
              {
                text: "Избранное",
                icon: <MenuIcon src="/icons/profile/heart-icon.svg" />,
                href: "/favorites",
                fontWeight: 500,
              },
              {
                text: "Просмотренное",
                icon: <MenuIcon src="/icons/profile/viewed-icon.svg" />,
                href: "/profile/viewed",
                fontWeight: 500,
              },
            ]}
          />
        </div>
        <div className={styles.c7}>
          <MenuSection
            items={[
              {
                text: "Настройки",
                icon: <MenuIcon src="/icons/profile/settings-icon.svg" />,
                href: "/settings",
                fontWeight: 500,
              },
              {
                text: "О сервисе",
                icon: <MenuIcon src="/icons/profile/info-icon.svg" />,
                // icon: <LogoutIcon />,
                href: "/logout",
                fontWeight: 500,
              },
              {
                text: "чат с поддержкой",
                icon: <MenuIcon src="/icons/profile/chat-icon.svg" />,
                href: "/support",
                fontWeight: 500,
              },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
