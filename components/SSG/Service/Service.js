/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import H2 from "../../SSG/H2/H2";
import styles from "./Service.module.scss";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

// 最適化されたImage用のMotionコンポーネント
const MotionImage = motion(Image);

const fadeInMaskVariants = (direction) => ({
  hidden: {
    opacity: 0,
    clipPath: direction === "right" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
    display: "none",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    display: "block",
    transition: { duration: 2, ease: "easeOut" },
  },
});

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
<Image
          // {/* <MotionImage */}
            className={styles.line}
            src="/Service/PC/line.webp"
            width={256}
            height={700}
            alt="line"
            // initial="hidden"
            // animate={isInView ? "visible" : "hidden"}
            // variants={fadeInMaskVariants("left")}
            // onAnimationComplete={() => setLineAnimationComplete(true)}
          // ></MotionImage>
          />
          <Image
          // {/* <MotionImage */}
            className={styles.lineSp}
            src="/Service/Sp/line.webp"
            width={86}
            height={642}
            alt="lineSp"
            // initial="hidden"
            // animate={isInView ? "visible" : "hidden"}
            // variants={fadeInMaskVariants("left")}
            // onAnimationComplete={() => setLineAnimationComplete(true)}
          // ></MotionImage>
          />
          {/* {lineAnimationComplete && ( */}
            <>
            <Image
              // {/* <MotionImage */}
                className={styles.polygon1}
                src="/Service/PC/polygon1.webp"
                width={103}
                height={52}
                alt="polygon1"
                // initial={{ opacity: 0, scale: 0.5 }}
                // animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                // onAnimationComplete={() => setBElementsComplete(true)}
              // ></MotionImage>
              />
              <Image
              // {/* <MotionImage */}
                className={styles.polygon1Sp}
                src="/Service/Sp/polygon1.webp"
                width={116}
                height={61}
                alt="polygon1Sp"
                // initial={{ opacity: 0, scale: 0.5 }}
                // animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                // onAnimationComplete={() => setBElementsComplete(true)}
              // ></MotionImage>
              />
              <Image
              // {/* <MotionImage */}
                className={styles.polygon2}
                src="/Service/PC/polygon2.webp"
                width={119}
                height={69}
                alt="polygon2"
                // initial={{ opacity: 0, scale: 0.5 }}
                // animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                // onAnimationComplete={() => setBElementsComplete(true)}
              // ></MotionImage>
              />
              <Image
              // {/* <MotionImage */}
                className={styles.polygon2Sp}
                src="/Service/Sp/polygon2.webp"
                width={125}
                height={81}
                alt="polygon2Sp"
                // initial={{ opacity: 0, scale: 0.5 }}
                // animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                // onAnimationComplete={() => setBElementsComplete(true)}
              // ></MotionImage>
              />
            </>
          {/* )} */}
          <div className={styles.h2Content}>
            <H2
              subText="サービス"
              mainText="Service"
              className={styles.service__title}
            ></H2>
                    <div className={styles.service__inner}>
            <motion.div
              className={styles.service__motion}
              variants={contentItemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className={styles.service__text}>
                お客様一人ひとりの希望に合わせた、世界に一つだけのホームページを作ります。既製品のデザインは
                {/* <br /> */}
                使わず、お客様の会社やサービスの魅力を最大限に引き出す、オリジナルのデザインを提案します。見た目だけでなく、使いやすさや検索エンジンでの表示のしやすさにも気を配ります。また、お客様自身で簡単に内容を更新できるシステムも用意できます。
              </div>
            </motion.div>
          </div>

          {/* ▼ figure群にアニメーション追加 ▼ */}
          <motion.div
            className={styles.service__content}
            variants={contentContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            ><div className={styles.imageWrap}>
              <img
                className={styles.image}
                               src="/Service/PC/hp.webp"
                alt="hp"
                loading="lazy"
              />
              <img
                className={styles.imageSp}
                               src="/Service/Sp/hp.webp"
                alt="hpSp"
                loading="lazy"
              /></div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={123}
                  height={40}
                  src="/Service/PC/title_hp.webp"
                  alt="titleHp"
                />
                <Image
                  className={styles.titleSp}
                  width={104}
                  height={41}
                  src="/Service/Sp/title_hp.webp"
                  alt="titleHpSp
                  "
                />
                <p className={styles.caption}>
                  WordPressを活用し、オリジナルデザインのWebサイトを制作。世界中のWebサイトの約64.2%、日本では80%以上で利用される信頼性の高いツールで、直感的な更新・管理が可能です。
                </p>
              </figcaption>
            </motion.figure>

            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            ><div className={styles.imageWrap}>
              <img
                className={styles.imageEc}
                src="/Service/PC/ec.webp"
                loading="lazy"
                alt="ec"
              />
              <img
                className={styles.imageSp}
                src="/Service/Sp/ec.webp"
                loading="lazy"
                alt="ecSp"
              /></div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={180}
                  height={40}
                  src="/Service/PC/title_ec.webp"
                  alt="titleEc"
                />
                <Image
                  className={styles.titleSp}
                  width={155}
                  height={41}
                  src="/Service/Sp/title_ec.webp"
                  alt="titleEcSp"
                />
                <p className={styles.caption}>
                  Shopifyを活用したECサイト構築・カスタマイズに対応。Shopifyは、世界・日本ともにシェアNo.1のECプラットフォームで、決済機能も標準搭載。スムーズな運用をサポートします。
                </p>
              </figcaption>
            </motion.figure>

            <motion.figure
              className={styles.figure}
              variants={contentItemVariants}
            ><div className={styles.imageWrap}>
              <img
                className={styles.image}
                src="/Service/PC/support.webp"
                loading="lazy"
                alt="support"
              />
              <img
                className={styles.imageSp}
                src="/Service/Sp/support.webp"
                loading="lazy"
                alt="supportSp"
              /></div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={154}
                  height={40}
                  src="/Service/PC/title_support.webp"
                  alt="titleSupport"
                />
                <Image
                  className={styles.titleSp}
                  width={133}
                  height={41}
                  src="/Service/Sp/title_support.webp"
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
            ><div className={styles.imageWrap}>
              <img
                className={styles.image}
                src="/Service/PC/coding.webp"
                loading="lazy"
                alt="coding"
              />
              <img
                className={styles.imageSp}
                src="/Service/Sp/coding.webp"
                loading="lazy"
                alt="codingSp"
              /></div>
              <figcaption className={styles.figcaption}>
                <Image
                  className={styles.title}
                  width={312}
                  height={40}
                  src="/Service/PC/title_coding.webp"
                  alt="titleCoding"
                />
                <Image
                  className={styles.titleSp}
                  width={275}
                  height={41}
                  src="/Service/Sp/title_coding.webp"
                  alt="titleCodingSp"
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
