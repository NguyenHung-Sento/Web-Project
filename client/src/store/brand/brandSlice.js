import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        brands: null,
        isLoading: false
    },
    reducers: {
   
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getBrands.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getBrands.fulfilled, (state,action) => {
            state.isLoading = false;
            state.brands = action.payload;
        });
        builder.addCase(actions.getBrands.rejected, (state,action) => {
            state.isLoading = false;
            state.errorMessage = 'Failed';
        });

    }
})
export const {} = brandSlice.actions
export default brandSlice.reducer