"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { productsApi, favoritesApi, cartApi, brandsApi } from "@/lib/api";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import styles from "./page.module.css";
import cx from "clsx";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { userId } = useCurrentUser();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isArticleCopied, setIsArticleCopied] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [brandsCarousel, setBrandsCarousel] = useState([]);

  // Загрузить товар
  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      try {
        setLoading(true);
        const data = await productsApi.getById(Number(productId));
        setProduct(data);
        
        // Загрузить избранное
        try {
          const favorites = await favoritesApi.getAll({ item_type: "product" });
          const favorite = favorites.find(f => f.product_id === Number(productId));
          setIsFavorite(!!favorite);
        } catch (err) {
          console.error("Failed to check favorite:", err);
        }

        // Загрузить похожие товары
        try {
          const similar = await productsApi.getAll({ 
            category_id: data.category_id, 
            limit: 4,
            skip: 0 
          });
          const favoriteIds = new Set();
          try {
            const favorites = await favoritesApi.getAll({ item_type: "product" });
            favorites.forEach(f => {
              if (f.product_id) favoriteIds.add(f.product_id);
            });
          } catch {}
          
          setRecommended(similar
            .filter(p => p.id !== Number(productId))
            .slice(0, 2)
            .map(p => ({
              id: p.id,
              name: p.name,
              price: new Intl.NumberFormat("ru-RU").format(p.price) + " ₽",
              image: p.photos?.[0] ? productsApi.getPhoto(p.photos[0].filename) : "/products/shoes-1.png",
              isFavorite: favoriteIds.has(p.id),
              deliveryDate: p.delivery === "China" ? "30 марта" : "Послезавтра",
            }))
          );
        } catch (err) {
          console.error("Failed to load recommended:", err);
        }

        // Загрузить бренды
        try {
          const brands = await brandsApi.getAll();
          setBrandsCarousel(brands.slice(0, 3).map(b => ({
            id: b.id,
            name: b.name,
            subtitle: "Бренд",
            image: b.logo ? brandsApi.getLogo(b.logo) : "/icons/favourites/brands/supreme.svg",
            href: `/brands/${b.id}`,
          })));
        } catch (err) {
          console.error("Failed to load brands:", err);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const productImages = product?.photos?.map(p => productsApi.getPhoto(p.filename)) || [
    "/products/shoes-1.png",
    "/products/shoes-2.png",
    "/products/t-shirt-1.png",
  ];

  const breadcrumb = product 
    ? ["Одежда, обувь и аксессуары", product.category?.name || "Категория", product.type?.name || "Тип"]
    : ["Одежда, обувь и аксессуары", "Одежда", "Зип худи"];

  const infoCards = [
    { title: "Гарантии\nи безопасность", icon: "/img/FriendsSection5.webp" },
    { title: "POIZON –\nтолько оригинал", icon: "/img/FriendsSection6.webp" },
    { title: "Подарочные\nкарты", icon: "/img/FriendsSection7.webp" },
    { title: "Чат\nс поддержкой", icon: "/img/FriendsSection8.webp" },
  ];

  const sizes = product?.sizes?.map(s => s.size) || ["XS", "S", "M", "L", "XL"];
  const availableSizes = sizes;

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

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const sizeObj = product.sizes?.find(s => s.size === selectedSize);
      await cartApi.addItem({
        product_id: product.id,
        quantity,
        ...(sizeObj && { size_id: sizeObj.id }),
      });
      // Обновить событие для обновления счетчика в футере
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('loyaltymarket_cart_updated'));
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Не удалось добавить товар в корзину");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      const sizeObj = product.sizes?.find(s => s.size === selectedSize);
      await cartApi.addItem({
        product_id: product.id,
        quantity,
        ...(sizeObj && { size_id: sizeObj.id }),
      });
      router.push("/trash");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Не удалось добавить товар в корзину");
    }
  };

  const handleToggleFavorite = async () => {
    if (!product || !userId) return;
    try {
      if (isFavorite) {
        const favorites = await favoritesApi.getAll({ item_type: "product" });
        const favorite = favorites.find(f => f.product_id === product.id);
        if (favorite) {
          await favoritesApi.remove(favorite.id);
          setIsFavorite(false);
        }
      } else {
        await favoritesApi.add({ user_id: userId, product_id: product.id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleToggleRecommendedFavorite = (id) => {
    setRecommended((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
  };

  const copyText = async (text) => {
    const value = String(text);

    // Modern Clipboard API (may be unavailable in some mobile/WebView contexts)
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function" &&
        typeof window !== "undefined" &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // fallback below
    }

    // Fallback: hidden textarea + execCommand('copy')
    try {
      if (typeof document === "undefined") return false;
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);

      ta.focus();
      ta.select();
      try {
        ta.setSelectionRange(0, ta.value.length);
      } catch {
        // ignore
      }

      const ok = document.execCommand?.("copy") ?? false;
      document.body.removeChild(ta);
      return Boolean(ok);
    } catch {
      return false;
    }
  };

  const handleCopy = async (text) => {
    const ok = await copyText(text);
    if (!ok) return;
    setIsArticleCopied(true);
    window.setTimeout(() => setIsArticleCopied(false), 1200);
  };

  if (loading) {
    return (
      <main className={cx("tg-viewport", styles.c1, styles.tw1)}>
        <Container>
          <div style={{ padding: "2rem", textAlign: "center" }}>Загрузка...</div>
        </Container>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={cx("tg-viewport", styles.c1, styles.tw1)}>
        <Container>
          <div style={{ padding: "2rem", textAlign: "center" }}>Товар не найден</div>
        </Container>
      </main>
    );
  }

  return (
    <main className={cx("tg-viewport", styles.c1, styles.tw1)}>
      <Container>
        <section className={styles.hero}>
          {/* Галерея изображений */}
          <ProductImageGallery
            images={productImages}
            productName={product.name}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
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
            productName={product.name}
            brand={product.brand?.name || "Unknown"}
            brandLink={product.brand?.id ? `/brands/${product.brand.id}` : "#"}
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
          price={new Intl.NumberFormat("ru-RU").format(product.price) + " ₽"}
          deliveryInfo={product.delivery === "China" ? "Доставка из Китая до РФ 0₽" : "Доставка из наличия 0₽"}
          splitPayment={{
            count: 4,
            amount: Math.floor(product.price / 4).toString(),
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
                  <span>{product.id}</span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    aria-label="Скопировать артикул"
                    onClick={() => handleCopy(product.id.toString())}
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
              <span className={styles.aboutVal}>{product.category?.name || "—"}</span>
            </div>

            <div className={styles.aboutRow}>
              <span className={styles.aboutKey}>Тип</span>
              <span className={styles.aboutVal}>{product.type?.name || "—"}</span>
            </div>

            <div className={styles.aboutRow}>
              <span className={styles.aboutKey}>Бренд</span>
              <span className={styles.aboutVal}>{product.brand?.name || "—"}</span>
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
  );
}
