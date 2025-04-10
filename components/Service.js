import React from 'react'
import H2 from './H2'
import styles from './Service.module.scss'

function Service() {
  return (
    <>
    <div id='Service' className={styles.service}>
    <div className={styles.service__inner}>
     <H2 subText="サービス" mainText="Service" className={styles.service__title}></H2>
    </div>
  </div>
  </>
  )
}

export default Service