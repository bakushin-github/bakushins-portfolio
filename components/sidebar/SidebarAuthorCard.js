import Image from 'next/image';
import { getAuthorData } from '../../lib/utils/sidebar-utils';
import styles from './SidebarAuthorCard.module.scss';

export default function SidebarAuthorCard({ articleTitle, articleUrl }) {
  // 投稿者データをユーティリティから取得
  const authorData = getAuthorData();

  // Xシェア用URL（SSG対応）
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle || 'おすすめの記事')}&url=${encodeURIComponent(articleUrl || '')}`;

  return (
    <>
      <div className={styles.sidebarWidget}>
        {/* ヘッダー */}
        <div className={styles.header}>
          ブログ投稿者
        </div>

        {/* 投稿者セクション */}
        <div className={styles.authorSection}>
          <Image 
            src={authorData.avatar}
            alt={authorData.name}
            width={80}
            height={80}
            className={styles.avatar}
          />
          <div>
            <h3 className={styles.name}>
              {authorData.name}
              <span>×</span>
            </h3>
            <p className={styles.description}>
              {authorData.description}
            </p>
          </div>
        </div>

        {/* シェアボタン */}
        <div className={styles.shareButtons}>
          <div className={styles.shareTitle}>
            記事をシェアする
          </div>
          
          {/* Xシェア */}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.shareButton} ${styles.shareTwitter}`}
            title="Xで記事をシェア"
          >
            𝕏 Xでシェア
          </a>
          
          {/* URLコピー - SSG対応でJavaScriptを使用 */}
          <button
            className={`${styles.shareButton} ${styles.shareCopy}`}
            data-url={articleUrl || ''}
            title="記事のURLをコピー"
          >
            🔗 URLをコピー
          </button>
        </div>
      </div>

      {/* SSG対応のためのスクリプト（最小限のJavaScript） */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const copyButton = document.querySelector('.${styles.shareCopy}');
              if (copyButton) {
                copyButton.addEventListener('click', function() {
                  const url = this.getAttribute('data-url') || window.location.href;
                  
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(function() {
                      const originalText = copyButton.textContent;
                      copyButton.textContent = '✓ コピー完了';
                      copyButton.classList.add('${styles.copied}');
                      
                      setTimeout(function() {
                        copyButton.textContent = originalText;
                        copyButton.classList.remove('${styles.copied}');
                      }, 2000);
                    }).catch(function() {
                      fallbackCopy(url);
                    });
                  } else {
                    fallbackCopy(url);
                  }
                });
              }
              
              function fallbackCopy(text) {
                try {
                  const textArea = document.createElement('textarea');
                  textArea.value = text;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  
                  const successful = document.execCommand('copy');
                  document.body.removeChild(textArea);
                  
                  if (successful) {
                    alert('記事のURLをコピーしました！');
                  } else {
                    alert('コピーに失敗しました。');
                  }
                } catch (error) {
                  console.error('コピーエラー:', error);
                  alert('コピーに失敗しました。');
                }
              }
            });
          `
        }}
      />
    </>
  );
}