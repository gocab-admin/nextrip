"use client"
import React from 'react';
import styles from './recommhomecard.module.scss';
import { usePageContext } from "@/components/Providers/PageContext";
interface Props {
    image: string,
    label: string,
    handleCategoryClick: () => void;
}
const RecommHomeCard = ({ image, label, handleCategoryClick }: Props) => {
  const { baseUrl } = usePageContext();
  return (
    <div className={`col ${styles.cardContainer}`}  onClick={() => handleCategoryClick()}>
      <div className={`card ${styles.card}`}>
        <img src={ image} alt={label} className={`card-img-top ${styles.image}`} />
        <div className={`card-body ${styles.overlay}`}>
          <h5 className={`card-title ${styles.text}`}>{label}</h5>
        </div>
      </div>
    </div>
  );
};

export default RecommHomeCard;
