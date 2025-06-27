// app/all-works/[slug]/WorkDetailClient.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./page.module.scss";
import H2 from "@/components/SSG/H2/H2";
import WorkOthers from "@/components/FetchLowerLayer/WorkOther";
import ListViewButton from "@/components/SSG/ListViewButton/ListViewButton";
import Cta from "@/components/SSG/Cta/Cta";
import { ScrollMotion } from "@/components/animation/Stagger/ScrollMotion"; // ★★★ Import from the correct path

export default function WorkDetailClient({ work, slug, breadcrumbItems }) {
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const [showCategoryAndTitle, setShowCategoryAndTitle] = useState(false);

  const imageScrollMotionRef = useRef(null);
  const contentScrollMotionRef = useRef(null);
  // categoryTitleScrollMotionRefは、ScrollMotionが直接表示を制御するため不要
  // const categoryTitleScrollMotionRef = useRef(null);

  // デバッグログ: コンポーネントがレンダリングされるたびに表示
  console.log("WorkDetailClient is rendering. Current work:", work?.title);
  console.log("Current showBackgroundImage state:", showBackgroundImage);
  console.log("Current showCategoryAndTitle state:", showCategoryAndTitle);

  useEffect(() => {
    if (!work) {
      console.log(
        "useEffect: Work data is not available, skipping observer setup."
      );
      return;
    }

    console.log("useEffect: Setting up Intersection Observer...");
    const observer = new IntersectionObserver(
      (entries) => {
        const imageMotionEntry = entries.find(
          (entry) => entry.target === imageScrollMotionRef.current
        );
        const contentMotionEntry = entries.find(
          (entry) => entry.target === contentScrollMotionRef.current
        );

        console.log("--- Intersection Observer callback triggered ---");
        console.log(
          "  imageMotionEntry.isIntersecting:",
          imageMotionEntry?.isIntersecting
        );
        console.log(
          "  contentMotionEntry.isIntersecting:",
          contentMotionEntry?.isIntersecting
        );
        console.log("-----------------------------------------------");

        if (
          imageMotionEntry?.isIntersecting &&
          contentMotionEntry?.isIntersecting
        ) {
          console.log(
            "SUCCESS: Both ScrollMotion elements intersected! Setting showBackgroundImage to true."
          );
          setShowBackgroundImage(true);
          observer.disconnect(); // 一度トリガーされたら監視を停止
        }
      },
      { threshold: 0 } // threshold: 0 を維持
    );

    // refがセットされている場合のみ監視を開始
    // WorkDetailClientのrefはScrollMotionコンポーネント自体を参照する
    // ScrollMotion内部のmotion.divがrefを持つようになる
    if (imageScrollMotionRef.current) {
      observer.observe(imageScrollMotionRef.current);
      console.log("useEffect: Observing imageScrollMotionRef.current");
    } else {
      console.log(
        "useEffect: imageScrollMotionRef.current is null (ScrollMotion for image not yet rendered or ref not attached)."
      );
    }
    if (contentScrollMotionRef.current) {
      observer.observe(contentScrollMotionRef.current);
      console.log("useEffect: Observing contentScrollMotionRef.current");
    } else {
      console.log(
        "useEffect: contentScrollMotionRef.current is null (ScrollMotion for content not yet rendered or ref not attached)."
      );
    }

    // クリーンアップ関数
    return () => {
      console.log("useEffect Cleanup: Observer disconnected.");
      observer.disconnect();
    };
  }, [work]); // workデータが変更されたらエフェクトを再実行

  // 背景アニメーションの後にカテゴリとタイトルのアニメーションをトリガーするエフェクト
  useEffect(() => {
    if (showBackgroundImage) {
      console.log(
        "useEffect (showCategoryAndTitle): showBackgroundImage is true. Setting showCategoryAndTitle with a delay."
      );
      const timer = setTimeout(() => {
        setShowCategoryAndTitle(true);
        console.log(
          "useEffect (showCategoryAndTitle): showCategoryAndTitle set to true after delay."
        );
      }, 1400);

      return () => {
        clearTimeout(timer);
        console.log("useEffect (showCategoryAndTitle): Timer cleared.");
      };
    } else {
      console.log(
        "useEffect (showCategoryAndTitle): showBackgroundImage is false, not setting showCategoryAndTitle."
      );
    }
  }, [showBackgroundImage]);

  if (!work) {
    console.log(
      "WorkDetailClient: Work data is null, rendering not found message."
    );
    return (
      <main className={styles.container}>
        <div className={styles.notFound}>
          <h1>作品が見つかりませんでした</h1>
          <p>スラッグ: {slug}</p>
          <Link href="/all-works" className={styles.backButton}>
            全作品一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <H2 subText="制作実績" mainText="Work" className={styles.work__h2} />
      <article className={styles.workDetail}>
        <div
          className={`${styles.imagePosition} ${
            showBackgroundImage ? styles["animate-background"] : ""
          }`}
        >
          {work.featuredImage?.node && (
            // ★★★ ScrollMotionのコメントアウトを外す ★★★
            <ScrollMotion
              ref={imageScrollMotionRef} // refを正しく渡す
              delay={0.2}
              duration={0.6}
              yOffset={30}
              threshold={0.3}
              once={true}
            >
              <div className={styles.featuredImage}>
                <img
                  src={work.featuredImage.node.sourceUrl}
                  alt={
                    work.featuredImage.node.altText ||
                    `${work.title}のメイン画像`
                  }
                  width={917}
                  height={450}
                  className={styles.mainImage}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                  }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </ScrollMotion>
          )}
        </div>

        {showCategoryAndTitle && (
          // ★★★ ScrollMotionのコメントアウトを外す ★★★
          <ScrollMotion
            delay={0.3} // 背景アニメーションの完了後
            duration={0.6}
            yOffset={30}
            threshold={0.3}
            once={true}
          >
            <header className={styles.workCategoryH1}>
              <span className={styles.worksCategory}>
                {work.categories?.nodes?.map((category, index) => (
                  <span key={category.id}>
                    {index > 0 ? ", " : ""}
                    {category.name}
                  </span>
                ))}
              </span>
              <h1 className={styles.worksTitle}>{work.title}</h1>
            </header>
          </ScrollMotion>
        )}

        {/* WordPress の WebM / YouTube を含む本文 */}
        {/* ★★★ ScrollMotionのコメントアウトを外す ★★★ */}
        <ScrollMotion
          ref={contentScrollMotionRef} // refを正しく渡す
          delay={0.2}
          duration={0.6}
          yOffset={30}
          threshold={0.3}
          once={true}
        >
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: work.content }}
          />
        </ScrollMotion>
        <figure className={styles.thumbnailMove}></figure>
        <div className={styles.videoBox}>
          {/* 動画自動再生スクリプト（use client 不使用） */}
          <Script id="lazy-video-autoplay" strategy="lazyOnload">{`
            (function() {
              function load(el) {
                const src = el.dataset.src;
                if (src) {
                  el.setAttribute('src', src);
                  el.removeAttribute('data-src');
                }
                if (el.tagName === 'VIDEO') {
                  el.play && el.play().catch(() => {});
                }
              }

              const lazyVideos = document.querySelectorAll('.lazy-video');

              if (!('IntersectionObserver' in window)) {
                lazyVideos.forEach(load);
                return;
              }

              const observer = new IntersectionObserver(
                (entries, obs) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      load(entry.target);
                      obs.unobserve(entry.target);
                    }
                  });
                },
                { rootMargin: '100px', threshold: 0.25 }
              );

              lazyVideos.forEach(el => observer.observe(el));
            })();
          `}</Script>
        </div>
        <section className={styles.relationWorks}>
          <H2
            subText="制作実績"
            mainText="Others"
            className={styles.work__h2Others}
          />
          <WorkOthers />
          <div className={styles.workOthersListButton}>
            <ListViewButton href="/all-works" />
          </div>
        </section>
      </article>
    </main>
  );
}
