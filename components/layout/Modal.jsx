import { X } from "lucide-react";

import styles from "./Modal.module.css";

export default function Modal({ children, open, onClose }) {
  return open ? (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  ) : null;
}
