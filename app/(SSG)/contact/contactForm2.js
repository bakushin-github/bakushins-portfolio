"use client";

import React from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HoneypotField from "@/components/HoneypotField/honeypotField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useRecaptcha from "@/hooks/useRecaptcha";

// Zodでバリデーションスキーマを定義
const contactSchema = z.object({
  company: z.string().optional(),
  name: z.string().min(1, "お名前がまだのようです。入力をお願いできますか？"),
  email: z.string().email("メールアドレスが正しくないようです。もう一度ご確認ください。"),
  inquiry: z.array(z.string()).min(1, "内容を選んでください。ピッタリじゃなくても大丈夫です！"),
  detail: z.string().min(1, "空っぽみたいです◎ひとことでもいいので、わかる範囲で書いてもらえたら嬉しいです！").max(1000, "1000文字以内で入力してください"),
  privacy: z.boolean().refine(val => val === true, {
    message: "ごめんなさい、プライバシーポリシーへの同意が必要です。"
  }),
  website: z.string().optional() // ハニーポットフィールド
});

export default function ContactForm() {
  const router = useRouter();
  const { recaptchaLoaded, executeRecaptcha } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);

  // React Hook Formの初期化
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      inquiry: ["ホームページ制作"],
      detail: "",
      privacy: false,
      website: "" // ハニーポットフィールド
    }
  });

  // フォーム送信処理
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = await executeRecaptcha("submit_contact");

      if (!token) {
        setSubmitError("reCAPTCHAの検証に失敗しました。");
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        ...data,
        recaptchaToken: token
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const responseText = await res.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (err) {
        setSubmitError("レスポンスの解析に失敗しました");
        setIsSubmitting(false);
        return;
      }

      if (responseData.success) {
        router.push("/contact/thanks");
      } else {
        setSubmitError(responseData.message || "送信に失敗しました");
      }
    } catch (error) {
      setSubmitError(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryOptions = [
    "ホームページ制作",
    "ホームページ修正",
    "ECサイト制作・修正",
    "その他"
  ];

  const recaptchaStatus = recaptchaLoaded
    ? "reCAPTCHA保護が有効です"
    : "reCAPTCHA読み込み中...";

  return (
    <form className={styles.contact__form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.form__contentWrap}>
        {submitError && (
          <div
            style={{
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#ffebee",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <p>{submitError}</p>
          </div>
        )}

        <div className={styles.form__content}>
          <label className={styles.labelName} htmlFor="company">
            会社名
          </label>
          <input
            className={styles.contact__personalInformation}
            type="text"
            id="company"
            placeholder="会社名"
            {...register("company")}
          />
        </div>

        <div className={styles.form__content}>
          <label className={styles.labelName} htmlFor="name">
            お名前<span className={styles.required}>必須</span>
          </label>
          <input
            className={styles.contact__personalInformation}
            type="text"
            id="name"
            placeholder="お名前"
            {...register("name")}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className={styles.form__content}>
          <label className={styles.labelName} htmlFor="email">
            メールアドレス<span className={styles.required}>必須</span>
          </label>
          <input
            className={styles.contact__personalInformation}
            type="email"
            id="email"
            placeholder="Email@address"
            {...register("email")}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.form__content}>
          <label className={styles.labelName} htmlFor="inquiry">
            お問い合わせ内容<span className={styles.required}>必須</span>
          </label>

          <div className={styles.checkboxWrap}>
            <Controller
              name="inquiry"
              control={control}
              render={({ field }) => (
                <>
                  {inquiryOptions.map((option) => (
                    <label key={option} className={styles.checkbox}>
                      <input
                        className={styles.contact__checkbox}
                        type="checkbox"
                        value={option}
                        checked={field.value.includes(option)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const isChecked = e.target.checked;
                          
                          if (isChecked) {
                            field.onChange([...field.value, value]);
                          } else {
                            field.onChange(field.value.filter(item => item !== value));
                          }
                        }}
                      />
                      <span className={styles.custom__checkbox}></span>
                      {option}
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.inquiry && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.inquiry.message}
            </p>
          )}

          <textarea
            id="detail"
            placeholder="お問い合わせ内容の詳細をご記入ください"
            className={styles.contact__textarea}
            {...register("detail")}
          />
          {errors.detail && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.detail.message}
            </p>
          )}
        </div>

        <div className={styles.form__pp}>
          <label className={styles.form__ppLabel}>
            <input
              className={styles.contact__checkbox}
              type="checkbox"
              id="privacy"
              {...register("privacy")}
            />
            <span className={styles.custom__pp}></span>{" "}
            <Link className={styles.contact__pp} href="/privacy_policy">
              プライバシーポリシーに同意する
            </Link>
          </label>
          {errors.privacy && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.privacy.message}
            </p>
          )}
        </div>
        
        <div className={styles.contact__click}>
          <button
            type="submit"
            disabled={isSubmitting || !recaptchaLoaded}
          >
            {isSubmitting ? "送信中..." : "送信する →"}
          </button>
        </div>

        <div
          style={{
            margin: "10px 0",
            padding: "5px",
            backgroundColor: recaptchaLoaded ? "#e8f5e9" : "#fff3e0",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <p>{recaptchaStatus}</p>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              whiteSpace: "normal",
              lineHeight: "1.5",
            }}
          >
            このフォームは、Googleの安全確認システムを使っています。
            <br />
            より快適に安心してご利用いただくため、Googleの
            <a
              style={{ textDecoration: "underline", color: "#2F4AB2" }}
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              プライバシーポリシー
            </a>
            と
            <a
              style={{ textDecoration: "underline", color: "#2F4AB2" }}
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              利用規約
            </a>
            が適用されます。
          </p>
        </div>

        <HoneypotField
          value={register("website").value}
          onChange={(e) => register("website").onChange(e)}
        />
      </div>
    </form>
  );
}