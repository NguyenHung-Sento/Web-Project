import React, {useEffect, useState} from 'react'
import { apiGetCategories } from '../apis/app'
import {NavLink} from 'react-router-dom'
import {creatSlug} from '../ultils/helper'

const Sidebar = () => {
  const [categories, setCategory] = useState(null)
  const fecthCategories = async() => {
    const response = await apiGetCategories()
    if(response.success) setCategory(response.prodCategories)
  }
  useEffect(()=>{
    fecthCategories()
  }, [])
  return (
    <div className='flex flex-col border'>
      {categories?.map(el => (
          <NavLink 
          key = {creatSlug(el.title)}
          to = {creatSlug(el.title)}
          className={({isActive}) => isActive? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm' : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
          >
            {el.title}
          </NavLink>
      ))}
    </div>
  )
}

export default Sidebar