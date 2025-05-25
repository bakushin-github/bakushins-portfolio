import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../../page.module.scss";
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

// ヘルパー関数
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
    console.log(`Fetching posts for page ${requestedPage}...`);

    const allPosts = await fetchAllPosts();
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const currentPage = Math.max(1, Math.min(requestedPage, totalPages || 1));

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPagePosts = allPosts.slice(startIndex, endIndex);

    console.log(
      `Found ${totalPosts} total posts, showing page ${currentPage}/${totalPages}`
    );

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

// ビルド時に総ページ数を計算する
async function calculateTotalPages() {
  try {
    console.log("Calculating total pages for static generation...");
    const allPosts = await fetchAllPosts();
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    console.log(`Total posts: ${allPosts.length}, Total pages: ${totalPages}`);
    return Math.max(1, totalPages);
  } catch (error) {
    console.error("Error calculating total pages:", error);
    return 1;
  }
}

// 静的パラメータの生成（2ページ目以降のみ）
export async function generateStaticParams() {
  try {
    const totalPages = await calculateTotalPages();
    const params = [];

    // 2ページ目以降のみ生成（1ページ目は /all-blogs で処理）
    for (let i = 2; i <= totalPages; i++) {
      params.push({ page: i.toString() }); // 文字列として返す
    }

    console.log(`Generated static params:`, params);
    console.log(`Total pages generated: ${params.length} (excluding page 1)`);
    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// メタデータを動的に生成
export async function generateMetadata({ params }) {
  const page = params?.page ? parseInt(params.page) : 2;

  return {
    title: `ブログ記事一覧 - ページ${page}`,
    description: `ブログの記事一覧ページです (${page}ページ目)`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

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

    // 総ページ数が3以下の場合は全ページを表示
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
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
      return pages;
    }

    // 総ページ数が4以上の場合：常に「1 2 3 ... 最終ページ」パターン

    // 1. 最初の3ページを表示
    for (let i = 1; i <= 3; i++) {
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

    // 2. 現在のページが4以上で最終ページでない場合、現在のページも表示
    if (currentPage > 3 && currentPage < totalPages) {
      pages.push(
        <span key="dots1" className={styles.pageDots}>
          ...
        </span>
      );

      pages.push(
        <Link
          key={currentPage}
          href={getPageUrl(currentPage)}
          className={`${styles.pageLink} ${styles.currentPage}`}
        >
          {currentPage}
        </Link>
      );
    }

    // 3. 総ページ数が4の場合は「...」なしで最終ページを表示
    if (totalPages === 4) {
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className={`${styles.pageLink} ${
            totalPages === currentPage ? styles.currentPage : ""
          }`}
        >
          {totalPages}
        </Link>
      );
    } else {
      // 4. 総ページ数が5以上の場合は「...」付きで最終ページを表示
      pages.push(
        <span key="dots2" className={styles.pageDots}>
          ...
        </span>
      );

      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className={`${styles.pageLink} ${
            totalPages === currentPage ? styles.currentPage : ""
          }`}
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
          <button className={styles.PreviousPageButton}>前のページへ</button>
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

// メインコンポーネント（2ページ目以降用）
export default async function BlogPostsPage({ params }) {
  // URLパラメータからページ番号を取得（2ページ目以降）
  const page = params?.page ? parseInt(params.page) : 2;

  console.log(`Rendering blog posts page: ${page}`);

  const { posts, pagination, error } = await getAllPostsWithPagination(page);

  // エラーが発生した場合の表示
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
            <Link href="/all-blogs" className={styles.retryLink}>
              記事一覧に戻る
            </Link>
          </div>
        </main>
        <Cta />
      </div>
    );
  }

  // ページ範囲外の場合
  if (posts.length === 0) {
    return (
      <div className={styles.allBlogs}>
        <Header_otherPage className={styles.blogsHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <main className={styles["blogs-container"]}>
          <div className={styles.noResults}>
            <h2>ページが見つかりません</h2>
            <p>指定されたページは存在しません。</p>
            <Link href="/all-blogs" className={styles.homeLink}>
              記事一覧の最初のページに戻る
            </Link>
          </div>
        </main>
        <Cta />
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
      <main className={styles["blogs-container"]}>
        <div className={styles.blogs_headTitle}>
          <span className={styles.blogs_subText}>ブログ</span>
          <h1 className={styles.blogs_h1Title}>
            ALL Blogs - ページ {pagination.currentPage}
          </h1>
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
            <article key={post.id} className={styles["blog-card"]}>
              <header className={styles["blog-header"]}>
                {getCategoryName(post) && (
                  <span className={styles["blog-category"]}>
                    {getCategoryName(post)}
                  </span>
                )}
                <Link
                  href={`/all-blogs/${post.slug}`}
                  className={styles["blog-imageLink"]}
                >
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
                    priority={false}
                  />
                </Link>
              </header>
              <footer className={styles["blog-footer"]}>
                <h2 className={styles["blog-title"]}>
                  <Link
                    href={`/all-blogs/${post.slug}`}
                    className={styles["blog-titleLink"]}
                  >
                    {truncateTitle(post.title)}
                  </Link>
                </h2>
                <time className={styles["blog-date"]} dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                <Link
                  href={`/all-blogs/${post.slug}`}
                  className={styles["blog-link"]}
                ></Link>
              </footer>
            </article>
          ))}
        </div>

        <Pagination pagination={pagination} />
      </main>
      <Cta />
    </div>
  );
}
