"use client"; // 重要：遷移制御のためクライアントコンポーネントに

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Faq({ className, borderColor, textColor }) {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const customStyles = {
    '--faq-component-border-color': borderColor || '#ccc',
    '--faq-component-text-color': textColor || '#fff',
  };

  const faqComponentStyle = `
    .faq-component-wrapper-9981 {
      --faq-border-color-default: #ccc;
      --faq-text-color-default: #fff;
      --final-border-color: var(--faq-component-border-color, var(--faq-border-color-default));
      --final-text-color: var(--faq-component-text-color, var(--faq-text-color-default));
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      text-decoration: none;
      width: 155px;
      height: 52px;
      border: 1px solid var(--final-border-color);
      border-radius: 30px;
      overflow: hidden;
      cursor: pointer;
    }

    .faq-button-container-9981 {
      width: 100%;
      height: 100%;
      background: transparent;
      box-sizing: border-box;
    }

    .faq-text-content-9981 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      font-family: "Noto Sans JP", sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 170%;
      color: var(--final-text-color);
      letter-spacing: 0.04em; 
      transition: left 0.4s ease;
    }

    .faq-hover-content-9981 {
      left: -100%;
    }

    .faq-component-wrapper-9981:hover .faq-default-content-9981 {
      left: 100%;
    }

    .faq-component-wrapper-9981:hover .faq-hover-content-9981 {
      left: 0;
    }
  `;

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
  };

  const handleTransitionEnd = (e) => {
    if (isClicked && e.propertyName === "left") {
      router.push("/faq");
    }
  };

  return (
    <div
      className={`faq-component-wrapper-9981 ${className || ''}`}
      style={customStyles}
      onClick={handleClick}
    >
      <style>{faqComponentStyle}</style>

      <div className="faq-button-container-9981">
        <div className="faq-text-content-9981 faq-default-content-9981">
          <span>よくある質問</span>
        </div>
        <div
          className="faq-text-content-9981 faq-hover-content-9981"
          onTransitionEnd={handleTransitionEnd}
        >
          <span>よくある質問</span>
        </div>
      </div>
    </div>
  );
}

export default Faq;
