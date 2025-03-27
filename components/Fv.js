"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FvTextImage from "./animation/Fv_text_image.js";
import styles from "./FV.module.scss";

function Fv() {
  const [aElementsComplete, setAElementsComplete] = useState(false);
  const [bElementsComplete, setBElementsComplete] = useState(false);
  const [imageTextAnimationComplete, setImageTextAnimationComplete] = useState(false); // New state for image and text animation

  // Variants for simultaneous image and text animation
  const imageTextVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0,
        staggerChildren: 0.03,
        onComplete: () => setImageTextAnimationComplete(true), // Set state to true when animation completes
      },
    },
  };

  // Mask Animation Variants with Direction
  const fadeInMaskVariants = (direction) => ({
    hidden: {
      opacity: 0,
      clipPath:
        direction === "right" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      display: "none",
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0 0 0)",
      display: "block",
      transition: { duration: 1.5, ease: "easeOut" },
    },
  });

  return (
    <div className="fv">
      {/* Initially hidden images */}
      <img
        className={styles.fv_header_ball}
        src="/Fv/header_ball.webp"
        alt="header_ball"
        width="44"
        height="44"
        style={{ display: "none" }}
      />
      <img
        className={styles.fv_header_line}
        src="/Fv/header_line.webp"
        alt="header_line"
        width="194"
        height="178"
        style={{ display: "none" }}
      />
      <img
        className={styles.fv_left_line}
        src="/Fv/left_line.webp"
        alt="left_line"
        width="390"
        height="197"
        style={{ display: "none" }}
      />
      <img
        className={styles.fv_right_line}
        src="/Fv/right_line.webp"
        alt="right_line"
        width="426"
        height="215"
        style={{ display: "none" }}
      />
      <img
        className={styles.fv_right_polygon_left}
        src="/Fv/right_polygon_left.webp"
        alt="right_polygon_left"
        width="46"
        height="79"
        style={{ display: "none" }}
      />
      <img
        className={styles.fv_right_polygon_right}
        src="/Fv/right_polygon_right.webp"
        alt="right_polygon_right"
        width="36"
        height="72"
        style={{ display: "none" }}
      />

      {/* A Elements */}
      <motion.img
        className={styles.fv_header_line}
        src="/Fv/header_line.webp"
        alt="header_line"
        width="194"
        height="178"
        initial="hidden"
        animate="visible"
        variants={fadeInMaskVariants("right")} // Right to left
      />
      <motion.img
        className={styles.fv_left_line}
        src="/Fv/left_line.webp"
        alt="left_line"
        width="390"
        height="197"
        initial="hidden"
        animate="visible"
        variants={fadeInMaskVariants("right")} // Right to left
      />
      <motion.img
        className={styles.fv_right_line}
        src="/Fv/right_line.webp"
        alt="right_line"
        width="426"
        height="215"
        initial="hidden"
        animate="visible"
        variants={fadeInMaskVariants("left")} // Left to right
        onAnimationComplete={() => setAElementsComplete(true)}
      />

      {/* B Elements (displayed after A is complete) */}
      {aElementsComplete && (
        <>
          <motion.img
            className={styles.fv_header_ball}
            src="/Fv/header_ball.webp"
            alt="header_ball"
            width="44"
            height="44"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
            onAnimationComplete={() => setBElementsComplete(true)}
          />
          <motion.img
            className={styles.fv_right_polygon_left}
            src="/Fv/right_polygon_left.webp"
            alt="right_polygon_left"
            width="46"
            height="79"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          />
          <motion.img
            className={styles.fv_right_polygon_right}
            src="/Fv/right_polygon_right.webp"
            alt="right_polygon_right"
            width="36"
            height="72"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          />
        </>
      )}

      {/* Image and Text Animation (displayed after B is complete) */}
      {bElementsComplete && (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageTextVariants}
            style={{
              position: "absolute",
              maxWidth: "420px",
              width: "100%",
              maxHeight: "467.478px",
              top: "177px",
              right: "188px",
              borderRadius: "9.74px",
            }}
          >
            <img
              src="/Fv/fv_image.webp"
              alt="fv_image"
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageTextVariants}
            style={{
              position: "absolute",
              maxWidth: "576px",
              maxHeight: "231px",
              width: "100%",
              top: "295px",
              left: "203px",
              gap: "24px",
            }}
          >
            <h1
              style={{
                fontWeight: 700,
                fontSize: "64px",
                lineHeight: "150%",
                letterSpacing: "0%",
                color: "#2F4AB2",
              }}
            >
              <FvTextImage text="ユニークで一番の<br/>サイトをあなたへ。" />
            </h1>
            <div
              style={{
                marginTop: "24px",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "170%",
                letterSpacing: "-10%",
                color: "#2F4AB2",
              }}
            >
              <FvTextImage text="Webの世界に踏み出す第一歩を、しっかりサポートします。" />
            </div>
          </motion.div>
        </>
      )}

      {/* Conditionally render SVG Animation after image and text animation */}
      {bElementsComplete && imageTextAnimationComplete && (
        <motion.div
          style={{
            position: "absolute",
            top: "418px",
            left: "491px",
          }}
        >
          <svg
            width="244.44444274902344"
            height="22"
            viewBox="0 0 245 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M146.292 10.0483C113.761 10.439 81.2139 11.9891 48.8244 14.7598C33.4254 16.0774 15.5426 15.9127 0.607448 20.4046C-0.13673 20.6307 0.00499591 21.3088 0.0211037 21.3767C0.0533192 21.5155 0.188659 21.9773 0.781424 21.9999C0.845855 22.0031 1.30006 21.9385 1.47403 21.9159C5.88433 21.3346 10.2785 20.6565 14.6921 20.1076C29.93 18.2055 45.213 16.7685 60.5186 15.5091C80.8337 13.8363 101.323 12.945 121.693 12.2474C132.842 11.8664 144.26 12.3734 155.445 11.5854C159.552 11.5628 163.66 11.5597 167.767 11.5726C184.938 11.6339 202.09 12.2862 219.231 13.1808C224.744 13.4682 228.948 13.7782 234.344 13.9881C236.393 14.0688 239.643 14.1237 241.905 14.1592C242.237 14.1657 243.084 14.1721 243.435 14.1753C243.47 14.1818 243.506 14.1818 243.545 14.1818C243.68 14.1818 243.744 14.1721 243.757 14.1721C244.524 14.0591 244.453 13.3325 244.434 13.2227C244.43 13.2001 244.314 12.5865 243.654 12.5639C243.496 12.5575 242.365 12.5511 241.931 12.5446C239.682 12.5091 236.444 12.4542 234.405 12.3767C229.019 12.1668 224.818 11.8567 219.315 11.5693C202.148 10.6748 184.97 10.0193 167.774 9.95793C165.673 9.95147 163.57 9.94824 161.469 9.95147C161.398 9.7674 161.24 9.56072 160.892 9.4703C160.567 9.38634 158.238 9.31208 157.339 9.23781C150.687 8.68883 150.883 8.71466 143.564 8.26579C132.478 7.58441 130.79 7.42933 119.26 7.14192C98.317 6.61878 77.3641 6.66081 56.4176 6.71248C46.0764 6.74154 35.0039 7.44229 24.5049 6.13442C27.9648 5.72753 31.4377 5.43044 34.9041 5.09137C46.74 3.93528 58.5857 3.21835 70.47 2.71458C98.9775 1.50682 127.53 1.0257 156.028 2.67264C149.962 2.73076 143.899 2.86635 137.833 2.95354C113.139 3.31522 88.2078 3.04399 63.5662 4.92021C63.1248 4.95573 62.793 5.34322 62.8252 5.78563C62.8575 6.23128 63.2472 6.56391 63.6886 6.53162C88.298 4.6554 113.194 4.92987 137.855 4.56819C147.017 4.43579 156.176 4.19684 165.338 4.26788C168.482 4.29372 171.627 4.40999 174.77 4.49061"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                transition: {
                  duration: 2, // Animation duration in seconds
                  ease: "easeInOut" // Easing function
                }
              }}
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

export default Fv;
