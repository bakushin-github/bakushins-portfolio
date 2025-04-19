import React from 'react';
import Toggle from '@/components/Toggle';
import styles from './page.module.scss';
import Cta from '@/components/Cta';
import Header_otherPage from '@/components/Header_otherPage';
import Image from 'next/image';

// 複数の質問データを取得（静的にビルド時に実行される）
async function getData() {
  return [
    {
      title: 'ご相談、お見積もりは無料ですか？',
      content: '無料で承っておりますので、ご安心ください。「ちょっと相談したいことがある」などお気軽にご連絡ください。',
    },
    {
      title: '料金はどのくらいですか？',
      content: 'サイトの規模や機能によって異なります。シンプルなランディングページであれば30万円〜、企業サイトであれば50万円〜が目安です。まずはご要望をお聞かせください。',
    },
    {
      title: 'ホームページの保守や運用はどんなサービスですか？',
      content: '次のようなサービスを提供させていただきます。サイトの仕様変更・お知らせやブログ記事の投稿代行・アクセス解析の実施とレポート作成・デザインのや画像・写真の変更・サイトの定期的なバックアップ・サイトの不具合や障害の対応。その他、ご要望に応じてサービスを提供させていただきます。',
    },
    {
      title: '料金はどのくらいかかりますか？',
      content: 'シンプルな1ページのサイト約 20-30万円、企業サイト（複数ページ） 約50-120万円、保守・運用は約5千-1万円/月になります。詳細はお打ち合わせの際にご提示いたします。',
    },
    {
      title: 'デザイン、写真、動画、文章なども依頼できますか？',
      content: 'デザイン、写真、動画、文章もすべて承っております。各分野に精通したスペシャリストが協働して、お客様のニーズにお応えします。',
    }
  ];
}

export default async function FaqPage() {
  const faqItems = await getData();

  return (
    <div className={styles.faq}>
      <Image className={styles.left_1stLine} src="/LowerLayer/PC/left_1stLine.webp" alt="left_1stLine" width={439} height={565} />
      <Image className={styles.left_2ndLine} src="/LowerLayer/PC/left_2ndLine.webp" alt="left_2ndLine" width={547} height={350} />
      <Image className={styles.right_1stLine} src="/LowerLayer/PC/right_1stLine.webp" alt="right_1stLine" width={342} height={429} />
      <Image className={styles.ball} src="/LowerLayer/PC/ball.webp" alt="ball" width={169} height={169} />
      <Image className={styles.right_2ndLine} src="/LowerLayer/PC/right_2ndLine.webp" alt="right_2ndLine" width={644} height={1009} />
      <Image className={styles.right_polygon1} src="/LowerLayer/PC/Polygon1.webp" alt="right_polygon1" width={232} height={117} />
      <Image className={styles.right_polygon2} src="/LowerLayer/PC/polygon2.webp" alt="right_polygon2" width={239} height={120} />
      <Header_otherPage />
      <div className={styles.faq__inner}>
        <div className={styles.breadcrumb}>パンくず</div>        <div className={styles.faq__title}>
          <h1 className={styles.faq__h1}>よくある質問</h1>
          <h2 className={styles.faq__h2}>FAQ</h2>
        </div>
        
        <div className={styles.faq__items}>
          {faqItems.map((item, index) => (
            <Toggle 
              className={styles.faq__itemsToggle} 
              key={index} 
              content={item} 
              isFirst={index === 0} // 最初の項目だけtrueを渡す
            />
          ))}
        </div>
      </div>
      <Cta />
    </div>
  );
}