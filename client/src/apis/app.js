import axios from '../axios'

export const apiGetCategories = () => axios({
    url: '/prodcategory/',
    method: 'get'
})

export const apiGetDashboard = () => axios({
    url: '/dashboard/',
    method: 'get'
})