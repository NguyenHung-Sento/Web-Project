import React, {memo} from 'react'

const Footer = () => {
  return (
    <div className='w-full'>
        <div className='flex h-[50px] w-full bg-cyan-500 text-white items-center pl-2'>
            <div className='w-main flex flex-col justify-between'>
                <span>Blue Medic</span>
                <small>*Nhà thuốc uy tín 100%</small>
            </div>
        </div>
        <div className='h-[200px] w-full bg-gray-300 flex items-center justify-center'>
            <div className='w-main'>Copyright</div>
        </div>
    </div>
  )
}

export default memo(Footer)