import React, { useState, useRef } from "react";
import styles from "./About.module.scss";
import H2 from "./H2";
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
    transition: { duration: 1.5, ease: "easeOut" },
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
      delay: 1.8, // 1.5秒の遅延を追加
    },
  },
};

function About() {
  // lineアニメーションが完了したらtrueになる状態
  const [lineAnimationComplete, setLineAnimationComplete] = useState(false);

  // 参照を作成してセクションに接続
  const sectionRef = useRef(null);

  // 要素が表示されているかどうかを追跡
  // {once: true} は一度表示されたら状態が維持されることを意味します
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <div id="About" className={styles.about}>
      <div ref={sectionRef}>
        {/* Lineのアニメーション (画面内に入ったら開始) */}
        <MotionImage
          className={styles.line}
          src="/About/PC/line.webp"
          width={194}
          height={190}
          alt="ライン"
          initial="hidden"
          // isInViewがtrueの場合のみアニメーション開始
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInMaskVariants("left")}
          onAnimationComplete={() => setLineAnimationComplete(true)}
        />

        {/* Ballのアニメーション（lineアニメーション完了後に表示） */}
        {lineAnimationComplete && (
          <MotionImage
            className={styles.ball}
            src="/About/PC/ball.webp"
            width={44}
            height={44}
            alt="ball"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
          />
        )}
        <div className={styles.about__inner}>
          <H2
            subText="私について"
            mainText="About"
            className={styles.about__title}
          />

          {/* about__contentをモーションコンポーネントでラップ */}
          <motion.div
            className={styles.about__content}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={contentContainerVariants}
          >
            {/* 第1セクションをモーションでラップ */}
            <motion.div
              className={styles.about__1st}
              variants={contentItemVariants}
            >
              <Image
                className={styles.about__icon}
                src="/About/PC/icon.webp"
                width={213}
                height={213}
                alt="icon"
              />
              <div className={styles.about__textBlock}>
                <div className={styles.about__textImages}>
                  <Image
                    className={styles.logo}
                    src="/About/PC/logo.webp"
                    width={157.09}
                    height={44.31}
                    alt="logo"
                  />
                  <Image
                    className={styles.x}
                    src="/About/PC/x.webp"
                    width={40}
                    height={38}
                    alt="x"
                  />
                </div>
                <div className={styles.about__text}>
                  医療の現場から Web
                  の世界へ。10年以上培った課題解決力と1年以上の徹底的な技術習得で、お客様のニーズに応えます。HTML、CSS、JavaScript、PHP、WordPressのスキルを駆使し、使いやすく効果的なサイトを制作。医療で培った細やかな配慮で、お客様に寄り添ったサービスを提供します。
                </div>
              </div>
            </motion.div>

            {/* 第2セクションをモーションでラップ - 遅延付きバリアントを使用 */}
            <motion.div
              className={styles.about__2nd}
              variants={secondSectionVariants} // 遅延付きバリアントを適用
            >
              <div className={styles.about__coding}>
                <Image
                  className={styles.about__codingTitle}
                  src="/About/PC/coding.webp"
                  width={194}
                  height={41}
                  alt="coding"
                />
                <ul className={styles.coding__lists}>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.wordpress}
                      src="/About/PC/wp.webp"
                      width={75}
                      height={75}
                      alt="wordpress"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.shopify}
                      src="/About/PC/shopify.webp"
                      width={66}
                      height={75}
                      alt="shopify"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.nextJs}
                      src="/About/PC/next.js.webp"
                      width={67}
                      height={67}
                      alt="next.js"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.gsap}
                      src="/About/PC/gsap.webp"
                      width={68}
                      height={68}
                      alt="gsap"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.jq}
                      src="/About/PC/jq.webp"
                      width={75}
                      height={75}
                      alt="jQuery"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.sass}
                      src="/About/PC/sass.webp"
                      width={69}
                      height={52}
                      alt="sass"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.html}
                      src="/About/PC/html.webp"
                      width={61}
                      height={68}
                      alt="html"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.css}
                      src="/About/PC/css.webp"
                      width={60}
                      height={68}
                      alt="css"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.js}
                      src="/About/PC/js.webp"
                      width={69}
                      height={68}
                      alt="JavaScript"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.php}
                      src="/About/PC/php.webp"
                      width={74}
                      height={38}
                      alt="php"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.github}
                      src="/About/PC/github.webp"
                      width={75}
                      height={75}
                      alt="github"
                    />
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
                <ul className={styles.design__lists}>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.figma}
                      src="/About/PC/figma.webp"
                      width={75}
                      height={75}
                      alt="figma"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.xd}
                      src="/About/PC/xd.webp"
                      width={69}
                      height={67}
                      alt="xd"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.ps}
                      src="/About/PC/ps.webp"
                      width={69}
                      height={67}
                      alt="Photoshop"
                    />
                  </li>
                  <li className={styles.about__list}>
                    <Image
                      className={styles.ai}
                      src="/About/PC/ai.webp"
                      width={69}
                      height={67}
                      alt="Adobe Illustrator"
                    />
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