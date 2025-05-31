"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FvTextImage from "../../../components/animation/Fv_text_image.js"; // パスを確認
import styles from "./FV.module.scss";
import Image from "next/image"; // next/image.js ではなく next/image
import { useLoadingContext } from '@/components/Loading/ClientWrapper'; // パスを確認

function Fv() {
  const { shouldTriggerAnimation, isLoadingComplete } = useLoadingContext();

  const [aElementsComplete, setAElementsComplete] = useState(false);
  const [bElementsComplete, setBElementsComplete] = useState(false);
  const [imageTextAnimationComplete, setImageTextAnimationComplete] = useState(false);
  
  const [aElementsStatus, setAElementsStatus] = useState({
    header_line: false,
    left_line: false,
    right_line: false
  });

  useEffect(() => {
    const allAElementsComplete = Object.values(aElementsStatus).every(status => status);
    if (allAElementsComplete && shouldTriggerAnimation) {
      setAElementsComplete(true);
    }
  }, [aElementsStatus, shouldTriggerAnimation]);

  // Variants for simultaneous image and text animation (変更なし)
  const imageTextVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0,
        staggerChildren: 0.03,
        // onComplete は useEffect で imageTextAnimationComplete を監視する方が堅牢な場合があります
      },
    },
  };
  // onComplete は variants のトップレベルではなく、animate の定義内や transition の onComplete として指定します。
  // ここでは imageTextAnimationComplete は bElementsComplete と同時に設定されるように見えます。
  // もし imageTextVariants のアニメーション完了で状態を更新したい場合は、
  // <motion.div onAnimationComplete={() => { if (shouldTriggerAnimation) setImageTextAnimationComplete(true); }} ... />
  // のように motion 要素の onAnimationComplete を使います。

  // Mask Animation Variants with Direction -> Simple Fade In Variants に変更
  const simpleFadeInVariants = { // direction 引数は不要になりました
    hidden: {
      opacity: 0,
      // display: "none", // opacity:0 で非表示になるので、display は不要な場合が多い
    },
    visible: {
      opacity: 1,
      // display: "block",
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  const handleAElementComplete = (elementName) => {
    if (shouldTriggerAnimation) {
      setAElementsStatus(prev => ({
        ...prev,
        [elementName]: true
      }));
    }
  };

  // B要素のアニメーション完了を追跡 (bElementsComplete は polygon1 と header_ball で設定)
  let bElementsCount = 0;
  const totalBElementsToComplete = 2; // header_ball, polygon1 (polygon2はonAnimationCompleteがない)
  const handleBElementComplete = () => {
    if (shouldTriggerAnimation) {
      bElementsCount++;
      if (bElementsCount >= totalBElementsToComplete) {
        setBElementsComplete(true);
      }
    }
  };
  
  // ImageTextアニメーションの完了を追跡 (fv_image と fv__text の両方が完了したか)
  let imageTextCount = 0;
  const totalImageTextToComplete = 2; // fv_image と fv__text
  const handleImageTextComplete = () => {
    if (shouldTriggerAnimation) {
        imageTextCount++;
        if (imageTextCount >= totalImageTextToComplete) {
            setImageTextAnimationComplete(true);
        }
    }
  }


  return (
    <>
      <div id="Fv" className={styles.fv} style={{ height: "100vh" }}>
        {/* A Elements: variants を simpleFadeInVariants に変更 */}
        <motion.img
          className={styles.fv_header_line}
          src="/Fv/header_line.webp"
          alt="header_line"
          width="194" // 通常のimgタグなのでwidth/height属性はOK
          height="178"
          initial="hidden"
          animate={shouldTriggerAnimation ? "visible" : "hidden"}
          variants={simpleFadeInVariants} // 修正
          onAnimationComplete={() => handleAElementComplete('header_line')}
        />
        
        <motion.img
          className={styles.fv_left_line}
          src="/Fv/left_line.webp"
          alt="left_line"
          width="390"
          height="197"
          initial="hidden"
          animate={shouldTriggerAnimation ? "visible" : "hidden"}
          variants={simpleFadeInVariants} // 修正
          onAnimationComplete={() => handleAElementComplete('left_line')}
        />
        
        <motion.img
          className={styles.fv_right_line}
          src="/Fv/right_line.webp"
          alt="right_line"
          width="426"
          height="215"
          initial="hidden"
          animate={shouldTriggerAnimation ? "visible" : "hidden"}
          variants={simpleFadeInVariants} // 修正
          onAnimationComplete={() => handleAElementComplete('right_line')}
        />

        {/* B Elements */}
        {shouldTriggerAnimation && aElementsComplete && (
          <>
            <motion.img
              className={styles.fv_header_ball}
              src="/Fv/header_ball.webp"
              alt="header_ball"
              width="44"
              height="44"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }} // transition はここに含めるか、variants で定義
              transition={{ duration: 1 }}
              onAnimationComplete={handleBElementComplete} // 修正
            />
            
            <motion.img
              className={styles.fv_right_polygon_left}
              src="/Fv/right_polygon_left.webp"
              alt="right_polygon_left"
              width="46"
              height="79"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              onAnimationComplete={handleBElementComplete} // polygon1にも完了ハンドラ追加（例）
            />
            
            <motion.img
              className={styles.fv_right_polygon_right}
              src="/Fv/right_polygon_right.webp"
              alt="right_polygon_right"
              width="36"
              height="72"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              // onAnimationComplete={handleBElementComplete} // 必要なら追加
            />
          </>
        )}

        {/* Image and Text Animation */}
        {/* bElementsComplete の代わりに aElementsComplete を使うか、bElementsComplete のロジックを確実にする */}
        {shouldTriggerAnimation && aElementsComplete && ( // bElementsComplete を待つと遅れる可能性があるので aElementsComplete で開始
          <>
            <motion.div
              className={styles.fv_image}
              initial="hidden"
              animate="visible"
              variants={imageTextVariants}
              onAnimationComplete={handleImageTextComplete}
            >
              {/* Next.js Image コンポーネントに priority を追加 */}
              <Image 
                src="/Fv/fv_image.webp" 
                alt="ファーストビュー メイン画像" // より具体的なalt
                width="420" 
                height="467"
                priority // LCP対策
              />
            </motion.div>

            <motion.div
              className={styles.fv__text}
              initial="hidden"
              animate="visible"
              variants={imageTextVariants}
              onAnimationComplete={handleImageTextComplete}
            >
              <h1 className={styles.fv__text_h1}>
                <FvTextImage text="ユニークで一番の<br/>サイトをあなたへ。" />
              </h1>
              <div className={styles.fv__text_div}>
                <FvTextImage text="Webの世界に踏み出す第一歩を、しっかりサポートします。" />
              </div>
            </motion.div>
          </>
        )}

        {/* SVG Animation */}
        {shouldTriggerAnimation && imageTextAnimationComplete && ( // imageTextAnimationComplete をトリガーに
          <motion.div style={{ position: "absolute", top: "418px", left: "491px" }}>
            <svg width="244.44444274902344" height="22" viewBox="0 0 245 22" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <motion.path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M174.77 4.49061C171.627 4.40999 168.482 4.29372 165.338 4.26788C156.176 4.19684 147.017 4.43579 137.855 4.56819C113.194 4.92987 88.298 4.6554 63.6886 6.53162C63.2472 6.56391 62.8575 6.23128 62.8252 5.78563C62.793 5.34322 63.1248 4.95573 63.5662 4.92021C88.2078 3.04399 113.139 3.31522 137.833 2.95354C143.899 2.86635 149.962 2.73076 156.028 2.67264C127.53 1.0257 98.9775 1.50682 70.47 2.71458C58.5857 3.21835 46.74 3.93528 34.9041 5.09137C31.4377 5.43044 27.9648 5.72753 24.5049 6.13442C35.0039 7.44229 46.0764 6.74154 56.4176 6.71248C77.3641 6.66081 98.317 6.61878 119.26 7.14192C130.79 7.42933 132.478 7.58441 143.564 8.26579C150.883 8.71466 150.687 8.68883 157.339 9.23781C158.238 9.31208 160.567 9.38634 160.892 9.4703C161.24 9.56072 161.398 9.7674 161.469 9.95147C163.57 9.94824 165.673 9.95147 167.774 9.95793C184.97 10.0193 202.09 12.2862 219.231 13.1808C184.938 11.6339 167.767 11.5726 155.445 11.5854C144.26 12.3734 132.842 11.8664 121.693 12.2474C101.323 12.945 80.8337 13.8363 60.5186 15.5091C45.213 16.7685 29.93 18.2055 14.6921 20.1076C10.2785 20.6565 5.88433 21.3346 1.47403 21.9159C1.30006 21.9385 0.845855 22.0031 0.781424 21.9999C0.188659 21.9773 0.0533192 21.5155 0.0211037 21.3767C0.00499591 21.3088 -0.13673 20.6307 0.607448 20.4046C15.5426 15.9127 33.4254 16.0774 48.8244 14.7598C81.2139 11.9891 113.761 10.439 146.292 10.0483"
                stroke="#000000" // SCSS変数やテーマカラーを使うことを検討
                strokeWidth="1" // デザインに合わせて調整
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default Fv;