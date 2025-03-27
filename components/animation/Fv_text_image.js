'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FvTextImage = ({ text = '', className }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: index * 0.03, 
        duration: 0.3 
      },
    }),
  };

  return (
    <motion.div 
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            delayChildren: 0,  // 子要素の遅延をなくす
            staggerChildren: 0.03 // 文字間のわずかな遅延
          }
        }
      }}
    >
      {(text || '').split(/<br\s*\/?>/i).map((line, lineIndex) => (
        <div key={lineIndex} style={{ display: 'block' }}>
          {line.split('').map((char, charIndex) => (
            <motion.span 
              key={`char-${lineIndex}-${charIndex}`} 
              custom={charIndex} 
              variants={variants}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default FvTextImage;