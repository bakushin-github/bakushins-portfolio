import React from "react";
import H2 from "./H2";
import styles from "./Flow.module.scss";
import Image from "next/image";

function Flow() {
  return (
    <>
      <div id="Flow" className={styles.flow}>
        <div className={styles.flow__inner}>
          <H2
            subText="制作の流れ"
            mainText="Flow"
            className={styles.flow__title}
          ></H2>
          <div className={styles.flow__contain}>
            <figure className={styles.flow__figure}>
              <Image
                className={styles.image}
                src="/Flow/PC/1.webp"
                width={200}
                height={99.66}
                alt="1"
              ></Image>
              <figcaption className={styles.figcaption}>
                <h3 className={styles.h3}>お問い合わせ（無料）</h3>
                <p className={styles.h3__caption}>
                  まずはお気軽にご相談ください。
                  <br />
                  課題やご希望を丁寧に伺い、
                  <br />
                  制作の流れをご説明します。
                </p>
              </figcaption>
            </figure>
            <figure className={styles.flow__figure}>
              <Image
                className={styles.image}
                src="/Flow/PC/2.webp"
                width={200}
                height={99.66}
                alt="2"
              ></Image>
              <figcaption className={styles.figcaption}>
                <h3 className={styles.h3}>お見積り（無料）</h3>
                <p className={styles.h3__caption}>
                  ヒアリング内容をもとに、
                  <br />
                  お見積りをご提案します。
                </p>
                <p className={styles.price}>費用のめやすはこちら </p>
              </figcaption>
            </figure>
            <figure className={styles.flow__figure}>
              <Image
                className={styles.image}
                src="/Flow/PC/3.webp"
                width={200}
                height={99.66}
                alt="3"
              ></Image>
              <figcaption className={styles.figcaption}>
                <h3 className={styles.h3}>設計・デザイン制作</h3>
                <p className={styles.h3__caption}>
                  サイトの構成を設計し、デザインを制作。フィードバックを反映しながら仕上げます。
                </p>
              </figcaption>
            </figure>
            <figure className={styles.flow__figure}>
              <Image
                className={styles.image}
                src="/Flow/PC/4.webp"
                width={200}
                height={99.67}
                alt="4"
              ></Image>
              <figcaption className={styles.figcaption}>
                <h3 className={styles.h3}>
                  コーディング・
                  <br />
                  動作確認
                </h3>
                <p className={styles.h3__caption}>
                  デザインをWeb上で正しく表示できるようコーディングし、各デバイスで動作確認を行います。
                </p>
              </figcaption>
            </figure>
            <figure className={styles.flow__figure}>
              <Image
                className={styles.image}
                src="/Flow/PC/5.webp"
                width={200}
                height={99.67}
                alt="5"
              ></Image>
              <figcaption className={styles.figcaption}>
                <h3 className={styles.h3}>サイト公開</h3>
                <p className={styles.h3__caption}>
                  問題がなければ本番環境へアップし、公開。ドメイン・サーバー取得のサポートも可能です。
                </p>
              </figcaption>
            </figure>
            <figure className={styles.flow__figure}>
              <Image
                className={styles.image}
                src="/Flow/PC/6.webp"
                width={200}
                height={99.83}
                alt="6"
              ></Image>
              <figcaption className={styles.figcaption}>
                <h3 className={styles.h3}>アフターサポート</h3>
                <p className={styles.h3__caption}>
                  公開後1ヶ月間、軽微な修正（テキスト・画像の変更など）を無料対応。その後の運用サポートもご相談いただけます。 
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </>
  );
}

export default Flow;
