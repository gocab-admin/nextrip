import React from 'react'
import styles from './header.module.scss';
function Header() {
  return (
    <header className={`col-lg-12 mb-4 ${styles.header}`}>
        <div className="d-flex justify-content-between align-items-center">
            <div className={styles.logo}>
              <img src={'/fitnest/logo_dark.png'} alt="FitNest Logo" />
              {/* <span>FitNest</span> */}
            </div>
            <a href="#" className={styles.loginSignup}>Login / signup</a>
          </div>
          </header>
  )
}

export default Header
