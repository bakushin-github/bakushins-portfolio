'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FvTextImage from "./animation/Fv_text_image.js";
import styles from './FV.module.scss';

function Fv() {
  const [aElementsComplete, setAElementsComplete] = useState(false);
  const [bElementsComplete, setBElementsComplete] = useState(false);

  // Variants for simultaneous image and text animation
  const imageTextVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 1,
        delayChildren: 0,
        staggerChildren: 0.03
      }
    }
  };

  // Mask Animation Variants with Direction
  const fadeInMaskVariants = (direction) => ({
    hidden: { 
      opacity: 0, 
      clipPath: direction === 'right' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
      display: 'none'
    },
    visible: { 
      opacity: 1, 
      clipPath: 'inset(0 0 0 0)',
      display: 'block',
      transition: { duration: 1.5, ease: "easeOut" }
    }
  });

  return (
    <div className="fv">
      {/* Initially hidden images */}
      <img 
        className={styles.fv_header_ball} 
        src="/Fv/header_ball.webp" 
        alt='header_ball' 
        width='44' 
        height='44' 
        style={{ display: 'none' }} 
      />
      <img 
        className={styles.fv_header_line} 
        src="/Fv/header_line.webp" 
        alt='header_line' 
        width='194' 
        height='178' 
        style={{ display: 'none' }} 
      />
      <img 
        className={styles.fv_left_line} 
        src="/Fv/left_line.webp" 
        alt='left_line' 
        width='390' 
        height='197' 
        style={{ display: 'none' }} 
      />
      <img 
        className={styles.fv_right_line} 
        src="/Fv/right_line.webp" 
        alt='right_line'  
        width='426' 
        height='215' 
        style={{ display: 'none' }} 
      />
      <img 
        className={styles.fv_right_polygon_left} 
        src="/Fv/right_polygon_left.webp" 
        alt='right_polygon_left'  
        width='46' 
        height='79' 
        style={{ display: 'none' }} 
      />
      <img 
        className={styles.fv_right_polygon_right} 
        src="/Fv/right_polygon_right.webp" 
        alt='right_polygon_right'  
        width='36' 
        height='72' 
        style={{ display: 'none' }} 
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
        variants={fadeInMaskVariants('right')} // Right to left
      />
      <motion.img
        className={styles.fv_left_line}
        src="/Fv/left_line.webp"
        alt="left_line"
        width="390"
        height="197"
        initial="hidden"
        animate="visible"
        variants={fadeInMaskVariants('right')} // Right to left
      />
      <motion.img
        className={styles.fv_right_line}
        src="/Fv/right_line.webp"
        alt="right_line"
        width="426"
        height="215"
        initial="hidden"
        animate="visible"
        variants={fadeInMaskVariants('left')} // Left to right
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
              position: 'absolute',
              maxWidth: '420px',
              width: '100%',
              maxHeight: '467.478px',
              top: '177px',
              right: '188px',
              borderRadius: '9.74px'
            }}
          >
            <img 
              src="/Fv/fv_image.webp" 
              alt='fv_image' 
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageTextVariants}
            style={{
              position: 'absolute',
              maxWidth: '576px',
              maxHeight: '231px',
              width: '100%',
              top: '295px',
              left: '203px',
              gap: '24px'
            }}
          >
            <h1 style={{
              fontWeight: 700,
              fontSize: '64px',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#2F4AB2'
            }}>
              <FvTextImage text="ユニークで一番の<br/>サイトをあなたへ。" />
            </h1>
            <div style={{
              marginTop: '24px',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '170%',
              letterSpacing: '-10%',
              color: '#2F4AB2'
            }}>
              <FvTextImage text="Webの世界に踏み出す第一歩を、しっかりサポートします。" />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default Fv;