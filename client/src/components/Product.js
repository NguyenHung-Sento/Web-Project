import React from 'react'
import { formatMoney, formatSold } from '../ultils/helper'
import labelRed from '../assets/bestsellerlabel.png'
import labelBlue from '../assets/newproductlabel.png'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const Product = ({productDatas, isNew}) => {
  return (
    <div className='w-full text-base px-[10px]'>
      <Link 
        className='w-full border p-[15px] flex flex-col items-center bg-white rounded-2xl'
        to={`${path.DETAIL_PRODUCT}/${productDatas?._id}/${productDatas?.title}`}
      >  
        <div className='w-full relative'>
          <img src={productDatas?.thumb[0] || 'https://th.bing.com/th/id/OIP.ZWOHnGJ4OUzFZnsKMgdCtgHaHa?rs=1&pid=ImgDetMain'} 
          alt='' 
          className='w-[243px] h-[243px] object-cover' 
          />
          <img src={isNew ? labelBlue : labelRed} alt='' className='absolute top-[-15px] left-[-38px] w-[100px] h-[35px] object-cover' />
          <span className='absolute font-bold text-white top-[-15px] left-[-15px] w-[100px]'>{isNew ? 'New' : 'Hot'}</span>
        </div>
        <div className='w-full flex flex-col gap-2 mt-[12px] items-start'>
          <span className='line-clamp-1'>{productDatas?.title}</span>
          <span className='text-main'>{`${formatMoney(productDatas?.price)} VND`}</span>
          <span className='text-sm'>{`Đã bán ${formatSold(productDatas?.sold)}`}</span>
        </div>
      </Link>
    </div>
  )
}

export default Product