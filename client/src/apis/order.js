import axios from '../axios';

export const apiCreateOrder = () => axios({
    url: '/order/',
    method: 'post'
})

export const apiCreateSingleOrder = (data) => axios({
    url: '/order/create-single-order',
    method: 'post',
    data
})

export const apiGetOrders = (params) => axios({
    url: '/order/admin',
    method: 'get',
    params
})

export const apiUpdateOrder = (data, oid) => axios({
    url: '/order/status/' + oid,
    method: 'put',
    data
})

export const apiGetUserOrders = (params) => axios({
    url: '/order/',
    method: 'get',
    params
})

