'use client';

import { useQuery } from '@apollo/client';
import { GET_OTHER_POSTS_BY_ID } from '@/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BlogOthers.module.scss';

// ヘルパー関数（既存のものを再利用）
const truncateTitle = (title, maxLength = 25) => {
  if (!title) return '';
  const plainText = String(title).replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

const truncateExcerpt = (excerpt, maxLength = 80) => {
  if (!excerpt) return '';
  const plainText = String(excerpt).replace(/<[^>]*>?/gm, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

const getCategoryName = (post) => {
  if (!post || !post.categories || !post.categories.nodes) return '';
  return post.categories.nodes.length > 0 ? post.categories.nodes[0].name : '';
};

function BlogOthers({ currentId }) {
  const { loading, error, data } = useQuery(GET_OTHER_POSTS_BY_ID, {
    variables: { 
      excludeId: currentId,
      first: 12
    },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });

  if (loading) {
    return (
      <section className={styles.otherPostsSection}>
        <h2 className={styles.sectionTitle}>他の記事も読む</h2>
        <div className={styles.loadingGrid}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonText}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    console.error('関連記事の取得エラー:', error);
    return (
      <section className={styles.otherPostsSection}>
        <h2 className={styles.sectionTitle}>他の記事も読む</h2>
        <div className={styles.errorContainer}>
          <p>関連記事の読み込みに失敗しました。</p>
        </div>
      </section>
    );
  }

  const otherPosts = data?.posts?.nodes || [];

  if (otherPosts.length === 0) {
    return (
      <section className={styles.otherPostsSection}>
        <h2 className={styles.sectionTitle}>他の記事も読む</h2>
        <div className={styles.noPostsContainer}>
          <p>他の記事はありません。</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.otherPostsSection}>
      <h2 className={styles.sectionTitle}>他の記事も読む</h2>
      <div className={styles.postsGrid}>
        {otherPosts.map((post) => (
          <article key={post.id} className={styles.postCard}>
            <Link href={`/all-blogs/${post.slug}`} className={styles.postLink}>
              <div className={styles.postImageContainer}>
                <span className={styles.postCategory}>{getCategoryName(post)}</span>
                <Image
                  src={post.featuredImage?.node?.sourceUrl || '/About/PC/Icon.webp'}
                  alt={post.featuredImage?.node?.altText || truncateTitle(post.title) || '記事画像'}
                  width={300}
                  height={200}
                  className={styles.postImage}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{truncateTitle(post.title)}</h3>
                <p className={styles.postExcerpt}>{truncateExcerpt(post.excerpt)}</p>
                <span className={styles.readMore}>詳細を見る</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BlogOthers;