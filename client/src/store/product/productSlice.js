import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: null,
        isLoading: false
    },
    reducers: {
   
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getProducts.fulfilled, (state,action) => {
            state.isLoading = false;
            state.products = action.payload;
        });
        builder.addCase(actions.getProducts.rejected, (state,action) => {
            state.isLoading = false;
            state.errorMessage = 'Failed';
        });

    }
})
export const {} = productSlice.actions
export default productSlice.reducer