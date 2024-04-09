import React from 'react'
import logo from '../assets/logo.png'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const { FaPhone, MdEmail, BsCart4, FaCircleUser } = icons
const Header = () => {
  return (
    <div className='w-main flex justify-between h-[140px] py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className='w-[235px] h-[84px]' />
      </Link>
      <div className='flex text-[13px]'>
        <div className='flex flex-col px-6 border-r items-center'>
          <span className='flex gap-4 items-center'>
            <FaPhone color='#156082' />
            <span className='font-semibold'>(1800) 6821</span>
          </span>
          <span>Thứ hai-CN 9:00AM - 8:00PM</span>
        </div>
        <div className='flex flex-col px-6 border-r items-center'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='#156082' />
            <span className='font-semibold'>RPCUSTOMER@BLUEMEDIC.COM</span>
          </span>
          <span>Hỗ trợ trực tuyến 24/7</span>
        </div>
        <div className='flex items-center px-6 border-r justify-center gap-2 cursor-pointer'>
          <BsCart4 color='#156082' size={24} />
          <span>0 items</span>
        </div>
        <div className='flex items-center px-6 justify-center cursor-pointer'>
          <FaCircleUser color='#156082' size={24} />
        </div>
      </div>
    </div>
  )
}

export default Header