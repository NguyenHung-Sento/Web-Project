import axios from '../axios';

export const apiGetProducts = (params, query) => axios({
    url: '/product',
    method: 'get',
    params,
    query
})