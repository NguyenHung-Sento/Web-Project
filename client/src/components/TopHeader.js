import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import path from '../ultils/path'
import { getCurrent } from '../store/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import icons from '../ultils/icons'
import { logout } from '../store/user/userSlice'

const { CiLogout } = icons

const TopHeader = () => {
  const dispatch = useDispatch()
  const { isLogedIn, current } = useSelector(state => state.user)

  useEffect(() => {
    if (isLogedIn) dispatch(getCurrent())
  }, [dispatch, isLogedIn])

  return (
    <div className='h-[38px] w-full bg-cyan-600 flex items-center justify-center'>
      <div className='w-main flex items-center justify-between text-white'>
        <span>Tư vấn ngay: (1800) 6821</span>
        {isLogedIn
          ? <div className='flex gap-2 items-center'>
            <span>{`Xin chào, ${current?.lastname}!`}</span>
            <span
              onClick={() => {dispatch(logout())}}
              className='hover:rounded-full hover:bg-gray-200 p-2 hover:text-main cursor-pointer'>
              <CiLogout size={18} />
            </span>
          </div>
          : <Link className='hover:text-gray-700 underline ' to={`/${path.LOGIN}`} >Đăng nhập/Đăng ký</Link>}
      </div>
    </div>
  )
}

export default memo(TopHeader)