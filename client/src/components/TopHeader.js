import React, {memo} from 'react'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const TopHeader = () => {
  return (
    <div className='h-[38px] w-full bg-cyan-600 flex items-center justify-center'>
        <div className='w-main flex items-center justify-between text-white'>
          <span>Tư vấn ngay: (1800) 6821</span>
          <Link className='hover:text-gray-700 underline 'to={`/${path.LOGIN}`} >Đăng nhập/Đăng ký</Link>
        </div>
    </div>
  )
}

export default memo(TopHeader)