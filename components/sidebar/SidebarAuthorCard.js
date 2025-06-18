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
                  className={styles.authorImage}          />
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
            
            {/* URLコピー - SSG対応でJavaScriptを使用 */}
            <button
              className={`${styles.shareButton} ${styles.shareCopy}`}
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