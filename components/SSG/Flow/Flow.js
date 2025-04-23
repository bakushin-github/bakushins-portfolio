import React, { useEffect, useRef } from "react";
import H2 from "../H2/H2";
import styles from "./Flow.module.scss";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";

function Flow() {
  // セクションの参照を作成
  const sectionRef = useRef(null);

  // useAnimationを使用するように変更
  const controls = useAnimation();

  // 要素が表示されているかどうかを追跡
  // {once: true} は一度表示されたら状態が維持されることを意味します
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // 各figureに適用するアニメーション用バリアント
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

  useEffect(() => {
    // 要素が視界に入ったときだけアニメーションを開始
    if (isInView) {
      const sequenceAnimation = async () => {
        for (let i = 0; i < 6; i++) {
          await controls.start((index) => {
            return index === i ? "visible" : index < i ? "visible" : "hidden";
          });

          // 次のアニメーションまで少し待機
          if (i < 5) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      };

      // アニメーション実行
      sequenceAnimation();
    }
  }, [controls, isInView]); // isInViewの依存関係を追加

  return (
    <>
      <div id="Flow" className={styles.flow}>
        <div className={styles.flow__inner}>
          <H2
            subText="制作の流れ"
            mainText="Flow"
            className={styles.flow__title}
          />
          <div className={styles.flow__contain} ref={sectionRef}>
            {[...Array(6)].map((_, index) => (
              <motion.figure
                key={index + 1}
                className={styles.flow__figure}
                variants={figureVariants}
                initial="hidden"
                custom={index}
                animate={controls}
              >
                <Image
                  className={styles.image}
                  src={`/Flow/PC/${index + 1}.webp`}
                  width={200}
                  height={
                    99.66 + (index >= 3 ? 0.01 : 0) + (index === 5 ? 0.16 : 0)
                  }
                  alt={`${index + 1}`}
                />
                <figcaption className={styles.figcaption}>
                  {index === 0 && (
                    <>
                      <h3 className={styles.h3}>お問い合わせ（無料）</h3>
                      <p className={styles.h3__caption}>
                        まずはお気軽にご相談ください。
                        <br />
                        課題やご希望を丁寧に伺い、
                        <br />
                        制作の流れをご説明します。
                      </p>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <h3 className={styles.h3}>お見積り（無料）</h3>
                      <p className={styles.h3__caption}>
                        ヒアリング内容をもとに、
                        <br />
                        お見積りをご提案します。
                      </p>
                      <Link href={"/price"} className={styles.price__link}><p className={styles.price}>費用のめやすはこちら {'>'} </p></Link>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <h3 className={styles.h3}>設計・デザイン制作</h3>
                      <p className={styles.h3__caption}>
                        サイトの構成を設計し、デザインを制作。フィードバックを反映しながら仕上げます。
                      </p>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <h3 className={styles.h3}>
                        コーディング・
                        <br />
                        動作確認
                      </h3>
                      <p className={styles.h3__caption}>
                        デザインをWeb上で正しく表示できるようコーディングし、各デバイスで動作確認を行います。
                      </p>
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <h3 className={styles.h3}>サイト公開</h3>
                      <p className={styles.h3__caption}>
                        問題がなければ本番環境へアップし、公開。ドメイン・サーバー取得のサポートも可能です。
                      </p>
                    </>
                  )}
                  {index === 5 && (
                    <>
                      <h3 className={styles.h3}>アフターサポート</h3>
                      <p className={styles.h3__caption}>
                        公開後1ヶ月間、軽微な修正（テキスト・画像の変更など）を無料対応。その後の運用サポートもご相談いただけます。
                      </p>
                    </>
                  )}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Flow;
