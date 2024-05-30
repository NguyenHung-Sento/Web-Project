import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Product } from '../../components'
import path from '../../ultils/path'
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { apiRemoveWishlist, apiUpdateCart } from '../../apis'
import { IoClose } from 'react-icons/io5'
const Wishlist = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { current } = useSelector(state => state.user)
  const updateDeleteWishlist = async (data) => {
    const response = await apiRemoveWishlist(data)
    if (response.success) {
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  const handleUpdateCart = async (pid) => {
    if (!current) return Swal.fire({
      title: 'Oops!',
      text: 'Vui lòng đăng nhập',
      icon: 'info',
      cancelButtonText: 'Không phải bây giờ',
      showCancelButton: true,
      confirmButtonText: 'Đến đăng nhập'
    }).then(async (rs) => {
      if (rs.isConfirmed) navigate({
        pathname: `/${path.LOGIN}`,
        search: createSearchParams({ redirect: location.pathname }).toString()
      })
    })
    const response = await apiUpdateCart({ pid: pid, quantity: 1 })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  return (
    <div className='w-full'>
      <h1 className='bg-white text-gray-800 h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Wishlist</span>
      </h1>
      <div className='p-4 w-full grid grid-cols-5 gap-4'>
        {current?.wishlist?.map((el) => (
          <div key={el._id} className='relative'>

            <Product
              pid={el._id}
              productDatas={el}
              normal
            />
            <IoClose size={24} color='white' className='absolute border top-0 right-0 cursor-pointer bg-red-500 rounded-full' onClick={() => updateDeleteWishlist(el._id)} />
            <Button fw handleOnClick={() => handleUpdateCart(el._id)} style={'px-4 py-2 my-2 rounded-md text-white bg-main text-semibold hover:bg-cyan-900'} children={'Thêm vào giỏ'} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist