export const currencyRound = (value: any) => {
  return Math.round(value);
};
export const currencyRate = (price: any, exchangeRate: any, format = true) => {
  let value = parseFloat(price) * parseFloat(exchangeRate);
  if (value === 0) {
    value = 1;
  }
  return format ? value.toLocaleString("en-IN") : value;
};

// to send data in db
export const currencyReverseRate = (price: any, exchangeRate: any) => {
  return parseFloat(price) / parseFloat(exchangeRate);
};
