import React from 'react'
import { Sidebar, Banner, BestSeller, DealDaily, FeaturedProducts, Popup } from '../../components'
import { useSelector } from 'react-redux'
import icons from '../../ultils/icons'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { creatSlug } from '../../ultils/helper'

const {IoIosArrowForward} = icons

const Home = () => {

  const { isLoggedIn } = useSelector(state => state.user)
  const { categories } = useSelector(state => state.app)
  const navigate = useNavigate()

  const navigateSearch = (category, productType) => {
    navigate({
      pathname: `/${creatSlug(category)}`,
      search: createSearchParams({productType}).toString()
    })
  }


  return (
    <div className='relative'>
      <div className='absolute z-50'>{!isLoggedIn && <Popup /> }</div>
      <div className='w-main flex'>
        <div className='flex flex-col gap-5 w-[25%] flex-auto '>
          <Sidebar />
          <DealDaily />
        </div>
        <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto'>
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className='my-8'>
        <FeaturedProducts />
      </div>
      <div className='my-8 w-full'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>DÒNG SẢN PHẨM</h3>
        <div className='flex flex-wrap gap-4 mt-4'>
          {categories?.map(el => (
            <div
            key={el._id}
            className='w-[396px]'
            >
              <div className='border flex p-4 gap-4 min-h-[240px]'>
                <img src={el?.image} alt='' className='w-[144px] flex-1 h-[129px] object-contain' />
                <div className='flex-2 text-gray-700'>
                  <h4 className='font-semibold uppercase mb-2'>{el.title}</h4>
                  <ul className='text-sm'>
                    {el?.productType?.map(item => (
                      <span onClick={() => navigateSearch(el.title, item)} key={item} className='cursor-pointer select-none hover:underline flex gap-1 items-center text-gray-500'>
                        <span><IoIosArrowForward /></span>
                        <li key={item}>{item}</li>
                      </span>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home