import Footer from "@/components/layout/Footer";
import { Check, Minus } from "lucide-react";
import Image from "next/image";
import { invitedUsers, stats } from "./mock";
import { cn } from "@/lib/format/cn";
import Container from "@/components/layout/Layout";
import Header from "@/components/layout/Header";

import styles from "./InviteFriendsPage.module.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Зовите друзей и получайте скидку",
  description:
    "Пригласите друзей и получите скидку. Уникальная ссылка для приглашения в приложение.",
  mainEntity: {
    "@type": "Offer",
    name: "Скидка за приглашение друзей",
    description:
      "Пригласите 3 друзей в приложение и получите промокод на скидку 10%",
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      value: 3,
      unitText: "друзья",
    },
    price: "0",
    priceCurrency: "RUB",
  },
  interactionStatistic: [
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ClickAction",
      name: "Переходы по ссылке",
      userInteractionCount: stats.visited,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ActivateAction",
      name: "Запуски приложения",
      userInteractionCount: stats.started,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReceiveAction",
      name: "Полученные промокоды",
      userInteractionCount: stats.promocodes,
    },
  ],
};

export default function InviteFriends() {
  return (
    <main
      className={cn(styles.c1, styles.tw1)}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header title="Зовите друзей"></Header>

      {/* Иконки приглашений: 3 слева, 3 справа, 1 по центру */}
      <div className={cn(styles.c2, styles.tw2)}>
        {/* Левый столбец: первые три слева */}
        <img
          src="/icons/invite-friends/1-avatar.svg"
          alt=""
          className={cn(styles.c3, styles.tw3)}
        />
        <img
          src="/icons/invite-friends/2-avatar.svg"
          alt=""
          className={cn(styles.c4, styles.tw4)}
        />
        <img
          src="/icons/invite-friends/3-avatar.svg"
          alt=""
          className={cn(styles.c5, styles.tw5)}
        />

        {/* Правый столбец: 4-5-6 справа */}
        <img
          src="/icons/invite-friends/4-avatar.svg"
          alt=""
          className={cn(styles.c6, styles.tw6)}
        />
        <img
          src="/icons/invite-friends/5-avatar.svg"
          alt=""
          className={cn(styles.c7, styles.tw7)}
        />
        <img
          src="/icons/invite-friends/6-avatar.svg"
          alt=""
          className={cn(styles.c8, styles.tw8)}
        />

        {/* Центр: 7 */}
        <img
          src="/icons/invite-friends/7-avatar.svg"
          alt=""
          className={cn(styles.c9, styles.tw9, styles.leftHalf)}
        />
      </div>

      <Container>
        <section>
          <h1 className={cn(styles.c10, styles.tw10)} itemProp="name">
            Зовите друзей и <br />
            получайте скидку
          </h1>

          <p className={cn(styles.c11, styles.tw11)} itemProp="description">
            Пригласите в приложение 3 друзей по своей ссылке и мы подарим вам
            промокод на скидку 10%.
          </p>
        </section>

        <section
          aria-labelledby="invite-link"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <h3
            id="invite-link"
            className={cn(styles.c12, styles.tw12)}
            itemProp="name"
          >
            Ваша ссылка для приглашений
          </h3>

          <meta itemProp="price" content="0" />
          <meta itemProp="priceCurrency" content="RUB" />

          <div className={cn(styles.c13, styles.tw13)}>
            <div className={styles.c14}>
              <input
                type="text"
                aria-label="Ссылка для приглашения"
                value="https://t.me/loyaltymarketbot?start=707635394"
                readOnly
                className={cn(styles.c15, styles.tw14)}
              />

              <button
                type="button"
                className={cn(styles.c16, styles.tw15, styles.topHalf)}
              >
                <img src="/icons/invite-friends/copy.svg" alt="copy-icon" />
              </button>
            </div>

            <button
              type="button"
              aria-label="Поделиться ссылкой"
              className={cn(styles.c17, styles.tw16)}
            >
              Поделиться
            </button>
          </div>
        </section>

        <section
          aria-labelledby="stats"
          className={cn(styles.c18, styles.tw17)}
        >
          <h3 id="stats" className={styles.srOnly}>
            Статистика
          </h3>

          <div className={styles.spaceY1_5}>
            <div
              className={cn(styles.c19, styles.tw18)}
              itemProp="interactionStatistic"
            >
              <span>Перешли по ссылке</span>
              <strong>{stats.visited}</strong>
            </div>

            <div
              className={cn(styles.c20, styles.tw19)}
              itemProp="interactionStatistic"
            >
              <span>Запустили приложение</span>
              <strong>{stats.started}</strong>
            </div>

            <div
              className={cn(styles.c21, styles.tw20)}
              itemProp="interactionStatistic"
            >
              <span>Получено промокодов</span>
              <strong>{stats.promocodes}</strong>
            </div>
          </div>
        </section>

        <section aria-labelledby="invite-history" className={styles.c22}>
          <h3 id="invite-history" className={cn(styles.c23, styles.tw21)}>
            История приглашений
          </h3>

          <div className={cn(styles.c24, styles.tw22)}>
            {invitedUsers.map((user) => (
              <article
                key={user.id}
                className={cn(styles.c25, styles.tw23)}
                itemScope
                itemType="https://schema.org/Person"
              >
                <Image
                  src={user.avatar}
                  alt={`Аватар пользователя ${user.name}`}
                  className={cn(styles.c26, styles.tw24)}
                  width={44}
                  height={44}
                  itemProp="image"
                />

                <div className={cn(styles.c27)}>
                  <div className={styles.c28}>
                    <div className={styles.c29} itemProp="name">
                      {user.name}
                    </div>

                    <div className={cn(styles.c30, styles.tw25)}>
                      {user.date}
                    </div>
                  </div>

                  <div className={cn(styles.c31, styles.tw26)}>
                    <span
                      aria-hidden="true"
                      className={cn(styles.c32, styles.tw27)}
                    >
                      {user.status === "Уже пользуется" ? (
                        <Minus size={20} />
                      ) : (
                        <Check size={18} />
                      )}
                    </span>

                    <span className={styles.statusText}>{user.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Footer />
      </Container>
    </main>
  );
}
