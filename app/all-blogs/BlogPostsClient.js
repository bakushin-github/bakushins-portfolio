// app/all-blogs/BlogPostsClient.jsx
"use client"; // ★★★ クライアントコンポーネントであることを明示 ★★★

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss"; // 同じディレクトリのスタイルシートを参照
import Breadcrumb from "@/components/Breadcrumb/index";
import Cta from "@/components/SSG/Cta/Cta";
import ResponsiveHeaderWrapper from "@/components/ResponsiveHeaderWrapper";
import { ScrollMotion } from "@/components/animation/Stagger/ScrollMotion"; // ScrollMotionをインポート

// ヘルパー関数（再定義するか、共通のユーティリティファイルからインポート）
// app/all-blogs/page.jsx からコピーしてください
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return "";
  const plainText = String(title).replace(/<[^>]*>?/gm, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

const getCategoryName = (post) => {
  if (!post || !post.categories || !post.categories.nodes) return "";
  return post.categories.nodes.length > 0 ? post.categories.nodes[0].name : "";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ページネーションコンポーネント（page.jsxから移動）
function Pagination({ pagination, basePath = "/all-blogs" }) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  if (totalPages <= 1) return null;

  const getPageUrl = (pageNum) => {
    if (pageNum === 1) return basePath;
    return `${basePath}/page/${pageNum}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Link key={1} href={getPageUrl(1)} className={styles.pageLink}>
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className={styles.pageDots}>
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`${styles.pageLink} ${
            i === currentPage ? styles.currentPage : ""
          }`}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className={styles.pageDots}>
            ...
          </span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className={styles.pageLink}
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <nav className={styles.pagination}>
      {hasPreviousPage && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className={`${styles.pageLink} ${styles.prevNext}`}
        >
          <button className={styles.NextPageButton}>前のページへ</button>
        </Link>
      )}

      <div className={styles.pageNumbers}>{renderPageNumbers()}</div>

      {hasNextPage && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className={`${styles.pageLink} ${styles.prevNext}`}
        >
          <button className={styles.NextPageButton}>次のページへ</button>
        </Link>
      )}
    </nav>
  );
}


export default function BlogPostsClient({ posts, pagination }) {
  // パンくずリストアイテムはクライアントコンポーネントでは直接定義しない（サーバーコンポーネントから渡される）
  const breadcrumbItems = [
    { name: "ホーム", path: "/" },
    { name: "全記事一覧", path: "/all-blogs" },
  ];

  // 列数を検出するためのstateとeffect（シンプル化のため、固定値を推奨することも多い）
  // ここではCSSのgrid-template-columnsに基づいて大まかに推測する
  const [columns, setColumns] = useState(3); // デフォルトはPCの3列

  useEffect(() => {
    const calculateColumns = () => {
      // CSSメディアクエリと連動させるための簡易ロジック
      // 実際にはwindow.matchMediaやresize observerで正確に判断することが推奨されます
      if (window.innerWidth <= 767) {
        setColumns(1); // モバイル
      } else if (window.innerWidth <= 1023) {
        setColumns(2); // タブレット
      } else {
        setColumns(3); // PC
      }
    };

    calculateColumns(); // 初回計算
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);


  return (
    <div className={styles.allBlogs}>
      {/* ResponsiveHeaderWrapperとBreadcrumbはサーバーコンポーネントで配置しても良いが、
          クライアント側でも常に表示されるものとしてここに含める */}
      <ResponsiveHeaderWrapper className={styles.blogsHeader} />
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <main className={styles["blogs-container"]}>
        <div className={styles.blogs_headTitle}>
          <span className={styles.blogs_subText}>ブログ</span>
          <h1 className={styles.blogs_h1Title}>ALL Blogs</h1>
        </div>

        {pagination.totalPosts > 0 && (
          <div className={styles.blogs_postInfo}>
            <span className={styles.blogs_postCount}>
              {pagination.totalPosts}件中 {pagination.startIndex}-
              {pagination.endIndex}件を表示
            </span>
          </div>
        )}

        <Link
          href="https://bakushin.blog/"
          className={styles.info_blogsSearch}
          aria-label="記事を検索"
          target="_blank"
          rel="noopener noreferrer"
        >
          気になる記事を探す
        </Link>

        <span className={styles["blogs_separatorLine"]}></span>

        <div className={styles["blogCard-grid"]}>
          {posts.map((post, index) => {
            // 各記事カードのアニメーション遅延を計算
            // index (0, 1, 2, 3, ...)
            // columns (例: 3)
            // row = Math.floor(index / columns)
            // col = index % columns
            // delay = (row * row_delay) + (col * column_delay)
            const row = Math.floor(index / columns);
            const col = index % columns;
            const initialDelay = 0.1; // 最初のカードの開始遅延
            const rowDelay = 0.2; // 行ごとの追加遅延
            const columnDelay = 0.05; // 列ごとの追加遅延

            const calculatedDelay = initialDelay + (row * rowDelay) + (col * columnDelay);

            return (
              <ScrollMotion
                key={post.id} // keyはScrollMotionではなくLinkに付与すべきだが、便宜上ここに
                // thresholdは小さめに設定すると、スクロールで早く発動しやすい
                threshold={0.1}
                once={true} // 一度表示されたら再アニメーションしない
                delay={calculatedDelay} // 計算した遅延を渡す
                duration={0.6}
                yOffset={50} // 下から上へのアニメーション
                xOffset={0}
              >
                <Link
                  href={`/all-blogs/${post.slug}`}
                  className={styles["blog-imageLink"]}
                >
                  <article className={styles["blog-card"]}>
                    <header className={styles["blog-header"]}>
                      {getCategoryName(post) && (
                        <span className={styles["blog-category"]}>
                          {getCategoryName(post)}
                        </span>
                      )}

                      <Image
                        src={
                          post.featuredImage?.node?.sourceUrl ||
                          "/About/PC/Icon.webp"
                        }
                        width={353}
                        height={200}
                        alt={
                          post.featuredImage?.node?.altText ||
                          truncateTitle(post.title) ||
                          "記事画像"
                        }
                        className={styles["blog-image"]}
                        priority={index < 4}
                      />
                    </header>
                    <footer className={styles["blog-footer"]}>
                      <h2 className={styles["blog-title"]}>
                        {truncateTitle(post.title)}
                      </h2>
                      <time className={styles["blog-date"]} dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                      <div className={styles["blog-link"]}></div>
                    </footer>
                  </article>
                </Link>
              </ScrollMotion>
            );
          })}
        </div>

        <Pagination pagination={pagination} />
      </main>
      <Cta />
    </div>
  );
}