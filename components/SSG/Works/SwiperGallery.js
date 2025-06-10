"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import Image from "next/image";
import styles from "./SwiperGallery.module.scss";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import ListViewButton from "../ListViewButton/ListViewButton";

const GET_WORKS_QUERY = gql`
  query GetWorksQuery {
    works(first: 15) {
      nodes { id title slug excerpt(format: RENDERED) featuredImage { node { sourceUrl(size: MEDIUM) altText } } works { skill } categories { nodes { id name slug } } }
    }
  }
`;
const truncateTitle = (title, maxLength = 25) => { if (!title) return ""; const plainText = String(title).replace(/<[^>]*>?/gm, ""); return plainText.length <= maxLength ? plainText : plainText.substring(0, maxLength) + "..."; };
const formatSkill = (skillValue) => { if (!skillValue) return ""; return Array.isArray(skillValue) ? skillValue.filter((s) => s).join(", ") : String(skillValue); };
const getCategoryName = (work) => { if (!work?.categories?.nodes?.length) return ""; return work.categories.nodes[0].name; };

function SwiperGallery() {
  const [isClient, setIsClient] = useState(false);
  const { loading, error, data } = useQuery(GET_WORKS_QUERY, { skip: !isClient });
  useEffect(() => { setIsClient(true); }, []);
  if (!isClient || loading || error || !data?.works?.nodes) { return <div className={styles.worksContents}><p style={{ textAlign: 'center' }}>Loading...</p></div>; }
  const worksToDisplay = data.works.nodes;

  return (
    <div className={styles.worksContents}>
      <Swiper
        modules={[Autoplay, Navigation, FreeMode]}
        spaceBetween={26}
        slidesPerView={"auto"}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={{
          prevEl: `.${styles.swiperButtonPrev}`,
          nextEl: `.${styles.swiperButtonNext}`,
        }}
      >
        {worksToDisplay.map((work, index) => (
          <SwiperSlide key={`${work.id}-${index}`}>
            <article className={styles.workCard}>
              <header className={styles.workHeader}>
                <span className={styles.workCategory}>{getCategoryName(work)}</span>
                <Image src={work.featuredImage?.node?.sourceUrl || "/About/PC/Icon.webp"} alt={work.featuredImage?.node?.altText || "作品画像"} fill style={{ objectFit: "cover" }} priority={index < 3} sizes="(max-width: 768px) 100vw, 50vw" />
              </header>
              <footer className={styles.workFooter}>
                <h3 className={styles.title}>{truncateTitle(work.title)}</h3>
                <p className={styles.skill}>{formatSkill(work.works?.skill || work.skill || "")}</p>
                <Link href={`/all-works/${work.slug}`} className={styles.worksLink} aria-label={`${truncateTitle(work.title)}の詳細へ`}></Link>
              </footer>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.navigationContainer}>
        <div className={styles.arrowButtons}>
          <div className={styles.swiperButtonPrev}></div>
          <div className={styles.swiperButtonNext}></div>
        </div>
              <Link href="/all-works" className={styles.listLink}>
        <button className={styles.ListViewButton}>一覧をみる</button>
      </Link>
      </div>
    </div>
  );
}

export default SwiperGallery;