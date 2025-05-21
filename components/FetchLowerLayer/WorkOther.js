'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import styles from "./workOther.module.scss"; // CSSモジュールをインポート

// デバッグを容易にするため、コンポーネントがロードされた時点でログを出力
console.log("WorkOther.js module loaded");

// --- テストクエリ ---
// スキルが works { skill } の形でネストされているかテスト
const TEST_NESTED_SKILL = gql`
  query TestNestedSkill {
    works(first: 1) {
      nodes {
        id
        title
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

// スキルが work { skill } の形で直下にあるかテスト
const TEST_DIRECT_SKILL = gql`
  query TestDirectSkill {
    works(first: 1) {
      nodes {
        id
        title
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

// スキルが metaData として格納されているかテスト
const TEST_META_DATA = gql`
  query TestMetaData {
    works(first: 1) {
      nodes {
        id
        title
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

// --- 最終クエリ構造 ---
// スキルが works { skill } の形でネストされている場合の最終クエリ
const GET_WORKS_WITH_NESTED_SKILL = gql`
  query GetWorksWithNestedSkill {
    works(first: 6) {
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

// スキルが work { skill } の形で直下にある場合の最終クエリ
const GET_WORKS_WITH_DIRECT_SKILL = gql`
  query GetWorksWithDirectSkill {
    works(first: 6) {
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

// スキルが metaData として格納されている場合の最終クエリ
const GET_WORKS_WITH_METADATA = gql`
  query GetWorksWithMetaData {
    works(first: 6) {
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

// どのアクセス方法も失敗した場合のフォールバッククエリ
const DEFAULT_FALLBACK_QUERY = GET_WORKS_WITH_NESTED_SKILL;

// タイトルを切り詰めるヘルパー関数
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return "";
  const plainText = String(title).replace(/<[^>]*>?/gm, ""); // HTMLタグを除去
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

// 抜粋を切り詰めるヘルパー関数
const truncateExcerpt = (excerpt, maxLength = 30) => {
  if (!excerpt) return "";
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, ""); // HTMLタグを除去
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};

// スキルをフォーマットするヘルパー関数
const formatSkill = (skillValue) => {
  if (!skillValue) return "";
  if (Array.isArray(skillValue)) {
    return skillValue.filter((s) => s).join(", "); // 配列の場合はカンマ区切り
  }
  return String(skillValue);
};

// カテゴリ名を取得するヘルパー関数
const getCategoryName = (work) => {
  if (!work || !work.categories || !work.categories.nodes) return "";
  return work.categories.nodes.length > 0 ? work.categories.nodes[0].name : "";
};

function WorkOthers() {
  console.log("WorkOthers component rendering");
  
  // クライアント側で実行されているかを示す状態
  const [isClient, setIsClient] = useState(false);
  // スキルデータへのアクセス方法 (nested, direct, meta, unknown)
  const [accessMethod, setAccessMethod] = useState(null);
  // 最終的に使用するGraphQLクエリ
  const [finalQuery, setFinalQuery] = useState(null);
  // カウンター（レンダリングが正しく行われているか確認用）
  const [renderCounter, setRenderCounter] = useState(0);

  console.log("State values at render:", { 
    isClient, 
    accessMethod, 
    finalQuery: finalQuery ? "set" : "not set",
    renderCounter
  });

  // スキルデータへのアクセス方法を判別するためのテストクエリ実行
  const {
    data: nestedTestData,
    error: nestedTestError,
    loading: nestedTestLoading,
  } = useQuery(TEST_NESTED_SKILL, {
    skip: !isClient, // クライアント側でのみ実行
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

  // コンポーネントマウント時にクライアント側で実行されていることをマーク
  useEffect(() => {
    console.log("Initial useEffect running - setting isClient to true");
    setIsClient(true);
    
    // レンダリングが正しく動作しているか確認するための定期的な更新
    const renderTimer = setInterval(() => {
      setRenderCounter(prev => prev + 1);
    }, 1000);
    
    return () => {
      console.log("Cleanup function called");
      clearInterval(renderTimer);
    };
  }, []);

  // isClientが変更されたとき
  useEffect(() => {
    console.log("isClient changed to:", isClient);
    
    // isClientの値が変わった後で、状態を確認する
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

  // テストクエリの結果に基づいて最終的なクエリを決定
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
    
    // クライアント側でない、またはテストクエリがまだロード中の場合は何もしない
    if (
      !isClient ||
      nestedTestLoading ||
      directTestLoading ||
      metaTestLoading
    ) {
      console.log("Skipping query decision due to loading state");
      return;
    }

    // ネストされたスキルが見つかった場合
    if (
      nestedTestData?.works?.nodes?.[0]?.works &&
      typeof nestedTestData.works.nodes[0].works.skill !== "undefined"
    ) {
      console.log("Access method: nested");
      setAccessMethod("nested");
      setFinalQuery(GET_WORKS_WITH_NESTED_SKILL);
    }
    // ダイレクトスキルが見つかった場合
    else if (
      directTestData?.works?.nodes?.[0] &&
      typeof directTestData.works.nodes[0].skill !== "undefined"
    ) {
      console.log("Access method: direct");
      setAccessMethod("direct");
      setFinalQuery(GET_WORKS_WITH_DIRECT_SKILL);
    }
    // メタデータからスキルが見つかった場合
    else if (metaTestData?.works?.nodes?.[0]?.metaData) {
      const skillMeta = metaTestData.works.nodes[0].metaData.find(
        (meta) => meta.key === "skill" || meta.key === "_skill" // skillまたは_skillキーを探す
      );
      if (skillMeta) {
        console.log("Access method: meta");
        setAccessMethod("meta");
        setFinalQuery(GET_WORKS_WITH_METADATA);
      } else {
        console.log("Access method: unknown (skill not found in metaData)");
        setAccessMethod("unknown");
        setFinalQuery(DEFAULT_FALLBACK_QUERY); // スキルが見つからなかった場合はフォールバック
      }
    }
    // どの方法でもスキルが見つからなかった場合
    else {
      console.log(
        "Access method: unknown (skill not found in any tested structure)"
      );
      setAccessMethod("unknown");
      setFinalQuery(DEFAULT_FALLBACK_QUERY); // フォールバック
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
  const { loading, error, data } = useQuery(
    finalQuery || DEFAULT_FALLBACK_QUERY,
    {
      // finalQueryが決定されておらず、かつテストクエリも全てロード中でない場合にのみスキップを解除
      skip: !isClient || !finalQuery,
      // キャッシュを優先し、一度取得したらキャッシュのみを使用
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-only",
      onCompleted: (data) => console.log("Main query completed:", data),
      onError: (err) => console.log("Main query error:", err.message)
    }
  );

  // 決定されたアクセス方法に基づいてスキル値を取得するヘルパー関数
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
    // accessMethod が unknown またはまだ設定されていない場合のフォールバック
    // 一応ネストとダイレクトの可能性を確認
    if (work.works && typeof work.works.skill !== "undefined")
      return work.works.skill;
    if (typeof work.skill !== "undefined") return work.skill;
    return ""; // 見つからなければ空文字列
  };

  // クライアント側でない場合の表示
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
            ギャラリーを読み込み中... (isClient: {String(isClient)}, render: {renderCounter})
          </p>
        </div>
      </div>
    );
  }

  // テストクエリまたは最終クエリがロード中の場合の表示
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
            作品データを読み込み中... (loading: {String(loading)}, render: {renderCounter})
          </p>
        </div>
      </div>
    );
  }

  // エラーが発生した場合の表示
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

  // データが見つからなかった場合の表示
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

  // 作品データがある場合のレンダリング
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

// デバッグのため、エクスポート前にもログを出力
console.log("About to export WorkOthers component");
export default WorkOthers;