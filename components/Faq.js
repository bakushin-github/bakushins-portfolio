import React from 'react'
import styles from './Faq.module.scss'
import Image from 'next/image'
import Link from 'next/link'

function Faq({ className }) {
  return (
    <Link href="https://bakushin.blog/contact/">
    <button className={`${styles.faq} ${className || ''}`}>
      よくある質問
    </button></Link>
  );
}

export default Faq