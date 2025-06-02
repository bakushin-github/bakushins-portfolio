'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';
import './ClientWrapper.scss';

// (Contextの定義は変更なし)
const LoadingContext = createContext({
  isLoadingComplete: false,
  shouldTriggerAnimation: false,
  triggerPageAnimation: () => {},
});

export const useLoadingContext = () => useContext(LoadingContext);

const ClientWrapper = ({ children }) => {
  const pathname = usePathname(); // pathnameをコンポーネントのトップレベルに移動
  const [showLoading, setShowLoading] = useState(false);
  const [isCheckingVisit, setIsCheckingVisit] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [shouldHideContent, setShouldHideContent] = useState(false); // 初期値が重要
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [shouldTriggerAnimation, setShouldTriggerAnimation] = useState(false);

  useEffect(() => {
    setIsClient(true); // クライアントサイドであることを示す

    const checkVisitStatus = () => {
      try {
        // トップページ（/）の場合のみローディングを表示
        if (pathname === '/') {
          const currentSessionVisited = sessionStorage.getItem('currentSessionVisited');
          if (!currentSessionVisited) {
            // 同一セッション内で未訪問
            setShouldHideContent(true); // ローダー表示前にコンテンツを確実に隠す
            setShowLoading(true);
            sessionStorage.setItem('currentSessionVisited', 'true');
          } else {
            // 既に訪問済み
            setContentVisible(true);
            setIsLoadingComplete(true);
            setTimeout(() => {
              setShouldTriggerAnimation(true);
            }, 100);
          }
        } else {
          // トップページ以外は常にローディングをスキップ
          setContentVisible(true);
          setIsLoadingComplete(true);
          setShouldTriggerAnimation(true);
        }
      } catch (error) {
        console.warn('SessionStorage not available:', error);
        setContentVisible(true);
        setIsLoadingComplete(true);
        setShouldTriggerAnimation(true);
      }
      setIsCheckingVisit(false); // 訪問ステータスのチェック完了
    };

    // (handleVisibilityChange, handleBeforeUnload は変更なし)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTimeout(() => {
          if (document.hidden) {
            try {
              sessionStorage.removeItem('currentSessionVisited');
            } catch (error) {
              console.warn('SessionStorage not available:', error);
            }
          }
        }, 30000);
      }
    };

    const handleBeforeUnload = () => {
      try {
        sessionStorage.removeItem('currentSessionVisited');
      } catch (error) {
        console.warn('SessionStorage not available:', error);
      }
    };

    checkVisitStatus();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [pathname]); // pathnameの変更時のみ再実行

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShouldHideContent(false); // コンテンツ表示を許可
    setIsLoadingComplete(true);

    setTimeout(() => {
      setContentVisible(true);
      setTimeout(() => {
        setShouldTriggerAnimation(true);
      }, 1000);
    }, 150);
  };

  const triggerPageAnimation = () => {
    setShouldTriggerAnimation(true);
  };

  const contextValue = {
    isLoadingComplete,
    shouldTriggerAnimation,
    triggerPageAnimation,
  };

  // SSRの場合の処理 (サーバーサイドレンダリング時)
  if (!isClient) {
    // ホームページ('/')のSSR時にはコンテンツを最初から非表示にする
    // これにより、クライアント側でJSが実行される前の一瞬の表示を防ぐ
    // 他のページやJS無効環境（このコンポーネントは 'use client' だが念のため）では表示する
    const ssrContentHidden = pathname === '/';
    return (
      <LoadingContext.Provider value={contextValue}>
        <div className="client-wrapper">
          <div
            className={`client-wrapper__content ${
              ssrContentHidden
                ? 'client-wrapper__content--hidden' // このクラスで確実に非表示にする
                : 'client-wrapper__content--visible'
            }`}
            style={
              ssrContentHidden ? { opacity: 0, visibility: 'hidden' } : {} // インラインスタイルでも非表示を補強
            }
          >
            {children}
          </div>
        </div>
      </LoadingContext.Provider>
    );
  }

  // 訪問状況チェック中（クライアントサイドでの初回チェック）
  // isClientがtrueになった後、isCheckingVisitがfalseになるまでの間
  if (isCheckingVisit && pathname === '/') {
    return (
      <LoadingContext.Provider value={contextValue}>
        <div className="client-wrapper">
          {/* ここでもコンテンツが誤って表示されないようにする */}
          <div className="client-wrapper__content--hidden" style={{ opacity: 0, visibility: 'hidden' }}>
            {children}
          </div>
        </div>
      </LoadingContext.Provider>
    );
  }

  // 訪問状況チェック中（非トップページ、クライアントサイド）
  if (isCheckingVisit) { // これはホームページ以外のページで訪問ステータスをチェックしている間に適用
    return (
      <LoadingContext.Provider value={contextValue}>
        <div className="client-wrapper">
          <div className="client-wrapper__content client-wrapper__content--visible">
            {children}
          </div>
        </div>
      </LoadingContext.Provider>
    );
  }

  // 訪問ステータスチェック後、ローディング画面またはコンテンツを表示
  return (
    <LoadingContext.Provider value={contextValue}>
      <div className="client-wrapper">
        {/* ローディング画面（トップページで必要な場合のみ表示） */}
        {showLoading && pathname === '/' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        <div
          className={`client-wrapper__content ${
            contentVisible
              ? 'client-wrapper__content--visible'
              : 'client-wrapper__content--hidden'
          }`}
          // shouldHideContentがtrue、またはローディング画面が表示中でコンテンツがまだ表示されるべきでない場合に非表示スタイルを適用
          style={(shouldHideContent || (showLoading && pathname === '/')) && !contentVisible ? { opacity: 0, visibility: 'hidden' } : {}}
        >
          {children}
        </div>
      </div>
    </LoadingContext.Provider>
  );
};

export default ClientWrapper;