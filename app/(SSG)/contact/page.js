"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/SSG/Header/Header/Header";
import Header_Sp from "@/components/SSG/Drawer/Sp/Drawer_menu/Drawer_menuSP";
import Link from "next/link";
import styles from "./page.module.scss";
import Breadcrumb from "@/components/Breadcrumb/index";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";
import Image from "next/image";
import ContactForm from "./contactForm";
import useRecaptcha from "@/hooks/useRecaptcha";
import { ScrollMotion } from "@/components/animation/Stagger/ScrollMotion";
import Script from "next/script"; 

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb("/contact");

function Page() {
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
    <>
            {/* Google reCAPTCHA v3 */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
          strategy="afterInteractive" 
        />
      <div className={styles.contact}>
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

        <div className={styles.contact__inner}>
          <div className={styles.Bread}>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className={styles.contact__title}>
            <h1 className={styles.contact__h1}>お問い合わせ</h1>
            <h2 className={styles.contact__h2}>Contact</h2>
          </div>
    <ScrollMotion
      delay={0.2}
      duration={0.6}
      yOffset={30}
      threshold={0.3}
      once={true}
    >
          <p className={styles.contact____explanation}>
            無料でご相談、お見積もりを承っております。
            <br />
            お気軽にご相談ください。
          </p>
          </ScrollMotion>
<ContactForm />
         
        </div>
      </div>
    </>
  );
}

export default Page;
