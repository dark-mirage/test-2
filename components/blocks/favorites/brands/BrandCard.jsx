"use client";
import styles from './BrandCard.module.css';
import cx from 'clsx';
export default function BrandCard({
  id,
  name,
  image,
  onClick,
}) {
  return (
    <li
      className={cx(styles.c1, styles.tw1)}
      onClick={() => onClick?.(id)}
    >
      {/* Левая часть: изображение и текст */}
      <div className={cx(styles.c2, styles.tw2)}>
        {/* Изображение бренда */}
        {image && (
          <div className={cx(styles.c3, styles.tw3)}>
            <img
              src={image}
              alt={name}
              className={styles.c4}
            />
          </div>
        )}

        {/* Текст бренда */}
        <div className={cx(styles.c5, styles.tw4)}>
          <span className={styles.c6}>
            {name}
          </span>
          <span className={styles.c7}>
            Бренд
          </span>
        </div>
      </div>

      {/* Стрелка справа */}
      <img
        src="/icons/global/Wrap.svg"
        alt="arrow"
        className={cx(styles.c8, styles.tw5)}
      />
    </li>
  );
}
