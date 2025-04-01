import React from 'react'
import H2 from './H2'
import styles from './Blogs.module.scss'

function Blogs() {
  return (
    <>
    <div className={styles.blogs}>
    <div className={styles.blogs__inner}>
     <H2 subText="ブログ" mainText="Blogs" className={styles.blogs__title}></H2>
    </div>
  </div>
  </>
  )
}

export default Blogs