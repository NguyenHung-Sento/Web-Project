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
        value: 'Mô tả',
        content: '1'
    },
    {
        id: 2,
        value: 'Thành phần',
        content: '2'
    },
    {
        id: 3,
        value: 'Công dụng',
        content: '3'
    },
]