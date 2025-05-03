"use client";
import { useEffect, useState } from 'react';

export default function useRecaptcha() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    // reCAPTCHAスクリプトが既に読み込まれているか確認
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA読み込み完了');
        setRecaptchaLoaded(true);
      });
    } else {
      console.error('reCAPTCHAスクリプトが見つかりません');
    }
  }, []);

  const executeRecaptcha = async (action) => {
    if (!recaptchaLoaded) {
      console.error('reCAPTCHAが読み込まれていません');
      return null;
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.error('reCAPTCHAサイトキーが設定されていません');
      return null;
    }

    try {
      console.log(`reCAPTCHA実行: ${action}`);
      const token = await window.grecaptcha.execute(siteKey, { action });
      console.log('reCAPTCHAトークン取得成功');
      return token;
    } catch (error) {
      console.error('reCAPTCHA実行エラー:', error);
      return null;
    }
  };

  return { recaptchaLoaded, executeRecaptcha };
}