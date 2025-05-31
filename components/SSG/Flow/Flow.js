import React, { useEffect, useRef } from "react";
import H2 from "../H2/H2"; // パスを確認してください
import styles from "./Flow.module.scss";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";

function Flow() {
  const sectionRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const figureVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      rotate: -15,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.2, // 短めのdurationに変更（元は0.2でしたが、他のコンポーネントに合わせて調整も可）
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      const sequenceAnimation = async () => {
        for (let i = 0; i < 6; i++) {
          // controls.start のカスタム関数は、各要素の custom prop (index) を受け取ります
          await controls.start((customIndex) => {
            // 現在アニメーションさせたい要素 (customIndex === i) は 'visible' に
            // それより前の要素 (customIndex < i) も 'visible' のまま
            // それより後の要素は 'hidden'
            if (customIndex === i) return "visible";
            if (customIndex < i) return "visible"; // 既に表示されたものは表示したまま
            return "hidden";
          });

          if (i < 5) { // 最後の要素のアニメーション後には待機しない
            await new Promise((resolve) => setTimeout(resolve, 200)); // 待機時間
          }
        }
      };
      sequenceAnimation();
    }
  }, [controls, isInView]);

  // 各画像の情報を配列で管理 (高さが異なる場合などに対応しやすくするため)
  // ここでは仮にすべて同じ画像パスパターンとしますが、実際にはデータソースから取得することを推奨
  const flowItems = [
    {
      id: 1,
      title: "お問い合わせ（無料）",
      caption: "まずはお気軽にご相談ください。\n課題やご希望を丁寧に伺い、\n制作の流れをご説明します。",
      imageSrc: "/Flow/PC/1.webp",
      imageAlt: "お問い合わせ",
    },
    {
      id: 2,
      title: "お見積り（無料）",
      caption: "ヒアリング内容をもとに、\nお見積りをご提案します。",
      link: { href: "/price", text: "費用のめやすはこちら >" },
      imageSrc: "/Flow/PC/2.webp",
      imageAlt: "お見積り",
    },
    {
      id: 3,
      title: "設計・デザイン制作",
      caption: "サイトの構成を設計し、デザインを制作。フィードバックを反映しながら仕上げます。",
      imageSrc: "/Flow/PC/3.webp",
      imageAlt: "設計・デザイン制作",
    },
    {
      id: 4,
      title: "コーディング・<br />動作確認", // dangerouslySetInnerHTML を使うか、React要素で分割
      caption: "デザインをWeb上で正しく表示できるようコーディングし、各デバイスで動作確認を行います。",
      imageSrc: "/Flow/PC/4.webp",
      imageAlt: "コーディング・動作確認",
    },
    {
      id: 5,
      title: "サイト公開",
      caption: "問題がなければ本番環境へアップし、公開。ドメイン・サーバー取得のサポートも可能です。",
      imageSrc: "/Flow/PC/5.webp",
      imageAlt: "サイト公開",
    },
    {
      id: 6,
      title: "アフターサポート",
      caption: "公開後1ヶ月間、軽微な修正（テキスト・画像の変更など）を無料対応。その後の運用サポートもご相談いただけます。",
      imageSrc: "/Flow/PC/6.webp",
      imageAlt: "アフターサポート",
    },
  ];


  return (
    <>
      <div id="Flow" className={styles.flow}>
        <div className={styles.flow__inner}>
          <H2
            subText="制作の流れ"
            mainText="Flow"
            className={styles.flow__title}
          />
          <div className={styles.flow__contain} ref={sectionRef}>
            {flowItems.map((item, index) => (
              <motion.figure
                key={item.id}
                className={styles.flow__figure}
                custom={index} // custom prop に index を渡す
                initial="hidden"
                animate={controls}
                variants={figureVariants}
              >
                {/* 画像をラップするコンテナを追加 */}
                <div className={styles.imageContainer}>
                  <Image
                    className={styles.image} // このクラスは object-fit や border-radius などに利用
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill // fill prop を使用
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // レスポンシブイメージのヒント (実際のレイアウトに合わせて調整)
                    priority={index < 3} // 最初の数枚を優先読み込み (任意)
                  />
                </div>
                <figcaption className={styles.figcaption}>
                  {/* dangerouslySetInnerHTML を使って h3 の <br /> を有効にするか、文字列を分割して表示 */}
                  <h3 className={styles.h3} dangerouslySetInnerHTML={{ __html: item.title }}></h3>
                  <p className={styles.h3__caption}>
                    {item.caption.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{line}{i < item.caption.split('\n').length -1 && <br />}</React.Fragment>
                    ))}
                  </p>
                  {item.link && (
                    <Link href={item.link.href} className={styles.price__link}>
                      <p className={styles.price}>{item.link.text}</p>
                    </Link>
                  )}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Flow;