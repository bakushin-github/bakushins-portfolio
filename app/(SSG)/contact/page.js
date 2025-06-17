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
      <div className={styles.contact}>
        <Image
          className={styles.left_1stLine}
          src="/LowerLayer/PC/left_1stLine.webp"
          alt="left_1stLine"
          width={439}
          height={565}
        />
        <Image
          className={styles.left_2ndLine}
          src="/LowerLayer/PC/left_2ndLine.webp"
          alt="left_2ndLine"
          width={547}
          height={350}
        />
        <Image
          className={styles.right_1stLine}
          src="/LowerLayer/PC/right_1stLine.webp"
          alt="right_1stLine"
          width={342}
          height={429}
        />
        <Image
          className={styles.ball}
          src="/LowerLayer/PC/ball.webp"
          alt="ball"
          width={169}
          height={169}
        />
        <Image
          className={styles.right_2ndLine}
          src="/LowerLayer/PC/right_2ndLine.webp"
          alt="right_2ndLine"
          width={644}
          height={1009}
        />

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

          <p className={styles.contact____explanation}>
            無料でご相談、お見積もりを承っております。
            <br />
            お気軽にご相談ください。
          </p>
<ContactForm />
          {/* <form className={styles.contact__form}>
            <div className={styles.form__contentWrap}>
              <div className={styles.form__content}>
                <label className={styles.labelName} htmlFor="company">
                  会社名
                </label>
                <input
                  className={styles.contact__personalInformation}
                  type="text"
                  id="company"
                  name="company"
                  placeholder="会社名"
                />
              </div>

              <div className={styles.form__content}>
                <label className={styles.labelName} htmlFor="name">
                  お名前<span className={styles.required}>必須</span>
                </label>
                <input
                  className={styles.contact__personalInformation}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="お名前"
                />
              </div>

              <div className={styles.form__content}>
                <label className={styles.labelName} htmlFor="email">
                  メールアドレス<span className={styles.required}>必須</span>
                </label>
                <input
                  className={styles.contact__personalInformation}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email@address"
                />
              </div>

              <div className={styles.form__content}>
                <label className={styles.labelName} htmlFor="inquiry">
                  お問い合わせ内容<span className={styles.required}>必須</span>
                </label>

                <div className={styles.checkboxWrap}>
                  <label className={styles.checkbox}>
                    <input
                      className={styles.contact__checkbox}
                      type="checkbox"
                      name="inquiry"
                      value="ホームページ制作"
                      defaultChecked
                    />
                    <span className={styles.custom__checkbox}></span>
                    ホームページ制作
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      className={styles.contact__checkbox}
                      type="checkbox"
                      name="inquiry"
                      value="ホームページ修正"
                    />
                    <span className={styles.custom__checkbox}></span>
                    ホームページ修正
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      className={styles.contact__checkbox}
                      type="checkbox"
                      name="inquiry"
                      value="ECサイト制作・修正"
                    />
                    <span className={styles.custom__checkbox}></span>
                    ECサイト制作・修正
                  </label>

                  <label className={styles.checkbox}>
                    <input
                      className={styles.contact__checkbox}
                      type="checkbox"
                      name="inquiry"
                      value="その他"
                    />
                    <span className={styles.custom__checkbox}></span>
                    その他
                  </label>
                </div>

                <textarea
                  id="text"
                  name="detail"
                  placeholder="お問い合わせ内容の詳細をご記入ください"
                  className={styles.contact__textarea}
                />
              </div>

              <div className={styles.form__pp}>
                <label className={styles.form__ppLabel}>
                  <input
                    className={styles.contact__checkbox}
                    type="checkbox"
                    id="pp"
                    name="privacy"
                  />
                  <span className={styles.custom__pp}></span>{" "}
                  <Link className={styles.contact__pp} href="/privacy_policy">
                    プライバシーポリシーに同意する
                  </Link>
                </label>
              </div>

              <div className={styles.contact__click}>
                <Link href="/contact/thanks">
                  <button type="submit">送信する →</button>
                </Link>
              </div>
            </div>
          </form> */}
        </div>
      </div>
    </>
  );
}

export default Page;
