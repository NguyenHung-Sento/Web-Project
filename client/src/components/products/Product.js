import React, { memo, useState } from 'react'
import { formatMoney, formatSold, creatSlug } from '../../ultils/helper'
import labelRed from '../../assets/bestsellerlabel.png'
import labelBlue from '../../assets/newproductlabel.png'
import { Link, useNavigate } from 'react-router-dom'
import SelectOption from '../common/SelectOption'
import { BsFillSuitHeartFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from '../../ultils/path'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'
import { apiUpdateWishlist } from '../../apis'

const Product = ({ productDatas, isNew, normal, pid }) => {
  const [isShowOption, setIsShowOption] = useState(false)
  const dispatch = useDispatch()
  const {current} = useSelector(state => state.user)
  const navigate = useNavigate()
  const handleOnClickOption = async () => {
    if(!current) return Swal.fire({
      title: 'Oops!',
      text: 'Vui lòng đăng nhập',
      icon: 'info',
      cancelButtonText: 'Không phải bây giờ',
      showCancelButton: true,
      confirmButtonText: 'Đến đăng nhập'
    }).then((rs) => {
      if(rs.isConfirmed) navigate(`/${path.LOGIN}`)
    })
    const response = await apiUpdateWishlist(pid)
    if(response.success){
      dispatch(getCurrent())
      toast.success(response.mes)
    } else toast.error(response.mes)
  }
  return (
    <div
      className='w-full text-base px-[10px] relative'
      onMouseEnter={() => setIsShowOption(true)}
      onMouseLeave={() => setIsShowOption(false)}
    >
      {isShowOption && <div className='absolute left-0 right-0 bottom-0 flex justify-center animate-slide-top z-10'>
        <span
          onClick={(e) => {
            e.stopPropagation()
            handleOnClickOption()
          }}
          title='Thêm vào yêu thích'
        >
          <SelectOption icon={<BsFillSuitHeartFill color={current?.wishlist?.some(i => i._id === pid ) ? 'red' : 'white'} />} />
        </span>
      </div>}
      <Link
        className='w-full border p-[15px] flex flex-col items-center bg-white rounded-2xl'
        to={`/${creatSlug(productDatas?.category)}/${productDatas?._id}/${productDatas?.title}`}
      >
        <div className='w-full relative'>
          <img src={productDatas?.thumb[0] || 'https://th.bing.com/th/id/OIP.ZWOHnGJ4OUzFZnsKMgdCtgHaHa?rs=1&pid=ImgDetMain'}
            alt=''
            className='w-[243px] h-[243px] object-cover'
          />
          {!normal && <>
            <img src={isNew ? labelBlue : labelRed} alt='' className='absolute top-[-15px] left-[-38px] w-[100px] h-[35px] object-cover' />
            <span className='absolute font-bold text-white top-[-15px] left-[-15px] w-[100px]'>{isNew ? 'New' : 'Hot'}</span>
          </>}
        </div>
        <div className='w-full flex flex-col gap-2 mt-[12px] items-start'>
          <span className='line-clamp-1'>{productDatas?.title}</span>
          <span className='text-main'>{`${formatMoney(productDatas?.price)} VNĐ`}</span>
          <span className='text-sm'>{`Đã bán ${formatSold(productDatas?.sold)}`}</span>
        </div>
      </Link>
    </div>
  )
}

export default memo(Product)