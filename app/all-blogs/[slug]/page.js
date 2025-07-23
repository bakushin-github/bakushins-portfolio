import Image from "next/image";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import ResponsiveHeaderWrapper from "@/components/ResponsiveHeaderWrapper";
import Breadcrumb from "@/components/Breadcrumb/index";
import BlogOthers from "@/components/FetchLowerLayer/BlogOhters";
import styles from "../../styles/_variables.module.scss";
import { ScrollMotion } from "@/components/animation/Stagger/ScrollMotion";
// WordPress コンテンツ用のグローバルスタイルは globals.scss で読み込む
import { processWordPressContent } from "../../../lib/utils/content-processor";
import {
  generateSocialMetadata,
  generateJsonLd,
} from "../../../lib/utils/sidebar-utils";
import Cta from "@/components/SSG/Cta/Cta";
import BlogLayoutWithSidebar from "@/components/sidebar/BlogLayoutWithSidebar";
import { notFound } from "next/navigation";


// GraphQLクライアントの初期化
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
  cache: new InMemoryCache(),
});

// 全てのブログ記事を取得するクエリ
const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    posts(first: 100) {
      nodes {
        id
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
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
    }
  }
`;

// 特定のスラッグのブログ記事を取得するクエリ
const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
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
  }
`;

// パンくずリストを作成する関数
function createBreadcrumbs(slug, title) {
  return [
    { name: "ホーム", path: "/" },
    { name: "全ブログ一覧", path: "/all-blogs" },
    { name: title || "ブログ詳細", path: `/all-blogs/${slug}` },
  ];
}

// SSGを有効化
export const dynamic = "force-static";
export const revalidate = 86400;

// すべてのブログ記事のスラッグを取得してSSGのパスを生成
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: GET_ALL_BLOGS,
    });

    const posts = data?.posts?.nodes || [];

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// ✅ メタデータを動的に生成（params await対応、SSG最適化版）
export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    const { data } = await client.query({
      query: GET_BLOG_BY_SLUG,
      variables: { slug: resolvedParams.slug },
    });

    const post = data?.post;

    if (!post) {
      return {
        title: "ブログ記事が見つかりません",
        description: "指定されたブログ記事は存在しません。",
      };
    }

    // SSGユーティリティを使用してメタデータ生成
    return generateSocialMetadata(post, resolvedParams.slug);
  } catch (error) {
    return {
      title: "ブログ記事",
      description: "ブログ記事の詳細ページです。",
    };
  }
}

// ✅ メインコンポーネント（params await対応）
export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  try {
    // 特定のスラッグの記事を取得
    const { data } = await client.query({
      query: GET_BLOG_BY_SLUG,
      variables: { slug },
    });

    const blog = data?.post;

    // 記事が見つからない場合
    if (!blog) {
      notFound();
    }

    // コンテンツ処理（blogが定義された後）
    const processedContent = blog?.content
      ? processWordPressContent(blog.content)
      : "";

    // 記事が見つかった場合
    const breadcrumbItems = createBreadcrumbs(slug, blog.title);

    // 現在のページURLを生成（SSG対応）
    const articleUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://bakushin.blog"
    }/all-blogs/${slug}`;

    // 構造化データ生成
    const jsonLd = generateJsonLd(blog, slug);

    return (
      <>
        <ResponsiveHeaderWrapper className={styles.blogsHeader} />
        <div className={styles.singleBlog_inner}>
          <div className={styles.singleBlog_breadcrumbWrapper}>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* 構造化データの追加 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
          />

          <main className="blog-main">
                 <ScrollMotion 
                delay={0.3}
                duration={0.6}
                yOffset={50}
                threshold={0.3}
                once={true}
              >
            <h1 className={styles.singleBlogH1}>{blog.title}</h1></ScrollMotion>
            <span className={styles["singleBlog_separatorLine"]}></span>
            <BlogLayoutWithSidebar
              articleTitle={blog.title}
              articleUrl={articleUrl}
            >
              <article className="blog-article">
                {blog.featuredImage?.node && (
                  <div className="blog-thumbnailBox">
                    <Image
                      src={blog.featuredImage.node.sourceUrl}
                      alt={blog.featuredImage.node.altText || blog.title}
                      fill
                      sizes="(max-width: 666px) 100vw, 666px"
                      className="blog-thumbnail"
                      priority
                    />
                  </div>
                )}

                <Link
                  href="https://bakushin.blog/"
                  className={styles.info_SearchToWordPress}
                  aria-label="記事を検索"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  記事を見つけよう
                </Link>

                {/* WordPressコンテンツ用のクラス名を追加 */}
                <div
                  className="wordpress-content"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                <div className={styles.navigation}>
                  <Link
                    href="/all-blogs"
                    className={styles.singleBlog_backButton}
                  >
                    他の記事を見つける
                  </Link>
                </div>
              </article>

              {/* <BlogOthers currentId={blog.id} /> */}
            </BlogLayoutWithSidebar>
          </main>
        </div>
        <Cta />
      </>
    );
  } catch (error) {
  // 🔴 変更: エラーが発生した場合も404ページを表示
  console.error("Error fetching blog post:", error);
  notFound(); // 🔴 変更: 独自エラーUIを削除してnotFound()を使用
}
}
