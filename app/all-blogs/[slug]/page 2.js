'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import styles from "./page.module.scss"; // 正しいスタイルシートパスに戻します
import Header_otherPage from "@/components/SSG/Header/Header_otherPage/Header_otherPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient'; // Apollo Clientインスタンスへのパスを調整してください

// 全てのブログをクエリして、フロントエンドでスラッグで絞り込む
const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    posts(first: 100) {
      nodes {
        id
        title
        slug
        content
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

function createBasicBreadcrumbs(slug) {
  return [
    { name: 'ホーム', path: '/' },
    { name: '全ブログ一覧', path: '/all-blogs' },
    { name: 'ブログ詳細', path: `/all-blogs/${slug}` }
  ];
}

export default function BlogDetailPage() {
  const params = useParams();
  const encodedSlug = params?.slug || '';
  const slug = decodeURIComponent(encodedSlug);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  
  // デバッグ用メッセージを追加
  console.log('Current slug:', slug);
  
  return (
    <ApolloProvider client={client}>
      <BlogDetailContent slug={slug} />
    </ApolloProvider>
  );
}

// コンテンツを別コンポーネントに分離
function BlogDetailContent({ slug }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  
  // GraphQLクエリを実行
  const { loading, error, data } = useQuery(GET_ALL_BLOGS);
  
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Data:', data);
  
  // フロントエンドでスラッグに基づいてブログを絞り込む
  const blog = data?.posts?.nodes?.find(blog => blog.slug === slug);
  // 開発環境用の詳細なログ（本番環境では削除または条件付きで表示）
  if (process.env.NODE_ENV === 'development') {
    console.log('All available blogs:', data?.posts?.nodes);
    console.log('Available slugs:', data?.posts?.nodes?.map(blog => blog.slug));
  }
  console.log('Filtered Blog:', blog);
  
  useEffect(() => {
    setBreadcrumbItems(createBasicBreadcrumbs(slug));
    
    if (blog?.title) {
      const updatedBreadcrumbs = [...createBasicBreadcrumbs(slug)];
      updatedBreadcrumbs[updatedBreadcrumbs.length - 1].name = blog.title;
      setBreadcrumbItems(updatedBreadcrumbs);
    }
  }, [slug, blog]);
  
  return (
    <>
      <Header_otherPage className={styles.blogsHeader} />
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <main className={styles.container}>
        {/* 本番環境用: デバッグ情報は削除かコメントアウトする */}
        {/* <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }}>
          <p><strong>デバッグ情報:</strong></p>
          <p>現在のスラッグ: {slug}</p>
          <p>データ取得状態: {loading ? '読込中' : 'データ取得完了'}</p>
          <p>エラー: {error ? error.message : 'なし'}</p>
        </div> */}
        
        {loading ? (
          <div className={styles.loading}>
            <p>データを読み込み中...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <h1>エラーが発生しました</h1>
            <p>スラッグ: {slug}</p>
            <p>エラー: {error.message}</p>
            <a href="/all-blogs" className={styles.backButton}>全ブログ一覧に戻る</a>
          </div>
        ) : !blog ? (
          <div className={styles.notFound}>
            <h1>ブログが見つかりませんでした</h1>
            <p>スラッグ: {slug}</p>
            <a href="/all-blogs" className={styles.backButton}>全ブログ一覧に戻る</a>
          </div>
        ) : (
          <article className={styles.blogDetail}>
            <h1>{blog.title}</h1>
            
            {blog.featuredImage?.node && (
              <div className={styles.featuredImage}>
                <img 
                  src={blog.featuredImage.node.sourceUrl} 
                  alt={blog.featuredImage.node.altText || blog.title} 
                  className={styles.mainImage}
                />
              </div>
            )}
            
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
            
            <div className={styles.navigation}>
              <a href="/all-blogs" className={styles.backButton}>
                全ブログ一覧に戻る
              </a>
            </div>
          </article>
        )}
      </main>
    </>
  );
}