/**
 * サイドバー・SSG用ユーティリティ関数
 */

/**
 * 静的ファイル用のURL生成
 * @param {string} path - パス
 * @returns {string} - 完全なURL
 */
export function generateStaticUrl(path) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * ソーシャルシェア用のメタデータ生成
 * @param {Object} post - ブログ記事データ
 * @param {string} slug - スラッグ
 * @returns {Object} - メタデータオブジェクト
 */
export function generateSocialMetadata(post, slug) {
  const url = generateStaticUrl(`/all-blogs/${slug}`);
  const title = `${post.title} | バクシンブログ`;
  const description = post.excerpt || `${post.title}の詳細ページです。医療の現場から Webの世界へ。ホームページはもちろん、決済機能付きECサイトもご提供します！`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: post.featuredImage?.node?.sourceUrl ? [
        {
          url: post.featuredImage.node.sourceUrl,
          width: 800,
          height: 600,
          alt: post.featuredImage.node.altText || post.title,
        }
      ] : [],
      siteName: 'バクシンブログ',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : [],
      creator: '@bakushin_dev', // 実際のTwitterハンドルに変更
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 構造化データ（JSON-LD）の生成
 * @param {Object} post - ブログ記事データ
 * @param {string} slug - スラッグ
 * @returns {Object} - JSON-LDオブジェクト
 */
export function generateJsonLd(post, slug) {
  const url = generateStaticUrl(`/all-blogs/${slug}`);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || `${post.title}の詳細ページです。`,
    url: url,
    datePublished: post.date || new Date().toISOString(),
    dateModified: post.modified || post.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'バクシン',
      description: '"医療の現場から Webの世界へ。ホームページはもちろん、決済機能付きECサイトもご提供します！',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog',
    },
    publisher: {
      '@type': 'Organization',
      name: 'バクシンブログ',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog'}/profile-avatar.webp`,
        width: 80,
        height: 80,
      },
    },
    image: post.featuredImage?.node?.sourceUrl ? {
      '@type': 'ImageObject',
      url: post.featuredImage.node.sourceUrl,
      width: 800,
      height: 600,
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.categories?.nodes?.[0]?.name || 'ブログ',
    keywords: post.categories?.nodes?.map(cat => cat.name).join(', ') || 'ホームページ, ECサイト',
  };
}

/**
 * サイドバー用のシェアURL生成
 * @param {string} articleTitle - 記事タイトル
 * @param {string} articleUrl - 記事URL
 * @returns {Object} - シェア用URL集
 */
export function generateShareUrls(articleTitle, articleUrl) {
  const encodedTitle = encodeURIComponent(articleTitle || 'おすすめの記事');
  const encodedUrl = encodeURIComponent(articleUrl || '');
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
    pocket: `https://getpocket.com/edit?url=${encodedUrl}&title=${encodedTitle}`,
  };
}

/**
 * サイドバー投稿者データ生成
 * @returns {Object} - 投稿者データ
 */
export function getAuthorData() {
  return {
    name: "バクシン",
    description: "医療の現場から Webの世界へ。ホームページはもちろん、決済機能付きECサイトもご提供します！お客様に寄り添い、使いやすく効果的なサイトを、医療で培った細やかな配慮で提供します。",
    avatar: "/profile-avatar.webp",
    social: {
      twitter: "@bakushin_dev", // 実際のハンドルに変更
      github: "bakushin", // 実際のアカウントに変更
      website: process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog',
    },
  };
}

/**
 * サイトマップ用のURL生成
 * @param {Array} posts - 全ブログ記事配列
 * @returns {Array} - サイトマップ用URL配列
 */
export function generateSitemapUrls(posts) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog';
  
  return posts.map(post => ({
    url: `${baseUrl}/all-blogs/${post.slug}`,
    lastModified: post.modified || post.date || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}

/**
 * パフォーマンス最適化：プリロード用リンク生成
 * @param {Array} posts - 関連記事配列
 * @returns {Array} - プリロード用Link配列
 */
export function generatePreloadLinks(posts) {
  return posts.slice(0, 3).map(post => ({
    rel: 'prefetch',
    href: `/all-blogs/${post.slug}`,
    as: 'document',
  }));
}

/**
 * RSS フィード用データ生成
 * @param {Array} posts - 全ブログ記事配列
 * @returns {Object} - RSS用データ
 */
export function generateRssData(posts) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bakushin.blog';
  
  return {
    title: 'バクシンブログ',
    description: '"医療の現場から Webの世界へ。ホームページはもちろん、決済機能付きECサイトもご提供するサイトです。',
    feed_url: `${baseUrl}/rss.xml`,
    site_url: baseUrl,
    language: 'ja',
    managingEditor: 'bakushin@example.com (バクシン)', // 実際のメールアドレスに変更
    webMaster: 'bakushin@example.com (バクシン)', // 実際のメールアドレスに変更
    items: posts.map(post => ({
      title: post.title,
      description: post.excerpt || post.title,
      url: `${baseUrl}/all-blogs/${post.slug}`,
      guid: `${baseUrl}/all-blogs/${post.slug}`,
      date: post.date || new Date().toISOString(),
      categories: post.categories?.nodes?.map(cat => cat.name) || [],
    })),
  };
}

/**
 * URLコピー用のフォールバック関数（クライアントサイド用）
 * @param {string} text - コピーするテキスト
 * @returns {boolean} - 成功/失敗
 */
export function fallbackCopyToClipboard(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('コピーエラー:', error);
    return false;
  }
}