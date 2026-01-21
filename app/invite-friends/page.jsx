import Footer from "@/components/layout/Footer";
import { Check, Minus } from "lucide-react";
import Image from "next/image";
import { invitedUsers, stats } from "./mock";
import { cn } from "@/lib/format/cn";
import Container from "@/components/layout/Layout";
import Header from "@/components/layout/Header";
import InviteLinkActions from "./InviteLinkActions";
import styles from "./page.module.css";

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
  const inviteUrl = "https://t.me/loyaltymarketbot?start=707635394";

  return (
    <main
      className={cn("tg-viewport", styles.page)}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header title="Зовите друзей" />

      <Container className={styles.container}>
        <section className={styles.hero} aria-label="Invite friends">
          <div className={styles.illustration} aria-hidden="true">
            <div className={styles.bubbles}>
              <Image
                src="/icons/invite-friends/1-avatar.svg"
                alt=""
                width={51}
                height={51}
                className={cn(styles.bubble, styles.b1)}
                priority
              />
              <Image
                src="/icons/invite-friends/2-avatar.svg"
                alt=""
                width={50}
                height={50}
                className={cn(styles.bubble, styles.b2)}
                priority
              />
              <Image
                src="/icons/invite-friends/3-avatar.svg"
                alt=""
                width={54}
                height={53}
                className={cn(styles.bubble, styles.b3)}
                priority
              />

              <Image
                src="/icons/invite-friends/4-avatar.svg"
                alt=""
                width={50}
                height={50}
                className={cn(styles.bubble, styles.b4)}
                priority
              />
              <Image
                src="/icons/invite-friends/5-avatar.svg"
                alt=""
                width={55}
                height={55}
                className={cn(styles.bubble, styles.b5)}
                priority
              />
              <Image
                src="/icons/invite-friends/6-avatar.svg"
                alt=""
                width={50}
                height={50}
                className={cn(styles.bubble, styles.b6)}
                priority
              />

              <div className={styles.centerBubble}>
                <Image
                  src="/icons/invite-friends/7-avatar.svg"
                  alt=""
                  width={100}
                  height={100}
                  className={styles.centerAvatar}
                  priority
                />
              </div>
            </div>
          </div>

          <h1 className={styles.title} itemProp="name">
            Зовите друзей и
            <br />
            получайте скидку
          </h1>

          <p className={styles.subtitle} itemProp="description">
            Пригласите в приложение 3 друзей по своей ссылке и мы подарим вам
            промокод на скидку 10%.
          </p>
        </section>

        <section
          className={styles.section}
          aria-labelledby="invite-link"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <h2 id="invite-link" className={styles.sectionTitle} itemProp="name">
            Ваша ссылка для приглашений
          </h2>

          <meta itemProp="price" content="0" />
          <meta itemProp="priceCurrency" content="RUB" />

          <InviteLinkActions url={inviteUrl} />
        </section>

        <section className={styles.statsCard} aria-label="Статистика">
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Перешло по ссылке</span>
            <strong className={styles.statValue}>{stats.visited}</strong>
          </div>
          <div className={styles.divider} />
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Запустило приложение</span>
            <strong className={styles.statValue}>{stats.started}</strong>
          </div>
          <div className={styles.divider} />
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Получено промокодов</span>
            <strong className={styles.statValue}>{stats.promocodes}</strong>
          </div>
        </section>

        <section className={styles.history} aria-labelledby="invite-history">
          <h2 id="invite-history" className={styles.historyTitle}>
            История приглашений
          </h2>

          <ul className={styles.historyList}>
            {invitedUsers.map((user) => {
              const isExisting = user.status === "Уже пользуется";

              return (
                <li key={user.id} className={styles.historyItem}>
                  <Image
                    src={user.avatar}
                    alt={`Аватар пользователя ${user.name}`}
                    width={44}
                    height={44}
                    className={styles.userAvatar}
                  />

                  <div className={styles.userBody}>
                    <div className={styles.userMain}>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userDate}>{user.date}</div>
                    </div>

                    <div className={styles.userStatus}>
                      <span className={styles.statusIcon} aria-hidden="true">
                        {isExisting ? <Minus size={20} /> : <Check size={18} />}
                      </span>
                      <span className={styles.statusText}>{user.status}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>

      <Footer />
    </main>
  );
}
