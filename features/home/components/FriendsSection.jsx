"use client";
import { useState } from "react";
import InfoCard from "./InfoCard";
import Link from "next/link";

import { cn } from "@/lib/format/cn";
import styles from "./FriendsSection.module.css";

export default function FriendsSection() {
  const cards = [
    { title: "Условия\nвозврата", icon: "/icons/global/Wrap.svg" },
    { title: "Гарантии\nи безопасность", icon: "/icons/global/security.png" },
    { title: "POIZON —\nтолько\nоригинал", icon: "/icons/footer/Poizon.svg" },
    { title: "Подарочные\nкарты", icon: "/icons/promo/box-colored.svg" },
    { title: "Чат\nс поддержкой", icon: "/icons/profile/chat-icon.svg" },
  ];

  // Avatars referenced from public/icons/home-main
  // Make sure files exist: public/icons/home-main/Ava-1.svg etc.
  const friends = [
    { id: 1, avatar: "/icons/home-main/Ava-1.svg", name: "Friend1" },
    { id: 2, avatar: "/icons/home-main/Ava-2.svg", name: "Friend2" },
    { id: 3, avatar: "/icons/home-main/Ava-3.svg", name: "Friend3" },
  ];

  const [imgErrorMap, setImgErrorMap] = useState({});
  return (
    <div className={styles.root}>
      <div className={styles.cardsOuter}>
        <div className={cn(styles.cardsRow, "scrollbar-hide")}>
          {cards.map((c) => (
            <div key={c.title} className={styles.cardItem}>
              <InfoCard title={c.title} iconSrc={c.icon} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.blocks}>
        <Link href="/invite-friends">
          <div className={styles.block}>
            <div className={styles.row}>
              <div>
                <span className={styles.title}>Зовите друзей</span>
                <span className={styles.subtitle}>Дарим скидку 10%</span>
              </div>
              <img
                className={styles.arrow}
                src="/icons/global/arrow.svg"
                alt="arrow"
              />
            </div>
            <div className={styles.avatarsRow}>
              <div className={styles.avatars}>
                {friends.map((friend) => (
                  <div key={friend.id} className={styles.avatar}>
                    {!imgErrorMap[friend.id] ? (
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className={styles.avatarImg}
                        onError={() =>
                          setImgErrorMap((prev) => ({
                            ...prev,
                            [friend.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <span className="text-xs">👤</span>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addBtn}>
                <img src="/icons/home-main/plus.svg" alt="plus" />
              </button>
            </div>
          </div>
        </Link>

        <div className={cn(styles.block, styles.blockSecondary)}>
          <Link href="/promo">
            <div className={styles.row}>
              <div>
                <span className={cn(styles.title)} style={{ marginBottom: 3 }}>
                  Баллы
                </span>
                <span className={styles.pointsSubtitle}>1 балл = 1 ₽</span>
              </div>
              <img
                className={styles.arrow}
                src="/icons/global/arrow.svg"
                alt="arrow"
              />
            </div>
            <div className={styles.pointsValue}>11</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
