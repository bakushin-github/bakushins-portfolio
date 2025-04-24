import React from "react";
import { Noto_Sans_JP } from "next/font/google";
import variablestyles from "../../../../app/styles/_variables.module.scss";
import styles from "../Header_otherPage/Header_otherPage.module.scss";
import Image from "next/image";
import Link from "next/link";
import Contact_button from "../../Contact_button/Contact_button";

function Header_otherPage() {
  return (
    <div className={styles.header}>
      <div className={styles.header__inner}>
        <Link href="/#Fv">
          <Image
            className={styles.header__logo}
            src="/Header/PC/Logo.webp"
            width={170.18}
            height={47.99}
            alt="ロゴ"
            priority={true}
          ></Image>
        </Link>
        <nav className={styles.header__nav}>
          <ul className={styles["header__nav-list"]}>
            <li>
              <Link href="/#Fv">Top</Link>
            </li>
            <li>
              <Link href="/#Works">Works</Link>
            </li>
            <li>
              <Link href="/#About">About</Link>
            </li>
            <li>
              <Link href="/#Service">Service</Link>
            </li>
            <li>
              <Link href="/#Flow">Flow</Link>
            </li>
            <li>
              <Link href="/#Blogs">Blog</Link>
            </li>
          </ul>
          <Contact_button className={styles.header__contact} />
        </nav>
      </div>
    </div>
  );
}

export default Header_otherPage;
