import React from 'react'
import styles from './page.module.scss'
import Header_otherPage from '@/components/Header_otherPage'

function page() {
  return (
    <div className={styles.thanks}>
      <Header_otherPage className={styles.thanksHeader} />
    <h1 className={styles.thanks404}>Thank you !</h1>
    <p className={styles.thanksP}>お問い合わせいただきありがとうございました。<br />当日、または翌営業日までにご連絡差し上げます。
</p>
    </div>
  )
}

export default page