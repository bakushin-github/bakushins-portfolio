"use client"; // クライアントコンポーネントにする
import { useState, useEffect } from "react";
import styles from "./Toggle.module.scss";

export default function Toggle({ content, className, isFirst = false }) {
  // isFirstがtrueの場合、初期状態を開いた状態(true)に設定
  const [open, setOpen] = useState(isFirst);

  // 初期レンダリング時にisFirstの値に基づいて状態を設定
  useEffect(() => {
    setOpen(isFirst);
  }, [isFirst]);

  return (
    <div className={`${styles.faq__toggle} ${className || ''}`}>
      <div className={styles.toggle__header}>
        <h3 className={styles.toggle__title}>{content.title}</h3>
        <button 
          onClick={() => setOpen(!open)} 
          className={styles.toggle__button}
        >
          {open ? "-" : "+"}
        </button>
      </div>

      {open && (
        <div className={styles.toggle__content}>
          <p className={styles.toggle__explanation}>{content.content}</p>
        </div>
      )}
    </div>
  );
}