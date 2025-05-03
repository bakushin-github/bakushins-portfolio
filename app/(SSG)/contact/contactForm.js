"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import useRecaptcha from "@/hooks/useRecaptcha";
import { useRouter } from "next/navigation"; // App Routerを使用

export default function ContactForm() {
  const router = useRouter(); // Next.jsのルーターを追加
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    inquiry: [],
    detail: "",
    privacy: false,
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
    console.log('フォーム送信開始', formData);

    try {
      // reCAPTCHAトークンを取得
      const token = await executeRecaptcha('submit_contact');
      
      if (!token) {
        setSubmitResult({
          success: false,
          message: 'reCAPTCHAの検証に失敗しました。もう一度お試しください。'
        });
        setIsSubmitting(false);
        return;
      }

      // APIに送信するデータを構築
      const submitData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        detail: formData.detail,
        inquiry: formData.inquiry,
        recaptchaToken: token  // reCAPTCHAトークンを含める
      };
      
      console.log('送信データ:', submitData);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log('APIレスポンスステータス:', res.status);
      
      // レスポンステキストを取得
      const responseText = await res.text();
      console.log('APIレスポンステキスト:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('JSONパースエラー:', e);
        setSubmitResult({
          success: false,
          message: 'レスポンスの解析に失敗しました'
        });
        setIsSubmitting(false);
        return;
      }
      
      if (data.success) {
        // 成功したら即座にリダイレクト
        router.push('/contact/thanks');
      } else {
        setSubmitResult({
          success: false,
          message: data.message || '詳細不明のエラーが発生しました'
        });
      }
    } catch (error) {
      console.error("フォーム送信エラー:", error);
      setSubmitResult({
        success: false,
        message: `エラーが発生しました: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // reCAPTCHAの状態表示
  const recaptchaStatus = recaptchaLoaded 
    ? "reCAPTCHA保護が有効です" 
    : "reCAPTCHA読み込み中...";

  return (
    <form className={styles.contact__form} onSubmit={handleSubmit}>
      <div className={styles.form__contentWrap}>
        {/* 結果メッセージ表示 */}
        {submitResult && (
          <div style={{ 
            margin: '10px 0', 
            padding: '10px', 
            backgroundColor: submitResult.success ? '#e8f5e9' : '#ffebee',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
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
            {["ホームページ制作", "ホームページ修正", "ECサイト制作・修正", "その他"].map((label) => (
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

        {/* reCAPTCHA状態表示 */}
        <div style={{ 
          margin: '10px 0', 
          padding: '5px', 
          backgroundColor: recaptchaLoaded ? '#e8f5e9' : '#fff3e0',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <p>{recaptchaStatus}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>このサイトはreCAPTCHA v3で保護されており、Googleの<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>と<a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">利用規約</a>が適用されます。</p>
        </div>

        <div className={styles.contact__click}>
          <button 
            type="submit" 
            disabled={isSubmitting || !formData.privacy || !recaptchaLoaded}
          >
            {isSubmitting ? "送信中..." : "送信する →"}
          </button>
        </div>
      </div>
    </form>
  );
}