import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "./page.module.scss";
import Header_otherPage from "@/components/SSG/Header/Header_fetch/Header_fetchPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import H2 from "@/components/SSG/H2/H2";
import WorkOthers from "@/components/FetchLowerLayer/WorkOther";
import ListViewButton from "@/components/SSG/ListViewButton/ListViewButton";
import Cta from "@/components/SSG/Cta/Cta";

const client = new ApolloClient({
  uri:
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://your-wordpress-site.com/graphql",
  cache: new InMemoryCache(),
});

const GET_ALL_WORKS = gql`
  query GetAllWorks {
    works {
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

function createBreadcrumbs(slug, title) {
  return [
    { name: "ホーム", path: "/" },
    { name: "全作品一覧", path: "/all-works" },
    { name: title || "作品詳細", path: `/all-works/${slug}` },
  ];
}

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: GET_ALL_WORKS,
      fetchPolicy: "network-only",
    });

    const works = data?.works?.nodes || [];

    return works
      .filter((work) => !!work.slug)
      .map((work) => ({
        slug: work.slug,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || "";

    const { data } = await client.query({ query: GET_ALL_WORKS });

    const works = data?.works?.nodes || [];
    const work = works.find((work) => work.slug === slug);

    if (!work) {
      return {
        title: "作品が見つかりません",
        description: "指定された作品は存在しません。",
      };
    }

    return {
      title: `${work.title} | 作品詳細`,
      description: work.excerpt || `${work.title}の詳細ページです。`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "作品詳細",
      description: "作品の詳細ページです。",
    };
  }
}

export default async function WorkDetailPage({ params }) {
  // slug をここで定義して、try/catch の両方のブロックでアクセスできるようにします
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || "";

    const { data } = await client.query({ query: GET_ALL_WORKS });

    const works = data?.works?.nodes || [];
    const work = works.find((work) => work.slug === slug);

    if (!work) {
      console.log("Work not found for slug:", slug); // ここで内容を確認
      return (
        <>
          <Header_otherPage className={styles.worksHeader} />
          <div className={styles.breadcrumbWrapper}>
            <Breadcrumb
              items={createBreadcrumbs(slug, "作品が見つかりません")}
            />
          </div>
          <main className={styles.container}>
            <div className={styles.notFound}>
              <h1>作品が見つかりませんでした</h1>
              <p>スラッグ: {slug}</p>
              <Link href="/all-works" className={styles.backButton}>
                全作品一覧に戻る
              </Link>
            </div>
          </main>
        </>
      );
    }

    const breadcrumbItems = createBreadcrumbs(slug, work.title);

    return (
      <>
        <Header_otherPage className={styles.worksHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <main className={styles.container}>
          <H2 subText="制作実績" mainText="Work" className={styles.work__h2} />
          <article className={styles.workDetail}>
            <div className={styles.imagePosition}>
              {work.featuredImage?.node && (
                <div className={styles.featuredImage}>
                  <img
                    src={work.featuredImage.node.sourceUrl}
                    alt={
                      work.featuredImage.node.altText ||
                      `${work.title}のメイン画像`
                    }
                    width={917}
                    height={450}
                    className={styles.mainImage}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto",
                    }}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
            </div>
            <header className={styles.workCategoryH1}>
              <span className={styles.worksCategory}>
                {work.categories?.nodes?.map((category, index) => (
                  <span key={category.id}>
                    {index > 0 ? ", " : ""}
                    {category.name}
                  </span>
                ))}
              </span>
              <h1 className={styles.worksTitle}>{work.title}</h1>
            </header>

            {/* WordPress の WebM / YouTube を含む本文 */}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: work.content }}
            />
            <figure className={styles.thumbnailMove}></figure>
            <div className={styles.videoBox}>
              {/* 動画自動再生スクリプト（use client 不使用） */}
              <Script id="lazy-video-autoplay" strategy="lazyOnload">{`
              (function() {
                function load(el) {
                  const src = el.dataset.src;
                  if (src) {
                    el.setAttribute('src', src);
                    el.removeAttribute('data-src');
                  }
                  if (el.tagName === 'VIDEO') {
                    el.play && el.play().catch(() => {});
                  }
                }

                const lazyVideos = document.querySelectorAll('.lazy-video');

                if (!('IntersectionObserver' in window)) {
                  lazyVideos.forEach(load);
                  return;
                }

                const observer = new IntersectionObserver(
                  (entries, obs) => {
                    entries.forEach(entry => {
                      if (entry.isIntersecting) {
                        load(entry.target);
                        obs.unobserve(entry.target);
                      }
                    });
                  },
                  { rootMargin: '100px', threshold: 0.25 }
                );

                lazyVideos.forEach(el => observer.observe(el));
              })();
            `}</Script>
            </div>
            <section className={styles.relationWorks}>
              <H2 subText="制作実績" mainText="Others" className={styles.work__h2Others}/>
              <WorkOthers />
              <div className={styles.workOthersListButton}>
              <ListViewButton href="/all-works" /></div>
            </section>
          </article>
        </main>
        <Cta />
      </>
    );
  } catch (error) {
    return (
      <>
        <Header_otherPage className={styles.worksHeader} />
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={createBreadcrumbs(slug, "エラーが発生しました")} />
        </div>
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>エラーが発生しました</h1>
            <p>スラッグ: {slug}</p>
            <p>エラー: {error.message}</p>
            <Link href="/all-works" className={styles.backButton}>
              全作品一覧に戻る
            </Link>
          </div>
        </main>
      </>
    );
  }
}
