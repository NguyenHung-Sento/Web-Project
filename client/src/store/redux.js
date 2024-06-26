import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice'
import brandSlice from './brand/brandSlice';
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from 'redux-persist'

const commonConfig = {
  key: 'shop/user',
  storage
}

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current']
}

export const store = configureStore({
  reducer: {
    app: appSlice,
    brand: brandSlice,
    product: productSlice,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

export const persistor = persistStore(store)
