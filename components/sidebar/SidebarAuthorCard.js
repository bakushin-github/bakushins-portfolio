'use client'; // この行がファイルの先頭に必要です！

import Image from 'next/image';
import { getAuthorData } from '../../lib/utils/sidebar-utils';
import styles from './SidebarAuthorCard.module.scss';
import { useEffect } from 'react'; // useEffect をインポート

export default function SidebarAuthorCard({ articleTitle, articleUrl }) {
  // 投稿者データをユーティリティから取得
  const authorData = getAuthorData();

  // Xシェア用URL（SSG対応）
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle || 'おすすめの記事')}&url=${encodeURIComponent(articleUrl || '')}`;

  // CSS Modulesのクラス名を直接文字列として取得 (JavaScript内で使用するため)
  const shareCopyClass = styles.shareCopy;
  const copiedClass = styles.copied;

  // コンポーネントがマウントされた後にJavaScriptロジックを実行
  useEffect(() => {
    console.log('✅ SidebarAuthorCard Client Component がマウントされ、スクリプト実行を開始します。'); // デバッグログ

    // CSS Modulesによって生成された実際のクラス名を使用して要素を選択
    const copyButton = document.querySelector(`.${shareCopyClass}`);

    if (copyButton) {
      console.log('✅ コピーボタンが見つかりました:', copyButton); // デバッグログ
      copyButton.addEventListener('click', function() {
        console.log('✅ コピーボタンがクリックされました！'); // デバッグログ
        // data-url属性からURLを取得、なければ現在のページのURLを使用
        const url = this.getAttribute('data-url') || window.location.href;

        // navigator.clipboard APIが利用可能かチェック
        if (navigator.clipboard) {
          console.log('✅ navigator.clipboardが利用可能です。'); // デバッグログ
          navigator.clipboard.writeText(url).then(function() {
            console.log('✅ クリップボードにコピー成功！'); // デバッグログ
            const originalText = copyButton.textContent;
            copyButton.textContent = '✓ コピー完了';
            copyButton.classList.add(copiedClass); // コピー完了時のクラスを追加

            // 2秒後に元のテキストに戻す
            setTimeout(function() {
              copyButton.textContent = originalText;
              copyButton.classList.remove(copiedClass); // コピー完了時のクラスを削除
            }, 2000);
          }).catch(function(err) {
            // コピー失敗時のエラーハンドリング
            console.error('❌ クリップボードAPIエラー:', err); // デバッグログ
            fallbackCopy(url); // フォールバック関数を呼び出す
          });
        } else {
          console.log('❌ navigator.clipboardが利用できません。フォールバックを開始します。'); // デバッグログ
          fallbackCopy(url); // フォールバック関数を呼び出す
        }
      });
    } else {
      console.log('❌ エラー: コピーボタンが見つかりませんでした。セレクタを確認してください。'); // デバッグログ
    }

    // クリーンアップ関数: コンポーネントがアンマウントされるときにイベントリスナーを削除
    return () => {
      if (copyButton) {
        copyButton.removeEventListener('click', () => {}); // ダミー関数を渡してイベントリスナーを削除
      }
    };
  }, [shareCopyClass, copiedClass]); // 依存配列にクラス名を追加 (変更の可能性は低いが推奨)

  // Clipboard APIが利用できない場合のフォールバック機能 (useEffectの外に定義)
  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      // 画面外にtextareaを配置
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // 古い execCommand を使用してコピー
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea); // 作成したtextareaを削除

      if (successful) {
        alert('記事のURLをコピーしました！');
      } else {
        alert('コピーに失敗しました。');
      }
    } catch (error) {
      console.error('❌ フォールバックコピーエラー:', error); // デバッグログ
      alert('コピーに失敗しました。');
    }
  };


  return (
    <>
      <div className={styles.sidebarWidget}>
        {/* ブログ投稿者ブロック */}
        <div className={styles.authorBlock}>
          <div className={styles.header}>
            ブログ投稿者
          </div>
          <div className={styles.authorSection}>
            <Image
              src={authorData.avatar}
              alt={authorData.name}
              width={60}
              height={60}
              className={styles.avatar}
            />
            <div className={styles.authorInfo}>
              <h3 className={styles.name}>
                <Image
                  src={"/SidebarLogo.webp"}
                  alt={"バクシン"}
                  width={87}
                  height={21.5}
                  className={styles.authorImage}
                />
                <a href="https://x.com/official_bksn">
                <Image
                className={styles.authorX}
                src={"/About/Sp/x.webp"}
                alt="X"
                width={22}
                height={19}/></a>
              </h3>
              <p className={styles.description}>
               医療現場で培った細やかな心配りを、Webの世界でも大切にしています。お客様一人ひとりのご要望に丁寧に耳を傾け、ホームページ制作から決済機能付きECサイトまで、安心してお任せいただけるよう心を込めてサポートいたします。
              </p>
            </div>
          </div>
        </div>

        {/* 記事をシェアするブロック */}
        <div className={styles.shareBlock}>
          <div className={styles.shareTitle}>
            記事をシェアする
          </div>
          <div className={styles.shareButtons}>
            {/* Xシェア */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareButton} ${styles.shareTwitter}`}
              title="Xで記事をシェア"
            >
              𝕏
            </a>

            {/* URLコピーボタン */}
            <button
              className={`${styles.shareButton} ${shareCopyClass}`} // JavaScriptで使用するクラス名を指定
              data-url={articleUrl || ''}
              title="記事のURLをコピー"
            >
              <Image
              src={"/SidebarLink.webp"}
              width={32}
              height={32}
              alt={"URL"}/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}