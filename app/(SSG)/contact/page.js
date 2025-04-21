import Link from 'next/link'
import React from 'react'
import styles from './page.module.scss'
import Header_otherPage from '@/components/SSG/Header/Header_otherPage/Header_otherPage'
import Breadcrumb from '@/components/Breadcrumb/index'
import { generateBreadcrumb } from '@/lib/utils/generateBreadcrumb'

// パスを静的に渡して生成
const breadcrumbItems = generateBreadcrumb('/contact');

function page() {
  return (
    <>
    <div className={styles.contact}>
         <Header_otherPage />
      <div className={styles.contact__inner}>
      <div className={styles.Breadcrumb}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
        <div className={styles.contact__title}>
          <h1 className={styles.contact__h1}>お問い合わせ</h1>
          <h2 className={styles.contact__h2}>Contact</h2>
        </div>
        </div>

<div className={styles.contact__click}>
    <div>お問い合わせフォーム</div>
    <Link className={styles.contact__pp} href={"/privacy_policy"} >プライバイシーポリシー</Link><br />
    <Link href="/contact/thanks">
      <button>送信</button></Link>
      </div></div>
      </>
  )
}

export default page