"use client";

import React, { useState } from "react";
import styles from "./CtaContact.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

function CtaContact({ className }) {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
  };

  const handleTransitionEnd = (e) => {
    // hover_contentの left が 0 になった時のみ発火させる
    if (isClicked && e.propertyName === "left") {
      router.push("/contact/");
    }
  };

  return (
    <div
      className={`${styles.contact__button} ${className || ""}`}
      onClick={handleClick}
    >
      <div className={styles.default_content}>
        <Image
          src="/Header/PC/mail.webp"
          alt="contact"
          width={20}
          height={20}
        />
        <span>問い合わせる</span>
      </div>
      <div
        className={styles.hover_content}
        onTransitionEnd={handleTransitionEnd}
      >
        <Image
          src="/Header/PC/mail.webp"
          alt="contact"
          width={20}
          height={20}
        />
        <span>お問い合わせ</span>
      </div>
    </div>
  );
}

export default CtaContact;
