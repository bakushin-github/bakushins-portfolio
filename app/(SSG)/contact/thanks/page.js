import React from "react";
import styles from "./page.module.scss";
import Header_otherPage from "@/components/SSG/Header/Header_otherPage/Header_otherPage";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb('/contact/thanks');

export default function Page() {
  return (
    <>
      <div className={styles.thanks}>
        <Image
          className={styles.left_1stLine}
          src="/LowerLayer/PC/left_1stLine.webp"
          alt="left_1stLine"
          width={439}
          height={565}
        />
        <Image
          className={styles.left_2ndLine}
          src="/LowerLayer/PC/left_2ndLine.webp"
          alt="left_2ndLine"
          width={547}
          height={350}
        />
        <Image
          className={styles.right_2ndLine}
          src="/LowerLayer/PC/right_2ndLine.webp"
          alt="right_2ndLine"
          width={644}
          height={1009}
        />
        <Image
          className={styles.right_polygon1}
          src="/LowerLayer/PC/Polygon1.webp"
          alt="right_polygon1"
          width={232}
          height={117}
        />
        <Image
          className={styles.right_polygon2}
          src="/LowerLayer/PC/polygon2.webp"
          alt="right_polygon2"
          width={239}
          height={120}
        />
        <Header_otherPage className={styles.thanksHeader} />
        <div className={styles.Breadcrumb}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <main>
        <h1 className={styles.thanks404}>Thank you !</h1>
        <p className={styles.thanksP}>
          お問い合わせいただきありがとうございました。
          <br />
          当日、または翌営業日までにご連絡差し上げます。
        </p>
        <div className={styles.thanksAttention}>
          <p><strong>返信メールが届かない場合は、迷惑メールフォルダもあわせてご確認ください。</strong></p>
        </div>
        </main>
      </div>
    </>
  );
}