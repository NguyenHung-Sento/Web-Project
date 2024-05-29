import React from 'react'
import { useSelector } from 'react-redux'
import { Button, OrderItem } from '../../components'
import { formatMoney } from '../../ultils/helper'
import Swal from 'sweetalert2'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import { apiCreateOrder } from '../../apis'


const DetailCart = () => {
  const { currentCart, current } = useSelector(state => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const handleOnClickBuy = async () => {
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
    else{
      const response = await apiCreateOrder(currentCart)
      if(response.success)
      return Swal.fire({
        title: 'Thành công',
        text: 'Bây giờ bạn có thể theo dõi tình trạng đơn hàng của mình',
        icon: 'success'
      })
    }
  }
console.log(currentCart)
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main flex flex-col gap-2'>
          <h3 className='font-semibold'>GIỎ HÀNG CỦA BẠN</h3>
        </div>
      </div>
      <div className='flex flex-col border mt-8 my-8'>
        <div className='grid grid-cols-10 font-semibold py-3 mx-auto w-main bg-gray-200 shadow-sm opacity-90'>
          <span className='col-span-6 w-full text-center'>Sản phẩm</span>
          <span className='col-span-2 w-full text-center'>Số lượng</span>
          <span className='col-span-2 w-full text-center'>Giá</span>
        </div>
        {currentCart?.map(el => (
          <OrderItem key={el._id} el={el} />
        ))}
      </div>
      <div className='w-main mx-auto flex flex-col items-end justify-center gap-3 mb-12'>
        <span className='flex items-center gap-8'>
          <span className='font-semibold'>TỔNG CỘNG: </span>
          <span className='font-semibold text-xl text-cyan-600'>{`${formatMoney(currentCart?.reduce((sum, el) => sum + Number(el.product?.price) * el.quantity, 0))} VNĐ`}</span>
        </span>
        <span className='text-xs italic'>Thông tin địa chỉ nhận hàng sẽ lấy theo thông tin địa chỉ của bạn, vui lòng kiểm tra kĩ.</span>
        <Button handleOnClick={handleOnClickBuy} style={'mt-8 bg-red-600 hover:bg-red-700'} children={'Đặt mua ngay'} />
      </div>
    </div>
  )
}

export default DetailCart