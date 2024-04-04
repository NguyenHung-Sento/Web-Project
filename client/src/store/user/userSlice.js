import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogedIn: false,
        current: null,
        token: null
    },
    reducers: {
        register: (state, action) => {
            state.isLogedIn = action.payload.isLogedIn
            state.current = action.payload.userData
            state.token = action.payload.token
        }
    },
    // extraReducers: (builder) => {
    //     builder.addCase(actions.getCategories.pending, (state) => {
    //         state.isLoading = true;
    //     });
    //     builder.addCase(actions.getCategories.fulfilled, (state,action) => {
    //         state.isLoading = false;
    //         state.categories = action.payload;
    //     });
    //     builder.addCase(actions.getCategories.rejected, (state,action) => {
    //         state.isLoading = false;
    //         state.errorMessage = 'Failed';
    //     });

    // }
})
export const {register} = userSlice.actions
export default userSlice.reducer