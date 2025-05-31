import React from "react";
import styles from "./Cta.module.scss";
import Image from "next/image";
import Faq from "./Faq"; // パスが正しいか確認
import Contact_button from "./CtaContact"; // パスが正しいか確認

function Cta() {
  return (
    <div className={styles.cta}>
      {/* cta_left.webp */}
      <div className={styles.cta__image_left_wrapper}>
        <Image
          src="/Cta/PC/cta_left.webp"
          alt="CTA左側の装飾画像"
          fill
          style={{ objectFit: 'contain' }} // または 'cover'
          priority // ビューポート内に表示される可能性が高い場合はtrue
          sizes="206px" // CSSで指定したラッパーの幅に合わせる (またはレスポンシブな値を指定)
        />
      </div>

      {/* cta_center.webp */}
      <div className={styles.cta__image_center_wrapper}>
        <Image
          src="/Cta/PC/cta_center.webp"
          alt="CTA中央の装飾画像"
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="155px" // CSSで指定したラッパーの幅に合わせる
        />
      </div>

      {/* cta_right.webp */}
      <div className={styles.cta__image_right_wrapper}>
        <Image
          src="/Cta/PC/cta_right.webp"
          alt="CTA右側の装飾画像"
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="248px" // CSSで指定したラッパーの幅に合わせる
        />
      </div>

      <div className={styles.cta__inner}>
        <div className={styles.cta_text}>
          ご相談は無料です
          <br />
          お気軽にお問い合わせください
        </div>
        <div className={styles.cta__buttons}>
          <Faq />
          <Contact_button className={styles.cta_contact} />
        </div>
      </div>
    </div>
  );
}

export default Cta;