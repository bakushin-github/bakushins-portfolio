import Image from 'next/image';
import Link from 'next/link';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Header_otherPage from "@/components/SSG/Header/Header_fetch/Header_fetchPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import BlogOthers from "@/components/FetchLowerLayer/BlogOhters"; // 🆕 追加
import styles from "../page.module.scss";

// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
  cache: new InMemoryCache(),
});

// 全てのブログ記事を取得するクエリ
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

// 特定のスラッグのブログ記事を取得するクエリ
const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
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
`;

// パンくずリストを作成する関数
function createBreadcrumbs(slug, title) {
  return [
    { name: 'ホーム', path: '/' },
    { name: '全ブログ一覧', path: '/all-blogs' },
    { name: title || 'ブログ詳細', path: `/all-blogs/${slug}` }
  ];
}

// SSGを有効化
export const dynamic = 'force-static';
export const revalidate = 3600;

// すべてのブログ記事のスラッグを取得してSSGのパスを生成
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: GET_ALL_BLOGS,
    });

    const posts = data?.posts?.nodes || [];
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// メタデータを動的に生成
export async function generateMetadata({ params }) {
  try {
    const { data } = await client.query({
      query: GET_BLOG_BY_SLUG,
      variables: { slug: params.slug },
    });

    const post = data?.post;
    
    if (!post) {
      return {
        title: 'ブログ記事が見つかりません',
        description: '指定されたブログ記事は存在しません。',
      };
    }

    return {
      title: `${post.title} | ブログ`,
      description: post.excerpt || `${post.title}の詳細ページです。`,
    };
  } catch (error) {
    return {
      title: 'ブログ記事',
      description: 'ブログ記事の詳細ページです。',
    };
  }
}

// メインコンポーネント
export default async function BlogDetailPage({ params }) {
  const slug = params?.slug || '';
  
  try {
    // 特定のスラッグの記事を取得
    const { data } = await client.query({
      query: GET_BLOG_BY_SLUG,
      variables: { slug },
    });

    const blog = data?.post;

    // 記事が見つからない場合
    if (!blog) {
      return (
        <>
          <Header_otherPage className={styles.blogsHeader} />
          <div className={styles.breadcrumbWrapper}>
            <Breadcrumb items={createBreadcrumbs(slug, '記事が見つかりません')} />
          </div>
          
          <main className={styles.container}>
            <div className={styles.notFound}>
              <h1>ブログが見つかりませんでした</h1>
              <p>スラッグ: {slug}</p>
              <Link href="/all-blogs" className={styles.backButton}>全ブログ一覧に戻る</Link>
            </div>
          </main>
        </>
      );
    }

    // 記事が見つかった場合
    const breadcrumbItems = createBreadcrumbs(slug, blog.title);

    return (
      <>
        <Header_otherPage className={styles.blogsHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <main className={styles.container}>
          <article className={styles.blogDetail}>
            <h1>{blog.title}</h1>
            
            {blog.featuredImage?.node && (
              <div className={styles.featuredImage}>
                <Image 
                  src={blog.featuredImage.node.sourceUrl} 
                  alt={blog.featuredImage.node.altText || blog.title} 
                  width={800}
                  height={450}
                  className={styles.mainImage}
                  priority
                />
              </div>
            )}
            
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
            
            <div className={styles.navigation}>
              <Link href="/all-blogs" className={styles.backButton}>
                全ブログ一覧に戻る
              </Link>
            </div>
          </article>

          {/* 🎯 重要：BlogOthersコンポーネントを追加（テスト済みID除外） */}
          <BlogOthers currentId={blog.id} />
        </main>
      </>
    );
  } catch (error) {
    // エラーが発生した場合
    return (
      <>
        <Header_otherPage className={styles.blogsHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={createBreadcrumbs(slug, 'エラーが発生しました')} />
        </div>
        
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>エラーが発生しました</h1>
            <p>スラッグ: {slug}</p>
            <p>エラー: {error.message}</p>
            <Link href="/all-blogs" className={styles.backButton}>全ブログ一覧に戻る</Link>
          </div>
        </main>
      </>
    );
  }
}