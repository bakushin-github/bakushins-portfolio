'use client'
import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import styles from './SplideGallery.module.scss';
import Link from 'next/link';

function SplideGallery() {
  return (
    <>
    <div className={styles.worksContents}>
      
        <Splide
          options={{
            type: 'false',
            perPage: 3,
            perMove: 1,
            pagination: true,
            arrows: true,
            autoplay: true,
            interval: 3000,
            speed: 1000,
          }}
        >
          <SplideSlide>
          <figure className={styles.figure}>
            <Image src="/About/PC/Icon.webp" width={150} height={150} alt="Image 1" />
          <figcaption className={styles.figcaption}>
            <h3 className={styles.title}>Image 1 Title</h3>
            <p className={styles.caption}>Description for Image 1</p>
            <Link href={"https://bakushin.blog/programmingdiary-202505-1st2ndweek/"} className={styles.worksLink}>{'→'}</Link>
            </figcaption>
        </figure>
          </SplideSlide>
        </Splide>

    </div>
    </>
  )
}

export default SplideGallery