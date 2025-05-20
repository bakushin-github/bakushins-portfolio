// export function generateBreadcrumb(path) {
//   const siteStructure = {
//     '/': 'ホーム',
//     '/contact': 'お問い合わせ',
//     '/contact/thanks': '送信完了',
//     '/faq': 'よくある質問',
//     '/privacy_policy': 'プライバイシーポリシー',
//     '/price': '費用のめやす',
//   };

//   const segments = path.split('/').filter(Boolean); // ['contact', 'thanks']
//   let accumulatedPath = '';
//   const breadcrumbItems = [];

//   // 常にホームを追加
//   breadcrumbItems.push({ name: siteStructure['/'], path: '/' });

//   // 中間のパスを構築
//   for (let i = 0; i < segments.length; i++) {
//     accumulatedPath += '/' + segments[i];
//     const name = siteStructure[accumulatedPath];
    
//     if (name) {
//       breadcrumbItems.push({
//         name,
//         // 最後のアイテムでも常にpathを含める（UIの表示はコンポーネント内で制御）
//         path: accumulatedPath,
//       });
//     }
//   }

//   return breadcrumbItems;
// }