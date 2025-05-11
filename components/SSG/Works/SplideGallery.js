'use client'
import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import styles from './SplideGallery.module.scss';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// --- Test Queries ---
const TEST_NESTED_SKILL = gql`
  query TestNestedSkill {
    works(first: 1) {
      nodes {
        id
        title
        works {
          skill
        }
      }
    }
  }
`;

const TEST_DIRECT_SKILL = gql`
  query TestDirectSkill {
    works(first: 1) {
      nodes {
        id
        title
        skill
      }
    }
  }
`;

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
      }
    }
  }
`;

// --- Final Query Structures ---
const GET_WORKS_WITH_NESTED_SKILL = gql`
  query GetWorksWithNestedSkill {
    works(first: 8) {
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
      }
    }
  }
`;

const GET_WORKS_WITH_DIRECT_SKILL = gql`
  query GetWorksWithDirectSkill {
    works(first: 8) {
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
      }
    }
  }
`;

const GET_WORKS_WITH_METADATA = gql`
  query GetWorksWithMetaData {
    works(first: 8) {
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
      }
    }
  }
`;

const DEFAULT_FALLBACK_QUERY = GET_WORKS_WITH_NESTED_SKILL;

const truncateTitle = (title, maxLength = 25) => {
  if (!title) return '';
  const plainText = String(title).replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

const truncateExcerpt = (excerpt, maxLength = 30) => {
  if (!excerpt) return '';
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

const formatSkill = (skillValue) => {
  if (!skillValue) return '';
  if (Array.isArray(skillValue)) {
    return skillValue.filter(s => s).join(', ');
  }
  return String(skillValue);
};

function SplideGallery() {
  const [isClient, setIsClient] = useState(false);
  const [accessMethod, setAccessMethod] = useState(null);
  const [finalQuery, setFinalQuery] = useState(null);

  // const isDevelopment = process.env.NODE_ENV === 'development';

  const { data: nestedTestData, error: nestedTestError, loading: nestedTestLoading } = useQuery(TEST_NESTED_SKILL, {
    skip: !isClient, // || !isDevelopment,
    onError: (error) => console.log('Nested skill access test error:', error.message)
  });

  const { data: directTestData, error: directTestError, loading: directTestLoading } = useQuery(TEST_DIRECT_SKILL, {
    skip: !isClient || nestedTestLoading || !!(nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined'), // || !isDevelopment,
    onError: (error) => console.log('Direct skill access test error:', error.message)
  });

  const { data: metaTestData, error: metaTestError, loading: metaTestLoading } = useQuery(TEST_META_DATA, {
    skip: !isClient || nestedTestLoading || directTestLoading || !!(nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined') || !!(directTestData?.works?.nodes?.[0] && typeof directTestData.works.nodes[0].skill !== 'undefined'), // || !isDevelopment,
    onError: (error) => console.log('Meta data access test error:', error.message)
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // if (!isDevelopment) {
    //   setAccessMethod('nested');
    //   setFinalQuery(GET_WORKS_WITH_NESTED_SKILL);
    //   return;
    // }

    if (!isClient || nestedTestLoading || directTestLoading || metaTestLoading) {
      return;
    }

    if (nestedTestData?.works?.nodes?.[0]?.works && typeof nestedTestData.works.nodes[0].works.skill !== 'undefined') {
      setAccessMethod('nested');
      setFinalQuery(GET_WORKS_WITH_NESTED_SKILL);
    }
    else if (directTestData?.works?.nodes?.[0] && typeof directTestData.works.nodes[0].skill !== 'undefined') {
      setAccessMethod('direct');
      setFinalQuery(GET_WORKS_WITH_DIRECT_SKILL);
    }
    else if (metaTestData?.works?.nodes?.[0]?.metaData) {
      const skillMeta = metaTestData.works.nodes[0].metaData.find(meta =>
        meta.key === 'skill' || meta.key === '_skill'
      );
      if (skillMeta) {
        setAccessMethod('meta');
        setFinalQuery(GET_WORKS_WITH_METADATA);
      } else {
        setAccessMethod('unknown');
        setFinalQuery(DEFAULT_FALLBACK_QUERY);
      }
    }
    else {
      setAccessMethod('unknown');
      setFinalQuery(DEFAULT_FALLBACK_QUERY);
    }
  }, [
    isClient, // isDevelopment,
    nestedTestData, nestedTestError, nestedTestLoading,
    directTestData, directTestError, directTestLoading,
    metaTestData, metaTestError, metaTestLoading
  ]);

  const { loading, error, data } = useQuery(finalQuery || DEFAULT_FALLBACK_QUERY, {
    skip: !isClient || !finalQuery,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only'
  });

  const [duplicatedWorks, setDuplicatedWorks] = useState([]);

  useEffect(() => {
    if (data?.works?.nodes) {
      const works = data.works.nodes;
      const numRepetitions = works.length > 0 ? Math.max(1, Math.floor(5 / works.length)) : 0;
      const repeated = Array(numRepetitions).fill(null).reduce((acc) => acc.concat(works), []);
      setDuplicatedWorks(repeated.slice(0, works.length * 5));
    }
  }, [data]);

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
    } else if (accessMethod === 'unknown') {
        if (work.works && typeof work.works.skill !== 'undefined') return work.works.skill;
        if (typeof work.skill !== 'undefined') return work.skill;
    }
    if (work.works && typeof work.works.skill !== 'undefined') return work.works.skill;
    if (typeof work.skill !== 'undefined') return work.skill;
    return '';
  };

  const splideOptions = {
    type: 'loop',
    easing: 'linear',
    perPage: 3.3,
    perMove: 1,
    pagination: false,
    arrows: true,
    autoplay: true,
    drag: 'free',
    interval: 2000,
    speed: 1000,
    clones: 10,
    lazyLoad: 'nearby',
    preloadPages: 1,
    breakpoints: {
      768: { perPage: 2.2 },
      480: { perPage: 1.2 },
    }
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

  if (!data?.works?.nodes || data.works.nodes.length === 0) {
    return (
      <div className={styles.worksContents}>
        <p>表示する作品が見つかりません。</p>
      </div>
    );
  }

  const worksToDisplay = duplicatedWorks.length > 0 ? duplicatedWorks : data.works.nodes;

  return (
    <div className={styles.worksContents}>
      {/* TestResultsInfoコンポーネントは完全に削除 */}
      <Splide options={splideOptions} aria-label="作品ギャラリー">
        {worksToDisplay.map((work, index) => (
          <SplideSlide key={`${work.id}-${index}`}>
            <figure className={styles.figure}>
              <Image
                src={work.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'}
                width={300}
                height={200}
                alt={work.featuredImage?.node?.altText || truncateTitle(work.title) || '作品画像'}
                className={styles.thumbnailImage}
                priority={index < (splideOptions.perPage || 3)}
                loading={index < (splideOptions.perPage || 3) ? "eager" : "lazy"}
              />
              <figcaption className={styles.figcaption}>
                <h3 className={styles.title}>{truncateTitle(work.title)}</h3>
                <p className={styles.skill}>{formatSkill(getSkill(work))}</p>
                <p className={styles.caption}>{truncateExcerpt(work.excerpt)}</p>
                {/* Linkコンポーネントがfigcaptionの兄弟要素として元々存在していた構造に戻します */}
                {/* ただし、Linkコンポーネント自体に意味のあるコンテンツがないとクリックエリアが非常に小さくなるか、表示されない可能性があります。 */}
                {/* 以前のコードでは <Link href={/works/${work.slug}} className={styles.worksLink} /> となっていました。 */}
                {/* このLinkを有効にするには、何らかのコンテンツ（テキストやアイコン）を入れるか、CSSでサイズを指定する必要があります。 */}
                {/* ここでは元の構造に近づけ、className={styles.worksLink} を持つLinkを配置します。 */}
                {/* このLinkがfigure全体を覆うようにしたい場合は、CSSでの工夫が必要です。 */}
                {/* 今回のご要望は「spanはコメントも不用です。完全に削除してください」なので、 */}
                {/* Linkコンポーネント内のテキストコンテンツは削除し、Link自体は残します。 */}
                <Link href={`/works/${work.slug}`} className={styles.worksLink} aria-label={`${truncateTitle(work.title)}の詳細へ`}>
                  {/* Linkにテキストコンテンツがない場合、CSSで表示を工夫する必要があります */}
                </Link>
              </figcaption>
            </figure>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default SplideGallery;