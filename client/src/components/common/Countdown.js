import React, {memo} from 'react'

const Countdown = ({unit, number}) => {
  return (
    <div className='w-[30%] h-[60px] border flex items-center justify-center rounded-md my-4 bg-slate-200 flex flex-col'>
        <span className='text-[18px] text-gray-800'>{number}</span>
        <span className='text-[12px] text-gray-700'>{unit}</span>
    </div>
  )
}

export default memo(Countdown)