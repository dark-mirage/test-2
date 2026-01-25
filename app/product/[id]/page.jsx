"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Layout";
import ProductImageGallery from "@/components/blocks/product/ProductImageGallery";
import ProductInfo from "@/components/blocks/product/ProductInfo";
import ProductSizes from "@/components/blocks/product/ProductSizes";
import ProductPrice from "@/components/blocks/product/ProductPrice";
import ProductAddToCart from "@/components/blocks/product/ProductAddToCart";
import ProductReviews from "@/components/blocks/product/ProductReviews";
import InfoCard from "@/components/blocks/home/InfoCard";
import ProductSection from "@/components/blocks/product/ProductSection";
import ProductShippingOptions from "@/components/blocks/product/ProductShippingOptions";
import ProductBrandsCarousel from "@/components/blocks/product/ProductBrandsCarousel";
import styles from "./page.module.css";
import cx from "clsx";

export default function ProductPage() {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isArticleCopied, setIsArticleCopied] = useState(false);

  const productImages = [
    "/products/shoes-1.png",
    "/products/shoes-2.png",
    "/products/t-shirt-1.png",
  ];

  const breadcrumb = ["Одежда, обувь и аксессуары", "Одежда", "Зип худи"];

  const infoCards = [
    { title: "Гарантии\nи безопасность", icon: "/img/FriendsSection5.webp" },
    { title: "POIZON –\nтолько оригинал", icon: "/img/FriendsSection6.webp" },
    { title: "Подарочные\nкарты", icon: "/img/FriendsSection7.webp" },
    { title: "Чат\nс поддержкой", icon: "/img/FriendsSection8.webp" },
  ];

  const [recommended, setRecommended] = useState(() => [
    {
      id: "rec-1",
      name: "Лонгслив Comme Des Garcons Play",
      price: "2 890 ₽",
      image: "/products/shoes-1.png",
      isFavorite: false,
      deliveryDate: "30 марта",
    },
    {
      id: "rec-2",
      name: "Туфли Prada Monolith",
      price: "112 490 ₽",
      image: "/products/shoes-1.png",
      isFavorite: false,
      deliveryDate: "Послезавтра",
    },
  ]);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const availableSizes = ["XS", "S", "M", "L", "XL"];

  const brandsCarousel = [
    {
      id: "supreme",
      name: "Supreme",
      subtitle: "Бренд",
      image: "/icons/favourites/brands/supreme.svg",
      href: "/brands/supreme",
    },
    {
      id: "adidas",
      name: "Adidas",
      subtitle: "Бренд",
      image: "/icons/favourites/brands/adidas.svg",
      href: "/brands/adidas",
    },
    {
      id: "stone-island",
      name: "Stone Island",
      subtitle: "Бренд",
      image: "/icons/favourites/brands/stone-island.svg",
      href: "/brands/stone-island",
    },
  ];

  // Данные для отзывов
  const reviews = [
    {
      id: 1,
      userName: "Анастасия",
      avatar: "https://i.pravatar.cc/150?img=1",
      date: "21 апреля",
      rating: 5,
      productName: "Кофта Sup...",
      pros: "стильно, классика которую можно носить под разный стиль одежды...",
      cons: "клей на подошве. ПОшив..",
    },
    {
      id: 2,
      userName: "fasffafdfa",
      avatar: "https://i.pravatar.cc/150?img=2",
      date: "21 апреля",
      rating: 4,
      pros: "стильно, классика которую можно носить под разный стиль одежды...",
      cons: "их не",
    },
  ];

  // Распределение рейтингов (для расчета среднего)
  const ratingDistribution = {
    5: 60,
    4: 20,
    3: 12,
    2: 6,
    1: 2,
  };

  const handleAddToCart = () => {
    console.log("Добавлено в корзину:", {
      productId,
      size: selectedSize,
      quantity,
    });
  };

  const handleBuyNow = () => {
    console.log("Купить сейчас:", {
      productId,
      size: selectedSize,
      quantity,
    });
  };

  const handleToggleRecommendedFavorite = (id) => {
    setRecommended((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setIsArticleCopied(true);
      window.setTimeout(() => setIsArticleCopied(false), 1200);
    } catch {
      // no-op
    }
  };

  return (
    <>
      <main className={cx("tg-viewport", styles.c1, styles.tw1)}>
        <Container>
          <section className={styles.hero}>
            {/* Галерея изображений */}
            <ProductImageGallery
              images={productImages}
              productName="Кофта Supreme"
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite(!isFavorite)}
              currentImageIndex={currentImageIndex}
              onImageChange={setCurrentImageIndex}
            />

            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <div className={cx(styles.breadcrumbRow, "scrollbar-hide")}>
                {breadcrumb.map((label, idx) => {
                  const isLast = idx === breadcrumb.length - 1;
                  return (
                    <button
                      key={`${label}-${idx}`}
                      type="button"
                      aria-current={isLast ? "page" : undefined}
                      className={cx(
                        styles.breadcrumbChip,
                        isLast && styles.breadcrumbChipActive,
                      )}
                    >
                      <span className={styles.breadcrumbChipText}>{label}</span>
                      {!isLast ? (
                        <span
                          className={styles.breadcrumbArrow}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Информация о товаре */}
            <ProductInfo
              productName="Кофта Supreme"
              brand="Supreme"
              brandLink="/brands/supreme"
              images={productImages}
              currentImageIndex={currentImageIndex}
              onImageChange={setCurrentImageIndex}
              theme="light"
              showThumbnails={true}
            />

            {/* Выбор размера */}
            <ProductSizes
              sizes={sizes}
              availableSizes={availableSizes}
              onSizeSelect={(size) => setSelectedSize(size)}
            />
          </section>

          {/* Цена и оплата */}
          <ProductPrice
            price="127 899 ₽"
            deliveryInfo="Доставка из Китая до РФ 0₽"
            splitPayment={{
              count: 4,
              amount: "880",
              text: "без переплаты",
            }}
          />

          <ProductShippingOptions
            pickupDate="Сегодня"
            pickupSub="из наличия"
            pickupAddress="Оренбург, улица Пролетарская, 23, 2 этаж"
            deliveryDate="Послезавтра"
            deliverySub="из наличия"
            deliveryHint="В пункт выдачи от 99₽"
          />

          <ProductBrandsCarousel brands={brandsCarousel} />

          <section className={styles.cardsOuter}>
            <div className={cx(styles.cardsRow, "scrollbar-hide")}>
              {infoCards.map((c) => (
                <div key={c.title} className={styles.cardItem}>
                  <InfoCard title={c.title} iconSrc={c.icon} />
                </div>
              ))}
            </div>
          </section>

          {/* Отзывы */}
          <ProductReviews
            brandName="Supreme"
            reviews={reviews}
            ratingDistribution={ratingDistribution}
            productImages={productImages.slice(0, 2)}
          />

          <section className={styles.about}>
            <h2 className={styles.aboutTitle}>О товаре</h2>

            <div className={styles.aboutGrid}>
              <div className={styles.aboutRow}>
                <span className={styles.aboutKey}>Артикул</span>
                <span className={styles.aboutVal}>
                  <span className={styles.aboutValRow}>
                    <span>0432135</span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      aria-label="Скопировать артикул"
                      onClick={() => handleCopy("0432135")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <span
                      className={styles.copiedHint}
                      aria-live="polite"
                      role="status"
                    >
                      {isArticleCopied ? "Скопировано" : ""}
                    </span>
                  </span>
                </span>
              </div>

              <div className={styles.aboutRow}>
                <span className={styles.aboutKey}>Категория</span>
                <span className={styles.aboutVal}>Одежда</span>
              </div>

              <div className={styles.aboutRow}>
                <span className={styles.aboutKey}>Тип</span>
                <span className={styles.aboutVal}>Зип худи</span>
              </div>

              <div className={styles.aboutRow}>
                <span className={styles.aboutKey}>Бренд</span>
                <span className={styles.aboutVal}>Supreme</span>
              </div>
            </div>

            <button type="button" className={styles.supportBtn}>
              Чат с поддержкой
            </button>
          </section>

          <ProductSection
            title="Похожие"
            products={recommended}
            layout="grid"
            headerVariant="tabs"
            tabs={["Для вас", "Похожие"]}
            onToggleFavorite={handleToggleRecommendedFavorite}
          />

          {/* Кнопка добавления в корзину (фиксированная внизу на mobile) */}
          <ProductAddToCart
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </Container>
        <Footer />
      </main>
    </>
  );
}
