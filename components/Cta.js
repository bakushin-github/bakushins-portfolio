import React from "react";
import styles from "./Cta.module.scss";
import Image from "next/image";
import Faq from "./Faq";
import Contact_button from "./CtaContact";
function Cta() {
  return (
    <div className={styles.cta}>
      <Image
        className={styles.cta__image_left}
        src="/Cta/PC/cta_left.webp"
        alt="cta-image-left"
        width={206.07}
        height={206.07}/>
      <Image
        className={styles.cta__image_center}
        src="/Cta/PC/cta_center.webp"
        alt="cta-image-center"
        width={155}
        height={155}/>
      <Image
        className={styles.cta__image_right}
        src="/Cta/PC/cta_right.webp"
        alt="cta-image-left"
        width={480.34326171875}
        height={480.34326171875}/>
      <div className={styles.cta__inner}>
        <div className={styles.cta_text}>
          ご相談は無料です
          <br />
          お気軽にお問い合わせください
        </div>
        <div className={styles.cta__buttons}>
        <Faq/>
        <Contact_button className={styles.cta_contact}/></div>
      </div>
    </div>
  );
}

export default Cta;
