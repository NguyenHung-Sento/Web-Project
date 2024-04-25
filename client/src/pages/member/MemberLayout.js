import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'

const MemberLayout = () => {
  const {isLogedIn, current} = useSelector(state => state.user)
  if(!isLogedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />
  return (
    <div>
      MemberLayout
      <Outlet />
    </div>
  )
}

export default MemberLayout