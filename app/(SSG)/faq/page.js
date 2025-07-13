"use client";

import React, { useState, useEffect } from "react";
import Toggle from "@/components/SSG/Faq/Toggle/Toggle";
import styles from "./page.module.scss";
import Cta from "@/components/SSG/Cta/Cta";
import Header from "../../../components/SSG/Header/Header/Header";
import Header_Sp from "../../../components/SSG/Drawer/Sp/Drawer_menu/Drawer_menuSP";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb/index";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";
import { ScrollMotion } from "@/components/animation/Stagger/ScrollMotion";

const breadcrumbItems = generateBreadcrumb('/faq');

async function getData() {
  return [
    {
      title: "ご相談、お見積もりは無料ですか？",
      content:
        "無料で承っておりますので、ご安心ください。「ちょっと相談したいことがある」などお気軽にご連絡ください。",
    },
    {
      title: "制作期間はどのくらいかかりますか？",
      content:
        "シンプルな1ページのサイトであれば1ヶ月ほどです。複数のページにわたる本格的な企業サイトの場合は2−3ヶ月ほどです。詳細はお打ち合わせの際にお見積もりと合わせてご提示いたします。。",
    },
    {
      title: "ホームページの保守や運用はどんなサービスですか？",
      content:
        "次のようなサービスを提供させていただきます。サイトの仕様変更・お知らせやブログ記事の投稿代行・アクセス解析の実施とレポート作成・デザインや画像・写真の変更・サイトの定期的なバックアップ・サイトの不具合や障害の対応。その他、ご要望に応じてサービスを提供させていただきます。",
    },
    {
      title: "料金はどのくらいかかりますか？",
      content:
        "シンプルな1ページのサイト約 20-30万円、企業サイト（複数ページ） 約50-120万円、保守・運用は約5千-1万円/月になります。詳細はお打ち合わせの際にご提示いたします。",
    },
    {
      title: "デザイン、写真、動画、文章なども依頼できますか？",
      content:
        "デザイン、写真、動画、文章もすべて承っております。各分野に精通したスペシャリストが協働して、お客様のニーズにお応えします。",
    },
  ];
}

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchFaqData = async () => {
      const data = await getData();
      setFaqItems(data);
    };
    fetchFaqData();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const BREAKPOINT_SP = 768;

  return (
    <div className={styles.faq}>
      <div className={styles.left_1stLineParent}>
        <Image
          className={styles.left_1stLine}
          src="/LowerLayer/PC/left_1stLine.webp"
          alt="left_1stLine"
          fill
        />
      </div>
      <div className={styles.left_2ndLineParent}>
        <Image
          className={styles.left_2ndLine}
          src="/LowerLayer/PC/left_2ndLine.webp"
          alt="left_2ndLine"
          fill
        />
      </div>
      <div className={styles.right_1stLineParent}>
        <Image
          className={styles.right_1stLine}
          src="/LowerLayer/PC/right_1stLine.webp"
          alt="right_1stLine"
          fill
        />
      </div>
      <div className={styles.ballParent}>
        <Image
          className={styles.ball}
          src="/LowerLayer/PC/ball.webp"
          alt="ball"
          fill
        />
      </div>
      <div className={styles.right_2ndParent}>
        <Image
          className={styles.right_2nd}
          src="/LowerLayer/PC/right_2nd.webp"
          alt="right_2nd"
          fill
        />
      </div>

      {windowWidth > BREAKPOINT_SP ? (
        <Header />
      ) : (
        <Header_Sp toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      )}

      <div className={styles.faq__inner}>
        <div className={styles.Bread}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className={styles.faq__title}>
          <h1 className={styles.faq__h1}>よくある質問</h1>
          <h2 className={styles.faq__h2}>FAQ</h2>
        </div>
        <div className={styles.faq__items}>
          {faqItems.map((item, index) => (
            <ScrollMotion 
              key={index}
              delay={0.2}
              duration={0.6}
              yOffset={30}
              threshold={0.3}
              once={true}
            >
              <Toggle
                className={styles.faq__itemsToggle}
                content={item}
              />
            </ScrollMotion>
          ))}
        </div>
      </div>
      <Cta />
    </div>
  );
}
