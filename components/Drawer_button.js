import React from "react";
import { motion } from "framer-motion";
import classNames from "classnames";
import styles from "./Drawer_button.module.scss";

function Drawer_button({ className, isOpen, toggleDrawer }) {
  const cell = 18; // 中央への距離(px)

  // アニメーション状態の定義
  const variants = {
    open: (custom) => getOpenVariant(custom),
    closed: (custom) => getClosedVariant(custom)
  };

  // 開くときのアニメーション
  const getOpenVariant = (dot) => {
    switch (dot) {
      case "dot1":
        return { x: cell, y: cell, opacity: 1 };
      case "dot3":
        return { x: -cell, y: cell, opacity: 1 };
      case "dot7":
        return { x: cell, y: -cell, opacity: 1 };
      case "dot9":
        return { x: -cell, y: -cell, opacity: 1 };
      default:
        return { x: 0, y: 0, opacity: 0 }; // 中央ドット以外はフェードアウト
    }
  };

  // 閉じるときのアニメーション（逆再生）
  const getClosedVariant = (dot) => {
    switch (dot) {
      case "dot1":
      case "dot3":
      case "dot7":
      case "dot9":
        return { x: 0, y: 0, opacity: 1 }; // 外周ドットは元の位置へ
      default:
        return { x: 0, y: 0, opacity: 1 }; // 中央ドット以外はフェードイン
    }
  };

  // トランジション設定
  const getTransition = (dot) => ({
    type: "spring",
    stiffness: dot === "dot5" ? 0 : 120, // 中央ドットは無効化
    damping: 12,
    restDelta: 0.001
  });

  return (
    <button
      className={`${styles.drawerButton__button} ${className || ""}`}
      onClick={toggleDrawer}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      <div className={styles.drawerButton__button__inner}>
        {["dot1","dot2","dot3","dot4","dot5","dot6","dot7","dot8","dot9"].map((dot) => (
          <motion.span
            key={dot}
            className={classNames(styles.drawerButton__dot, styles[dot])}
            variants={variants}
            custom={dot}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={getTransition(dot)}
          />
        ))}
      </div>
    </button>
  );
}

export default Drawer_button;