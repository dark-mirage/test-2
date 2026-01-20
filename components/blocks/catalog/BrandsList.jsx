"use client";
import Image from "next/image";

import styles from "./BrandsList.module.css";

const brandsData = [
  {
    letter: "А",
    brands: [{ name: "Adidas" }, { name: "Armani" }, { name: "ASICS" }],
  },
  {
    letter: "b",
    brands: [{ name: "Balenciaga" }, { name: "Burberry" }, { name: "Balmain" }],
  },
  {
    letter: "с",
    brands: [{ name: "Calvin Klein" }, { name: "Celine" }],
  },
];

export default function BrandsList() {
  return (
    <div className={styles.root}>
      <div className={styles.groups}>
        {brandsData.map((group) => (
          <div key={group.letter} className={styles.group}>
            {/* Буква */}
            <div className={styles.letterBar}>
              <span className={styles.letter}>{group.letter}</span>
            </div>

            {/* Список брендов */}
            <div className={styles.list}>
              {group.brands.map((brand, brandIndex) => (
                <div key={brand.name}>
                  <div className={styles.item}>
                    <span className={styles.name}>{brand.name}</span>
                    <div className={styles.chevron}>
                      <Image
                        src="/icons/global/Wrap.svg"
                        alt=""
                        width={7}
                        height={11}
                      />
                    </div>
                  </div>
                  {brandIndex < group.brands.length - 1 && (
                    <div className={styles.divider} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
