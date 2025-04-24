import Link from "next/link";
import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Header_otherPage from "@/components/SSG/Header/Header_otherPage/Header_otherPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";
import Cta from "@/components/SSG/Cta/Cta";

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb("/price");

export default function Price() {
  return (
    <div className={styles.price}>
      <Image
        className={styles.left_1stLine}
        src="/LowerLayer/PC/left_1stLine.webp"
        alt="left_1stLine"
        width={439}
        height={565}
        priority
      />
      <Image
        className={styles.right_1stLine}
        src="/LowerLayer/PC/right_1stLine.webp"
        alt="right_1stLine"
        width={342}
        height={429}
      />
      <Image
        className={styles.ball}
        src="/LowerLayer/PC/ball.webp"
        alt="ball"
        width={169}
        height={169}
      />
      <Image
        className={styles.right_polygon1}
        src="/LowerLayer/PC/Polygon1.webp"
        alt="right_polygon1"
        width={232}
        height={117}
      />
      <Header_otherPage />
      <div className={styles.price__inner}>
        <div className={styles.Breadcrumb}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className={styles.price__title}>
          <h1 className={styles.price__h1}>費用のめやす</h1>
          <h2 className={styles.price__h2}>price</h2>
        </div>
        <div className={styles.price__text}>
          <p className={styles.price__explanation}>
            ご依頼内容に応じた料金の目安を掲載しています。デザイン・原稿・アニメーションをご希望の場合、別途料金を承ります。詳細なお見積もりは、ヒアリング後にご案内いたします。
          </p>
        </div>
        <div className={styles.price__tableContent}>
          {" "}
          <table className={styles.price_table} role="table">
            <thead className={styles.visually_hidden}>
              <tr>
                <th scope="col">項目</th>
                <th scope="col">料金</th>
              </tr>
            </thead>
            <tbody class={styles.price__tableBody}>
              <tr>
                <td>横長の1ページ</td>
                <td>150,000円〜</td>
              </tr>
              <tr>
                <td>追加1ページにつき</td>
                <td>20,000円〜</td>
              </tr>
              <tr>
                <td>WordPress化</td>
                <td>50,000円〜</td>
              </tr>
              <tr>
                <td>ECサイト構築</td>
                <td>200,000円〜</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Cta />
    </div>
  );
}
