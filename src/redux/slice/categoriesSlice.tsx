import { getApiMethod } from "@/services/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CategoryList = {
  _id: string;
  category: string;
};
export interface Filters {
  propertycategory: CategoryList[];
  categoryId: string;
  categoryName: string;
  activeSubcategory: string;
  subCategories: any
}
const initialState: Filters = {
  propertycategory: [],
  categoryId: "",
  categoryName:"",
  activeSubcategory: '',
  subCategories: {},
};

const CategoriesData = createSlice({
  name: "categorydata",
  initialState,
  reducers: {
    updateSubCategories: (state, action: PayloadAction<any>) => {
      state.subCategories = {...state.subCategories,
        [action.payload.id]: action.payload.data
      }
    },
    updateCategoryList: (state, action: PayloadAction<Partial<Filters>>) => ({
      ...state,
      ...action.payload
    })
  }
});
export const { updateCategoryList, updateSubCategories } = CategoriesData.actions;

export const fetchSubCategories: any = (url: string,id: string) => async (dispatch: any) => {
      try {
        const response = await getApiMethod(url);
        if (response.statusCode === 200) {
          // dispatch(isLoading(false));
          dispatch(updateSubCategories({
            data: response?.data?.subCategories || [],
            id
          }));
          return response;
        } else {
          // dispatch(isLoading(true));
        }
      } catch (error: any) {
        // dispatch(isLoading(true));
        console.log(error);
      }
    }

export const categorySelector = (state: any) => state.categoryReducer;
export default CategoriesData.reducer;
