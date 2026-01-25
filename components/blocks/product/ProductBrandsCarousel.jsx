"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import cx from "clsx";
import styles from "./ProductBrandsCarousel.module.css";

export default function ProductBrandsCarousel({ brands = [] }) {
  if (!Array.isArray(brands) || brands.length === 0) return null;

  return (
    <section className={styles.root} aria-label="Бренды">
      <div className={cx(styles.row, "scrollbar-hide")}>
        {brands.map((brand) => (
          <Link
            key={brand.id ?? brand.slug ?? brand.name}
            href={brand.href ?? "#"}
            className={styles.card}
          >
            <div className={styles.left}>
              <span className={styles.logoWrap} aria-hidden="true">
                <Image
                  src={brand.image}
                  alt=""
                  fill
                  className={styles.logo}
                  sizes="56px"
                />
              </span>
              <div className={styles.text}>
                <span className={styles.name}>{brand.name}</span>
                <span className={styles.sub}>{brand.subtitle ?? "Бренд"}</span>
              </div>
            </div>

            <span className={styles.right} aria-hidden="true">
              <Image
                src="/icons/global/Wrap.svg"
                alt=""
                width={7}
                height={11}
                className={styles.arrow}
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
