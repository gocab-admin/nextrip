export const formatNumber = (price: number, currency?: Record<any, any>): string => {
    let amount = price;
    if(currency && currency?.exchange_rate) {
        amount = Math.round(price * currency?.exchange_rate);
    }
    return amount.toLocaleString('en-IN');
  };

  export const applyExchange = (price: number, currency?: Record<any, any>): number => {
    let amount = price;
    if(currency && currency?.exchange_rate) {
        amount = Math.round(price * currency?.exchange_rate);
    }
    return amount;
  };
  
