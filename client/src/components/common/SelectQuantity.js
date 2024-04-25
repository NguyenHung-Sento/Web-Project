import React, {memo} from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
  return (
    <div className='flex items-center'>
        <span onClick={() => {handleChangeQuantity('minus')}} className='cursor-pointer p-2 border-r border-cyan-300'>-</span>
        <input 
        className='py-2 text-center outline-none w-[100px]' 
        type='text' 
        value={quantity}
        onChange={e => handleQuantity(e.target.value)}
        />
        <span onClick={() => {handleChangeQuantity('plus')}} className='cursor-pointer p-2 border-l border-cyan-300'>+</span>
    </div>
  )
}

export default memo(SelectQuantity)