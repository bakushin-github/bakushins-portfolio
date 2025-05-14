'use client'
import React from 'react';
import Image from "next/image";
import styles from "./article.module.scss";
import Link from "next/link";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

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
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
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

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <>
      <div className={styles.worksContents}>
        {data.posts.nodes.map((post) => {
          // 画像URLの処理
          let imageUrl = "/About/PC/Icon.webp"; // デフォルト画像
          if (post.featuredImage?.node?.sourceUrl) {
            // 画像がある場合はNext.jsのブラーハッシュかローカル画像を使用
            try {
              // ローカルの画像を使用するか、Next Image Optimizationを無効化
              imageUrl = post.featuredImage.node.sourceUrl;
            } catch (e) {
              console.error("画像読み込みエラー:", e);
              imageUrl = "/About/PC/Icon.webp";
            }
          }
          
          return (
            <article key={post.id} className={styles.postCard}>
              {/* 
                外部画像の場合は width, height, unoptimized を指定して
                next.config.jsでの設定が必要になることを回避
              */}
              <header className={styles.postHeader}>
                <span className={styles.Category}>{getCategoryName(post)}</span>
                <Image
                  src={imageUrl}
                  width={150}
                  height={150}
                  alt={post.featuredImage?.node?.altText || post.title || "ブログ画像"}
                  unoptimized={imageUrl !== "/About/PC/Icon.webp"} // 外部画像は最適化をスキップ
                />
              </header>
              <footer className={styles.postFooter}>
                <h3 className={styles.title}>{truncateTitle(post.title)}</h3>
                <p className={styles.caption}>{formatDate(post.date)}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className={styles.worksLink}
                ></Link>
              </footer>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default LatestPosts;