import React from "react";
import styles from "./Drawer_menu.module.scss";
import Image from "next/image";
import Faq from "./Faq";
import Contact_button from "./Contact_button";

function Drawer_menu() {
  return (
    <div className={styles.Drawer_menu}>
      <div className={styles.Drawer_flexLeft}>
        <Image
          src={"/DrawerMenu/PC/1st.webp"}
          alt="□"
          width={125.91254197535207}
          height={125.91254197535207}
          className={styles.Drawer_menu__1}
        />
        <Image
          src={"/DrawerMenu/PC/2nd.webp"}
          alt="▽"
          width={170.0053487710697}
          height={170.0053487710697}
          className={styles.Drawer_menu__2}
        />
        <Image
          src={"/DrawerMenu/PC/3rd.webp"}
          alt="○"
          width={274.34326171875}
          height={274.34326171875}
          className={styles.Drawer_menu__3}
        />
        <Image
          src={"/DrawerMenu/PC/logo.webp"}
          alt="logo"
          width={287.1818542480469}
          height={81.00000762939453}
          className={styles.Drawer_menu__logo}
        />
      </div>
      <div className={styles.Drawer_flexRight}>
        <ul className={styles.Drawer_menu__boxInner}>
          <li className={styles.Drawer_menu__list}>
            <span>Top</span>
            <span>→</span>
          </li>
          <li className={styles.Drawer_menu__list}>
            <span>Works</span>
            <span>→</span>
          </li>
          <li className={styles.Drawer_menu__list}>
            <span>About</span>
            <span>→</span>
          </li>
          <li className={styles.Drawer_menu__list}>
            <span>Service</span>
            <span>→</span>
          </li>
          <li className={styles.Drawer_menu__list}>
            <span>Flow</span>
            <span>→</span>
          </li>
          <li className={styles.Drawer_menu__list}>
            <span>Blog</span>
            <span>→</span>
          </li>

        <div className={styles.Drawer_menu__buttons}>
          <Faq className={styles.Drawer_menu__faq} />
          <Contact_button className={styles.Drawer_menu__contact} />
        </div>
        </ul>
      </div>
    </div>
  );
}

export default Drawer_menu;
