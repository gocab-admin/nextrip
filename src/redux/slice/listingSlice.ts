import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";

export type Info = {
  userId: string;
  name: string;
  desc: string;
}

export type Guest = {
  guests: number;
  child: number;
  pets: number;
}

export type Accommodation = {
  bedRoomCount: number;
  // beds: number;
  bedRoomtype: any[];
  bathRoomCount: number;
  shared: boolean
}

export type Address = {
  area: string;
  street: string;
  zipcode: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  Address: any;
  lat: any;
  lng: any;
  locationName:string
}

export type BasicDetails = {
  propertyCategory: string;
  propertyType: string;
} & Guest & Accommodation & Address;

export type CoverImages = {
  coverImage: string;
}

export type GroupImages = {
  photos: any[];
}

export type PlacesOffer = {
  amenityId: any[];
}

export type Price = {
  perHour: number;
  perDay: number;
  availableCount: number;
  minimumNight: number;
  maximumNight: number;
  extraGuest: number;
  extraGuestFee: number;
}

export type Step1 = Info & BasicDetails
export type Step2 = CoverImages & GroupImages & PlacesOffer
export type Step3 = Price

export interface CreateList {
  step1: Step1;
  step2: Step2;
  step3: Step3;
}

// export const initialState: CreateList = {
//   step1: {
//     userId: '',
//     name: '',
//     desc: 'Take a break and unwind at this peaceful oasis.',
//     guests: 1,
//     child: 0,
//     pets: 0,
//     bedRoomCount: 1,
//     bedRoomtype: [],
//     bathRoomCount: 1,
//     shared: false,
//     area: '',
//     street: '',
//     zipcode: '',
//     landmark: '',
//     city: '',
//     state: '',
//     country: '',
//     Address: null,
//     lat: null,
//     lng: null,
//     locationName: '',
//     propertyCategory: '',
//     propertyType: ''
//   },
//   step2: {
//     coverImage: '',
//     photos: [],
//     amenityId: []
//   },
//   step3: {
//     perHour: 45,
//     perDay: 100,
//     availableCount: 1,
//     minimumNight: 1,
//     maximumNight: 5,
//     extraGuest: 0,
//     extraGuestFee: 0
//   }
// };

export interface Listing {
  title: string;
  describes: any;
  structure: string;
  privacy_type: string;
  guests: number;
  child: number;
  pets: number;
  bedroom: number;
  beds: number;
  bedType: any[];
  bathroom: number;
  houseNo: string;
  area: string;
  street: string;
  zipcode: string;
  nearlandmark: string;
  city: string;
  state: string;
  country: string;
  host_offer: any[];
  coverImage: any;
  image: any[];
  price: number;
  availableCount: number;
  mini: number;
  maxi: number;
  extraguest: number;
  extraprice: number;
  disable: boolean;
  listId: string;
  extraPricePerHour : number;
  addAvailabilityCount: number;
  hourlyChecking : string;
  capacity: number;
}
export interface ListInfo {
  ListInfo: Listing
  isLoading: boolean;
}


const initialState: ListInfo = {
  ListInfo: {
    title: '',
    describes: 'Take a break and unwind at this peaceful oasis.',
    structure: '',
    privacy_type: '',
    guests: 1,
    child: 0,
    pets: 0,
    bedroom: 1,
    beds: 0,
    bedType: [],
    bathroom: 1,
    houseNo: '',
    area: '',
    street: '',
    zipcode: '',
    city: '',
    nearlandmark: '',
    state: '',
    country: '',
    coverImage: '',
    image: [],
    disable: false,
    price: 100,
    availableCount: 1,
    mini: 1,
    maxi: 5,
    extraguest: 0,
    extraprice: 0,
    host_offer: [],
    listId: '',
    extraPricePerHour : 45,
    hourlyChecking : '',
    addAvailabilityCount: 1,
    capacity: 0
    
  },
  isLoading: false
}




export const listingSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    guestCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.guests = action.payload;
    },
    extraGuestCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.extraguest = action.payload;
    },
    
    childCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.child = action.payload;
    },    
    petsCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.pets = action.payload;
    },
    bedroomCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.bedroom = action.payload;
    },
    bedsCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.beds = action.payload;
    },
    bedsType: (state, action: PayloadAction<Listing[]>) => {
      state.ListInfo.bedType = action.payload;
    },
    bathroomCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.bathroom = action.payload;
    },
    capacity: (state, action: PayloadAction<number>) => {
      state.ListInfo.availableCount = action.payload;
    },
    miniCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.mini = action.payload;
    },
    maxiCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.maxi = action.payload;
    },
    placeTitle: (state, action: PayloadAction<string>) => {
      state.ListInfo.title = action.payload;
    },
    describeTitle: (state, action: PayloadAction<string>) => {
      state.ListInfo.describes = action.payload;
    },
    placeStructure: (state, action: PayloadAction<string>) => {
      state.ListInfo.structure = action.payload;
    },
    sharePlace: (state, action: PayloadAction<string>) => {
      state.ListInfo.privacy_type = action.payload;
    },
    nextDisable: (state, action: PayloadAction<boolean>) => {
      state.ListInfo.disable = action.payload;
    },
    placeOffer: (state, action: PayloadAction<Listing>) => {
      state.ListInfo.host_offer.push(action.payload);
    },
    setPlaceOffer: (state, action: PayloadAction<Listing[]>) => {
      state.ListInfo.host_offer = action.payload;
    },
    flatNo: (state, action: PayloadAction<string>) => {
      state.ListInfo.houseNo = action.payload;
    },
    addArea: (state, action: PayloadAction<string>) => {
      state.ListInfo.area = action.payload;
    },
    addsStreet: (state, action: PayloadAction<string>) => {
      state.ListInfo.street = action.payload;
    },
    nearLandmark: (state, action: PayloadAction<string>) => {
      state.ListInfo.nearlandmark = action.payload;
    },
    addCity: (state, action: PayloadAction<string>) => {
      state.ListInfo.city = action.payload;
    },
    addZipcode: (state, action: PayloadAction<string>) => {
      state.ListInfo.zipcode = action.payload;
    },
    addCounty: (state, action: PayloadAction<string>) => {
      state.ListInfo.state = action.payload;
    },
    addCountry: (state, action: PayloadAction<string>) => {
      state.ListInfo.country = action.payload;
    },
    addPrice: (state, action: PayloadAction<number>) => {
      state.ListInfo.price = action.payload;
    },
    addExtraPrice: (state, action: PayloadAction<number>) => {
      state.ListInfo.extraprice = action.payload;
    },
    addExtraPricePerHour: (state, action: PayloadAction<number>) => {
      state.ListInfo.extraPricePerHour = action.payload;
    },
    addAvailablecount: (state, action: PayloadAction<number>) => {
      state.ListInfo.addAvailabilityCount = action.payload;
    },
    addCoverImg: (state, action: PayloadAction<any>) => {
      state.ListInfo.coverImage = action.payload;
    },
    addImage: (state, action: PayloadAction<any>) => {
      if(Array.isArray(action.payload)) {
        state.ListInfo.image = [...(state.ListInfo.image || []) , ...action.payload];
      } else {
        state.ListInfo.image.push(action.payload);
      }
    },

    addImageDel: (state, action: PayloadAction<any>) => {
      state.ListInfo.image = action.payload;
    },
    createdListId: (state, action: PayloadAction<string>) => {
      state.ListInfo.listId = action.payload;
    },
    HourlyChecking : (state,action : PayloadAction<string>) =>{
      state.ListInfo.hourlyChecking = action.payload
    },
    resetData: (state) => {
      state.ListInfo = initialState.ListInfo
    },
    resetStep4Data: (state) => {
      state.ListInfo.houseNo = '';
      state.ListInfo.area = '';
      state.ListInfo.street = '';
      state.ListInfo.zipcode = '';
      state.ListInfo.city = '';
      state.ListInfo.nearlandmark = '';
      state.ListInfo.state = '';
      state.ListInfo.country = '';
    },
    isLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setData: (state, action) => {
      debugger;
      state.ListInfo = {...state.ListInfo, ...action.payload};
    }
  }
});

export const {
  placeStructure,
  sharePlace,
  nextDisable,
  placeTitle,
  describeTitle,
  placeOffer,
  setPlaceOffer,
  guestCount,
  petsCount,
  childCount,
  bedroomCount,
  bedsCount,
  bedsType,
  bathroomCount,
  flatNo,
  addArea,
  addsStreet,
  addCity,
  addZipcode,
  nearLandmark,
  addCounty,
  addCountry,
  addPrice,
  addCoverImg,
  addImage,
  addImageDel,
  createdListId,
  extraGuestCount,
  addExtraPrice,
  capacity,
  miniCount,
  maxiCount,
  addExtraPricePerHour,
  addAvailablecount,
  HourlyChecking,
  resetData,
  resetStep4Data,
  setData,
  isLoading
} =
  listingSlice.actions;
  
export const getListingData: any = (singleListId: any) => {
    return async (dispatch: any) => {
      try {
        const response = await getApiMethod(`${APICONSTANT.getListing  }/${singleListId}`);
        if (response.statusCode === 200) {
          debugger;
          dispatch(isLoading(false));
          dispatch(setData(response?.data?.listing[0] || {}));
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
export const listingSelector = (state: any) => state.listReducer;
export default listingSlice.reducer;
