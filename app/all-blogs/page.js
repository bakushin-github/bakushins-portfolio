import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "./page.module.scss";
import Header_otherPage from "@/components/SSG/Header/Header_fetch/Header_fetchPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import Cta from "@/components/SSG/Cta/Cta";

// ページネーションの設定
const POSTS_PER_PAGE = 12;
const MAX_POSTS_TO_FETCH = 1000;

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

// 記事を取得するシンプルなクエリ
const GET_POSTS = gql`
  query GetPosts($first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
    ) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ヘルパー関数（共通関数を再利用）
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

// 全記事を再帰的に取得する関数
async function fetchAllPosts(after = null, allPosts = []) {
  try {
    const { data } = await client.query({
      query: GET_POSTS,
      variables: {
        first: 100,
        after: after,
      },
    });

    const posts = data?.posts?.nodes || [];
    const newAllPosts = [...allPosts, ...posts];

    if (newAllPosts.length >= MAX_POSTS_TO_FETCH) {
      return newAllPosts.slice(0, MAX_POSTS_TO_FETCH);
    }

    if (
      data?.posts?.pageInfo?.hasNextPage &&
      data?.posts?.pageInfo?.endCursor
    ) {
      return await fetchAllPosts(data.posts.pageInfo.endCursor, newAllPosts);
    }

    return newAllPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return allPosts;
  }
}

// ページネーション情報と共に記事を返す
async function getAllPostsWithPagination(requestedPage = 1) {
  try {
    const allPosts = await fetchAllPosts();
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const currentPage = Math.max(1, Math.min(requestedPage, totalPages || 1));

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPagePosts = allPosts.slice(startIndex, endIndex);

    return {
      posts: currentPagePosts,
      pagination: {
        currentPage,
        totalPosts,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startIndex: totalPosts > 0 ? startIndex + 1 : 0,
        endIndex: Math.min(endIndex, totalPosts),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in getAllPostsWithPagination:", error);
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        totalPosts: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 0,
        endIndex: 0,
      },
      error: error.message,
    };
  }
}

// メタデータを設定（1ページ目用）
export const metadata = {
  title: "ブログ記事一覧",
  description: "ブログの記事一覧ページです",
  robots: {
    index: true,
    follow: true,
  },
};

// SSGでビルド時に静的に生成
export const dynamic = "force-static";
export const revalidate = 3600;

// ページネーションコンポーネント
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

// メインコンポーネント（1ページ目用）
export default async function BlogPostsPage() {
  const page = 1; // 1ページ目固定

  console.log(`Rendering blog posts page: ${page} (first page)`);

  const { posts, pagination, error } = await getAllPostsWithPagination(page);

  if (error) {
    return (
      <div className={styles.allBlogs}>
        <Header_otherPage className={styles.blogsHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <main className={styles["blogs-container"]}>
          <div className={styles.error}>
            <h2>エラーが発生しました</h2>
            <p>記事の読み込み中にエラーが発生しました。</p>
            <details className={styles.errorDetails}>
              <summary>エラーの詳細</summary>
              <p>{error}</p>
            </details>
          </div>
        </main>
        <Cta />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.allBlogs}>
        <Header_otherPage className={styles.blogsHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <main className={styles["blogs-container"]}>
          <div className={styles.noResults}>
            <h2>記事が見つかりません</h2>
            <p>まだ記事が投稿されていないか、一時的に利用できません。</p>
            <Link href="/" className={styles.homeLink}>
              ホームページに戻る
            </Link>
          </div>
        </main>
        <Cta />
      </div>
    );
  }

  return (
    <div className={styles.allBlogs}>
      <Header_otherPage className={styles.blogsHeader} />
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
          {posts.map((post, index) => (
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
              </article>{" "}
            </Link>
          ))}
        </div>

        <Pagination pagination={pagination} />
      </main>
      <Cta />
    </div>
  );
}
