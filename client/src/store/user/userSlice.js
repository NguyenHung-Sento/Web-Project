import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogedIn: false,
        current: null,
        token: null,
        isLoading: false
    },
    reducers: {
        login: (state, action) => {
            state.isLogedIn = action.payload.isLogedIn
            state.token = action.payload.token
        },
        logout: (state, action) => {
            state.isLogedIn = false
            state.token = null
            state.current = null
            state.isLoading = false
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrent.fulfilled, (state,action) => {
            state.isLoading = false;
            state.current = action.payload;
        });
        builder.addCase(actions.getCurrent.rejected, (state,action) => {
            state.isLoading = false;
            state.current = null;
        });

    }
})
export const {login, logout} = userSlice.actions
export default userSlice.reducer