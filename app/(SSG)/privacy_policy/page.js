"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/SSG/Header/Header/Header";
import Header_Sp from "@/components/SSG/Drawer/Sp/Drawer_menu/Drawer_menuSP";
import styles from "./page.module.scss";
import Breadcrumb from "@/components/Breadcrumb/index";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";
import Cta from "@/components/SSG/Cta/Cta";
import Image from "next/image";

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb("/privacy_policy");

export default function PrivacyPolicyPage() {
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
      <div className={styles.privacy}>
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
        <div className={styles.privacy__inner}>
          <div className={styles.Bread}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className={styles.privacy__title}>
            <h1 className={styles.privacy__h1}>プライバシーポリシー</h1>
            <h2 className={styles.privacy__h2}>Privacy Policy</h2>
          </div>
          <div className={styles.privacy__policy}>
          <article className={styles.pp__article}>
            <section className={styles.pp__section}>
              <p>本ウェブサイトにおける、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>
            <h3 className={styles.pp__h3}>第1条（個人情報）</h3>
            <p>個人情報」とは、個人情報保護法にいう「個人情報」を指すもので、生存する個人に関する情報であって、当該情報に含まれる氏名、住所、電話番号、メールアドレスなどの記述によって特定の個人を識別できる情報を指します</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第2条（個人情報の収集方法）</h3>
            <p>当方は、ユーザーからのお問い合わせを受ける際に、氏名、住所、電話番号、メールアドレスなどの個人情報をお尋ねすることがあります。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第3条（個人情報を収集・利用する目的）</h3>
            <p>当方が収集した個人情報は、以下の目的で利用します。</p>
            <ul>
              <li>ユーザーからのお問い合わせに回答するため</li>
              <li>お問い合わせ内容に関連する情報を提供するため</li>
              <li>必要に応じたご連絡のため</li>
              <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第4条（利用目的の変更）</h3>
            <p>当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更があった場合には、変更後の目的について当方所定の方法でユーザーに通知し、または本ウェブサイト上に公表します。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第5条（個人情報の第三者提供）</h3>
              <p>当方は、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第6条（個人情報の開示）</h3>
              <p>当方は、本人から個人情報の開示を求められた場合には、遅滞なくこれを開示します。ただし、開示によって他者の権利利益を害するおそれがある場合には、その全部または一部を開示しないことがあります。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第7条（個人情報の訂正および削除）</h3>
              <p>ユーザーは、当方が保有する自己の個人情報が誤っている場合には、当方が定める手続きにより、その訂正または削除を請求することができます。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第8条（個人情報の利用停止等）</h3>
              <p>当方は、本人から個人情報の利用停止等を求められた場合には、遅滞なく必要な調査を行います。その結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく当該個人情報の利用停止等を行います。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第9条（プライバシーポリシーの変更）</h3>
              <p>本ポリシーの内容は法令その他本ポリシーに別段の定めがある事項を除いて、ユーザーに通知することなく変更できるものとします。変更後のプライバシーポリシーは、本ウェブサイトに掲載した時点から効力を生じるものとします。</p>
            </section>
            <section className={styles.pp__section}>
            <h3 className={styles.pp__h3}>第10条（お問い合わせ窓口）</h3>
              <p>本ポリシーや個人情報のお取扱いについてのお問い合わせは、本ウェブサイト内のお問い合わせフォームをご利用ください。</p>
            </section>
          </article>
          </div>
          <Cta />
        </div>
      </div>
    </>
  );
}

// export default PrivacyPolicyPage;
