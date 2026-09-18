import React from 'react'
import styles from "./booking.module.scss";

// @todo: Provide a real popover in future
function Popover({children, onClose, title}:any) {
  return (
    <><div className={styles.search_region}>
      {children}
    </div>
    <div
    className={`${styles.backdrop}`}
    onClick={() => {
        onClose(false);
    }}
  /></>
  )
}

export default Popover
