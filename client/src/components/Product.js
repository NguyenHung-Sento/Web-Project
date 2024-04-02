import React from 'react'

const Product = ({productDatas}) => {
  return (
    <div className='w-full text-base px-[10px]'>
      <div className='w-full border'>  
        <img src={productDatas?.thumb[0] || 'https://th.bing.com/th/id/OIP.ZWOHnGJ4OUzFZnsKMgdCtgHaHa?rs=1&pid=ImgDetMain'} 
        alt='' 
        className='w-[243px] h-[243px] object-cover' 
        />
        <div className='flex flex-col gap-2'>
          <span className='line-clamp-1'>{productDatas?.title}</span>
          <span>{`${productDatas.price} VND`}</span>
        </div>
      </div>
    </div>
  )
}

export default Product