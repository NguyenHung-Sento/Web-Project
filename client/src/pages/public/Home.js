import React, {useEffect, useState} from 'react'
import {Sidebar, Banner} from '../../components'
import { apiGetProducts } from '../../apis/product'  



const Home = () => {
  const [bestSellers, setBetSellers] = useState(null)
  const [newProducts, setNewProducts] = useState(null)

  const fecthProducts = async () => {
    const response = await Promise.all([apiGetProducts({sort: '-sold'}), apiGetProducts({sort: '-createAt'})])
    if(response[0]?.success) setBetSellers(response[0].productDatas)
    if(response[1]?.success) setNewProducts(response[1].productDatas)
  }
  useEffect(() => {
    fecthProducts()
  }, [])
  return (
    <div className='w-main flex'>
      <div className='flex flex-col gap-5 w-[20%] flex-auto '>
        <Sidebar />
        <span>Deal Daily</span>
      </div>
      <div className='flex flex-col gap-5 pl-5 w-[80%] flex-auto'>
        <Banner />
        <span>Best Seller</span>
      </div>
    </div>
  )
}

export default Home