"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const ScrollMotion = ({
  children,
  duration = 0.6,
  delay = 0,
  yOffset = 50,
  xOffset = 0,
  threshold = 0.3,
  once = true,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: yOffset,
      x: xOffset
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};