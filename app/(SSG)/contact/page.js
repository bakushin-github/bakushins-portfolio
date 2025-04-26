import Link from "next/link";
import React from "react";
import styles from "./page.module.scss";
import Header_otherPage from "@/components/SSG/Header/Header_otherPage/Header_otherPage";
import Breadcrumb from "@/components/Breadcrumb/index";
import { generateBreadcrumb } from "@/lib/utils/generateBreadcrumb";
import Image from "next/image";

<script src="https://www.google.com/recaptcha/api.js?render=あなたのサイトキー" />;

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb("/contact");

function page() {
  return (
    <>
      <div className={styles.contact}>
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
          className={styles.right_2ndLine}
          src="/LowerLayer/PC/right_2ndLine.webp"
          alt="right_2ndLine"
          width={644}
          height={1009}
        />
        <Header_otherPage />
        <div className={styles.contact__inner}>
          <div className={styles.Breadcrumb}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className={styles.contact__title}>
            <h1 className={styles.contact__h1}>お問い合わせ</h1>
            <h2 className={styles.contact__h2}>Contact</h2>
          </div>
          <p className={styles.contact____explanation}>
            依無料でご相談、お見積もりを承っております。
            <br />
            お気軽にご相談ください。
          </p>
          <form className={styles.contact__form}>
            <div className={styles.form__contentWrap}>
            <div className={styles.form__content}>
              <label className={styles.labelName}  htmlFor="name">会社名</label>
              <input
                className={styles.contact__input}
                type="text"
                id="name"
                placeholder=""
              />
            </div>
            <div className={styles.form__content}>
              <label className={styles.labelName} htmlFor="name">
                お名前<span className={styles.required}>必須</span>
              </label>
              <input
                className={styles.contact__input}
                type="text"
                id="name"
                placeholder=""
              />
            </div>
            <div className={styles.form__content}>
              <label className={styles.labelName}  htmlFor="name">
                メールアドレス<span className={styles.required}>必須</span>
              </label>
              <input
                className={styles.contact__input}
                type="text"
                id="name"
                placeholder=""
              />
            </div>
            <div className={styles.form__content}>
              <label className={styles.labelName} htmlFor="name">
                お問い合わせ内容<span className={styles.required}>必須</span>
                <label className={styles.radio}>
                  <span className={styles.radioCheck}></span>
                  <input
                    className={styles.contact__input}
                    type="radio"
                    id="HP"
                    text="ホームページ制作"
                    placeholder=""
                  />ホームページ制作
                </label>
                <label className={styles.radio}>
                  <span className={styles.radioCheck}></span>
                  <input
                    className={styles.contact__input}
                    type="radio"
                    id="HPCustomize"
                  />ホームページ修正
                </label>
                <label className={styles.radio}>
                  <span className={styles.radioCheck}></span>
                  <input
                    className={styles.contact__input}
                    type="radio"
                    id="EC"
                  />ECサイト制作・修正
                </label>
                <label className={styles.radio}>
                  <span className={styles.radioCheck}></span>
                  <input
                    className={styles.contact__input}
                    type="radio"
                    id="others"
                  />その他
                </label>
                <textarea
                  id="text"
                  placeholder="お問い合わせ内容の詳細をご記入ください"
                />
              </label>
            </div>
            <div className={styles.form__pp}>
              <label className={styles.form__ppLabel}>
                <Link className={styles.contact__pp} href={"/privacy_policy"}>
                  プライバシーポリシーに同意する
                </Link>
                <input
                  className={styles.contact__input}
                  type="checkbox"
                  id="pp"
                />
              </label>
            </div>
            <div className={styles.contact__click}>
              <br />
              <Link href="/contact/thanks">
                <button>送信する →</button>
              </Link>
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default page;
