// components/Loading/ClientWrapper.jsx
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';
import './ClientWrapper.scss';

// ローディング状態を管理するContext
const LoadingContext = createContext({
  isLoadingComplete: false,
  shouldTriggerAnimation: false,
  triggerPageAnimation: () => {},
});

export const useLoadingContext = () => useContext(LoadingContext);

const ClientWrapper = ({ children }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [isCheckingVisit, setIsCheckingVisit] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [shouldHideContent, setShouldHideContent] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [shouldTriggerAnimation, setShouldTriggerAnimation] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // クライアントサイドでのみ実行
    setIsClient(true);
    
    const checkVisitStatus = () => {
      try {
        // トップページ（/）の場合のみローディングを表示
        if (pathname === '/') {
          // セッションストレージで同一セッション内での訪問をチェック
          const currentSessionVisited = sessionStorage.getItem('currentSessionVisited');
          
          if (!currentSessionVisited) {
            // 同一セッション内で未訪問 = 新規訪問またはサイト離脱後の再訪問
            setShouldHideContent(true); // コンテンツを一時的に隠す
            setShowLoading(true);
            sessionStorage.setItem('currentSessionVisited', 'true');
          } else {
            // 既に訪問済み = サイト内回遊（即座にアニメーション開始）
            setContentVisible(true);
            setIsLoadingComplete(true);
            // アニメーション開始を遅らせる
            setTimeout(() => {
              setShouldTriggerAnimation(true);
            }, 100);
          }
        } else {
          // トップページ以外は常にローディングをスキップ
          setContentVisible(true);
          setIsLoadingComplete(true);
          setShouldTriggerAnimation(true); // 他ページでもアニメーション状態を有効に
        }
      } catch (error) {
        // sessionStorageが使用できない場合はローディングをスキップ
        console.warn('SessionStorage not available:', error);
        setContentVisible(true);
        setIsLoadingComplete(true);
        setShouldTriggerAnimation(true);
      }
      
      setIsCheckingVisit(false);
    };

    // ページの可視性変化を監視（タブ切り替えやサイト離脱を検知）
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // ページが非表示になった（タブ切り替えやサイト離脱）
        // 一定時間後にセッションをリセット
        setTimeout(() => {
          if (document.hidden) {
            try {
              // まだ非表示なら離脱とみなす
              sessionStorage.removeItem('currentSessionVisited');
            } catch (error) {
              console.warn('SessionStorage not available:', error);
            }
          }
        }, 30000); // 30秒後にリセット
      }
    };

    // ページ離脱時の処理
    const handleBeforeUnload = () => {
      try {
        // ブラウザを閉じる、他のサイトに移動する際にセッションをクリア
        sessionStorage.removeItem('currentSessionVisited');
      } catch (error) {
        console.warn('SessionStorage not available:', error);
      }
    };

    checkVisitStatus();
    
    // イベントリスナーを追加
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
  }, [pathname]);

  const handleLoadingComplete = () => {
    // ローディング完了後、中央から上下に開くアニメーションでコンテンツを表示
    setShowLoading(false);
    setShouldHideContent(false);
    setIsLoadingComplete(true);
    
    // 少し遅らせて中央から開くアニメーション開始
    setTimeout(() => {
      setContentVisible(true);
      // さらに遅らせてページアニメーションを開始（TOPアニメーション用に十分な時間を確保）
      setTimeout(() => {
        setShouldTriggerAnimation(true);
      }, 1000); // パン開きアニメーション完了後1秒待ってからページアニメーション開始
    }, 150);
  };

  const triggerPageAnimation = () => {
    setShouldTriggerAnimation(true);
  };

  // Context値
  const contextValue = {
    isLoadingComplete,
    shouldTriggerAnimation,
    triggerPageAnimation,
  };

  // SSRの場合は静的コンテンツを表示
  if (!isClient) {
    return (
      <LoadingContext.Provider value={contextValue}>
        <div className="client-wrapper">
          <div className="client-wrapper__content--visible">
            {children}
          </div>
        </div>
      </LoadingContext.Provider>
    );
  }

  // 訪問状況チェック中で、ローディングが必要な場合はコンテンツを隠す
  if (isCheckingVisit && pathname === '/') {
    return (
      <LoadingContext.Provider value={contextValue}>
        <div className="client-wrapper">
          <div className="client-wrapper__content--hidden" style={{ opacity: 0, visibility: 'hidden' }}>
            {children}
          </div>
        </div>
      </LoadingContext.Provider>
    );
  }

  // 訪問状況チェック中（非トップページ）は静的コンテンツを表示
  if (isCheckingVisit) {
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

  return (
    <LoadingContext.Provider value={contextValue}>
      <div className="client-wrapper">
        {/* ローディング画面（トップページのみ） */}
        {showLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        
        {/* メインコンテンツ - 中央から上下に開くアニメーション */}
        <div 
          className={`client-wrapper__content ${contentVisible ? 'client-wrapper__content--visible' : 'client-wrapper__content--hidden'}`}
          style={shouldHideContent ? { opacity: 0, visibility: 'hidden' } : {}}
        >
          {children}
        </div>
      </div>
    </LoadingContext.Provider>
  );
};

export default ClientWrapper;