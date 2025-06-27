'use client'
import React, { useState, useEffect } from "react";
import styles from "../components/SSG/not-found.module.scss";
import Image from "next/image";
import Header_Sp from "@/components/SSG/Drawer/Sp/Drawer_menu/Drawer_menuSP";
import Header from "@/components/SSG/Header/Header/Header";

function not_found() {
  // ========== レスポンシブヘッダー切り替えロジック ==========
    const [windowWidth, setWindowWidth] = useState(0); // 画面幅管理
    const [isMenuOpen, setIsMenuOpen] = useState(false); // SPメニュー開閉状態
    const BREAKPOINT_SP = 768; // PC/SP切り替え境界値
  
    // SPメニュー開閉切り替え関数
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  
    // 画面幅監視とリサイズイベント処理
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
  
      if (typeof window !== "undefined") {
        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
      }
  
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", handleResize);
        }
      };
    }, []);
    // ========================================================
  return (
    <div className={styles.not_found}>
      <div className={styles.left_1stLineParent}>
              <Image
                className={styles.left_1stLine}
                src="/LowerLayer/PC/left_1stLine.webp"
                alt="left_1stLine"
                fill
              /></div>
              <div className={styles.left_2ndLineParent}>
              <Image
                className={styles.left_2ndLine}
                src="/LowerLayer/PC/left_2ndLine.webp"
                alt="left_2ndLine"
                fill
              /></div>
             <div className={styles.right_2ndParent}>
            <Image
              className={styles.right_2nd}
              src="/LowerLayer/PC/right_2nd.webp"
              alt="right_2nd"
              fill
            /></div>
           {windowWidth > BREAKPOINT_SP ? (
          <Header className={styles.thanksHeader} />
        ) : (
          <Header_Sp toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        )}
      <h1 className={styles.not_found404}>404</h1>
      <p className={styles.not_foundP}>
        お探しのページが見つかりません。
        <br />
        一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
      </p>
    </div>
  );
}

export default not_found;
