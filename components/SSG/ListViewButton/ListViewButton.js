import React from 'react'
import styles from "./ListViewButton.module.scss"
import Link from 'next/link'

function ListViewButton() {
  return (
    <>
    <Link href="/" className={styles.listLink}>
    <button className={styles.ListViewButton}>一覧をみる</button>
    </Link>
    </>
  )
}

export default ListViewButton