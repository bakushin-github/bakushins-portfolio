import React from 'react';

/**
 * FAQページへのリンクを表示する、外部ファイルに依存しない自己完結型のサーバーコンポーネント。
 * アニメーションとスタイルは、コンポーネント内部の<style>タグとCSS変数で制御されます。
 *
 * @param {object} props - コンポーネントのプロパティ
 * @param {string} [props.className] - 主にレイアウト（幅、高さ、マージン等）を指定するための外部CSSクラス
 * @param {string} [props.borderColor] - ボタンの枠線の色。未指定の場合は '#ccc' になります。
 * @param {string} [props.textColor] - テキストの色。未指定の場合は '#fff' になります。
 */
function Faq({ className, borderColor, textColor }) {

  // 親から渡された色をCSS変数としてインラインスタイルで設定
  const customStyles = {
    // 未指定時のデフォルト値を設定
    '--faq-component-border-color': borderColor || '#ccc',
    '--faq-component-text-color': textColor || '#fff',
  };

  // コンポーネントにスコープを限定したCSSを<style>タグとして埋め込む
  // ユニークなクラス名を使用して、他のコンポーネントとのスタイルの衝突を防ぎます。
  const faqComponentStyle = `
    .faq-component-wrapper-9981 {
      /* デフォルトスタイルをCSS変数として定義 */
      --faq-border-color-default: #ccc;
      --faq-text-color-default: #fff;
      
      /* propsから渡された値があればそれを使い、なければデフォルト値を使用 */
      --final-border-color: var(--faq-component-border-color, var(--faq-border-color-default));
      --final-text-color: var(--faq-component-text-color, var(--faq-text-color-default));

      /* aタグのスタイル。ここに枠線や見た目のスタイルを集約 */
      display: inline-block;
      position: relative; /* テキスト要素の配置の基準 */
      box-sizing: border-box;
      text-decoration: none;
      width: 155px; /* デフォルトの幅 */
      height: 52px;  /* デフォルトの高さ */
      border: 1px solid var(--final-border-color); /* 枠線はここで一度だけ描画 */
      border-radius: 30px;
      overflow: hidden; /* アニメーションのためのはみ出しを隠す */
      cursor: pointer;
    }

    /* 内側のdivは配置に関与しないように変更 */
    .faq-button-container-9981 {
      width: 100%;
      height: 100%;
      background: transparent;
      box-sizing: border-box;
    }

    .faq-text-content-9981 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      font-family: "Noto Sans JP", sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 170%;
      color: var(--final-text-color); /* CSS変数で色を指定 */
      letter-spacing: 0.04em; 
      transition: left 0.4s ease;
    }

    .faq-hover-content-9981 {
      left: -100%;
    }

    /* ホバー時のアニメーション */
    .faq-component-wrapper-9981:hover .faq-default-content-9981 {
      left: 100%;
    }

    .faq-component-wrapper-9981:hover .faq-hover-content-9981 {
      left: 0;
    }
  `;

  return (
    // 親から渡されたクラス名と、CSS変数を設定したインラインスタイルを適用
    <a 
      href="/faq" 
      className={`faq-component-wrapper-9981 ${className || ''}`}
      style={customStyles}
    >
      {/* このコンポーネント専用のスタイルを埋め込む */}
      <style>{faqComponentStyle}</style>

      {/* アニメーションのコンテナ */}
      <div className="faq-button-container-9981">
        {/* 通常時に表示されるテキスト */}
        <div className="faq-text-content-9981 faq-default-content-9981">
          <span>よくある質問</span>
        </div>
        {/* ホバー時に表示されるテキスト */}
        <div className="faq-text-content-9981 faq-hover-content-9981">
          <span>よくある質問</span>
        </div>
      </div>
    </a>
  );
}

export default Faq;
