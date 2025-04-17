import React from 'react'
import styles from '../components/not-found.module.scss'
import Header_otherPage from '@/components/Header_otherPage'
import Image from 'next/image'


function not_found() {
  return (
    <div className={styles.not_found}>
      <Image className={styles.left_1stLine} src="/LowerLayer/PC/left_1stLine.webp" alt="left_1stLine" width={439} height={565} />
      <Image className={styles.left_2ndLine} src="/LowerLayer/PC/left_2ndLine.webp" alt="left_2ndLine" width={547} height={350} />
      <Image className={styles.right_2ndLine} src="/LowerLayer/PC/right_2ndLine.webp" alt="right_2ndLine" width={644} height={1009} />
      <Image className={styles.right_polygon1} src="/LowerLayer/PC/Polygon1.webp" alt="right_polygon1" width={232} height={117} />
      <Image className={styles.right_polygon2} src="/LowerLayer/PC/polygon2.webp" alt="right_polygon2" width={239} height={120} />
      <Header_otherPage className={styles.not_foundHeader} />
    <h1 className={styles.not_found404}>404</h1>
    <p className={styles.not_foundP}>お探しのページが見つかりません。<br />一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。</p>
    </div>
  )
}

export default not_found