import icons from "./icons"
import path from "./path"

export const navigation = [
    {
        id: 1,
        value: 'Trang chủ',
        path: `/${path.HOME}`,
    },
    {
        id: 2,
        value: 'Sản phẩm',
        path: `/${path.PRODUCTS}`,
    },
    {
        id: 3,
        value: 'About us',
        path: `/${path.ABOUT}`,
    },
]

export const productInfoTabs = [
    {
        id: 1,
        value: 'Chi tiết',
        content: '1'
    },
    {
        id: 2,
        value: 'Chỉ định',
        content: '2'
    },
]

export const sorts = [
    {
        id: 1,
        value:'-sold',
        text: 'Bán chạy'
    },
    {
        id: 2,
        value:'price',
        text: 'Giá từ thấp đến cao'
    },
    {
        id: 3,
        value:'-price',
        text: 'Giá từ cao đến thấp'
    },
    {
        id: 4,
        value:'title',
        text: 'Sắp xếp A-Z'
    },
    {
        id: 5,
        value:'-title',
        text: 'Sắp xếp Z-A'
    },
]

const {AiOutlineDashboard, TbBrandProducthunt, FaUsersRectangle, RiBillLine} = icons
export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard />
    },
    {
        id: 2,
        type: 'PARENT',
        text: 'Quản lý sản phẩm',
        icon: <TbBrandProducthunt />,
        submenu: [
            {
                text: 'Thêm sản phẩm',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`
            },
            {
                text: 'Quản lý',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`
            },
        ]
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Quản lý người dùng',
        path: `/${path.ADMIN}/${path.MANAGE_USERS}`,
        icon: <FaUsersRectangle />
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Quản lý đơn hàng',
        path: `/${path.ADMIN}/${path.MANAGE_ORDERS}`,
        icon: <RiBillLine />
    },

]

export const roles = [
    {
        code: 'admin',
        value: 'admin'
    },
    {
        code: 'user',
        value: 'user'
    }
]

export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    }
]

