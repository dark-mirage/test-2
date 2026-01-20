"use client";
import { Search } from "lucide-react";

import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <Search size={21} color="#111111" aria-hidden="true" />
        <input type="text" placeholder="Поиск" className={styles.input} />
      </div>
    </div>
  );
}
