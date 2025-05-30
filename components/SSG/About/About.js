import React, { useState, useRef } from "react";
import styles from "./About.module.scss";
import H2 from "../H2/H2";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// MotionImage の定義は削除

// clipPath を使わないシンプルなフェードインバリアントに変更
const simpleFadeInVariants = {
  hidden: {
    opacity: 0,
    display: "none", // アニメーション前は非表示
  },
  visible: {
    opacity: 1,
    display: "block", // アニメーション後は表示
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

// コンテンツのスタッガーアニメーション用バリアント (変更なし)
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

// about__2nd用の遅延付きバリアント (変更なし)
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
        {/* Lineのアニメーション: motion.divでラップし、シンプルなバリアントを使用 */}
        <motion.div
          className={styles.line}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={simpleFadeInVariants} // 単純化したバリアントを適用
          onAnimationComplete={() => setLineAnimationComplete(true)}
        >
          <Image
            src="/About/PC/line.webp"
            width={194}
            height={190}
            alt="ライン"
            // Next.js Imageの警告が出ている場合、CSS側で
            // width/height のどちらかに auto を指定するか、
            // fill prop を使うなどの対応をご検討ください。
            // 例: style={{ width: '100%', height: 'auto' }} (親要素のサイズに依存)
          />
        </motion.div>

        {/* Ballのアニメーション: motion.divでラップ */}
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

        <div className={styles.about__inner}>
          <H2
            subText="私について"
            mainText="About"
            className={styles.about__title}
          />

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
              {/*
                Next.js Image の警告が出ている場合、以下の Image コンポーネントにも
                CSS側での width/height:auto の調整や、
                fill prop の使用などを検討してください。
                className={styles.about__icon} に適用されているCSSを確認してください。
              */}
              <Image
                className={styles.about__icon}
                src="/About/PC/icon.webp" // この画像のパスは以前のログで警告が出ていました
                width={213}
                height={213}
                alt="icon"
              />
              <div className={styles.about__textBlock}>
                <div className={styles.about__textImages}>
                  <Image
                    className={styles.logo}
                    src="/About/PC/logo.webp"
                    width={157.09} // 小数点を含む width/height は整数に丸めることを推奨
                    height={44.31}  // 同上
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
                <div className={styles.about__text}>
                  医療の現場から Web
                  の世界へ。10年以上培った課題解決力と徹底的な技術習得で、お客様のニーズに応えます。ホームページはもちろん、決済機能付きのECサイトもご提供できます！モダンなJavaScript、WordPressのスキルを駆使し、使いやすく効果的なサイトを制作します。医療で培った細やかな配慮で、お客様に寄り添ったサービスを提供します。
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
                <ul className={styles.coding__lists}>
                  {/* 各スキルアイコンの Image についても、必要であればCSSやpropsを調整 */}
                  <li className={styles.about__list}>
                    <Image className={styles.wordpress} src="/About/PC/wp.webp" width={75} height={75} alt="wordpress" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.shopify} src="/About/PC/shopify.webp" width={66} height={75} alt="shopify" />
                  </li>
                  {/* ... 他スキルアイコンも同様 ... */}
                  <li className={styles.about__list}>
                    <Image className={styles.nextJs} src="/About/PC/next.js.webp" width={67} height={67} alt="next.js" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.gsap} src="/About/PC/gsap.webp" width={68} height={68} alt="gsap" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.jq} src="/About/PC/jq.webp" width={75} height={75} alt="jQuery" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.sass} src="/About/PC/sass.webp" width={69} height={52} alt="sass" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.html} src="/About/PC/html.webp" width={61} height={68} alt="html" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.css} src="/About/PC/css.webp" width={60} height={68} alt="css" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.js} src="/About/PC/js.webp" width={69} height={68} alt="JavaScript" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.php} src="/About/PC/php.webp" width={74} height={38} alt="php" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.github} src="/About/PC/github.webp" width={75} height={75} alt="github" />
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
                  {/* 各デザインツールアイコンも同様 */}
                  <li className={styles.about__list}>
                    <Image className={styles.figma} src="/About/PC/figma.webp" width={75} height={75} alt="figma" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.xd} src="/About/PC/xd.webp" width={69} height={67} alt="xd" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.ps} src="/About/PC/ps.webp" width={69} height={67} alt="Photoshop" />
                  </li>
                  <li className={styles.about__list}>
                    <Image className={styles.ai} src="/About/PC/ai.webp" width={69} height={67} alt="Adobe Illustrator" />
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