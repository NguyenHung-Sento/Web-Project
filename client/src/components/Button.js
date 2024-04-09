import React, { memo } from 'react'

const Button = ({children, handleOnClick, style, fw}) => {
  return (
    <button
    type='button'
    className={style ? style : `px-4 py-2 my-2 rounded-md text-white bg-main text-semibold ${fw ? 'w-full' : 'w-fit' }`}
    onClick={() => {handleOnClick && handleOnClick()}}
    >
     {children}
    </button>
  )
}

export default memo(Button)