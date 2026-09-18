// get all step urls in a step
const getStepsUrl = (pages:any, listIdX:any, i:number) => {
    const stepPages: string[] = ["/" +
    (listIdX ? listIdX : "create") +
    "/intro/" +
    "step" +
    (i + 1) +
    "/"];
    const stepInfo = [{}]
        const pageData = Array.isArray(pages)
          ? pages
          : [];
        for (let j = 0; j < pageData.length; ++j) {
          stepPages.push(
            "/" + (listIdX ? listIdX : "create") + pageData[j].name
          );
          stepInfo.push(pageData[j]);
        }
        return {
          steps: stepPages,
          stepInfo: stepInfo
        }
  }

  export default getStepsUrl;