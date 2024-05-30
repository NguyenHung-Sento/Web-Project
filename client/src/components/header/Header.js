import React, { Fragment, memo } from 'react'
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { useDispatch, useSelector } from 'react-redux'
import { showCart } from '../../store/app/appSlice'

const { FaPhone, MdEmail, BsCart4, FaCircleUser, MdAnalytics } = icons
const Header = () => {
  const { current } = useSelector(state => state.user)
  const dispacth = useDispatch()
  return (
    <div className='w-main flex justify-between h-[140px] py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className='w-[235px] h-[84px]' />
      </Link>
      <div className='flex text-[13px]'>
        <div className='flex flex-col px-6 border-r items-center justify-center'>
          <span className='flex gap-4 items-center'>
            <FaPhone color='#156082' />
            <span className='font-semibold'>(1800) 6821</span>
          </span>
          <span>Thứ hai-CN 9:00AM - 8:00PM</span>
        </div>
        <div className='flex flex-col px-6 border-r items-center justify-center'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='#156082' />
            <span className='font-semibold'>RPCUSTOMER@BLUEMEDIC.COM</span>
          </span>
          <span>Hỗ trợ trực tuyến 24/7</span>
        </div>
        {current && (
          <Fragment>
            <div onClick={() => dispacth(showCart())} className='flex items-center px-6 border-r justify-center gap-2 cursor-pointer relative group'>
              <BsCart4 color='#156082' size={24} />
              <span>{`${current?.cart?.length || 0} item(s)`}</span>
              <div className='absolute bg-black bg-opacity-75 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 rounded-md -top-10 left-1/2 transform -translate-x-1/2'>
                Giỏ hàng
              </div>
            </div>
            {current?.role === 'admin' && <Link
              to={`/${path.ADMIN}/${path.DASHBOARD}` }
              className='flex items-center px-6 justify-center border-r cursor-pointer relative group'
            >
              <div className='flex justify-center items-center gap-2'><MdAnalytics color='#156082' size={24} /><span>Administration</span></div>
              <div className='absolute bg-black bg-opacity-75 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 rounded-md -top-10 left-1/2 transform -translate-x-1/2'>
                Trang quản trị
              </div>
            </Link>}
            <Link
              to={`/${path.MEMBER}/${path.PERSONAL}`}
              className='flex items-center px-6 justify-center cursor-pointer relative group'
            >
              <div className='flex justify-center items-center gap-2'><FaCircleUser color='#156082' size={24} /><span>Profiles</span></div>
              <div className='absolute bg-black bg-opacity-75 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 rounded-md -top-10 left-1/2 transform -translate-x-1/2'>
                Trang cá nhân
              </div>
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default memo(Header)