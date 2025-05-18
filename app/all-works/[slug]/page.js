// app/all-works/[slug]/page.js
import Image from 'next/image';
import Link from 'next/link';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import styles from "./page.module.scss";
import Header_otherPage from "@/components/SSG/Header/Header_fetch/Header_fetchPage";
import Breadcrumb from "@/components/Breadcrumb/index";

// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/graphql',
  cache: new InMemoryCache(),
});

// 全ての作品をクエリする
const GET_ALL_WORKS = gql`
  query GetAllWorks {
    works {
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

// パンくずリストを作成する関数
function createBreadcrumbs(slug, title) {
  return [
    { name: 'ホーム', path: '/' },
    { name: '全作品一覧', path: '/all-works' },
    { name: title || '作品詳細', path: `/all-works/${slug}` }
  ];
}

// SSGを有効化
export const dynamic = 'force-static'; // このページを強制的に静的生成
export const revalidate = 3600; // 1時間ごとに再検証（ISR）

// すべての作品のスラッグを取得してSSGのパスを生成
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: GET_ALL_WORKS,
      fetchPolicy: 'network-only', // キャッシュを使わず、常に最新データを取得
    });

    const works = data?.works?.nodes || [];
    
    // スラッグが空でない作品のみをフィルタリング
    return works
      .filter(work => !!work.slug)
      .map((work) => ({
        slug: work.slug,
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// メタデータを動的に生成
export async function generateMetadata({ params }) {
  try {
    // paramsオブジェクト自体をawait
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || '';

    const { data } = await client.query({
      query: GET_ALL_WORKS,
    });

    const works = data?.works?.nodes || [];
    const work = works.find(work => work.slug === slug);
    
    if (!work) {
      return {
        title: '作品が見つかりません',
        description: '指定された作品は存在しません。',
      };
    }

    return {
      title: `${work.title} | 作品詳細`,
      description: work.excerpt || `${work.title}の詳細ページです。`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '作品詳細',
      description: '作品の詳細ページです。',
    };
  }
}

// メインコンポーネント
export default async function WorkDetailPage({ params }) {
  try {
    // paramsオブジェクト自体をawait
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || '';
    
    // 全ての作品を取得
    const { data } = await client.query({
      query: GET_ALL_WORKS,
    });

    const works = data?.works?.nodes || [];
    const work = works.find(work => work.slug === slug);

    // 作品が見つからない場合
    if (!work) {
      return (
        <>
          <Header_otherPage className={styles.worksHeader} />
          <div className={styles.breadcrumbWrapper}>
            <Breadcrumb items={createBreadcrumbs(slug, '作品が見つかりません')} />
          </div>
          
          <main className={styles.container}>
            <div className={styles.notFound}>
              <h1>作品が見つかりませんでした</h1>
              <p>スラッグ: {slug}</p>
              <Link href="/all-works" className={styles.backButton}>全作品一覧に戻る</Link>
            </div>
          </main>
        </>
      );
    }

    // 作品が見つかった場合
    const breadcrumbItems = createBreadcrumbs(slug, work.title);

    return (
      <>
        <Header_otherPage className={styles.worksHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <main className={styles.container}>
          <article className={styles.workDetail}>
            <h1>{work.title}</h1>
            
            {work.featuredImage?.node && (
              <div className={styles.featuredImage}>
                {/* Next.jsのImageコンポーネントを使わず、標準のimgタグに戻す */}
                <img 
                  src={work.featuredImage.node.sourceUrl} 
                  alt={work.featuredImage.node.altText || `${work.title}のメイン画像`}
                  width={917}
                  height={450}
                  className={styles.mainImage}
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  loading="eager" // SEO: 早期読み込み(priorityと同様)
                  decoding="async" // パフォーマンス最適化
                />
              </div>
            )}
            
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: work.content }} 
            />
            
            <div className={styles.navigation}>
              <Link href="/all-works" className={styles.backButton}>
                全作品一覧に戻る
              </Link>
            </div>
          </article>
        </main>
      </>
    );
  } catch (error) {
    // エラーが発生した場合
    return (
      <>
        <Header_otherPage className={styles.worksHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={createBreadcrumbs(slug, 'エラーが発生しました')} />
        </div>
        
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>エラーが発生しました</h1>
            <p>スラッグ: {slug}</p>
            <p>エラー: {error.message}</p>
            <Link href="/all-works" className={styles.backButton}>全作品一覧に戻る</Link>
          </div>
        </main>
      </>
    );
  }
}