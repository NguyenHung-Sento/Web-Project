import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import { useDispatch, useSelector } from 'react-redux'
import { FaCircleUser } from 'react-icons/fa6'
import { logout } from '../../store/user/userSlice'
import { MemberSidebar } from '../../components'

const MemberLayout = () => {
  const {isLoggedIn, current} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [openMenu, setOpenMenu] = useState(false)
  if(!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />

  return (
   <div className='flex w-full bg-gray-100 min-h-screen relative'>
      <div className="absolute top-0 right-0 m-4 z-20">
        <FaCircleUser size={24} className="cursor-pointer select-none" onClick={() => {setOpenMenu(!openMenu)}} />
        {openMenu && <div className="absolute w-[130px] flex flex-col gap-2 bg-white border border-gray-300 p-2 rounded shadow-lg right-0 mt-2 z-40">
          <div className="cursor-pointer hover:text-red-600" onClick={() => { dispatch(logout()) }}>Đăng xuất</div>
          <div className='border-t border-gray-200'></div>
          <div className="cursor-pointer hover:text-blue-600" onClick={() => { window.location.href = `/${path.HOME}` }}>Về trang chủ</div>
        </div>}
      </div>
      <div className='w-[327px] top-0 bottom-0 flex-none fixed shadow-md'>
        <MemberSidebar />
      </div>
      <div className='w-[327px] flex-none'></div>
      <div className='flex-auto'>
        <Outlet />
      </div>
    </div>
  )
}


export default MemberLayout