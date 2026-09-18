import React from 'react'
import styles from './layout1.module.scss';
import { Hanken_Grotesk } from 'next/font/google'
const hk_grotesk = Hanken_Grotesk({
  weight: '500',
  subsets: ['latin'],
})
 

function Layout1() {
  // return (<html className={styles.bgimage}><body className={styles.bgimage} style={{margin: 0}}>
  //   <iframe
  //     loading="lazy"
  //     style={{
  //       position: "absolute",
  //       width: "100%",
  //       height: "100%",
  //       top: 0,
  //       left: 0,
  //       border: "none",
  //       padding: 0,
  //       margin: 0
  //     }}
  //     src="https://www.canva.com/design/DAGU5mVnmuQ/Wd94AYxinnituH7gDbnq3A/view?embed"
  //     allowFullScreen={true}
  //     allow="fullscreen"
  //   ></iframe></body></html>
  // );
  return (
    <html className={`${styles.bgimage} ${hk_grotesk.className}`}>
      <body className={`${styles.bgimage} ${styles.container} ${hk_grotesk.className}`}>
        <div className={styles.subcontainer}>
        <div className={styles.leftcont}>
        <img src={`/svg/coming/studio_logo.svg`} className={styles.logo} />
        <div className={styles.flex}>
          <div>
        <div className={`${styles.text} ${styles.title}`}>Ready to make<br />some noise?</div>

        <div  className={`${styles.text} ${styles.subtitle}`}>Get ready to experience<br />something epic.</div>
        </div>
        <img src="/svg/coming/rocket.webp" className={styles.rocket} />
        </div>

        </div>

        <img src={`svg/coming/coming_soon.gif`} className={styles.loader_comingsoon} />
        </div>
        </body>
    </html>
  )
}

export default Layout1
