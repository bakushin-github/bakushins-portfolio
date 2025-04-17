import React from "react";
import { Noto_Sans_JP } from "next/font/google";
import variablestyles from "../app/styles/variables.module.scss";
import styles from "./Header_after.module.scss";
import Image from "next/image";
import Link from "next/link";
import Contact_button from "../components/Contact_button";
import Drawer_button from "../components/Drawer_button";

// toggleMenuプロパティを受け取るようにする
function Header_after({ toggleMenu }) {
  return (
    <div className={styles.headerAfter}>
      <div className={styles.headerAfter__inner}>
      <Link href="#Fv">
        <Image
          className={styles.headerAfter__logo}
          src="/Header/PC/Logo.webp"
          width={170.18}
          height={47.99}
          alt="ロゴ"
          priority={true}
        ></Image></Link>
        <div className={styles.headerAfter__buttons}>
          <Contact_button className={styles.headerAfter__contact} />
          {/* toggleDrawerプロパティにtoggleMenu関数を渡す */}
          <Drawer_button 
            toggleDrawer={toggleMenu} 
            className={styles.headerAfter__drawerButton}
          />
        </div>
      </div>
    </div>
  );
}

export default Header_after;