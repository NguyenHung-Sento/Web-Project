import axios from '../axios'

export const apiGetBrands = () => axios({
    url: '/brand/',
    method: 'get'
})