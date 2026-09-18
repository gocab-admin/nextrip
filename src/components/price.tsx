import { useAppSelector } from "@/redux/hooks";
import { currencySelector } from "@/redux/slice/CurrencySlice";

import styles from "./componentstyles.module.scss";

export default function PriceCurreny(props: any) {
  const { CurrencyList } = useAppSelector(currencySelector);
  const { value } = props;

  return (
    <div className={`${styles.curreny_value} d-flex`}>
      <span className="me-1">{CurrencyList.currency}</span>
      {value.split("").map((price: number, p: number) => <PriceNumber value={price} key={p} />)}
    </div>
  );
}

function PriceNumber(props: any) {
  const { value } = props;

  return (
    <>
      <span
        className={`${styles.number_format} position-relative overflow-hidden`}
      >
        <span
          className={`${styles.price_value} d-flex flex-column position-relative`}
          style={{
            top: value * -100,
            transition: "0.6s"
          }}
        >
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
        </span>
      </span>
    </>
  );
}
