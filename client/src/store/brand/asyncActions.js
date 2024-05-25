import {createAsyncThunk} from "@reduxjs/toolkit"
import * as apis from '../../apis'

export const getBrands = createAsyncThunk('app/brands', async (data, {rejectWithValue}) => {
    const response = await apis.apiGetBrands()
    if(!response.success) return rejectWithValue(response)
    return response.brands
})