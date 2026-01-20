"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ProductImageGallery from "@/components/blocks/product/ProductImageGallery";
import ProductInfo from "@/components/blocks/product/ProductInfo";
import ProductSizes from "@/components/blocks/product/ProductSizes";
import ProductPrice from "@/components/blocks/product/ProductPrice";
import ProductDelivery from "@/components/blocks/product/ProductDelivery";
import ProductAddToCart from "@/components/blocks/product/ProductAddToCart";
import ProductReviews from "@/components/blocks/product/ProductReviews";
import styles from "./page.module.css";
import cx from "clsx";

export default function ProductPage() {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = [
    "/products/shoes-1.png",
    "/products/shoes-1.png",
    "/products/shoes-1.png",
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];
  const availableSizes = ["XS", "S", "M", "L", "XL"];

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

  return (
    <>
      <main className={cx(styles.c1, styles.tw1)}>
        {/* Галерея изображений */}
        <ProductImageGallery
          images={productImages}
          productName="Кофта Supreme"
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        {/* Информация о товаре */}
        <ProductInfo
          productName="Кофта Supreme"
          brand="Supreme"
          brandLink="/brands/supreme"
          images={productImages}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        {/* Выбор размера */}
        <ProductSizes
          sizes={sizes}
          availableSizes={availableSizes}
          onSizeSelect={(size) => setSelectedSize(size)}
        />

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

        {/* Доставка */}
        <ProductDelivery
          deliveryDate="30 марта"
          country="из Китая"
          pickupPrice="99₽"
        />

        {/* Отзывы */}
        <ProductReviews
          brandName="Supreme"
          reviews={reviews}
          ratingDistribution={ratingDistribution}
        />

        {/* Кнопка добавления в корзину (фиксированная внизу на mobile) */}
        <ProductAddToCart
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </main>
      <Footer />
    </>
  );
}
