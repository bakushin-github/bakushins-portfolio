"use client";
import { useEffect, useState } from 'react';

export default function useRecaptcha() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    const checkRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          console.log('reCAPTCHA読み込み完了');
          setRecaptchaLoaded(true);
        });
        return true; // 読み込み完了
      }
      return false; // まだ読み込み中
    };

    // 最初のチェック
    if (checkRecaptcha()) {
      return; // 既に読み込まれている場合は終了
    }

    // 読み込みを待つためのポーリング
    const interval = setInterval(() => {
      if (checkRecaptcha()) {
        clearInterval(interval);
      }
    }, 100); // 100ms間隔でチェック

    // タイムアウト設定（10秒後に諦める）
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.error('reCAPTCHAスクリプトの読み込みがタイムアウトしました');
    }, 10000);

    // クリーンアップ
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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