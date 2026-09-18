import React from 'react';
import styles from './categorycard.module.scss';
import { usePageContext } from "@/components/Providers/PageContext";
interface Props {
    image: string,
    label: string,
    handleCategoryClick: () => void;
    active: boolean
}
const CategoryCard = ({ image, label, handleCategoryClick, active }: Props) => {
  const { baseUrl } = usePageContext();
  return (
    <div className={`col ${styles.cardContainer}${active?` ${styles.active}`:''}`}
      onClick={() => handleCategoryClick()}>
      <div className={`card ${styles.card}`} style={{
      backgroundImage: `url(${baseUrl + image})`
    }}>
        {/* <img src={ image} alt={label} className={`card-img-top ${styles.image}`} /> */}
        {active && 
        <div className={`card-body ${styles.overlay}`}>
          <h5 className={`card-title ${styles.text}`}>{label}</h5>
        </div>}
      </div>
      {!active && 
        <div className={`card-body ${styles.overlay}`}>
          <h5 className={`card-title ${styles.text}`}>{label}</h5>
        </div>}
    </div>
  );
};

export default CategoryCard;
