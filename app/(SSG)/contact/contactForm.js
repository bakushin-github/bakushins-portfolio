"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import useRecaptcha from "@/hooks/useRecaptcha";
import { useRouter } from "next/navigation";
import HoneypotField from "@/components/HoneypotField/honeypotField";

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    inquiry: ["ホームページ制作"], // デフォルトで「ホームページ制作」をチェック
    detail: "",
    privacy: false,
    website: "", // ← ハニーポットフィールド追加
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const { recaptchaLoaded, executeRecaptcha } = useRecaptcha();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "inquiry") {
      setFormData((prev) => ({
        ...prev,
        inquiry: checked
          ? [...prev.inquiry, value]
          : prev.inquiry.filter((v) => v !== value),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const token = await executeRecaptcha("submit_contact");

      if (!token) {
        setSubmitResult({
          success: false,
          message: "reCAPTCHAの検証に失敗しました。",
        });
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        detail: formData.detail,
        inquiry: formData.inquiry,
        website: formData.website, // これがハニーポットフィールド
        recaptchaToken: token,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const responseText = await res.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        setSubmitResult({
          success: false,
          message: "レスポンスの解析に失敗しました",
        });
        setIsSubmitting(false);
        return;
      }

      if (data.success) {
        router.push("/contact/thanks"); // ✅ 遷移処理を復元
      } else {
        setSubmitResult({
          success: false,
          message: data.message || "送信に失敗しました",
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `エラーが発生しました: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const recaptchaStatus = recaptchaLoaded
    ? "reCAPTCHA保護が有効です"
    : "reCAPTCHA読み込み中...";

  return (
    <form className={styles.contact__form} onSubmit={handleSubmit}>
      <div className={styles.form__contentWrap}>
        {submitResult && (
          <div
            style={{
              margin: "10px 0",
              padding: "10px",
              backgroundColor: submitResult.success ? "#e8f5e9" : "#ffebee",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <p>{submitResult.message}</p>
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
            name="company"
            placeholder="会社名"
            value={formData.company}
            onChange={handleChange}
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
            name="name"
            placeholder="お名前"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form__content}>
          <label className={styles.labelName} htmlFor="email">
            メールアドレス<span className={styles.required}>必須</span>
          </label>
          <input
            className={styles.contact__personalInformation}
            type="email"
            id="email"
            name="email"
            placeholder="Email@address"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form__content}>
          <label className={styles.labelName} htmlFor="inquiry">
            お問い合わせ内容<span className={styles.required}>必須</span>
          </label>

          <div className={styles.checkboxWrap}>
            {[
              "ホームページ制作",
              "ホームページ修正",
              "ECサイト制作・修正",
              "その他",
            ].map((label) => (
              <label key={label} className={styles.checkbox}>
                <input
                  className={styles.contact__checkbox}
                  type="checkbox"
                  name="inquiry"
                  value={label}
                  checked={formData.inquiry.includes(label)}
                  onChange={handleChange}
                />
                <span className={styles.custom__checkbox}></span>
                {label}
              </label>
            ))}
          </div>

          <textarea
            id="detail"
            name="detail"
            placeholder="お問い合わせ内容の詳細をご記入ください"
            className={styles.contact__textarea}
            value={formData.detail}
            onChange={handleChange}
          />
        </div>

        <div className={styles.form__pp}>
          <label className={styles.form__ppLabel}>
            <input
              className={styles.contact__checkbox}
              type="checkbox"
              id="privacy"
              name="privacy"
              checked={formData.privacy}
              onChange={handleChange}
              required
            />
            <span className={styles.custom__pp}></span>{" "}
            <Link className={styles.contact__pp} href="/privacy_policy">
              プライバシーポリシーに同意する
            </Link>
          </label>
        </div>
        <div className={styles.contact__click}>
          <button
            type="submit"
            disabled={isSubmitting || !formData.privacy || !recaptchaLoaded}
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
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
        />
      </div>
    </form>
  );
}
