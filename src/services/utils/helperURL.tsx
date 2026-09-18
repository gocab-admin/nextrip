export function encryptProduct(productName: any) {
  let sanitizedProductName = productName?.toLowerCase();

  sanitizedProductName = sanitizedProductName?.replace(/ /g, '-');

  sanitizedProductName = sanitizedProductName?.replace(/[^a-zA-Z0-9_-]/g, '');

  sanitizedProductName = sanitizedProductName?.replace(/[_-]+/g, '-');

  sanitizedProductName = sanitizedProductName?.replace(/^[_-]+|[_-]+$/g, '');

  sanitizedProductName = sanitizedProductName?.substring(0, 100);
  return sanitizedProductName;
}

export function encryptCategory(category: any) {
  let sanitizedCategory = category?.toLowerCase();

  sanitizedCategory = sanitizedCategory?.replace(/ /g, '-');

  sanitizedCategory = sanitizedCategory?.replace(/[^a-zA-Z0-9_-]/g, '');

  sanitizedCategory = sanitizedCategory?.replace(/[_-]+/g, '-');

  sanitizedCategory = sanitizedCategory?.replace(/^[_-]+|[_-]+$/g, '');

  sanitizedCategory = sanitizedCategory?.substring(0, 100);
  return sanitizedCategory;
}
export function GenerateUrl(path?: string, category?: any, productName?: any, productId?: any, fdate?: any, edate?: any, adult?: any, children?: any, pets?: any) {

  let url: any;
  const fromdate = fdate ? fdate : null;
  const todate = edate ? edate : null;
  const adultCount = adult ? adult : 0;
  const childrenCount = children ? children : 0
  const petCount = pets ? pets : 0;

  let sanitizedCategory = encryptCategory(category);
  let sanitizedProductName = encryptProduct(productName);

  if (fromdate || todate || adultCount || childrenCount || petCount) {
    url = `${path}${sanitizedCategory}/${sanitizedProductName}_${productId}/?adult=${adultCount || 1}&children=${childrenCount}&pet=${petCount}`;
    if(fromdate && todate) {
      url +=`&startDate=${fromdate}&endDate=${todate}`;
    }
  } else {
    url = `${path}${sanitizedCategory}/${sanitizedProductName}_${productId}`;
  }


  return url;
}

export function parseId(productName: any) {

  const id = productName?.split('_').pop();

  return id;
}

export function CategoryName(category: any) {

  let sanitizedCategory = category?.toLowerCase();

  sanitizedCategory = sanitizedCategory?.replace(/ /g, '-');

  sanitizedCategory = sanitizedCategory?.replace(/[^a-zA-Z0-9_-]/g, '');

  sanitizedCategory = sanitizedCategory?.replace(/[_-]+/g, '-');

  sanitizedCategory = sanitizedCategory?.replace(/^[_-]+|[_-]+$/g, '');

  sanitizedCategory = sanitizedCategory?.substring(0, 100);

  return sanitizedCategory
}

export function capitalizeWords(str: any) {
  return str
    .split("-") // Split the string by hyphens
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words with spaces
};