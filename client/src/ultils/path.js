const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS: ':category',
    ABOUT: 'about',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    RESET_PASSWORD: 'reset-password/:token',
    DETAIL_CART: 'my-cart',


    //admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USERS: 'manage-users',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDERS: 'manage-orders',
    CREATE_PRODUCT: 'create-product',

    //member
    MEMBER:'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    WISHLIST: 'wishlist',
    HISTORY: 'history'

}

export default path