"use client";
import { useState } from "react";

import { cn } from "@/lib/format/cn";
import styles from "./CategoryTabs.module.css";

const tabs = ["Для вас", "Новинки", "Одежда", "Обувь", "Аксессуары"];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState("Для вас");

  return (
    <div className={cn(styles.outer, "scrollbar-hide")}>
      <div className={styles.inner}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
            className={cn(styles.tab, activeTab === tab && styles.active)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
  
}
