import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { dispatch, store } from "@/redux/store";
import { getApprovedlist } from "@/redux/approvedListSlice";
import { getListData } from "@/redux/slice/listdataSlice";
import { setSelectedMarkerRedux } from "@/redux/slice/detailSlice";

export const ArrayMove = (arr: any, old_index: any, new_index: any) => {
  const cloneArr =[...arr];
  cloneArr.splice(new_index, 0, cloneArr.splice(old_index, 1)[0]);
  return cloneArr;
};


export const CustomSearchBar = (props?: any) => (
  <TextField
    fullWidth
    variant="outlined"
    type="text"
    placeholder="Search review"
    onChange={props.onchange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      )
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "30px",
        borderColor: "#717171"
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#717171" // Set the outline (focused) border color to black
      }
    }}
  />
);

export const generateData = (count: any, arr: any[]) => {
  let obj: any = {};
  const temp = {
    double: 0,
    queen: 0,
    king: 1
  };
  for (let i = 1; i <= count; i++) {
    obj[`bedRoom${i}`] = temp;
  }
  const tempObj = JSON.parse(JSON.stringify(obj));
  if (arr.length > 0) {
    arr.forEach((item) => {
      const key = `bedRoom${item.bedRoom}`;
      if (key && tempObj[key] && item.bedType && item.bedType !== "sofa") {
        tempObj[key][item.bedType] = item.bedCount;
      }
    });
  }
  return tempObj;
};

export const onlyNumbers = (e: any) => {
  const clipboard: any = window.Clipboard;
  if (e.type === "paste") {
    let clipboardData: any = e.clipboardData || clipboard;
    let pastedData = clipboardData.getData("Text");
    if (isNaN(pastedData)) {
      e.preventDefault();
    } else {
      return;
    }
  }
};

export const onlyLetters = (e: any) => {
  const clipboard: any = window.Clipboard;
  if (e.type === "paste") {
    let clipboardData: any = e.clipboardData || clipboard;
    let pastedData = clipboardData.getData("Text");
    if (!isNaN(pastedData)) {
      e.preventDefault();
    } else {
      return;
    }
  }
};
export const removeDuplicates = (arr: any, key: any) => {
  const seen = new Set();
  return arr.filter((item: { [x: string]: any }) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    } else {
      seen.add(value);
      return true;
    }
  });
};

export const mergeQueryParams = (data: any) => {
  const currentParams = new URLSearchParams(window.location.search);

  const currentParamsObj: any = {};
  currentParams.forEach((value, key) => {
    currentParamsObj[key] = value;
  });

  const mergedData = { ...currentParamsObj, ...data };

  const queryString = Object.keys(mergedData)
    .map((key) => `${key}=${encodeURIComponent(mergedData[key])}`)
    .join("&");

  window.history.replaceState(
    { path: `?${queryString}` },
    "",
    `?${queryString}`
  );
};

// Import your Redux store

export const WishListUpdate = (id: any, type?: any) => {
  const state: any = store.getState(); // Access Redux state directly
  const listData = state.approvedlist.listData.approvedListing;
  const propertyData = state.listingData.ListingData;
  const selectedMarkerRedux = state.detailsReducer.selectedMarkerRedux
  const index = listData !== undefined && listData.findIndex((item: any) => item._id === id);

  if (type === 'details') {
    const updatedArray = {
      ...propertyData,
      wishlist: !propertyData.wishlist
    }
    dispatch(getListData(updatedArray));
  } else if(type === 'map'){
    const updatedArray = {
      ...selectedMarkerRedux,
      data: {
        ...selectedMarkerRedux.data,
        wishlist: !selectedMarkerRedux?.data?.wishlist
      }
    };
    dispatch(setSelectedMarkerRedux(updatedArray));
  }
  
  else {
    if (index !== -1) {
      const updatedArray = listData.map((item: any, i: number) =>
        i === index ? { ...item, wishlist: !item.wishlist } : item
      );
      dispatch(getApprovedlist({
        ...listData,
        approvedListing: updatedArray
      }));
    }
  }



};

