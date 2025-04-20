"use client";
import React from "react";
import { Noto_Sans_JP } from "next/font/google";
import variablestyles from "../../../app/styles/_variables.module.scss";
import styles from "./Works.module.scss";
import Image from "next/image";
import Link from "next/link";
// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import H2 from "../H2/H2";

function Works() {
  return (
    <>
      <div id="Works" className={styles.works}>
        <div className={styles.works__inner}>
          <H2
            subText="制作実績"
            mainText="Works"
            className={styles.works__title}
          ></H2>
        </div>
      </div>
    </>
  );
}

export default Works;
