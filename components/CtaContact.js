import React from 'react'
import styles from './CtaContact.module.scss'
import Image from 'next/image'
import Link from 'next/link'

function CtaContact({className}) {
  return (
    <Link href="/contact/" className={styles.contact__link}>
      <div className={`${styles.contact__button} ${className || ''}`}>
        <div className={styles.default_content}>
          <Image src="/Header/PC/mail.webp" alt="contact" width={20} height={20} />
          <span>問い合わせる</span>
        </div>
        <div className={styles.hover_content}>
          <Image src="/Header/PC/mail.webp" alt="contact" width={20} height={20} />
          <span>お問い合わせ</span>
        </div>
      </div>
    </Link>
  )
}

export default CtaContact