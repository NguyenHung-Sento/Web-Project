import React, { useCallback, useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiCreateSingleOrder, apiGetProduct, apiUpdateCart } from '../../apis'
import Slider from 'react-slick'
import { formatMoney, formatSold } from '../../ultils/helper'
import { Button, SelectQuantity, ProductInfomation } from '../../components'
import { Breadcrumbs } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import DOMPurify from 'dompurify';
import path from '../../ultils/path'
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
};

const DetailProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { pid, title } = useParams()
  const {current} = useSelector(state => state.user)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)

 const handleOnClickBuy = async () => {
  if(!current) return Swal.fire({
    title: 'Oops!',
    text: 'Vui lòng đăng nhập',
    icon: 'info',
    cancelButtonText: 'Không phải bây giờ',
    showCancelButton: true,
    confirmButtonText: 'Đến đăng nhập'
  }).then(async(rs) => {
    if(rs.isConfirmed) navigate({
      pathname: `/${path.LOGIN}`,
      search: createSearchParams({redirect: location.pathname}).toString()
    })
  })
    if (!current?.address)
      return Swal.fire({
        title: 'Oops!',
        text: 'Vui lòng cập nhật địa chỉ của bạn',
        icon: 'info',
        cancelButtonText: 'Không phải bây giờ',
        showCancelButton: true,
        confirmButtonText: 'Đến cập nhật'
      }).then((rs) => {
        if (rs.isConfirmed) navigate({
          pathname: `/${path.MEMBER}/${path.PERSONAL}`,
          search: createSearchParams({ redirect: location?.pathname }).toString()
        })
      })
    else {
      const response = await apiUpdateCart({pid: pid, quantity: quantity})
      if (response.success) {
        const createOrder = await apiCreateSingleOrder({product: pid, count: quantity, title: title, thumb: product.thumb[0]})
        if (createOrder.success)
          return Swal.fire({
            title: 'Thành công',
            text: 'Bây giờ bạn có thể theo dõi tình trạng đơn hàng của mình',
            icon: 'success'
          })
        else
          return Swal.fire({
            title: 'Opps',
            text: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
            icon: 'error'
          })
      }
    }
  }
  const handleUpdateCart = async() => {
    if(!current) return Swal.fire({
      title: 'Oops!',
      text: 'Vui lòng đăng nhập',
      icon: 'info',
      cancelButtonText: 'Không phải bây giờ',
      showCancelButton: true,
      confirmButtonText: 'Đến đăng nhập'
    }).then(async(rs) => {
      if(rs.isConfirmed) navigate({
        pathname: `/${path.LOGIN}`,
        search: createSearchParams({redirect: location.pathname}).toString()
      })
    })
    const response = await apiUpdateCart({pid: pid, quantity: quantity})
    if(response.success){
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid)
    if (response.success) setProduct(response.productData)
  }
  useEffect(() => {
    if (pid) fetchProductData()
  }, [pid])

  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return
    } else setQuantity(number)
  }, [quantity])

  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => +prev - 1)
    if (flag === 'plus' && quantity < product?.quantity) setQuantity(prev => +prev + 1)
  }, [quantity, product?.quantity])

  const handleThumbnailClick = (image) => {
    setSelectedImage(image)
  }

  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main flex flex-col gap-2'>
          <h3 className='font-semibold'>CHI TIẾT SẢN PHẨM</h3>
          <Breadcrumbs title={title} category={product?.category} productType={product?.productType} />
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='w-4/5 flex flex-col'>
          <div className='w-full flex'>
            <div className='flex-4 flex flex-col gap-4 w-1/2'>
              <img src={selectedImage ? selectedImage : product?.images[0]} alt='product' className='h-[458px] w-[458px] object-cover border' />
              <div className='w-[458px]'>
                <Slider className='images-slider flex gap-2 justify-between' {...settings}>
                  {product?.images?.map(el => (
                    <div className='flex-1' key={el} onClick={() => handleThumbnailClick(el)}>
                      <img src={el} alt='image' className='h-[143px] w-[143px] object-cover border cursor-pointer' />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
            <div className='w-1/2 flex flex-col gap-4'>
              <h1 className='font-semibold text-[20px] text-neutral-900'>{`${product?.title}`}</h1>
              <h3 className='font-semibold text-[30px] text-[#0072BC]'>{`${formatMoney(product?.price)} VNĐ`}</h3>
              <p className='text-sm text-neutral-900'>{`Tồn kho ${formatSold(product?.quantity)} | Đã bán ${formatSold(product?.sold)} sản phẩm`}</p>
              <ul className='list-disc pl-5'>
                {product?.description?.length > 1 && <div className='text-sm mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
              </ul>
            </div>
          </div>
          <div className='w-full m-auto mt-8'>
            <ProductInfomation />
          </div>
        </div>
        <div className='h-[500px] border rounded-lg w-1/5 flex flex-col gap-8 items-center'>
          <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity} />
          <Button fw handleOnClick={handleUpdateCart} style={'px-4 py-2 my-2 rounded-md text-white bg-main text-semibold hover:bg-cyan-900'} children={'Thêm vào giỏ'} />
          <Button fw handleOnClick={handleOnClickBuy} style={'px-4 py-2 my-2 rounded-md text-white bg-red-600 hover:bg-red-700 text-semibold'} children={'Đặt hàng ngay'} />
        </div>
      </div>
        
      <div className='h-[500px] w-full'></div>
    </div>
  )
}

export default DetailProduct