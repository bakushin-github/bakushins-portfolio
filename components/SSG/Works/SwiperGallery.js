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
    skip: !isClient || nestedTestLoading || !!(nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined'),
    onError: (error) => console.log('Direct skill access test error:', error.message)
  });

  const { data: metaTestData, error: metaTestError, loading: metaTestLoading } = useQuery(TEST_META_DATA, {
    skip: !isClient || nestedTestLoading || directTestLoading || !!(nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined') || !!(directTestData?.works?.nodes?.[0] && typeof directTestData.works.nodes[0].skill !== 'undefined'),
    onError: (error) => console.log('Meta data access test error:', error.message)
  });

  // コンポーネントマウント時にクライアント側で実行されていることをマーク
  useEffect(() => {
    setIsClient(true);
  }, []);

  // テストクエリの結果に基づいて最終的なクエリを決定
  useEffect(() => {
    if (!isClient || nestedTestLoading || directTestLoading || metaTestLoading) {
      return;
    }

    if (nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined') {
      setAccessMethod('nested');
      setFinalQuery(GET_WORKS_WITH_NESTED_SKILL);
    }
    else if (directTestData?.works?.nodes?.[0] && typeof directTestData.works.nodes[0].skill !== 'undefined') {
      console.log('Access method: direct');
      setAccessMethod('direct');
      setFinalQuery(GET_WORKS_WITH_DIRECT_SKILL);
    }
    else if (metaTestData?.works?.nodes?.[0]?.metaData) {
      const skillMeta = metaTestData.works.nodes[0].metaData.find(meta =>
        meta.key === 'skill' || meta.key === '_skill'
      );
      if (skillMeta) {
        console.log('Access method: meta');
        setAccessMethod('meta');
        setFinalQuery(GET_WORKS_WITH_METADATA);
      } else {
        console.log('Access method: unknown (skill not found in metaData)');
        setAccessMethod('unknown');
        setFinalQuery(DEFAULT_FALLBACK_QUERY);
      }
    }
    else {
      console.log('Access method: unknown (skill not found in any tested structure)');
      setAccessMethod('unknown');
      setFinalQuery(DEFAULT_FALLBACK_QUERY);
    }
  }, [
    isClient,
    nestedTestData, nestedTestError, nestedTestLoading,
    directTestData, directTestError, directTestLoading,
    metaTestData, metaTestError, metaTestLoading
  ]);

  const { loading, error, data } = useQuery(finalQuery || DEFAULT_FALLBACK_QUERY, {
    skip: !isClient || !finalQuery,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only'
  });

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
    if (work.works && typeof work.works.skill !== 'undefined') return work.works.skill;
    if (typeof work.skill !== 'undefined') return work.skill;
    return '';
  };

  if (!isClient) {
    return (
      <div className={styles.worksContents}>
        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>ギャラリーを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (loading || (!finalQuery && (nestedTestLoading || directTestLoading || metaTestLoading))) {
    return (
      <div className={styles.worksContents}>
        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>作品データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !data?.works?.nodes) {
    return (
      <div className={styles.worksContents}>
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  const worksToDisplay = data?.works?.nodes || [];
  if (worksToDisplay.length === 0) {
    return (
      <div className={styles.worksContents}>
        <p>表示する作品が見つかりません。</p>
      </div>
    );
  }

  return (
    <div className={styles.worksContents}>
      <Swiper
        modules={[Autoplay, Navigation, FreeMode]}
        spaceBetween={26}
        slidesPerView={'auto'}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={true}
      >
        {worksToDisplay.map((work, index) => (
          <SwiperSlide key={`${work.id}-${index}`}>
            <article className={styles.workCard}>
              {/* 親要素である header に position: relative とサイズ指定がCSSでされている想定 */}
              <header className={styles.workHeader}>
                <span className={styles.workCategory}>{getCategoryName(work)}</span>
                {/* Imageコンポーネントの修正 */}
                <Image
                  src={work.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'}
                  alt={work.featuredImage?.node?.altText || truncateTitle(work.title) || '作品画像'}
                  fill // width と height props の代わりに fill を使用
                  // className={styles.thumbnailImage} // fill を使う場合、このクラスの役割は object-fit の指定や追加のスタイリングのみ
                                                    // もし styles.thumbnailImage に width/height 指定があれば削除または調整が必要
                  style={{ objectFit: 'cover' }} // object-fit をインラインスタイルで指定 (またはCSSクラスで)
                  priority={index < 3} // 最初の数枚の画像を優先的に読み込む (任意)
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // レスポンシブイメージのヒント (任意、実際のブレークポイントに合わせて調整)
                />
              </header>
              <footer className={styles.workFooter}>
                <h3 className={styles.title}>{truncateTitle(work.title)}</h3>
                <p className={styles.skill}>{formatSkill(getSkill(work))}</p>
                <Link href={`/all-works/${work.slug}`} className={styles.worksLink} aria-label={`${truncateTitle(work.title)}の詳細へ`}>
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