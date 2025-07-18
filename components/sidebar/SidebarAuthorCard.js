'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';

export default function SidebarAuthorCard({ articleTitle, articleUrl }) {
  const [sidebarTop, setSidebarTop] = useState(370);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  
  // 作者データ（元の仕様に合わせて修正）
  const authorData = {
    name: 'バクシン', 
    avatar: '/avatar.webp', // 158x158のアバター画像
    description: '医療現場で培った心配りを活かし、Webでも一人ひとりの想いに寄り添います。ホームページや決済対応のECサイトも、安心してお任せください。心を込めてサポートします。'
  };

  // Xシェア用URL
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle || 'おすすめの記事')}&url=${encodeURIComponent(articleUrl || '')}`;

  // blog-thumbnailBoxとY軸を揃え、スクロール時はヘッダーとの距離を保つ
  const getAlignedTop = () => {
    if (windowWidth >= 1024) {
      // スクロール処理でsidebarTopが動的に設定されている場合はそれを使用
      return `${sidebarTop}px`;
    } else {
      // 1024px未満: 通常の計算を使用
      return `${sidebarTop}px`;
    }
  };

  // スタイル定義
  const sidebarWidgetStyle = {
    position: 'fixed',
    top: getAlignedTop(),
    transition: 'top 0.2s ease-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif',
    width: '100%',
    background: 'transparent',
    maxWidth: windowWidth >= 1024 && windowWidth < 1280 ? '300px' : '353px',
    color: '#333',
    marginBottom: '24px',
    animation: 'slideInRight 0.5s ease-out',
    zIndex: 1,
    margin: windowWidth >= 1024 && windowWidth < 1280 ? '0' : '0',
    backgroundColor: 'transparent'
  };

  // デバッグ用：現在の値をログ出力（本番では削除）
  console.log('🎨 Current sidebar values:', {
    sidebarTop,
    windowWidth,
    isTargetWidth: windowWidth >= 1024 && windowWidth < 1280,
    appliedTop: getAlignedTop()
  });

  const authorBlockStyle = {
    padding: windowWidth >= 1024 && windowWidth < 1280 ? '20px 15px 27px' : '24px 17.5px 32px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px 0px rgba(25, 33, 61, 0.05)'
  };

  const headerStyle = {
    fontSize: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    color: '#333',
    marginBottom: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    fontWeight: '500',
    textAlign: 'left',
    borderBottom: '1px solid #e1e5e9',
    paddingBottom: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    boxSizing: 'border-box'
  };

  const authorSectionStyle = {
    display: 'flex',
    flexDirection: windowWidth >= 1024 && windowWidth < 1280 ? 'row' : 'row',
    alignItems: windowWidth >= 1024 && windowWidth < 1280 ? 'flex-start' : 'flex-start',
    gap: windowWidth >= 1024 && windowWidth < 1280 ? '7px' : '8px',
    width: '100%',
    maxWidth: windowWidth >= 1024 && windowWidth < 1280 ? '270px' : '318px'
  };

  const avatarStyle = {
    width: windowWidth >= 1024 && windowWidth < 1280 ? '134px' : '158px',
    height: windowWidth >= 1024 && windowWidth < 1280 ? '134px' : '158px'
  };

  const authorInfoStyle = {
    flex: 1,
    minWidth: 0,
    width: '100%',
    overflow: 'hidden'
  };

  const nameStyle = {
    margin: windowWidth >= 1024 && windowWidth < 1280 ? '0 0 14px 0' : '0 0 16px 0',
    fontSize: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    fontWeight: '600',
    color: '#333333',
    display: 'flex',
    alignItems: 'center',
    gap: windowWidth >= 1024 && windowWidth < 1280 ? '7px' : '8px',
    justifyContent: windowWidth >= 1024 && windowWidth < 1280 ? 'flex-start' : 'flex-start'
  };

  const descriptionStyle = {
    fontSize: windowWidth >= 1024 && windowWidth < 1280 ? '12px' : '12px',
    lineHeight: '1.5',
    color: '#666666',
    margin: 0,
    fontWeight: '300',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    wordBreak: 'break-all',
    width: '100%',
    maxWidth: '100%',
    textAlign: windowWidth >= 1024 && windowWidth < 1280 ? 'left' : 'left'
  };

  const shareBlockStyle = {
    marginTop: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    padding: windowWidth >= 1024 && windowWidth < 1280 ? '20px 21px 27px' : '24px 25px 32px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px 0px rgba(25, 33, 61, 0.05)'
  };

  const shareTitleStyle = {
    fontSize: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    color: '#333',
    marginBottom: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    textAlign: 'left',
    fontWeight: '500',
    borderBottom: '1px solid #e1e5e9',
    paddingBottom: windowWidth >= 1024 && windowWidth < 1280 ? '14px' : '16px',
    boxSizing: 'border-box'
  };

  const shareButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: windowWidth >= 1024 && windowWidth < 1280 ? '41px' : '48px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#333',
    textDecoration: 'none',
    fontSize: '14px',
    textAlign: 'center',
    cursor: 'pointer',
    fontWeight: '500',
    marginBottom: windowWidth >= 1024 && windowWidth < 1280 ? '7px' : '8px',
    boxSizing: 'border-box'
  };

  // リサイズ監視用のuseEffect
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // スクロール位置によってサイドバーの位置を調整
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const currentWindowWidth = window.innerWidth;
      
      if (currentWindowWidth >= 1024) {
        // 1024px以上の場合：ヘッダーとの距離を考慮した位置調整
        
        // blog-thumbnailBox要素の初期位置を取得
        const thumbnailBox = document.querySelector('.blog-thumbnailBox') || 
                            document.querySelector('[class*="thumbnail"]') ||
                            document.querySelector('[class*="blog-thumbnail"]') ||
                            document.querySelector('.post-thumbnail') ||
                            document.querySelector('.featured-image');
        
        let initialSidebarTop = 370; // フォールバック値
        
        if (thumbnailBox) {
          const rect = thumbnailBox.getBoundingClientRect();
          initialSidebarTop = rect.top + window.scrollY;
        }
        
        // ヘッダーの高さを取得（一般的なヘッダーセレクタで検索）
        const header = document.querySelector('header') ||
                      document.querySelector('.header') ||
                      document.querySelector('[class*="header"]') ||
                      document.querySelector('nav') ||
                      document.querySelector('.navbar');
        
        const headerHeight = header ? header.offsetHeight : 60; // フォールバック: 60px
        const headerMargin = 20; // ヘッダーとの間隔
        const minTopPosition = headerHeight + headerMargin; // ヘッダー + 20px
        
        // 現在のスクロール位置での理想的なサイドバー位置
        const idealTopPosition = initialSidebarTop - scrollY;
        
        // ヘッダーとの衝突を回避する最終位置
        const finalTopPosition = Math.max(minTopPosition, idealTopPosition);
        
        setSidebarTop(finalTopPosition);
        
        console.log('🔍 Desktop Scroll Debug:', {
          scrollY,
          windowWidth: currentWindowWidth,
          headerHeight,
          minTopPosition,
          initialSidebarTop,
          idealTopPosition,
          finalTopPosition
        });
        
      } else {
        // 1024px未満の場合は従来のスクロール処理を実行
        const separatorLineElement = document.querySelector('span.span_variables_singleBlog_separatorLine__d8DxW'); 
        const eyecatchImageElement = document.querySelector('.eyecatch-image-container');

        let dynamicInitialTop = 370; // デフォルト値

        if (eyecatchImageElement) {
          const eyecatchBottom = eyecatchImageElement.getBoundingClientRect().bottom + window.scrollY;
          const separatorMarginBottom = 48; 
          dynamicInitialTop = eyecatchBottom + separatorMarginBottom;
          console.log('🎯 Dynamic initialTop (from eyecatch):', dynamicInitialTop);
        } else if (separatorLineElement) {
          const separatorBottom = separatorLineElement.getBoundingClientRect().bottom + window.scrollY;
          dynamicInitialTop = separatorBottom;
          console.log('🎯 Dynamic initialTop (from separatorLine):', dynamicInitialTop);
        } else {
          if (currentWindowWidth >= 1024 && currentWindowWidth < 1280) {
            dynamicInitialTop = 410;
          } else {
            dynamicInitialTop = currentWindowWidth >= 1920 
              ? 400 
              : currentWindowWidth <= 1440 
                ? 370 
                : 370 + ((currentWindowWidth - 1440) / (1920 - 1440)) * 30;
          }
          console.log('🎯 Fallback initialTop:', dynamicInitialTop);
        }

        const sidebarElement = document.querySelector('.sidebar-author-card-container');
        const sidebarHeight = sidebarElement ? sidebarElement.offsetHeight : 0;
        const sidebarMarginBottom = 24; 
        const totalSidebarHeight = sidebarHeight + sidebarMarginBottom;

        const initialScrollThreshold = 220; 
        let fixedTopOffset; 

        if (currentWindowWidth >= 1024 && currentWindowWidth < 1280) {
          fixedTopOffset = 180;
        } else {
          fixedTopOffset = 150;
        }
        
        const footerOffset = 310; 
        const stopScrollingAt = documentHeight - windowHeight - footerOffset;
        const absoluteStopPosition = documentHeight - totalSidebarHeight - footerOffset;

        if (scrollY <= initialScrollThreshold) {
          const progress = scrollY / initialScrollThreshold;
          const currentTop = dynamicInitialTop - ((dynamicInitialTop - fixedTopOffset) * progress);
          setSidebarTop(Math.max(fixedTopOffset, currentTop)); 
        } else if (scrollY > initialScrollThreshold && scrollY < stopScrollingAt) {
          setSidebarTop(fixedTopOffset);
        } else if (scrollY >= stopScrollingAt) {
          const newTopRelativeToDocument = absoluteStopPosition;
          setSidebarTop(newTopRelativeToDocument - scrollY); 
        }
        
        console.log('🔍 Mobile Debug Info:', {
          scrollY,
          windowWidth: currentWindowWidth,
          calculatedSidebarTop: sidebarTop
        });
      }
    };

    // 初期実行
    handleScroll();

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // リサイズ時も再計算
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [windowWidth]); // windowWidth が変更されたら再計算

  // コンポーネントがマウントされた後にコピー機能のJavaScriptロジックを実行
  useEffect(() => {
    console.log('✅ SidebarAuthorCard Client Component がマウントされ、スクリプト実行を開始します。');

    const copyButton = document.querySelector('.share-copy-button');

    if (copyButton) {
      console.log('✅ コピーボタンが見つかりました:', copyButton);
      
      // 元のコンテンツを保存
      const originalHTML = copyButton.innerHTML;
      
      const handleCopyClick = function() {
        console.log('✅ コピーボタンがクリックされました！');
        const url = this.getAttribute('data-url') || window.location.href;

        if (navigator.clipboard) {
          console.log('✅ navigator.clipboardが利用可能です。');
          navigator.clipboard.writeText(url).then(function() {
            console.log('✅ クリップボードにコピー成功！');
            
            // ボタンの内容を「✓ コピー完了」に変更
            copyButton.innerHTML = '✓ コピー完了';
            copyButton.style.backgroundColor = '#10b981';
            copyButton.style.color = 'white';

            setTimeout(function() {
              // 元のHTMLコンテンツに戻す（画像も含む）
              copyButton.innerHTML = originalHTML;
              copyButton.style.backgroundColor = 'transparent';
              copyButton.style.color = '#333';
            }, 2000);
          }).catch(function(err) {
            console.error('❌ クリップボードAPIエラー:', err);
            fallbackCopy(url);
          });
        } else {
          console.log('❌ navigator.clipboardが利用できません。フォールバックを開始します。');
          fallbackCopy(url);
        }
      };

      copyButton.addEventListener('click', handleCopyClick);

      return () => {
        copyButton.removeEventListener('click', handleCopyClick);
      };
    } else {
      console.log('❌ エラー: コピーボタンが見つかりませんでした。セレクタを確認してください。');
    }
  }, []);

  // Clipboard APIが利用できない場合のフォールバック機能
  const fallbackCopy = (text) => {
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
      console.error('❌ フォールバックコピーエラー:', error);
      alert('コピーに失敗しました。');
    }
  };

  return (
    <>
      <div 
        className="sidebar-author-card-container" // Sidebarの高さ計算のために追加
        style={sidebarWidgetStyle}
      >
        {/* ブログ投稿者ブロック */}
        <div style={authorBlockStyle}>
          <div style={headerStyle}>
            ブログ投稿者
          </div>
          <div style={authorSectionStyle}>
            <img
              src={"/profile-avatar.webp"}
              alt={authorData.name}
              style={avatarStyle}
            />
            <div style={authorInfoStyle}>
              <h3 style={nameStyle}>
                <img
                  src="/SidebarLogo.webp"
                  alt="バクシン"
                  width={windowWidth >= 1024 && windowWidth < 1280 ? "74" : "87"}
                  height={windowWidth >= 1024 && windowWidth < 1280 ? "18" : "21.5"}
                  style={{ marginRight: windowWidth >= 1024 && windowWidth < 1280 ? '7px' : '8px' }}
                />
                <a 
                  href="https://x.com/official_bksn"
                  style={{ color: '#2F4AB2', textDecoration: 'underline' }}
                >
                  <img
                    src="/About/Sp/x.webp"
                    alt="X"
                    width={windowWidth >= 1024 && windowWidth < 1280 ? "19" : "22"}
                    height={windowWidth >= 1024 && windowWidth < 1280 ? "16" : "19"}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  />
                </a>
              </h3>
              <p style={descriptionStyle}>
                {authorData.description}
              </p>
            </div>
          </div>
        </div>

        {/* 記事をシェアするブロック */}
        <div style={shareBlockStyle}>
          <div style={shareTitleStyle}>
            記事をシェアする
          </div>
          <div>
            {/* Xシェア */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...shareButtonStyle,
                fontSize: windowWidth >= 1024 && windowWidth < 1280 ? '25px' : '29.5px'
              }}
              title="Xで記事をシェア"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1da1f2';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              𝕏
            </a>

            {/* URLコピーボタン */}
            <button
              className="share-copy-button"
              data-url={articleUrl || ''}
              title="記事のURLをコピー"
              style={{
                ...shareButtonStyle,
                marginBottom: '0'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1da1f2';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <img
                src="/SidebarLink.webp"
                width={windowWidth >= 1024 && windowWidth < 1280 ? "27" : "32"}
                height={windowWidth >= 1024 && windowWidth < 1280 ? "27" : "32"}
                alt="URL"
              />
            </button>
          </div>
        </div>
      </div>

      {/* CSS アニメーション用のスタイル */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 1023px) {
          div[style*="position: fixed"] {
            position: static !important;
            top: auto !important;
            margin: auto;
            transform: none !important;
          }
        }

        @media (min-width: 1024px) {
          div[style*="position: fixed"] {
            /* デスクトップ表示時の追加調整 */
            transition: top 0.1s ease-out;
          }
        }

        @media screen and (min-width: 1024px) and (max-width: 1279px) {
          /* blog-mainのpadding-inlineを50pxに設定 */
          .blog-main {
            padding-inline: 50px !important;
          }
          
          /* サイドバーサイズを300pxに設定 */
          div[style*="max-width: 353px"] {
            max-width: 300px !important;
          }
          
          div[style*="max-width: 270px"] {
            max-width: 270px !important;
          }
        }

        @media (max-width: 370px) {
          img[style*="width: 158px"] {
            width: clamp(5.625rem, -21.388rem + 135.07vw, 9.846rem) !important;
            height: clamp(5.625rem, -21.388rem + 135.07vw, 9.846rem) !important;
          }
          
          div[style*="max-width: 318px"] {
            width: auto !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}