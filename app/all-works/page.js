import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "./page.module.scss";
import ResponsiveHeaderWrapper from "@/components/ResponsiveHeaderWrapper";
import Breadcrumb from "@/components/Breadcrumb/index";
import Cta from "@/components/SSG/Cta/Cta";

// ページネーションの設定
const WORKS_PER_PAGE = 9;
const MAX_WORKS_TO_FETCH = 1000;

const breadcrumbItems = [
  { name: "ホーム", path: "/" },
  { name: "全作品一覧", path: "/all-works" },
];

// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri:
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://your-wordpress-site.com/graphql",
  cache: new InMemoryCache(),
});

// 作品を取得するクエリ - 動的にスキル構造を判断
const GET_WORKS_TEST_NESTED = gql`
  query GetWorksTestNested($first: Int!, $after: String) {
    works(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
    ) {
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
        works {
          skill
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

const GET_WORKS_TEST_DIRECT = gql`
  query GetWorksTestDirect($first: Int!, $after: String) {
    works(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
    ) {
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
        skill
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

const GET_WORKS_TEST_META = gql`
  query GetWorksTestMeta($first: Int!, $after: String) {
    works(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
    ) {
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
        metaData {
          key
          value
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

// スキル構造を判断する関数
async function determineSkillStructure() {
  try {
    // まずnested構造をテスト
    try {
      const { data } = await client.query({
        query: GET_WORKS_TEST_NESTED,
        variables: { first: 1, after: null },
      });

      if (
        data?.works?.nodes?.[0]?.works &&
        typeof data.works.nodes[0].works.skill !== "undefined"
      ) {
        console.log("Skill structure: nested");
        return { structure: "nested", query: GET_WORKS_TEST_NESTED };
      }
    } catch (error) {
      console.log("Nested skill test failed:", error.message);
    }

    // 次にdirect構造をテスト
    try {
      const { data } = await client.query({
        query: GET_WORKS_TEST_DIRECT,
        variables: { first: 1, after: null },
      });

      if (
        data?.works?.nodes?.[0] &&
        typeof data.works.nodes[0].skill !== "undefined"
      ) {
        console.log("Skill structure: direct");
        return { structure: "direct", query: GET_WORKS_TEST_DIRECT };
      }
    } catch (error) {
      console.log("Direct skill test failed:", error.message);
    }

    // 最後にmeta構造をテスト
    try {
      const { data } = await client.query({
        query: GET_WORKS_TEST_META,
        variables: { first: 1, after: null },
      });

      if (data?.works?.nodes?.[0]?.metaData) {
        const skillMeta = data.works.nodes[0].metaData.find(
          (meta) => meta.key === "skill" || meta.key === "_skill"
        );
        if (skillMeta) {
          console.log("Skill structure: meta");
          return { structure: "meta", query: GET_WORKS_TEST_META };
        }
      }
    } catch (error) {
      console.log("Meta skill test failed:", error.message);
    }

    // フォールバック
    console.log("Skill structure: fallback to nested");
    return { structure: "nested", query: GET_WORKS_TEST_NESTED };
  } catch (error) {
    console.error("Error determining skill structure:", error);
    return { structure: "nested", query: GET_WORKS_TEST_NESTED };
  }
}

// ヘルパー関数
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return "";
  const plainText = String(title).replace(/<[^>]*>?/gm, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

const formatSkill = (skillValue) => {
  if (!skillValue) return "";
  if (Array.isArray(skillValue)) {
    return skillValue.filter((s) => s).join(", ");
  }
  return String(skillValue);
};

const getCategoryName = (work) => {
  if (!work || !work.categories || !work.categories.nodes) return "";
  return work.categories.nodes.length > 0 ? work.categories.nodes[0].name : "";
};

const getSkill = (work, structure) => {
  if (!work) return "";

  if (structure === "nested") {
    return work.works?.skill;
  } else if (structure === "direct") {
    return work.skill;
  } else if (structure === "meta") {
    if (work.metaData) {
      const skillMeta = work.metaData.find(
        (meta) => meta.key === "skill" || meta.key === "_skill"
      );
      return skillMeta?.value;
    }
  }

  // フォールバック
  if (work.works && typeof work.works.skill !== "undefined")
    return work.works.skill;
  if (typeof work.skill !== "undefined") return work.skill;
  return "";
};

// 全作品を再帰的に取得する関数
async function fetchAllWorks(skillStructure, after = null, allWorks = []) {
  try {
    const { data } = await client.query({
      query: skillStructure.query,
      variables: {
        first: 100,
        after: after,
      },
    });

    const works = data?.works?.nodes || [];
    const newAllWorks = [...allWorks, ...works];

    if (newAllWorks.length >= MAX_WORKS_TO_FETCH) {
      return newAllWorks.slice(0, MAX_WORKS_TO_FETCH);
    }

    if (
      data?.works?.pageInfo?.hasNextPage &&
      data?.works?.pageInfo?.endCursor
    ) {
      return await fetchAllWorks(
        skillStructure,
        data.works.pageInfo.endCursor,
        newAllWorks
      );
    }

    return newAllWorks;
  } catch (error) {
    console.error("Error fetching works:", error);
    return allWorks;
  }
}

// ページネーション情報と共に作品を返す
async function getAllWorksWithPagination(requestedPage = 1) {
  try {
    const skillStructure = await determineSkillStructure();
    const allWorks = await fetchAllWorks(skillStructure);
    const totalWorks = allWorks.length;
    const totalPages = Math.ceil(totalWorks / WORKS_PER_PAGE);

    const currentPage = Math.max(1, Math.min(requestedPage, totalPages || 1));

    const startIndex = (currentPage - 1) * WORKS_PER_PAGE;
    const endIndex = startIndex + WORKS_PER_PAGE;
    const currentPageWorks = allWorks.slice(startIndex, endIndex);

    return {
      works: currentPageWorks,
      skillStructure: skillStructure.structure,
      pagination: {
        currentPage,
        totalWorks,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startIndex: totalWorks > 0 ? startIndex + 1 : 0,
        endIndex: Math.min(endIndex, totalWorks),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in getAllWorksWithPagination:", error);
    return {
      works: [],
      skillStructure: "nested",
      pagination: {
        currentPage: 1,
        totalWorks: 0,
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
  title: "作品一覧",
  description: "作品の一覧ページです",
  robots: {
    index: true,
    follow: true,
  },
};

// SSGでビルド時に静的に生成
export const dynamic = "force-static";
export const revalidate = 3600;

// ページネーションコンポーネント
function Pagination({ pagination, basePath = "/all-works" }) {
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

// メインコンポーネント（1ページ目用）
export default async function WorksPage() {
  const page = 1; // 1ページ目固定

  console.log(`Rendering works page: ${page} (first page)`);

  const { works, skillStructure, pagination, error } =
    await getAllWorksWithPagination(page);

  if (error) {
    return (
      <div className={styles.allWorks}>
        <ResponsiveHeaderWrapper className={styles.worksHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <main className={styles["works-container"]}>
          <div className={styles.error}>
            <h2>エラーが発生しました</h2>
            <p>作品の読み込み中にエラーが発生しました。</p>
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

  if (works.length === 0) {
    return (
      <div className={styles.allWorks}>
        <ResponsiveHeaderWrapper className={styles.worksHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <main className={styles["works-container"]}>
          <div className={styles.noResults}>
            <h2>作品が見つかりません</h2>
            <p>まだ作品が投稿されていないか、一時的に利用できません。</p>
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
    <div className={styles.allWorks}>
      <ResponsiveHeaderWrapper className={styles.worksHeader} />
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <main className={styles["works-container"]}>
        <div className={styles.works_headTitle}>
          <span className={styles.works_subText}>作品</span>
          <h1 className={styles.works_h1Title}>ALL Works</h1>
        </div>

        {pagination.totalWorks > 0 && (
          <div className={styles.works_postInfo}>
            <span className={styles.works_postCount}>
              {pagination.totalWorks}件中 {pagination.startIndex}-
              {pagination.endIndex}件を表示
            </span>
          </div>
        )}

        <span className={styles["works_separatorLine"]}></span>

        <div className={styles["workCard-grid"]}>
          {works.map((work, index) => (
            <Link
              key={work.id}
              href={`/all-works/${work.slug}`}
              className={styles["work-imageLink"]}
            >
              <article className={styles["work-card"]}>
                <header className={styles["work-header"]}>
                  {getCategoryName(work) && (
                    <span className={styles["work-category"]}>
                      {getCategoryName(work)}
                    </span>
                  )}

                  <Image
                    src={
                      work.featuredImage?.node?.sourceUrl ||
                      "/About/PC/Icon.webp"
                    }
                    width={353}
                    height={200}
                    alt={
                      work.featuredImage?.node?.altText ||
                      truncateTitle(work.title) ||
                      "作品画像"
                    }
                    className={styles["work-image"]}
                    priority={index < 4}
                  />
                </header>
                <footer className={styles["work-footer"]}>
                  <h2 className={styles["work-title"]}>
                    {truncateTitle(work.title)}
                  </h2>
                  <p className={styles["work-skill"]}>
                    {formatSkill(getSkill(work, skillStructure))}
                  </p>
                  <div className={styles["work-link"]}></div>
                </footer>
              </article>
            </Link>
          ))}
        </div>

        <Pagination pagination={pagination} />
      </main>
      <Cta />
    </div>
  );
}
