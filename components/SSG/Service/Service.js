import React, { useState, useRef, useEffect } from "react";
import H2 from "../../SSG/H2/H2"; // パスを確認してください
import styles from "./Service.module.scss";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

// MotionImage の定義は削除

// clipPath を使わないシンプルなフェードインバリアントに変更
const simpleFadeInVariants = { // direction 引数は不要になったため削除
  hidden: {
    opacity: 0,
    display: "none", // アニメーション前は非表示
  },
  visible: {
    opacity: 1,
    display: "block", // アニメーション後は表示
    transition: { duration: 2, ease: "easeOut" }, // duration は元の fadeInMaskVariants に合わせました
  },
};

const contentItemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const contentContainerVariants = {
  // hidden: {}, // 必要であれば hidden も定義
  visible: {
    transition: {
      staggerChildren: 1,
    },
  },
};

function Service() {
  const [lineAnimationComplete, setLineAnimationComplete] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // これらの state は現在 JSX 内で使用されていませんが、ロジックは残しておきます
  const [aElementsComplete, setAElementsComplete] = useState(false);
  const [bElementsComplete, setBElementsComplete] = useState(false);

  useEffect(() => {
    if (lineAnimationComplete) {
      setAElementsComplete(true);
    }
  }, [lineAnimationComplete]);

  return (
    <>
      <div id="Service" className={styles.service} ref={sectionRef}>
        <div className={styles.service__inner}>
          {/* Lineのアニメーション: motion.divでラップし、シンプルなバリアントを使用 */}
          <motion.div
            className={styles.line}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={simpleFadeInVariants} // 単純化したバリアントを適用
            onAnimationComplete={() => setLineAnimationComplete(true)}
          >
            <Image
              src="/Service/PC/line.webp"
              width={256}
              height={700}
              alt="line"
              // Next.js Imageの警告が出ている場合、CSS側で
              // width/height のどちらかに auto を指定するなどの対応をご検討ください。
            />
          </motion.div>

          {lineAnimationComplete && (
            <>
              {/* Polygon1のアニメーション: motion.divでラップ */}
              <motion.div
                className={styles.polygon1}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                onAnimationComplete={() => setBElementsComplete(true)} // bElementsComplete のロジックは残します
              >
                <Image
                  src="/Service/PC/polygon1.webp"
                  width={103}
                  height={52}
                  alt="polygon1"
                />
              </motion.div>

              {/* Polygon2のアニメーション: motion.divでラップ */}
              <motion.div
                className={styles.polygon2}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                onAnimationComplete={() => setBElementsComplete(true)} // bElementsComplete のロジックは残します
              >
                <Image
                  src="/Service/PC/polygon2.webp"
                  width={104}
                  height={52}
                  alt="polygon2"
                />
              </motion.div>
            </>
          )}
          <div className={styles.h2Content}>
            <H2
              subText="サービス"
              mainText="Service"
              className={styles.service__title}
            ></H2>
            <motion.div
              className={styles.service__motion}
              variants={contentItemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className={styles.service__text}>
                お客様一人ひとりの希望に合わせた、世界に一つだけのホームページを作ります。既製品のデザインは
                <br />
                使わず、お客様の会社やサービスの魅力を最大限に引き出す、オリジナルのデザインを提案します。見た目だけでなく、使いやすさや検索エンジンでの表示のしやすさにも気を配ります。また、お客様自身で簡単に内容を更新できるシステムも用意できます。
              </div>
            </motion.div>
          </div>

          <motion.div
            className={styles.service__content}
            variants={contentContainerVariants}
            initial="hidden" // contentContainerVariants に hidden がないので、明示的に opacity: 0 を設定するか、variants に追加
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            >
              <div className={styles.imageWrap}>
                {/* 注意: ここは通常の<img>タグです。Next.jsのImageコンポーネントではありません。 */}
                <img
                  className={styles.image}
                  src="/Service/PC/hp.webp"
                  alt="hp"
                  loading="lazy"
                />
              </div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={123}
                  height={41}
                  src="/Service/PC/title_hp.webp"
                  alt="titleHp"
                />
                <p className={styles.caption}>
                  WordPressを活用し、オリジナルデザインのWebサイトを制作。世界中のWebサイトの約64.2%、日本では80%以上で利用される信頼性の高いツールで、直感的な更新・管理が可能です。
                </p>
              </figcaption>
            </motion.figure>

            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            >
              <div className={styles.imageWrap}>
                <img
                  className={styles.image}
                  src="/Service/PC/ec.webp"
                  loading="lazy"
                  alt="ec"
                />
              </div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={128}
                  height={33}
                  src="/Service/PC/title_ec.webp"
                  alt="titleEc"
                />
                <p className={styles.caption}>
                  Shopifyを活用したECサイト構築・カスタマイズに対応。Shopifyは、世界・日本ともにシェアNo.1のECプラットフォームで、決済機能も標準搭載。スムーズな運用をサポートします。
                </p>
              </figcaption>
            </motion.figure>

            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            >
              <div className={styles.imageWrap}>
                <img
                  className={styles.image}
                  src="/Service/PC/support.webp"
                  loading="lazy"
                  alt="support"
                />
              </div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={128}
                  height={39}
                  src="/Service/PC/title_support.webp"
                  alt="titleSupport"
                />
                <p className={styles.caption}>
                  WebサイトやECサイトの保守・運用サポートを提供。定期的な更新・管理を代行し、安心してサイトを運用できる環境を整えます。
                </p>
              </figcaption>
            </motion.figure>

            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            >
              <div className={styles.imageWrap}>
                <img
                  className={styles.image}
                  src="/Service/PC/coding.webp"
                  loading="lazy"
                  alt="coding"
                />
              </div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={253}
                  height={36}
                  src="/Service/PC/title_coding.webp"
                  alt="titleCoding"
                />
                <p className={styles.caption}>
                  高品質なコーディングとカスタマイズに対応。JavaScriptやWordPress、Shopifyの調整・拡張も可能。リソース不足や外注ニーズにも柔軟に対応します。
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Service;