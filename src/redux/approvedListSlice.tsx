import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import { getImageUrl } from "@/components/ImageComponent";

const initialState = {
  listData: {},
  AdsData: {},
  total: 0,
  getApprovedData: {},
};

const ApprovedListingslice = createSlice({
  name: "approvedListing",
  initialState,
  reducers: {
    getApprovedlist: (state, action) => {
      state.listData = action.payload;
    },
    getApprovedads: (state, action) => {
      state.listData = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setApprovedData: (state, action) => {
      state.getApprovedData = action.payload;
    }
  }
});

export const { getApprovedlist, getApprovedads, setTotal, setApprovedData } = ApprovedListingslice.actions;

let abortController = new AbortController();

export const fetchApprovedListingData =
  (data: any, page?: number, limit?: number, type?: string) =>
    async (dispatch: any, getItem: any) => {
      dispatch(setApprovedData(data));
      try {
        if (abortController) {
          abortController.abort();
        }
        abortController = new AbortController();
        const { signal } = abortController;

        const response = await getApiMethod(
          `${APICONSTANT.approvedListings}?_page=${page}&_limit=${limit}`,
          data,
          {
            signal
          }
        );
        if (response.statusCode === 200) {
          const list = response.data;
          list.approvedListing = list.approvedListing.map((item: any) => {
            item.images = [
              {
                src: '/images/errorImage.webp'
              }
            ];
            if (item.attachmentData.length > 0) {
              const attachments = item.attachmentData[0].image;
              if (attachments) {
                // const myimages = attachments.groupImage.map(
                //   (groupImage: any) => ({
                //     src: APIURLS.imageUrl + groupImage.imagePath
                //   })
                // );
                // myimages.unshift({
                //   src: APIURLS.imageUrl + attachments.coverImage
                // });
                // item.images = myimages;
                const myimages = attachments.groupImage.map((groupImage: any) => ({
                  src: getImageUrl(groupImage.imagePath)   // ✅ normalize instead of prefix
                }));

                myimages.unshift({
                  src: getImageUrl(attachments.coverImage) // ✅ normalize instead of prefix
                });

                item.images = myimages;

              }
            }
            return item;
          });
          if (type === "append") {
            const previousData = getItem().approvedlist.listData.approvedListing || []
            const mergedList = [...previousData, ...list.approvedListing];
            dispatch(getApprovedlist({ ...list, approvedListing: mergedList }));
          } else if (type === 'filter' && type !== undefined) {
            dispatch(setTotal(list.totalCount || 0))
          }
          else {
            dispatch(getApprovedlist(list));
          }
          return response.data;
        }
      } catch (error: any) {
        console.log(error);
      }
    };


export const fetchApprovedAdsData =
  (data: any, page?: number, limit?: number, type?: string) =>
    async (dispatch: any, getItem: any) => {

      try {
        if (abortController) {
          abortController.abort();
        }
        abortController = new AbortController();
        const { signal } = abortController;

        const response = await getApiMethod(
          `${APICONSTANT.approvedadsListings}?_page=${page}&_limit=${limit}`,
          data,
          {
            signal
          }
        );
        if (response.statusCode === 200) {
          const list = response.data;
          list.approvedAds = list.approvedAds.map((item: any) => {
            item.images = [
              {
                src: '/images/errorImage.webp'
              }
            ];
            if (item.image) {
              const attachments = item.image;
              if (attachments) {
                const myimages = attachments.groupImage.map(
                  (groupImage: any) => ({
                    src: APIURLS.baseUrl + groupImage.imagePath
                  })
                );
                myimages.unshift({
                  src: APIURLS.baseUrl + attachments.coverImage
                });
                item.images = myimages;
              }
            }
            return item;
          });
          if (type === "append") {
            const previousData = getItem().approvedlist.listData.approvedAds || []
            const mergedList = [...previousData, ...list.approvedAds];
            dispatch(getApprovedads({ ...list, approvedAds: mergedList }));
          } else if (type === 'filter' && type !== undefined) {
            dispatch(setTotal(list.totalCount || 0))
          }
          else {
            dispatch(getApprovedads(list));
          }
          return response.data;
        }
      } catch (error: any) {
        console.log(error);
      }
    };

export default ApprovedListingslice.reducer;
