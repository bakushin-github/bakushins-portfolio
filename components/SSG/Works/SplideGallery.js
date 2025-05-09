'use client'
import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import styles from './SplideGallery.module.scss';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_POSTS_WITH_IMAGES = gql`
  query GetPostsWithImages {
    posts {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const truncateTitle = (title, maxLength = 25) => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
};

const truncateExcerpt = (excerpt, maxLength = 30) => {
  const plainText = excerpt.replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

function SplideGallery() {
  const { loading, error, data } = useQuery(GET_POSTS_WITH_IMAGES);
  const [duplicatedPosts, setDuplicatedPosts] = useState([]);

  useEffect(() => {
    if (data?.posts?.nodes?.length > 0) {
      // 10倍に複製（クライアントサイドのみ）
      const original = data.posts.nodes;
      const repeated = Array(10).fill(original).flat();
      setDuplicatedPosts(repeated);
    }
  }, [data]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <div className={styles.worksContents}>
      <Splide
        options={{
          type: 'loop',          // 無限ループ
          easing: 'linear',      // スムーズな進行
          perPage: 3.3,
          perMove: 1,
          pagination: false,
          arrows: true,
          autoplay: true,
          drag: 'free',
          interval: 5000,
          speed: 1000,
          clones: 10,            // スライドを複製して無限感を出す
          breakpoints: {
            768: { perPage: 2.2 },
            480: { perPage: 1.2 },
          }
        }}
      >
        {(duplicatedPosts.length > 0 ? duplicatedPosts : data.posts.nodes).map((post, index) => (
          <SplideSlide key={`${post.id}-${index}`}>
            <figure className={styles.figure}>
              <Image
                src={post.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'}
                width={300}
                height={200}
                alt={post.featuredImage?.node?.altText || post.title}
                className={styles.thumbnailImage}
                priority={true}
              />
              <figcaption className={styles.figcaption}>
                <h3 className={styles.title}>{truncateTitle(post.title)}</h3>
                <p className={styles.caption}>{truncateExcerpt(post.excerpt)}</p>
                <Link href={`/blog/${post.slug}`} className={styles.worksLink} />
              </figcaption>
            </figure>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default SplideGallery;
