import axios from '../axios';

export const apiGetProducts = (params, query) => axios({
    url: '/product',
    method: 'get',
    params,
    query
})

export const apiGetProduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'get',
})