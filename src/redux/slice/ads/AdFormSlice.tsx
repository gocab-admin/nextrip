import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiMethod } from "@/services/global";
import ADSAPICONSTANT from "@/services/adsApiConstant";

export interface Listing {
  _id: string;
  name: string;
  desc: any;
  category: string;
  subCategory: string;
  
  lat: number;
  lng: number;
  location: string;
  country: string;
  address: string;
  street: string;
  state: string;
  city: string;
  zipcode: string;
  houseNo: string;
  landmark: string;

  coverImage: any;
  groupImage: any[];
  imgFiles: any[];

  area: string;

  adsCategoryName: string;
  subCategoryName: string
}

export interface ListInfo {
  ListInfo: Listing
  isLoading: boolean;
}


const initialState: ListInfo = {
  ListInfo: {
    _id: '',
    name: '',
    desc: 'Take a break and unwind at this peaceful oasis.',
    category: '',
    subCategory: '',
    houseNo: '',
    area: '',
    street: '',
    zipcode: '',
    location: '',
    city: '',
    landmark: '',
    state: '',
    country: '',
    address: '',

    coverImage: '',
    groupImage: [],
    imgFiles: [],

    lat: 0,
    lng: 0,
    adsCategoryName: '',
    subCategoryName: ''
    
  },
  isLoading: false
}

export const AdFormSlice = createSlice({
  name: "ad_form_slicce",
  initialState,
  reducers: {
    describeTitle: (state, action: PayloadAction<string>) => {
      state.ListInfo.desc = action.payload;
    },
    addCoverImg: (state, action: PayloadAction<any>) => {
      state.ListInfo.coverImage = action.payload;
    },
    addImage: (state, action: PayloadAction<any>) => {
      state.ListInfo.groupImage.push(action.payload);
    },
    addImageDel: (state, action: PayloadAction<any>) => {
      state.ListInfo.groupImage = action.payload;
    },
    resetData: (state) => {
      state.ListInfo = initialState.ListInfo
    },
    isLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setData: (state, action) => {
      state.ListInfo = {...state.ListInfo, ...action.payload};
    }
  }
});

export const {
  describeTitle,
  addCoverImg,
  addImage,
  addImageDel,
  resetData,
  setData,
  isLoading
} =
  AdFormSlice.actions;
  
export const getListingData: any = (singleListId: any) => {
    return async (dispatch: any) => {
      try {
        const response = await getApiMethod(`${ADSAPICONSTANT.getListing  }/${singleListId}`);
        if (response.statusCode === 200) {
          dispatch(isLoading(false));
          let data = response?.data?.ads[0] || {};
          if(data?.address?.coordinates && data.address.coordinates[0]) {
            data.lat = data.address.coordinates[0]
            data.lng = data.address.coordinates[1]
          }
          if(data?.address)
          data = {...data, ...data.address}

        data.coverImage =  {
          imagePath: data.image?.coverImage,
          ImageId: data.image?.coverImageId
        };
        const groupImages =  data.image?.groupImage || [];
        data.groupImage = groupImages.map((item:any)=>({imagePath: item.imagePath, ImageId: item.groupImageId}))
        const coverImgArr = data.coverImage?.imagePath ? [data.coverImage] : [];
        data.imgFiles = [...coverImgArr, ...data.groupImage];

        data.adsCategoryName = data?.adsCategoryName?.category;
        data.subCategoryName = data?.subCategoryName?.property;
        
        dispatch(setData(data));
          return response;
        } else {
          dispatch(isLoading(true));
        }
      } catch (error: any) {
        dispatch(isLoading(true));
        console.log(error);
      }
    };
  }
export const adFormSelector = (state: any) => state.AdFormReducer;
export default AdFormSlice.reducer;
