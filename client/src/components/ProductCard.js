import React from 'react'
import { formatMoney } from '../ultils/helper'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const ProductCard = ({ image, price, title, _id }) => {
    return (
        <Link 
        className='w-1/3  flex-auto px-[10px] mb-[20px]'
        to={`${path.DETAIL_PRODUCT}/${_id}/${title}`}
        >
            <div className='flex w-full border'>
                <img src={image} alt='product' className='w-[120px] object-contain p-4' />
                <div className='w-full flex flex-col gap-2 mt-[12px] items-start'>
                    <span className='line-clamp-2 capitalize'>{title}</span>
                    <span className='text-main'>{`${formatMoney(price)} VND`}</span>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard