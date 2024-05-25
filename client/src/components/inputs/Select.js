import React, {memo} from 'react'
import clsx from 'clsx'

const Select = ({label, options=[], register, errors, id, validate, style, fullWidth, defaultValue, defaultSelect}) => {
  return (
    <div className={clsx('flex flex-col h-[78px] gap-2', style)}>
        {label && <label className='font-semibold' htmlFor={id}>{label}</label>}
        <select
        id={id}
        {...register(id, validate)}
        className={clsx('form-select my-auto px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-cyan-500 focus:border-cyan-500 transition-shadow', fullWidth && 'w-full',style)}
        defaultValue={defaultValue} 
        >
            {defaultSelect && <option value=''>---Chọn---</option>}
            {options.map(el => (
                <option key={el.code} value={el.code}>{el.value}</option>
            ))}
        </select>
        {errors[id] && <small className='text-xs text-red-500 italic'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(Select)