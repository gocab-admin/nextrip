import React from 'react';
import {Triangle , ThreeDots} from 'react-loader-spinner';

import styles from './componentstyles.module.scss'

const Loader = () => (
    <div className={`${styles.loader_container}`}>
      <Triangle
        visible={true}
        height="80"
        width="80"
        color="var(--search-button-color)"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );

const ModalLoader = () => (
    <div className={`${styles.loader_container}`}>
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="var(--search-button-color)"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
export  {Loader,ModalLoader};
