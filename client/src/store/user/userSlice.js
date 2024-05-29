import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        currentCart: [],
        mes: ''
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
        },
        logout: (state, action) => {
            state.isLoggedIn = false
            state.token = null
            state.current = null
            state.isLoading = false
        },
        updateCart: (state, action) => {
            const {pid, quantity} = action.payload
            const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
            state.currentCart  = updatingCart.map(el => {
                if(el.product?._id === pid) {
                    return {...el, quantity}
                } else return el
            })
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrent.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.current = action.payload;
            state.currentCart = action.payload.cart;
        });
        builder.addCase(actions.getCurrent.rejected, (state,action) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
        });

    }
})
export const {login, logout, updateCart} = userSlice.actions
export default userSlice.reducer