"use client";
import { useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReviewsHeader from "@/components/blocks/reviews/ReviewsHeader";
import ReviewsRatingSummary from "@/components/blocks/reviews/ReviewsRatingSummary";
import ReviewsGrid from "@/components/blocks/reviews/ReviewsGrid";

import styles from "./page.module.css";

/**
 * Страница отзывов о бренде
 * Компонентный подход с разделением на отдельные компоненты
 */
export default function ReviewsPage() {
  const brandName = "Supreme";

  // Статистика рейтингов
  const [ratingStats] = useState([
    { stars: 5, count: 45, percentage: 65 },
    { stars: 4, count: 15, percentage: 22 },
    { stars: 3, count: 5, percentage: 7 },
    { stars: 2, count: 3, percentage: 4 },
    { stars: 1, count: 1, percentage: 2 },
  ]);

  // Отзывы
  const [reviews] = useState([
    {
      id: 1,
      rating: 4,
      title: "Кофта Sup...",
      date: "1 день назад",
      pros: "стильно, классика которую можно носить под любую стиль одежды...",
      cons: "клей на подошве. Подше...",
      avatar: "https://i.pravatar.cc/150?img=1",
      userName: "Алексей",
    },
    {
      id: 2,
      rating: 4,
      title: "",
      date: "",
      pros: "стильно, классика которую можно нос...",
      cons: "не на...",
      avatar: "https://i.pravatar.cc/150?img=2",
      userName: "Мария",
    },
    {
      id: 3,
      rating: 5,
      title: "Отличное качество",
      date: "3 дня назад",
      pros: "очень качественная вещь, рекомендую",
      cons: "нет",
      avatar: "https://i.pravatar.cc/150?img=3",
      userName: "Дмитрий",
    },
    {
      id: 4,
      rating: 3,
      title: "Нормально",
      date: "5 дней назад",
      pros: "качество хорошее",
      cons: "размер немного мал",
      avatar: "https://i.pravatar.cc/150?img=4",
      userName: "Елена",
    },
    {
      id: 5,
      rating: 5,
      title: "Супер!",
      date: "1 неделя назад",
      pros: "все отлично, очень доволен",
      cons: "нет",
      avatar: "https://i.pravatar.cc/150?img=5",
      userName: "Иван",
    },
    {
      id: 6,
      rating: 4,
      title: "Хорошо",
      date: "2 недели назад",
      pros: "качество на высоте",
      cons: "цена высокая",
      avatar: "https://i.pravatar.cc/150?img=6",
      userName: "Ольга",
    },
  ]);

  // Изображения товаров
  const productImages = ["/products/t-shirt-1.png", "/products/t-shirt-2.png"];

  // Расчет среднего рейтинга
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <>
      <Header title="Отзывы" />
      <main className={styles.page}>
        {/* Заголовок страницы */}
        <ReviewsHeader brandName={brandName} />

        {/* Сводка рейтинга */}
        <ReviewsRatingSummary
          averageRating={averageRating}
          totalReviews={reviews.length}
          ratingStats={ratingStats}
          productImages={productImages}
        />

        {/* Сетка отзывов */}
        <ReviewsGrid reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}
