'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./article.module.scss";
import Link from "next/link";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { ScrollMotion } from '@/components/animation/Stagger/ScrollMotion';

// GraphQLクエリ - 最新の3記事を取得（日付順）
const GET_LATEST_POSTS = gql`
  query GetLatestPosts {
    posts(first: 3, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

// タイトルが長い場合に切り詰める関数
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return '';
  // HTMLタグを除去
  const plainText = String(title).replace(/<[^>]*>?/gm, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

// 日付をフォーマットする関数
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// カテゴリ名を取得する関数
const getCategoryName = (post) => {
  if (!post || !post.categories || !post.categories.nodes) return '';
  return post.categories.nodes.length > 0 ? post.categories.nodes[0].name : '';
};

function LatestPosts() {
  const { loading, error, data } = useQuery(GET_LATEST_POSTS);
  
  // 画面幅を監視
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // 初期チェック
    checkScreenSize();

    // リサイズイベントをリッスン
    window.addEventListener('resize', checkScreenSize);

    // クリーンアップ
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <>
      <div className={styles.worksContents}>
        {data.posts.nodes.map((post) => {
          // モバイル時のみScrollMotionを適用
          if (isMobile) {
            return (
              <ScrollMotion 
                key={post.id}
                delay={0.3}
                duration={0.6}
                yOffset={50}
                threshold={0.3}
                once={true}
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
                        priority={true}
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
          }

          // デスクトップ時はアニメーションなし
          return (
            <Link
              key={post.id}
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
                    priority={true}
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
          );
        })}
      </div>
    </>
  );
}

export default LatestPosts;