// utils/content-processor.js
export function processWordPressContent(htmlContent) {
  if (!htmlContent) return '';
  
  // サーバーサイドではそのまま返す（SSG時はここで終了）
  if (typeof window === 'undefined') {
    return htmlContent;
  }
  
  // ブラウザ側でのみDOM操作を実行
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Cocoonテーブル対応
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    table.classList.add('wp-block-table');
    
    const wrapper = doc.createElement('div');
    wrapper.classList.add('table-responsive');
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
  
  // YouTube対応
  const iframes = doc.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.getAttribute('src') || '';
    
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      const wrapper = doc.createElement('div');
      wrapper.className = 'youtube-wrapper';
      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
      
      iframe.removeAttribute('width');
      iframe.removeAttribute('height');
    }
  });
  
  // 吹き出し対応
  const speeches = doc.querySelectorAll('[class*="speech"]');
  speeches.forEach(speech => {
    if (!speech.classList.contains('speech-balloon')) {
      speech.classList.add('speech-balloon');
    }
  });
  
  // Snow Monkey Alert対応
  const alerts = doc.querySelectorAll('.smb-alert');
  alerts.forEach(alert => {
    if (!alert.classList.contains('smb-alert--info') && 
        !alert.classList.contains('smb-alert--warning') &&
        !alert.classList.contains('smb-alert--success') &&
        !alert.classList.contains('smb-alert--danger')) {
      alert.classList.add('smb-alert--info');
    }
  });
  
  // 画像対応
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    img.classList.add('wp-image');
  });
  
  return doc.body.innerHTML;
}