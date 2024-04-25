import React, {useCallback, useEffect, useState} from 'react'
import { useParams} from 'react-router-dom'
import { apiGetProduct } from '../../apis'
import Slider from 'react-slick'
import {formatMoney, formatSold} from '../../ultils/helper'
import {Button, SelectQuantity, ProductInfomation} from '../../components'
import {Breadcrumbs} from '../../components'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
};

const DetailProduct = () => {

  const { pid, title } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  // const {user} = useSelector(state => state.user)
  const handleOnClick = () => {
      return Swal.fire({
        title:'Thành công',
        text:'Hãy xem giỏ hàng của bạn',
        icon:'success'
      })
  }

  const fetchProductData = async() => {
    const response = await apiGetProduct(pid)
    if(response.success) setProduct(response.productData)
  }
  useEffect(() => {
    if(pid) fetchProductData()
  }, [pid])

  const handleQuantity = useCallback((number) => {
    if(!Number(number) || Number(number) < 1) {
      return
    } else setQuantity(number)
  }, [quantity])

  const handleChangeQuantity = useCallback((flag) => {
    if(flag === 'minus' && quantity === 1) return
    if(flag === 'minus') setQuantity(prev => +prev-1)
    if(flag === 'plus') setQuantity(prev => +prev+1)
  },[quantity])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main flex flex-col gap-2'>
          <h3 className='font-semibold'>CHI TIẾT SẢN PHẨM</h3>
          <Breadcrumbs title={title}  category={product?.category} productType={product?.productType}/>
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='flex-4 flex flex-col gap-4 w-2/5'>
          <img src={product?.images[0]} alt='product' className='h-[458px] w-[458px] object-cover border' />
          <div className='w-[458px]'>
            <Slider className='images-slider flex gap-2 justify-between' {...settings}>
              {product?.images?.map(el => (
                <div className='flex-1' key={el}>
                  <img src={el} alt='image' className='h-[143px] w-[143px] object-cover border' />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='w-2/5 flex flex-col gap-4'>
          <h1 className='font-semibold text-[20px] text-neutral-900'>{`${product?.title}`}</h1>
          <h3 className='font-semibold text-[30px] text-[#0072BC]'>{`${formatMoney(product?.price)} VNĐ`}</h3>
          <p className='text-sm text-neutral-900'>{`Tồn kho ${formatSold(product?.quantity)} | Đã bán ${formatSold(product?.sold)} sản phẩm`}</p>
          <ul className='list-disc pl-5'>
            {product?.description?.map(el => (
              <li className='leading-9' key={el}>{el}</li>
            ))}
          </ul>
        </div>
        <div className='border rounded-lg w-1/5 flex flex-col gap-8 items-center'>
          <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity} />
          <Button handleOnClick={handleOnClick} style={'px-4 py-2 my-2 rounded-md text-white bg-main text-semibold hover:bg-cyan-900 w-full'} children={'Mua hàng'} />
        </div>
      </div>
      <div className='w-main m-auto mt-8'>
            <ProductInfomation />
      </div>
      <div className='h-[500px] w-full'></div>
    </div>
  )
}

export default DetailProduct