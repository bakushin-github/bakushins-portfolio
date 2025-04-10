import React from 'react'
import H2 from './H2'
import styles from './Flow.module.scss'

function Flow() {
  return (
    <>
    <div id='Flow' className={styles.flow}>
    <div className={styles.flow__inner}>
     <H2 subText="制作の流れ" mainText="Flow" className={styles.flow__title}></H2>
    </div>
  </div>
  </>
  )
}

export default Flow