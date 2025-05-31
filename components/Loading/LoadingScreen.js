// components/Loading/LoadingScreen.jsx
'use client';

import React, { useState, useEffect } from 'react';
import './LoadingScreen.scss';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    let timer;
    
    if (progress < 99) {
      timer = setTimeout(() => {
        setProgress(progress + 1);
      }, 15);
    } else if (progress === 99) {
      timer = setTimeout(() => {
        setProgress(100);
        setShowWelcome(true);
        
        // Welcome表示後2秒で完了
        setTimeout(() => {
          setIsCompleting(true);
          // CSS transitionの時間を考慮して少し遅らせる
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 500);
        }, 2000);
      }, 1500);
    }
    
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  // 数字を2桁でフォーマット（00から始める）
  const formatNumber = (num) => {
    if (num === 100) return '100%';
    return num.toString().padStart(2, '0');
  };

  return (
    <div className={`loading-screen ${isCompleting ? 'loading-screen--completing' : ''}`}>
      <div className="loading-screen__progress-container">
        <div className="loading-screen__progress-display">
          <div className="loading-screen__progress-number">
            {formatNumber(progress)}
          </div>
          {/* 100%になったらロゴ表示 */}
          {progress === 100 && (
            <div className="loading-screen__logo">
              <img
                src="/DrawerMenu/PC/logo.webp"
                alt="Logo"
                width="170"
                height="48"
                style={{
                  width: '170.182px',
                  height: '48px',
                  aspectRatio: '170.18/48.00',
                  display: 'block'
                }}
                onError={(e) => {
                  console.error('Logo image failed to load:', e.target.src);
                  // フォールバック: 画像が読み込めない場合は非表示
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Logo image loaded successfully');
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className={`loading-screen__welcome ${showWelcome ? 'loading-screen__welcome--show' : ''}`}>
        Welcome !!
      </div>
    </div>
  );
};

export default LoadingScreen;