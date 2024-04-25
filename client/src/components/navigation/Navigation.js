import React, {memo} from 'react'
import {navigation} from '../../ultils/constants'
import { NavLink } from 'react-router-dom'
import icons from '../../ultils/icons'

const {FaHome} = icons
const Navigation = () => {
  return (
    <div className='w-main h-[48px] py-2 border-y mb-6 flex items-center bg-[#C1E5F5]'>
      <FaHome color='#156082'/>
      {navigation.map(el => (
        <NavLink 
          to={el.path} 
          key={el.id} 
          className={({isActive}) => isActive ? 'pr-12 hover:text-main text-main':'pr-12 hover:text-main'}
        >
          {el.value}
        </NavLink>
      ))}
    </div>
  )
}

export default memo(Navigation)