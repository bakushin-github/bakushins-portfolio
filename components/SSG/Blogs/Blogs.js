import React from 'react'
import H2 from '../../SSG/H2/H2'
import styles from './Blogs.module.scss'

function Blogs() {
  return (
    <>
    <div id='Blogs' className={styles.blogs}>
    <div className={styles.blogs__inner}>
     <H2 subText="ブログ" mainText="Blogs" className={styles.blogs__title}></H2>
    </div>
  </div>
  </>
  )
}

export default Blogs