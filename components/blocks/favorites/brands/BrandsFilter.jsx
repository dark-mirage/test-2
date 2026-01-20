'use client'
import React from 'react';
import styles from './BrandsFilter.module.css';
import cx from 'clsx';

export default function BrandsFilter({ letters, selectedLetter, onSelectLetter }) {
  return (
    <div className={cx(styles.c1, styles.tw1)}>
      {letters.map((letter, index) => (
        <button
          key={index}
          onClick={() => onSelectLetter?.(letter)}
          className={cx(
            styles.letterButton,
            selectedLetter === letter && styles.letterButtonSelected
          )}
        >
          <span
            className={cx(
              styles.letterText,
              selectedLetter === letter
                ? styles.letterTextSelected
                : styles.letterTextDefault
            )}
          >
            {letter}
          </span>
        </button>
      ))}
    </div>
  );
}

