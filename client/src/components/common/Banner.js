import React, {memo} from 'react'
import ads1 from '../../assets/ads1.png'

const Banner = () => {
  return (
    <div className='w-full'>
      <img 
      src={ads1}
      alt='banner'
      className='w-full object-cover'
      />
    </div>
  )
}

export default memo(Banner)