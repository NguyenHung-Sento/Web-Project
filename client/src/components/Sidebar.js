import React, {useEffect, useState} from 'react'
import { apiGetCategories } from '../apis/app'
import {NavLink} from 'react-router-dom'
import {creatSlug} from '../ultils/helper'
import { useSelector } from 'react-redux'

const Sidebar = () => {
  const {categories} = useSelector(state => state.app)
  return (
    <div className='flex flex-col border'>
      {categories?.map(el => (
          <NavLink 
          key = {creatSlug(el.title)}
          to = {creatSlug(el.title)}
          className={({isActive}) => isActive? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-[16px]' : 'px-5 pt-[15px] pb-[14px] text-[16px] hover:text-main'}
          >
            {el.title}
          </NavLink>
      ))}
    </div>
  )
}

export default Sidebar