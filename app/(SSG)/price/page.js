"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/SSG/Header/Header/Header";
import Header_Sp from "@/components/SSG/Drawer/Sp/Drawer_menu/Drawer_menuSP";
import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb/index";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";
import Cta from "@/components/SSG/Cta/Cta";
import { ScrollMotion } from "@/components/animation/Stagger/ScrollMotion";

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb("/price");

export default function Price() {
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
    <div className={styles.price}>
      <div className={styles.left_1stLineParent}>
        <Image
          className={styles.left_1stLine}
          src="/LowerLayer/PC/left_1stLine.webp"
          alt="left_1stLine"
          fill
        />
      </div>
      <div className={styles.right_1stLineParent}>
      <Image
        className={styles.right_1stLine}
        src="/LowerLayer/PC/right_1stLine.webp"
        alt="right_1stLine"
        fill
      /></div>
      <div className={styles.ballParent}>
      <Image
        className={styles.ball}
        src="/LowerLayer/PC/ball.webp"
        alt="ball"
        fill
      /></div>
      <div className={styles.right_polygonParent}>
      <Image
        className={styles.right_polygon1}
        src="/LowerLayer/PC/Polygon1.webp"
        alt="right_polygon1"
        fill
      /></div>
      {windowWidth > BREAKPOINT_SP ? (
        <Header className={styles.thanksHeader} />
      ) : (
        <Header_Sp toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      )}
      <div className={styles.price__inner}>
        <div className={styles.Bread}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className={styles.price__title}>
          <h1 className={styles.price__h1}>費用のめやす</h1>
          <h2 className={styles.price__h2}>price</h2>
        </div>
        <div className={styles.price__text}>
          <p className={styles.price__explanation}>
            ご依頼内容に応じた料金の目安を掲載しています。デザイン・原稿・アニメーションをご希望の場合、別途料金を承ります。詳細なお見積もりは、ヒアリング後にご案内いたします。
          </p>
        </div>
        <ScrollMotion 
    delay={0.3}
    duration={0.6}
    yOffset={50}
    threshold={0.3}
    once={true}
  >        <div className={styles.price__tableContent}>
          {" "}
          <table className={styles.price_table} role="table">
            <thead className={styles.visually_hidden}>
              <tr>
                <th scope="col">項目</th>
                <th scope="col">料金</th>
              </tr>
            </thead>
            <tbody class={styles.price__tableBody}>
              <tr>
                <td>横長の1ページ</td>
                <td>150,000円〜</td>
              </tr>
              <tr>
                <td>追加1ページにつき</td>
                <td>20,000円〜</td>
              </tr>
              <tr>
                <td>WordPress化</td>
                <td>50,000円〜</td>
              </tr>
              <tr>
                <td>ECサイト構築</td>
                <td>200,000円〜</td>
              </tr>
            </tbody>
          </table>
        </div></ScrollMotion>
      </div>
      <Cta />
    </div>
  );
}
