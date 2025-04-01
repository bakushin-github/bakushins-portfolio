import React from 'react';
import classNames from 'classnames'; // ← 追加！
import styles from './Drawer_button.module.scss';

function Drawer_button() {
  return (
    // <div className={styles.drawerButton}>
      <button className={styles.drawerButton__button}>
        <div className={styles.drawerButton__button__inner}>
          <span className={classNames(styles.drawerButton__dot, styles.dot1)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot2)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot3)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot4)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot5)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot6)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot7)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot8)}></span>
          <span className={classNames(styles.drawerButton__dot, styles.dot9)}></span>
        </div>
      </button>
    // </div>
  );
}

export default Drawer_button;
