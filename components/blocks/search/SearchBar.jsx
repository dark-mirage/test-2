"use client";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import styles from "./SearchBar.module.css";

export default function SearchBar({
  navigateOnFocusTo = "",
  readOnly = false,
  autoFocus = false,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  inputMode,
  enterKeyHint,
  inputRef,
  className,
}) {
  const router = useRouter();

  const handleFocus = (e) => {
    onFocus?.(e);
    if (navigateOnFocusTo) router.push(navigateOnFocusTo);
  };

  return (
    <div className={className ? `${styles.outer} ${className}` : styles.outer}>
      <div className={styles.inner}>
        <Search size={21} color="#7E7E7E" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск"
          className={styles.input}
          readOnly={readOnly}
          autoFocus={autoFocus}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
        />
      </div>
    </div>
  );
}
