// app/all-blogs/page.js
import Image from 'next/image'
import Link from 'next/link'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/graphql',
  cache: new InMemoryCache(),
});

// WordPressの標準投稿を取得するクエリ
const GET_POSTS = gql`
  query GetPosts {
    posts(first: 30) {
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

const getCategoryName = (post) => {
  if (!post || !post.categories || !post.categories.nodes) return '';
  return post.categories.nodes.length > 0 ? post.categories.nodes[0].name : '';
};

// メタデータを設定
export const metadata = {
  title: 'ブログ記事一覧',
  description: 'ブログの記事一覧ページです',
};

// SSGでビルド時に静的に生成
export const dynamic = 'force-static'; // このページを強制的に静的生成
export const revalidate = 3600; // オプション: 1時間ごとに再検証（ISR）

// データを取得するためのサーバーサイド関数
async function getPosts() {
  try {
    const { data } = await client.query({
      query: GET_POSTS,
    });
    
    return {
      posts: data?.posts?.nodes || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      error: error.message
    };
  }
}

// サーバーコンポーネントとして実装
export default async function BlogPostsPage() {
  const { posts, error } = await getPosts();

  // エラーが発生した場合の表示
  if (error) {
    return (
      <div className="posts-container">
        <p>エラーが発生しました: {error}</p>
      </div>
    );
  }

  // データが見つからなかった場合の表示
  if (posts.length === 0) {
    return (
      <div className="posts-container">
        <p>表示する記事が見つかりません。</p>
      </div>
    );
  }

  // 記事データがある場合のレンダリング
  return (
    <div className="posts-container">
      <h1 className="posts-title">記事一覧</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-image-container">
              <span className="post-category">{getCategoryName(post)}</span>
              <Image
                src={post.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'}
                width={300}
                height={200}
                alt={post.featuredImage?.node?.altText || truncateTitle(post.title) || '記事画像'}
                className="post-image"
                priority={false}
              />
            </div>
            <div className="post-content">
              <h3 className="post-title">{truncateTitle(post.title)}</h3>
              <p className="post-excerpt">{truncateExcerpt(post.excerpt)}</p>
              <Link href={`/all-blogs/${post.slug}`} className="post-link">
                詳細を見る
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// 個別の投稿ページもSSGで生成する場合（/all-blogs/[slug]/page.jsで使用）
export async function generateStaticParams() {
  const { posts } = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}