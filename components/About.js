import React from 'react'
import styles from './About.module.scss'
import H2 from './H2'

function About() {
  return (
    <>
    <div className={styles.about}>
    <div className={styles.about__inner}>
     <H2 subText="私について" mainText="About" className={styles.about__title}></H2>
    </div>
  </div>
  </>
  )
}

export default About