// app/all-works/page.js
import Image from 'next/image'
import Link from 'next/link'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/graphql',
  cache: new InMemoryCache(),
});

// 作品一覧を取得するシンプルなクエリ
const GET_WORKS = gql`
  query GetWorks {
    works(first: 30) {
      nodes {
        id
        title
        slug
        excerpt(format: RENDERED)
        featuredImage {
          node {
            sourceUrl(size: MEDIUM)
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

// ヘルパー関数
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return '';
  const plainText = String(title).replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

const truncateExcerpt = (excerpt, maxLength = 80) => {
  if (!excerpt) return '';
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

const getCategoryName = (work) => {
  if (!work || !work.categories || !work.categories.nodes) return '';
  return work.categories.nodes.length > 0 ? work.categories.nodes[0].name : '';
};

// SSGを有効化
export const dynamic = 'force-static'; // このページを強制的に静的生成
export const revalidate = 3600; // 1時間ごとに再検証（ISR）

// メタデータ設定
export const metadata = {
  title: '作品一覧',
  description: '制作した作品の一覧ページです',
};

// メインコンポーネント
export default async function WorksPage() {
  try {
    // データを取得
    const { data, error } = await client.query({
      query: GET_WORKS,
    });

    // エラーが発生した場合の表示
    if (error) {
      return (
        <div className="works-container">
          <p>エラーが発生しました: {error.message}</p>
        </div>
      );
    }

    // データが見つからなかった場合の表示
    const worksToDisplay = data?.works?.nodes || [];
    if (worksToDisplay.length === 0) {
      return (
        <div className="works-container">
          <p>表示する作品が見つかりません。</p>
        </div>
      );
    }

    // 作品データがある場合のレンダリング
    return (
      <div className="works-container">
        <h1 className="works-title">作品一覧</h1>
        <div className="works-grid">
          {worksToDisplay.map((work) => (
            <article key={work.id} className="work-card">
              <div className="work-image-container">
                <span className="work-category">{getCategoryName(work)}</span>
                <Image
                  src={work.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'}
                  width={300}
                  height={200}
                  alt={work.featuredImage?.node?.altText || truncateTitle(work.title) || '作品画像'}
                  className="work-image"
                />
              </div>
              <div className="work-content">
                <h3 className="work-title">{truncateTitle(work.title)}</h3>
                <p className="work-excerpt">{truncateExcerpt(work.excerpt)}</p>
                <Link href={`/all-works/${work.slug}`} className="work-link">
                  詳細を見る
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in WorksPage:', error);
    return (
      <div className="works-container">
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }
}