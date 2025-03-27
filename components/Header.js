import React from "react";
import { Noto_Sans_JP } from "next/font/google";
import variablestyles from "../app/styles/variables.module.scss";
import styles from "./Header.module.scss";
import Image from "next/image";
import Link from "next/link";


function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header__inner}>
        <Image className={styles.header__logo} src="/Header/PC/Logo.webp" width={170.18} height={47.99} alt="ロゴ" priority={true}></Image>
        <nav className={styles.header__nav}>
          <ul className={styles['header__nav-list']}>
            <li><Link href="/">Top</Link></li>
            <li><Link href="/works">Works</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/service">Service</Link></li>
            <li><Link href="/flow">Flow</Link></li>
            <li><Link href="/blog">Blog</Link></li>
              </ul>
          <button className={styles.header__contact}><Image src="/Header/PC/mail.webp" alt="contact" width={20} height={20}></Image><Link href="https://bakushin.blog/contact/">問い合わせる</Link></button>
        </nav>
      </div>
    </div>
  );
}

export default Header;
