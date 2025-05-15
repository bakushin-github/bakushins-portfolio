'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
// 必要なモジュールをインポート
import { Autoplay, Navigation, FreeMode } from 'swiper/modules';

// SwiperのCSSをインポート
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode'; // FreeModeのCSSも使用する場合にインポート

import Image from 'next/image';
import styles from './SwiperGallery.module.scss';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// --- Test Queries ---
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

// --- Final Query Structures ---
// スキルが works { skill } の形でネストされている場合の最終クエリ
const GET_WORKS_WITH_NESTED_SKILL = gql`
  query GetWorksWithNestedSkill {
    works(first: 15) { # ループのために十分な数を取得
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
    works(first: 15) { # ループのために十分な数を取得
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
    works(first: 15) { # ループのために十分な数を取得
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
  if (!title) return '';
  const plainText = String(title).replace(/<[^>]*>?/gm, ''); // HTMLタグを除去
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

// 抜粋を切り詰めるヘルパー関数
const truncateExcerpt = (excerpt, maxLength = 30) => {
  if (!excerpt) return '';
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, ''); // HTMLタグを除去
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

// スキルをフォーマットするヘルパー関数
const formatSkill = (skillValue) => {
  if (!skillValue) return '';
  if (Array.isArray(skillValue)) {
    return skillValue.filter(s => s).join(', '); // 配列の場合はカンマ区切り
  }
  return String(skillValue);
};

// カテゴリ名を取得するヘルパー関数
const getCategoryName = (work) => {
  if (!work || !work.categories || !work.categories.nodes) return '';
  return work.categories.nodes.length > 0 ? work.categories.nodes[0].name : '';
};

function SwiperGallery() {
  // クライアント側で実行されているかを示す状態
  const [isClient, setIsClient] = useState(false);
  // スキルデータへのアクセス方法 (nested, direct, meta, unknown)
  const [accessMethod, setAccessMethod] = useState(null);
  // 最終的に使用するGraphQLクエリ
  const [finalQuery, setFinalQuery] = useState(null);

  // スキルデータへのアクセス方法を判別するためのテストクエリ実行
  const { data: nestedTestData, error: nestedTestError, loading: nestedTestLoading } = useQuery(TEST_NESTED_SKILL, {
    skip: !isClient, // クライアント側でのみ実行
    onError: (error) => console.log('Nested skill access test error:', error.message)
  });

  const { data: directTestData, error: directTestError, loading: directTestLoading } = useQuery(TEST_DIRECT_SKILL, {
    // クライアント側であり、かつネストされたスキルのテストがまだロード中か、ネストされたスキルが見つからなかった場合に実行
    skip: !isClient || nestedTestLoading || !!(nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined'),
    onError: (error) => console.log('Direct skill access test error:', error.message)
  });

  const { data: metaTestData, error: metaTestError, loading: metaTestLoading } = useQuery(TEST_META_DATA, {
    // クライアント側であり、かつネスト・ダイレクト両方のテストがまだロード中か、どちらのスキルも見つからなかった場合に実行
    skip: !isClient || nestedTestLoading || directTestLoading || !!(nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined') || !!(directTestData?.works?.nodes?.[0] && typeof directTestData.works.nodes[0].skill !== 'undefined'),
    onError: (error) => console.log('Meta data access test error:', error.message)
  });

  // コンポーネントマウント時にクライアント側で実行されていることをマーク
  useEffect(() => {
    setIsClient(true);
  }, []);

  // テストクエリの結果に基づいて最終的なクエリを決定
  useEffect(() => {
    // クライアント側でない、またはテストクエリがまだロード中の場合は何もしない
    if (!isClient || nestedTestLoading || directTestLoading || metaTestLoading) {
      return;
    }

    // ネストされたスキルが見つかった場合
    if (nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined') {
      console.log('Access method: nested');
      setAccessMethod('nested');
      setFinalQuery(GET_WORKS_WITH_NESTED_SKILL);
    }
    // ダイレクトスキルが見つかった場合
    else if (directTestData?.works?.nodes?.[0] && typeof directTestData.works.nodes[0].skill !== 'undefined') {
      console.log('Access method: direct');
      setAccessMethod('direct');
      setFinalQuery(GET_WORKS_WITH_DIRECT_SKILL);
    }
    // メタデータからスキルが見つかった場合
    else if (metaTestData?.works?.nodes?.[0]?.metaData) {
      const skillMeta = metaTestData.works.nodes[0].metaData.find(meta =>
        meta.key === 'skill' || meta.key === '_skill' // skillまたは_skillキーを探す
      );
      if (skillMeta) {
        console.log('Access method: meta');
        setAccessMethod('meta');
        setFinalQuery(GET_WORKS_WITH_METADATA);
      } else {
        console.log('Access method: unknown (skill not found in metaData)');
        setAccessMethod('unknown');
        setFinalQuery(DEFAULT_FALLBACK_QUERY); // スキルが見つからなかった場合はフォールバック
      }
    }
    // どの方法でもスキルが見つからなかった場合
    else {
      console.log('Access method: unknown (skill not found in any tested structure)');
      setAccessMethod('unknown');
      setFinalQuery(DEFAULT_FALLBACK_QUERY); // フォールバック
    }
  }, [
    isClient,
    nestedTestData, nestedTestError, nestedTestLoading,
    directTestData, directTestError, directTestLoading,
    metaTestData, metaTestError, metaTestLoading
  ]);

  // 最終的に決定されたクエリで作品データを取得
  const { loading, error, data } = useQuery(finalQuery || DEFAULT_FALLBACK_QUERY, {
    // finalQueryが決定されておらず、かつテストクエリも全てロード中でない場合にのみスキップを解除
    skip: !isClient || !finalQuery,
    // キャッシュを優先し、一度取得したらキャッシュのみを使用
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only'
  });

  // 決定されたアクセス方法に基づいてスキル値を取得するヘルパー関数
  const getSkill = (work) => {
    if (!work) return '';
    if (accessMethod === 'nested') {
      return work.works?.skill;
    } else if (accessMethod === 'direct') {
      return work.skill;
    } else if (accessMethod === 'meta') {
      if (work.metaData) {
        const skillMeta = work.metaData.find(meta =>
          meta.key === 'skill' || meta.key === '_skill'
        );
        return skillMeta?.value;
      }
    }
    // accessMethod が unknown またはまだ設定されていない場合のフォールバック
    // 一応ネストとダイレクトの可能性を確認
    if (work.works && typeof work.works.skill !== 'undefined') return work.works.skill;
    if (typeof work.skill !== 'undefined') return work.skill;
    return ''; // 見つからなければ空文字列
  };

  // クライアント側でない場合の表示
  if (!isClient) {
    return (
      <div className={styles.worksContents}>
        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>ギャラリーを読み込み中...</p> {/* 初回ロード時の表示 */}
        </div>
      </div>
    );
  }

  // テストクエリまたは最終クエリがロード中の場合の表示
  if (loading || (!finalQuery && (nestedTestLoading || directTestLoading || metaTestLoading))) {
    return (
      <div className={styles.worksContents}>
        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>作品データを読み込み中...</p> {/* データ取得中の表示 */}
        </div>
      </div>
    );
  }

  // エラーが発生した場合の表示
  if (error && !data?.works?.nodes) {
    return (
      <div className={styles.worksContents}>
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  // データが見つからなかった場合の表示
  const worksToDisplay = data?.works?.nodes || [];
  if (worksToDisplay.length === 0) {
    return (
      <div className={styles.worksContents}>
        <p>表示する作品が見つかりません。</p>
      </div>
    );
  }

  // 作品データがある場合のレンダリング
  return (
    <div className={styles.worksContents}>
      {/* Swiperコンポーネントでラップし、loop={true} を設定 */}
      <Swiper
        // 使用するモジュール
        modules={[Autoplay, Navigation, FreeMode]}
        // スライド間のスペース (CSSのmargin-left: 26px; に合わせる)
        spaceBetween={26}
        // スライドの表示数 ('auto'にするとCSSで指定したスライド幅が有効になる)
        slidesPerView={'auto'}
        // 無限ループを有効化
        loop={true}
        // 自動再生を設定 (任意)
        autoplay={{
          delay: 3000, // 3秒ごとにスライド
          disableOnInteraction: false, // ユーザーが操作しても自動再生を止めない
        }}
        // ナビゲーションボタンを有効化 (CSSでスタイルを設定済み)
        navigation={true}
        // 必要に応じてブレークポイントを設定し、レスポンシブに対応
        // breakpoints={{
        //   768: {
        //     slidesPerView: 2,
        //     spaceBetween: 20,
        //   },
        //   1024: {
        //     slidesPerView: 3,
        //     spaceBetween: 30,
        //   },
        // }}
      >
        {worksToDisplay.map((work, index) => (
          <SwiperSlide key={`${work.id}-${index}`}> {/* 一意なキーを設定 */}
            <article className={styles.workCard}>
              <header className={styles.workHeader}>
                <span className={styles.workCategory}>{getCategoryName(work)}</span>
                <Image
                  src={work.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'} // 画像URL、なければフォールバック
                  width={300} // 表示サイズ (CSSで指定したサイズに合わせると良い)
                  height={200} // 表示サイズ (CSSで指定したサイズに合わせると良い)
                  alt={work.featuredImage?.node?.altText || truncateTitle(work.title) || '作品画像'} // altテキスト
                  className={styles.thumbnailImage}
                />
              </header>
              <footer className={styles.workFooter}>
                <h3 className={styles.title}>{truncateTitle(work.title)}</h3> {/* タイトル */}
                <p className={styles.skill}>{formatSkill(getSkill(work))}</p> {/* スキル */}
                
                {/* 作品詳細ページへのリンク */}
                <Link href={`/works/${work.slug}`} className={styles.worksLink} aria-label={`${truncateTitle(work.title)}の詳細へ`}>
                  {/* リンク全体をカードに重ねる場合はここに何もコンテンツを置かず、CSSで position: absolute; を使う */}
                </Link>
              </footer>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SwiperGallery;