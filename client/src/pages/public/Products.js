import React, { useState, useEffect } from 'react'
import { apiGetProducts } from '../../apis'
import { formatMoney, formatSold } from '../../ultils/helper'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'

const Products = () => {
  const [products, setProducts] = useState(null)
  const fecthProducts = async () => {
    const response = await apiGetProducts()
    if (response?.success) {
      setProducts(response.productDatas)
    }
  }
  useEffect(() => {
    fecthProducts()
  }, [])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold'>SẢN PHẨM</h3>
        </div>
      </div>
      <div className='flex gap-2'>
        {products?.map(el => (
          <Link
          className='w-1/3  flex-auto px-[10px] mb-[20px]'
          to={`/${el._id}/${el.title}`}
          >
            <div key={el._id} className='w-full flex flex-col items-center pt-8 gap-2'>
            <img
              src={el?.thumb[0] || 'https://th.bing.com/th/id/OIP.ZWOHnGJ4OUzFZnsKMgdCtgHaHa?rs=1&pid=ImgDetMain'}
              alt=''
              className='w-full object-contain'
            />
            <span className='line-clamp-1 text-center'>{el?.title}</span>
            <span className='text-main text-[20px]'>{`${formatMoney(el?.price)} VNĐ`}</span>
            <span className='text-sm'>{`Đã bán ${formatSold(el?.sold)}`}</span>
          </div>
          </Link>
        ))}
      </div>
      <div className='h-[500px] w-full'></div>
    </div>
  )
}

export default Products