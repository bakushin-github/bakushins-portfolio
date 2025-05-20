'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import styles from "./page.module.scss"; // 正しいスタイルシートパスに戻します
import Header_otherPage from "@/components/SSG/Header/Header_otherPage/Header_otherPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client'; // Apollo Clientインスタンスへのパスを調整してください

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

export default function Page() {
  const params = useParams();
  const slug = params?.slug ? decodeURIComponent(params.slug) : '';
  
  return (
    <ApolloProvider client={client}>
      <BlogDetailContent slug={slug} />
    </ApolloProvider>
  );
}

function BlogDetailContent({ slug }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  
  // GraphQLクエリを実行
  const { loading, error, data } = useQuery(GET_ALL_BLOGS);
  const { loading, error, data } = useQuery(GET_ALL_BLOGS);
console.log('loading:', loading);
console.log('error:', error);
console.log('data:', data);

  // フロントエンドでスラッグに基づいてブログを絞り込む
  const blog = data?.posts?.nodes?.find(post => post.slug === slug);
  
  useEffect(() => {
    if (slug) {
      setBreadcrumbItems(createBasicBreadcrumbs(slug));
      
      if (blog?.title) {
        const updatedBreadcrumbs = [...createBasicBreadcrumbs(slug)];
        updatedBreadcrumbs[updatedBreadcrumbs.length - 1].name = blog.title;
        setBreadcrumbItems(updatedBreadcrumbs);
      }
    }
  }, [slug, blog?.title]);
  
  return (
    <>
      <Header_otherPage className={styles.blogsHeader} />
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <main className={styles.container}>
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
