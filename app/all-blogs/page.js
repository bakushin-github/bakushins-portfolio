import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "./page.module.scss"; // SCSSモジュールをインポート
import Header_otherPage from "@/components/SSG/Header/Header_fetch/Header_fetchPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import Cta from "@/components/SSG/Cta/Cta";

const breadcrumbItems = [
  { name: "ホーム", path: "/" },
  { name: "全記事一覧", path: "/all-blogs" },
];

// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri:
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://your-wordpress-site.com/graphql",
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
        date
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
  if (!title) return "";
  const plainText = String(title).replace(/<[^>]*>?/gm, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

const truncateExcerpt = (excerpt, maxLength = 80) => {
  if (!excerpt) return "";
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

const getCategoryName = (post) => {
  if (!post || !post.categories || !post.categories.nodes) return "";
  return post.categories.nodes.length > 0 ? post.categories.nodes[0].name : "";
};

// 日付をフォーマットする関数
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// メタデータを設定
export const metadata = {
  title: "ブログ記事一覧",
  description: "ブログの記事一覧ページです",
};

// SSGでビルド時に静的に生成
export const dynamic = "force-static";
export const revalidate = 3600;

// データを取得するためのサーバーサイド関数
async function getPosts() {
  try {
    const { data } = await client.query({
      query: GET_POSTS,
    });

    return {
      posts: data?.posts?.nodes || [],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: [],
      error: error.message,
    };
  }
}

// サーバーコンポーネントとして実装 (className を修正)
export default async function BlogPostsPage() {
  const { posts, error } = await getPosts();

  // エラーが発生した場合の表示
  if (error) {
    return (
      // SCSS に posts-container があれば適用
      <div className={styles["posts-container"] || ""}>
        <p>エラーが発生しました: {error}</p>
      </div>
    );
  }

  // データが見つからなかった場合の表示
  if (posts.length === 0) {
    return (
      // SCSS に posts-container があれば適用
      <div className={styles["posts-container"] || ""}>
        <p>表示する記事が見つかりません。</p>
      </div>
    );
  }

  // 記事データがある場合のレンダリング
  return (
    <div className={styles.allBlogs}>
      <Header_otherPage className={styles.blogsHeader} />
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <main className={styles["blogs-container"] || ""}>
        <div className={styles.blogs_headTitle}>
          <span className={styles.blogs_subText}>ブログ</span>
          <h1 className={styles.blogs_h1Title} Blogs>
            ALL Blogs
          </h1>
        </div>
        <span className={styles.blogs_postSelect}></span>
        <span className={styles["blogs_separatorLine"]}></span>
        <div className={styles["blogCard-grid"]}>
          {" "}
          {/* 修正 */}
          {posts.map((post) => (
            <article key={post.id} className={styles["blog-card"]}>
              {" "}
              {/* 修正 */}
              {/* ↓ header は SCSS に .post-image-container があれば適用 */}
              <header className={styles["blog-header"]}>
                {" "}
                {/* 修正 */}
                <span className={styles["blog-category"]}>
                  {getCategoryName(post)}
                </span>{" "}
                {/* 修正 */}
                <Image
                  src={
                    post.featuredImage?.node?.sourceUrl || "/About/PC/Icon.webp"
                  }
                  width={353}
                  height={200}
                  alt={
                    post.featuredImage?.node?.altText ||
                    truncateTitle(post.title) ||
                    "記事画像"
                  }
                  className={styles["blog-image"] || ""}
                  priority={false}
                />
              </header>
              {/* ↓ footer は SCSS に .post-content があれば適用 */}
              <footer className={styles["blog-footer"]}>
                {" "}
                {/* 修正 */}
                <h2 className={styles["blog-title"] || ""}>
                  {truncateTitle(post.title)}
                </h2>{" "}
                {/* 修正 */}
                <p className={styles["blog-excerpt"] || ""}>
                  {formatDate(post.date)}
                </p>{" "}
                {/* 修正 */}
                <Link
                  href={`/all-blogs/${post.slug}`}
                  className={styles["blog-link"] || ""}
                >
                  {" "}
                  {/* 修正 */}
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </main>
      <Cta />
    </div>
  );
}

// 個別の投稿ページもSSGで生成する場合
export async function generateStaticParams() {
  const { posts } = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
