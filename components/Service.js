import React from "react";
import H2 from "./H2";
import styles from "./Service.module.scss";
import Image from "next/image";

function Service() {
  return (
    <>
      <div id="Service" className={styles.service}>
        <div className={styles.service__inner}>
          <Image className={styles.line} src="/Service/PC/line.webp" width={128} height={350} alt="line"></Image>
          <Image className={styles.polygon1} src="/Service/PC/polygon1.webp" width={103} height={52} alt="polygon1"></Image>
          <Image className={styles.polygon2} src="/Service/PC/polygon2.webp" width={104} height={52} alt="polygon2"></Image>
          <div className={styles.h2Content}><H2
            subText="サービス"
            mainText="Service"
            className={styles.service__title}
          ></H2>
          <div className={styles.service__text}>
          お客様一人ひとりの希望に合わせた、世界に一つだけのホームページを作ります。既製品のデザインは<br/>使わず、お客様の会社やサービスの魅力を最大限に引き出す、オリジナルのデザインを提案します。見た目だけでなく、使いやすさや検索エンジンでの表示のしやすさにも気を配ります。また、お客様自身で簡単に内容を更新できるシステムも用意できます。
          </div></div>
          <div className={styles.service__content}>
            <figure className={styles.figure}>
              <Image className={styles.image} width={128} height={88} src="/Service/PC/hp.webp" alt="hp"></Image>
                <figcaption className={styles.figcaption}>
                  <Image className={styles.title} width={123} height={41} src="/Service/PC/title_hp.webp" alt="titleHp"></Image>
                  <p className={styles.caption}>WordPressを活用し、オリジナルデザインのWebサイトを制作。世界中のWebサイトの約64.2%、日本では80%以上で利用される信頼性の高いツールで、直感的な更新・管理が可能です。</p>
                </figcaption>
            </figure>
            <figure className={styles.figure}>
              <Image className={styles.image} width={128} height={88} src="/Service/PC/ec.webp" alt="ec"></Image>
                <figcaption className={styles.figcaption}>
                  <Image className={styles.title} width={128} height={33} src="/Service/PC/title_ec.webp" alt="titleEc"></Image>
                  <p className={styles.caption}>Shopifyを活用したECサイト構築・カスタマイズ に対応。Shopifyは、世界・日本ともにシェアNo.1 のECプラットフォームで、決済機能も標準搭載。スムーズな運用をサポートします。</p>
                </figcaption>
            </figure>
            <figure className={styles.figure}>
              <Image className={styles.image} width={128} height={88} src="/Service/PC/support.webp" alt="support"></Image>
                <figcaption className={styles.figcaption}>
                  <Image className={styles.title} width={128} height={39} src="/Service/PC/title_support.webp" alt="titleSupport"></Image>
                  <p className={styles.caption}>WebサイトやECサイトの保守・運用サポートを提供。定期的な更新・管理を代行し、安心してサイトを運用できる環境を整えます。</p>
                </figcaption>
            </figure>
            <figure className={styles.figure}>
              <Image className={styles.image} width={128} height={88} src="/Service/PC/coding.webp" alt="coding"></Image>
                <figcaption className={styles.figcaption}>
                  <Image className={styles.title} width={253} height={36} src="/Service/PC/title_coding.webp" alt="titleCoding"></Image>
                  <p className={styles.caption}>高品質なコーディングとカスタマイズに対応。JavaScriptやWordPress、Shopifyの調整・拡張も可能。リソース不足や外注ニーズにも柔軟に対応します。</p>
                </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </>
  );
}

export default Service;
