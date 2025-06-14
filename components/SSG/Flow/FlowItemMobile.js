import React, { useRef } from "react";
import H2 from "../H2/H2"; // パスを確認してください
import styles from "./Flow.module.scss";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

function FlowSp() {
  const sectionRef = useRef(null);

  const figureVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      rotate: -15,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // ★★★ 修正点1: キーの名前を統一し、タイポを修正 ★★★
  const flowItems = [
    {
      id: 1,
      title: "お問い合わせ（無料）",
      caption:
        "まずはお気軽にご相談ください。\n課題やご希望を丁寧に伺い、\n制作の流れをご説明します。",
      imageSrcSp: "/Flow/Sp/01.webp", // キーを 'imageSrcSp' に統一
      imageIconSp: "/Flow/Sp/01-icon.webp", // こちらも命名規則を揃えることを推奨
      imageAltSp: "お問い合わせ",
    },
    {
      id: 2,
      title: "お見積り（無料）",
      caption: "ヒアリング内容をもとに、お見積りをご提案します。",
      link: { href: "/price", text: "費用のめやすはこちら >" },
      imageSrcSp: "/Flow/Sp/02.webp", // キーを統一し、パスのタイポを修正
      imageIconSp: "/Flow/Sp/02-icon.webp",
      imageAltSp: "お見積り",
    },
    {
      id: 3,
      title: "設計・デザイン制作",
      caption:
        "サイトの構成を設計し、デザインを制作。フィードバックを反映しながら仕上げます。",
      imageSrcSp: "/Flow/Sp/03.webp", // キーを 'imageSrcSp' に統一
      imageIconSp: "/Flow/Sp/03-icon.webp",
      imageAltSp: "設計・デザイン制作",
    },
    {
      id: 4,
      title: "コーディング・動作確認",
      caption:
        "デザインをWeb上で正しく表示できるようコーディングし、各デバイスで動作確認します。",
      imageSrcSp: "/Flow/Sp/04.webp", // キーを 'imageSrcSp' に統一
      imageIconSp: "/Flow/Sp/04-icon.webp",
      imageAltSp: "コーディング・動作確認",
    },
    {
      id: 5,
      title: "サイト公開",
      caption:
        "問題がなければ本番環境へアップし、公開。ドメイン・サーバー取得のサポートも可能です。",
      imageSrcSp: "/Flow/Sp/05.webp", // キーを 'imageSrcSp' に統一
      imageIconSp: "/Flow/Sp/05-icon.webp",
      imageAltSp: "サイト公開",
    },
    {
      id: 6,
      title: "アフターサポート",
      caption:
        "公開後1ヶ月間、軽微な修正（テキスト・画像の変更など）を無料対応。その後の運用サポートもご相談いただけます。",
      imageSrcSp: "/Flow/Sp/06.webp", // キーを 'imageSrcSp' に統一
      imageIconSp: "/Flow/Sp/06-icon.webp",
      imageAltSp: "アフターサポート",
    },
  ];

  const renderTitle = (title) => {
    const parts = title.split("<br />");
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const AnimatedFigure = ({ item, index }) => {
    const figureRef = useRef(null);
    const isInView = useInView(figureRef, {
      once: true,
      amount: 0.3,
      margin: "-50px 0px",
    });

    return (
      <motion.figure
        ref={figureRef}
        className={styles.flow__figureSp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={figureVariants}
      >
        <div className={styles.imageContainerSp}>
          {/* ★★★ 修正点2: 正しいキーでプロパティを渡す ★★★ */}
          <div className={styles.imgSpStyle}>
            <div className={styles.imgSpParent}>
              <Image
                className={styles.imageSp}
                src={item.imageIconSp} // 'imageSrcSp' を使用
                alt={item.imageAltSp} // 'imageAltSp' を使用 (余分な 'Sp' を削除)
                fill
                sizes="(max-width: 767px) 90vw, 0" // モバイル表示のみを想定したsizes
                priority={index < 3}
              />
            </div>
          </div>
        </div>
        <figcaption className={styles.figcaptionSp}>
          {" "}
          {/* スタイルもSP用に合わせる */}
          <div className={styles.h3__container}>
            <div className={styles.imageNumberStyle}>
              <div className={styles.imgNumberParent}>
                {" "}
                <Image
                  className={styles.imageNumberSp}
                  src={item.imageSrcSp} // 'imageSrcSp' を使用
                  alt={item.imageAltSp} // 'imageAltSp' を使用 (余分な 'Sp' を削除)
                  fill
                  sizes="(max-width: 767px) 90vw, 0" // モバイル表示のみを想定したsizes
                  priority={index < 3}
                />
              </div>
            </div>
            <h3 className={styles.h3Sp}>{renderTitle(item.title)}</h3>
          </div>
          <p className={styles.h3__captionSp}>
            {item.caption.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < item.caption.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          {item.link && (
            <Link href={item.link.href} className={styles.price__linkSp}>
              <p className={styles.priceSp}>{item.link.text}</p>
            </Link>
          )}
        </figcaption>
      </motion.figure>
    );
  };

  return (
    <>
      <div id="FlowSp" className={styles.flowSp}>
        {" "}
        {/* PC版とIDが重複しないように変更推奨 */}
        <div className={styles.flow__innerSp}>
          <H2
            subText="制作の流れ"
            mainText="Flow"
            className={styles.flow__titleSp}
          />
          <div className={styles.flow__containSp} ref={sectionRef}>
            {flowItems.map((item, index) => (
              <AnimatedFigure key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FlowSp;
