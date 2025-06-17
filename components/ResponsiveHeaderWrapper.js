"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/SSG/Header/Header/Header"; // PC用ヘッダー
import Header_Sp from "@/components/SSG/Drawer/Sp/Drawer_menu/Drawer_menuSP"; // SP用ヘッダー

/**
 * 画面幅に応じてPC用またはSP用ヘッダーをレンダリングするラッパーコンポーネント
 * @param {object} props - プロパティ
 * @param {string} props.headerClassName - Headerコンポーネントに適用するCSSクラス名
 */
export default function ResponsiveHeaderWrapper({ headerClassName }) {
  // 画面幅を管理するstate
  const [windowWidth, setWindowWidth] = useState(0);
  // SPヘッダーのメニュー開閉状態を管理するstate
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // PCとSPのブレイクポイントを定義 (サイト全体で共通にすると良いでしょう)
  const BREAKPOINT_SP = 768;

  // メニューの開閉を切り替える関数
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // コンポーネントマウント時とウィンドウリサイズ時に画面幅を更新
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // `window` オブジェクトはブラウザでのみ利用可能なので、存在チェックを行う
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth); // 初期画面幅を設定
      window.addEventListener("resize", handleResize); // リサイズイベントリスナーを追加
    }

    // クリーンアップ関数: コンポーネントがアンマウントされる際にイベントリスナーを削除
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []); // 空の依存配列により、マウント時とアンマウント時にのみ実行

  return (
    <>
      {windowWidth > BREAKPOINT_SP ? (
        // PCサイズの場合、Headerコンポーネントをレンダリング
        <Header className={headerClassName} />
      ) : (
        // SPサイズの場合、Header_Spコンポーネントをレンダリング
        <Header_Sp toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      )}
    </>
  );
}