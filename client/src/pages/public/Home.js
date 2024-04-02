import React from 'react'
import {Sidebar, Banner, BestSeller} from '../../components'


const Home = () => {

  return (
    <div>
      <div className='w-main flex'>
        <div className='flex flex-col gap-5 w-[20%] flex-auto '>
          <Sidebar />
          <span>Deal Daily</span>
        </div>
        <div className='flex flex-col gap-5 pl-5 w-[80%] flex-auto'>
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className='w-full h-[500px]'></div>
    </div>
  )
}

export default Home