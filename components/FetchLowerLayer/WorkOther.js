'use client'; // Next.js のクライアントコンポーネント宣言

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import styles from "./workOther.module.scss"; // CSSモジュールをインポート

console.log("WorkOther.js module loaded");

// --- テストクエリ ---
// WPGraphQL のカスタム投稿タイプ 'works' の構造を動的に判断するためのテストクエリです。
// スキルデータが 'works' フィールド内にネストされているかを確認します。
const TEST_NESTED_SKILL = gql`
  query TestNestedSkill {
    works(first: 1) {
      nodes {
        id
        title
        works { # カスタムフィールドグループ 'works' が存在し、その中に 'skill' があるか
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
    }
  }
`;

// スキルデータが 'works' ノードの直下にあるかを確認します。
const TEST_DIRECT_SKILL = gql`
  query TestDirectSkill {
    works(first: 1) {
      nodes {
        id
        title
        skill # 'skill' フィールドが直下にあるか
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

// スキルデータが汎用的な 'metaData' フィールドとして格納されているかを確認します。
const TEST_META_DATA = gql`
  query TestMetaData {
    works(first: 1) {
      nodes {
        id
        title
        metaData { # ACF などで追加されたカスタムフィールドが metaData に格納されているか
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
    }
  }
`;

// --- 最終的に使用する作品データ取得クエリ ---
// **変更点:**
// - クエリ変数に `$currentWorkId: [ID]` を追加。
// - `where: { notIn: $currentWorkId }` を追加し、指定されたIDの作品を除外します。
// ID は常に利用できるため、これが最も堅牢な除外方法です。

const GET_WORKS_WITH_NESTED_SKILL = gql`
  query GetWorksWithNestedSkill($currentWorkId: [ID]) {
    works(first: 6, where: { notIn: $currentWorkId }) {
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
    }
  }
`;

const GET_WORKS_WITH_DIRECT_SKILL = gql`
  query GetWorksWithDirectSkill($currentWorkId: [ID]) {
    works(first: 6, where: { notIn: $currentWorkId }) {
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
    }
  }
`;

const GET_WORKS_WITH_METADATA = gql`
  query GetWorksWithMetaData($currentWorkId: [ID]) {
    works(first: 6, where: { notIn: $currentWorkId }) {
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
    }
  }
`;

const DEFAULT_FALLBACK_QUERY = GET_WORKS_WITH_NESTED_SKILL;

// --- ヘルパー関数 ---
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return "";
  const plainText = String(title).replace(/<[^>]*>?/gm, "");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

const truncateExcerpt = (excerpt, maxLength = 30) => {
  if (!excerpt) return "";
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, "");
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

// --- WorkOthers コンポーネント ---
// **変更点:** `currentWorkSlug` から `currentWorkId` にプロップス名を変更しました。
function WorkOthers({ currentWorkId }) {
  console.log("WorkOthers component rendering with currentWorkId:", currentWorkId);

  const [isClient, setIsClient] = useState(false);
  const [accessMethod, setAccessMethod] = useState(null);
  const [finalQuery, setFinalQuery] = useState(null);
  // const [renderCounter, setRenderCounter] = useState(0);

  // テストクエリの実行 (変更なし)
  const {
    data: nestedTestData,
    error: nestedTestError,
    loading: nestedTestLoading,
  } = useQuery(TEST_NESTED_SKILL, {
    skip: !isClient,
    onCompleted: (data) => console.log("Nested test query completed:", data),
    onError: (error) => console.log("Nested skill access test error:", error.message),
  });

  const {
    data: directTestData,
    error: directTestError,
    loading: directTestLoading,
  } = useQuery(TEST_DIRECT_SKILL, {
    skip:
      !isClient ||
      nestedTestLoading ||
      !!(
        nestedTestData?.works?.nodes?.[0]?.works &&
        typeof nestedTestData.works.nodes[0].works.skill !== "undefined"
      ),
    onCompleted: (data) => console.log("Direct test query completed:", data),
    onError: (error) => console.log("Direct skill access test error:", error.message),
  });

  const {
    data: metaTestData,
    error: metaTestError,
    loading: metaTestLoading,
  } = useQuery(TEST_META_DATA, {
    skip:
      !isClient ||
      nestedTestLoading ||
      directTestLoading ||
      !!(
        nestedTestData?.works?.nodes?.[0]?.works &&
        typeof nestedTestData.works.nodes[0].works.skill !== "undefined"
      ) ||
      !!(
        directTestData?.works?.nodes?.[0] &&
        typeof directTestData.works.nodes[0].skill !== "undefined"
      ),
    onCompleted: (data) => console.log("Meta test query completed:", data),
    onError: (error) => console.log("Meta data access test error:", error.message),
  });

  // クライアント側でのマウントをマーク
 // 🔥 修正: setIntervalを削除してクライアント側マウントのみマーク
  useEffect(() => {
    console.log("Initial useEffect running - setting isClient to true");
    setIsClient(true);
    return () => {
      console.log("Cleanup function called");
    };
  }, []);

  // isClient 変更時のログ
  useEffect(() => {
    console.log("isClient changed to:", isClient);
    if (isClient) {
      setTimeout(() => {
        console.log("Delayed check after isClient changed:", {
          isClient,
          nestedTestLoading,
          directTestLoading,
          metaTestLoading
        });
      }, 500);
    }
  }, [isClient, nestedTestLoading, directTestLoading, metaTestLoading]);

  // テストクエリの結果に基づいて最終クエリを決定 (変更なし)
  useEffect(() => {
    console.log("Query decision useEffect running with:", {
      isClient,
      nestedTestLoading,
      directTestLoading,
      metaTestLoading,
      nestedTestData: nestedTestData ? "exists" : "null",
      directTestData: directTestData ? "exists" : "null",
      metaTestData: metaTestData ? "exists" : "null"
    });

    if (
      !isClient ||
      nestedTestLoading ||
      directTestLoading ||
      metaTestLoading
    ) {
      console.log("Skipping query decision due to loading state");
      return;
    }

    if (
      nestedTestData?.works?.nodes?.[0]?.works &&
      typeof nestedTestData.works.nodes[0].works.skill !== "undefined"
    ) {
      console.log("Access method: nested");
      setAccessMethod("nested");
      setFinalQuery(GET_WORKS_WITH_NESTED_SKILL);
    }
    else if (
      directTestData?.works?.nodes?.[0] &&
      typeof directTestData.works.nodes[0].skill !== "undefined"
    ) {
      console.log("Access method: direct");
      setAccessMethod("direct");
      setFinalQuery(GET_WORKS_WITH_DIRECT_SKILL);
    }
    else if (metaTestData?.works?.nodes?.[0]?.metaData) {
      const skillMeta = metaTestData.works.nodes[0].metaData.find(
        (meta) => meta.key === "skill" || meta.key === "_skill"
      );
      if (skillMeta) {
        console.log("Access method: meta");
        setAccessMethod("meta");
        setFinalQuery(GET_WORKS_WITH_METADATA);
      } else {
        console.log("Access method: unknown (skill not found in metaData)");
        setAccessMethod("unknown");
        setFinalQuery(DEFAULT_FALLBACK_QUERY);
      }
    }
    else {
      console.log(
        "Access method: unknown (skill not found in any tested structure)"
      );
      setAccessMethod("unknown");
      setFinalQuery(DEFAULT_FALLBACK_QUERY);
    }
  }, [
    isClient,
    nestedTestData,
    nestedTestError,
    nestedTestLoading,
    directTestData,
    directTestError,
    directTestLoading,
    metaTestData,
    metaTestError,
    metaTestLoading,
  ]);

  // 最終的に決定されたクエリで作品データを取得
  // **変更点:** `variables` に `currentWorkId` を渡すようにしました。
  const { loading, error, data } = useQuery(
    finalQuery || DEFAULT_FALLBACK_QUERY,
    {
      variables: {
        currentWorkId: currentWorkId ? [currentWorkId] : [], // IDを配列として渡し、なければ空の配列
      },
      skip: !isClient || !finalQuery,
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-only",
      onCompleted: (data) => console.log("Main query completed:", data),
      onError: (err) => console.log("Main query error:", err.message)
    }
  );

  // 決定されたアクセス方法に基づいてスキル値を取得するヘルパー関数 (変更なし)
  const getSkill = (work) => {
    if (!work) return "";
    if (accessMethod === "nested") {
      return work.works?.skill;
    } else if (accessMethod === "direct") {
      return work.skill;
    } else if (accessMethod === "meta") {
      if (work.metaData) {
        const skillMeta = work.metaData.find(
          (meta) => meta.key === "skill" || meta.key === "_skill"
        );
        return skillMeta?.value;
      }
    }
    // フォールバックロジック
    if (work.works && typeof work.works.skill !== "undefined")
      return work.works.skill;
    if (typeof work.skill !== "undefined") return work.skill;
    return "";
  };

  // --- レンダリングロジック ---
  if (!isClient) {
    console.log("Rendering loading state because isClient is false");
    return (
      <div
        className={styles.worksContents}
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          margin: '20px',
          background: '#f9f9f9'
        }}
      >
        <div
          style={{
            height: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: '#333' }}>
            ギャラリーを読み込み中...
          </p>
        </div>
      </div>
    );
  }

  if (
    loading ||
    (!finalQuery && (nestedTestLoading || directTestLoading || metaTestLoading))
  ) {
    console.log("Rendering loading state because queries are still loading", {
      loading,
      finalQuery: finalQuery ? "set" : "not set",
      nestedTestLoading,
      directTestLoading,
      metaTestLoading
    });
    return (
      <div
        className={styles.worksContents}
        style={{
          border: '1px solid #ddd',
          padding: '20px',
          margin: '20px',
          background: '#f0f0f0'
        }}
      >
        <div
          style={{
            height: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: '#333' }}>
            作品データを読み込み中...
          </p>
        </div>
      </div>
    );
  }

  if (error && !data?.works?.nodes) {
    console.log("Rendering error state:", error.message);
    return (
      <div
        className={styles.worksContents}
        style={{
          border: '1px solid #f88',
          padding: '20px',
          margin: '20px',
          background: '#fff0f0'
        }}
      >
        <p style={{ color: '#c00' }}>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  const worksToDisplay = data?.works?.nodes || [];
  if (worksToDisplay.length === 0) {
    console.log("Rendering empty state, no works found");
    return (
      <div
        className={styles.worksContents}
        style={{
          border: '1px solid #ddd',
          padding: '20px',
          margin: '20px',
          background: '#fffbf0'
        }}
      >
        <p style={{ color: '#333' }}>表示する作品が見つかりません。</p>
      </div>
    );
  }

  console.log("Rendering works data:", worksToDisplay.length, "items found");
  return (
    <div className={styles.worksContents}>
      {worksToDisplay.map((work, index) => {
        console.log(`Rendering work item ${index}:`, work.title);
        return (
          <article key={work.id || index} className={styles.workCard}>
            <header className={styles.workHeader}>
              <span className={styles.workCategory}>{getCategoryName(work)}</span>
              <Image
                src={work.featuredImage?.node?.sourceUrl || "/About/PC/Icon.webp"}
                width={300}
                height={200}
                alt={
                  work.featuredImage?.node?.altText ||
                  truncateTitle(work.title) ||
                  "作品画像"
                }
                className={styles.thumbnailImage}
              />
            </header>
            <footer className={styles.workFooter}>
              <h3 className={styles.title}>{truncateTitle(work.title)}</h3>
              <p className={styles.skill}>{formatSkill(getSkill(work))}</p>
              <Link
                href={`/all-works/${work.slug}`}
                className={styles.worksLink}
                aria-label={`${truncateTitle(work.title)}の詳細へ`}
              >
                {/* リンク全体をカードに重ねる */}
              </Link>
            </footer>
          </article>
        );
      })}
    </div>
  );
}

console.log("About to export WorkOthers component");
export default WorkOthers;