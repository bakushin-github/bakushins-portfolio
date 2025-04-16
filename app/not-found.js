import React from 'react'
import styles from '../components/not-found.module.scss'
import Header_otherPage from '@/components/Header_otherPage'


function not_found() {
  return (
    <div className={styles.not_found}>
      <Header_otherPage className={styles.not_foundHeader} />
    <h1 className={styles.not_found404}>404</h1>
    <p className={styles.not_foundP}>お探しのページが見つかりません。<br />一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。</p>
    </div>
  )
}

export default not_found