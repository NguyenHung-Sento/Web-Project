import React, { memo } from 'react';
import clsx from 'clsx';

const Button = ({ children,handleOnClick , style, fw, type = 'button' }) => {
  return (
    <button
      type={type}
      className={clsx('px-4 py-2 my-2 rounded-md text-white text-semibold transition duration-300 ease-in-out hover:shadow-lg',
        style || 'bg-main hover:bg-blue-500 ',
        fw ? 'w-full' : 'w-fit'
      )}
      onClick={() => {handleOnClick && handleOnClick()}}
    >
      {children}
    </button>
  );
};

export default memo(Button);