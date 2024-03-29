import React from 'react'
import ads1 from '../assets/ads1.png'

const Banner = () => {
  return (
    <div className='w-full'>
      <img 
      src={ads1}
      alt='banner'
      className='w-full object-contain'
      />
    </div>
  )
}

export default Banner