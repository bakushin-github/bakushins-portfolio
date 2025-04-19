"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./Toggle.module.scss";

export default function Toggle({ content, className, isFirst = false }) {
  // 最初のアイテムは閉じた状態、それ以外は開いた状態に設定
  const [isOpen, setIsOpen] = useState(!isFirst);
  const answerRef = useRef(null);
  const [height, setHeight] = useState("auto");
  
  // 初期状態の設定
  useEffect(() => {
    setIsOpen(!isFirst); // 最初のアイテムは閉じる、それ以外は開く
  }, [isFirst]);

  // アニメーション用の高さ設定
  useEffect(() => {
    if (!answerRef.current) return;
    
    if (isOpen) {
      const answerHeight = answerRef.current.scrollHeight;
      setHeight(`${answerHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen, content]);

  const toggleAccordion = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.qa_box} ${isOpen ? styles.is_open : ""} ${className || ""}`}>
      <div className={styles.qa_box__head} onClick={toggleAccordion}>
        <div className={styles.qa_box__head_wrap}>
          <span className={styles.qa_box__head_text}>{content.title}</span>
        </div>
        <div className={styles.qa_box__move}>
          <span className={styles.qa_box__dash}></span>
          <span className={styles.qa_box__dash2}></span>
        </div>
      </div>
      
      <div 
        className={styles.qa_box__body} 
        ref={answerRef}
      >
        <div className={styles.qa_box__a}>
          <p className={styles.qa_box__a_text}>{content.content}</p>
        </div>
      </div>
    </div>
  );
}