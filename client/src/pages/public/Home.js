import React from 'react'
import {Sidebar, Banner, BestSeller, DealDaily} from '../../components'
import { UseSelector, useSelector } from 'react-redux'


const Home = () => {
  
const {isLogedIn, current} = useSelector(state => state.user)

  return (
    <div>
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
      <div className='w-full h-[500px]'></div>
    </div>
  )
}

export default Home