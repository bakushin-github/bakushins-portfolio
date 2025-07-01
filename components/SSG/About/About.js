/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import styles from "./About.module.scss";
import H2 from "../H2/H2";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// マスクアニメーション（線が少しずつ表示される）を復活
const maskAnimationVariants = (direction = "left") => ({
  hidden: {
    clipPath: direction === "left" ? "inset(0 0 0 100%)" : 
              direction === "right" ? "inset(0 100% 0 0)" : 
              direction === "top" ? "inset(0 0 100% 0)" : 
              "inset(100% 0 0 0)", // bottom
    opacity: 1,
  },
  visible: {
    clipPath: "inset(0 0 0 0)",
    opacity: 1,
    transition: { 
      duration: 1.2, // 統一された時間
      ease: "linear", // 統一されたイージング（一定速度）
    },
  },
});

// コンテンツのスタッガーアニメーション用バリアント
const contentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.9,
    },
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

// about__2nd用の遅延付きバリアント
const secondSectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 1.8,
    },
  },
};

function About() {
  const [lineAnimationComplete, setLineAnimationComplete] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <div id="About" className={styles.about}>
      <div ref={sectionRef}>
       {/* 
// Lineのアニメーション: マスクアニメーションで線が少しずつ表示
<motion.div
  className={styles.line}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  variants={maskAnimationVariants("right")} // 右から左へ表示に変更
  onAnimationComplete={() => setLineAnimationComplete(true)}
>
  <Image
    src="/About/PC/line.webp"
    width={194}
    height={190}
    alt="ライン"
  />
</motion.div>

// Ballのアニメーション
{lineAnimationComplete && (
  <motion.div
    className={styles.ball}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1 }}
  >
    <Image
      src="/About/PC/ball.webp"
      width={44}
      height={44}
      alt="ball"
    />
  </motion.div>
)}
*/}

{/* 静止画として表示 */}
<div className={styles.line}>
  <Image
    src="/About/PC/line.webp"
    width={194}
    height={190}
    alt="ライン"
  />
</div>

<div className={styles.ball}>
  <Image
    src="/About/PC/ball.webp"
    width={44}
    height={44}
    alt="ball"
  />
</div>

          <H2
            subText="私について"
            mainText="About"
            className={styles.about__title}
          />

        <div className={styles.about__inner}>
          <motion.div
            className={styles.about__content}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={contentContainerVariants}
          >
            <motion.div
              className={styles.about__1st}
              variants={contentItemVariants}
            >
              <img
                className={styles.about__icon}
                src="/About/PC/icon.webp"
                alt="icon"
              />
              <img
                className={styles.about__iconSp}
                src="/About/Sp/icon.webp"
                alt="iconSp"
              />
              <div className={styles.about__textBlock}>
                <div className={styles.about__textImages}>
                  <Image
                    className={styles.logo}
                    src="/About/PC/logo.webp"
                    width={157}
                    height={44}
                    alt="logo"
                  />
                  <Link href={"https://x.com/official_bksn"}>
                    <Image
                      className={styles.x}
                      src="/About/PC/x.webp"
                      width={40}
                      height={38}
                      alt="x"
                    />
                  </Link>
                </div>
                <div className={styles.about__textImagesSp}>
                  <img
                    className={styles.logoSp}
                    src="/About/Sp/logo.webp"
                    alt="logoSp"
                  />
                  <Link href={"https://x.com/official_bksn"}>
                    <img
                      className={styles.xSp}
                      src="/About/Sp/x.webp"
                      alt="xSp"
                    />
                  </Link>
                </div>
                <div className={styles.about__text}>
                  医療の現場から Web
                  の世界へ。10年以上培った課題解決力と徹底的な技術習得で、お客様のニーズに応えます。ホームページはもちろん、決済機能付きのECサイトもご提供できます！<br />モダンなJavaScript、WordPressのスキルを駆使し、使いやすく効果的なサイトを制作します。医療で培った細やかな配慮で、お客様に寄り添ったサービスを提供します。
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.about__2nd}
              variants={secondSectionVariants}
            >
              <div className={styles.about__coding}>
                <Image
                  className={styles.about__codingTitle}
                  src="/About/PC/coding.webp"
                  width={194}
                  height={41}
                  alt="coding"
                />
                <img
                  className={styles.about__codingTitleSp}
                  src="/About/Sp/coding.webp"
                  alt="codingSp"
                />
                <ul className={styles.coding__lists}>
                  <li className={styles.about__list}>
                    <Image className={styles.wordpress} src="/About/Sp/wp.webp" width={75} height={75} alt="wordpress" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.shopify} src="/About/Sp/shopify.webp" width={75} height={75} alt="shopify" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.nextJs} src="/About/Sp/next.webp" width={75} height={75} alt="next.js" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.gsap} src="/About/Sp/gsap.webp" width={75} height={75} alt="gsap" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.jq} src="/About/Sp/jq.webp" width={75} height={75} alt="jQuery" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.sass} src="/About/Sp/sass.webp" width={75} height={75} alt="sass" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.html} src="/About/Sp/html.webp" width={75} height={75} alt="html" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.css} src="/About/Sp/css.webp" width={75} height={75} alt="css" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.js} src="/About/Sp/js.webp" width={75} height={75} alt="JavaScript" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.php} src="/About/Sp/php.webp" width={75} height={75} alt="php" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.github} src="/About/Sp/github.webp" width={75} height={75} alt="github" />
                  </li>
                </ul>
              </div>
              <div className={styles.about__design}>
                <Image
                  className={styles.about__designTitle}
                  src="/About/PC/design.webp"
                  width={147}
                  height={41}
                  alt="design"
                />
                <img
                  className={styles.about__designTitleSp}
                  src="/About/Sp/design.webp"
                  alt="designSp"
                />
                <ul className={styles.design__lists}>
                  <li className={styles.about__list}>
                    <Image className={styles.figma} src="/About/Sp/figma.webp" width={75} height={75} alt="figma" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.xd} src="/About/Sp/xd.webp" width={75} height={75} alt="xd" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.ps} src="/About/Sp/ps.webp" width={75} height={75} alt="Photoshop" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.ai} src="/About/Sp/ai.webp" width={75} height={75} alt="Adobe Illustrator" />
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;