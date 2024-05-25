import React, {memo} from 'react'
import clsx from 'clsx'

const InputForm = ({label, disabled, register, errors, id, validate, type = 'text', placeholder,defaultValue , fullWidth, style, onInput, onKeyDown}) => {
  return (
    <div className={clsx('flex flex-col h-[78px] gap-2', style)}>
        {label && <label className='font-semibold' htmlFor={id}>{label}</label>}
        <input 
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx('form-input my-auto px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-cyan-500 focus:border-cyan-500 transition-shadow',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white', fullWidth && 'w-full',style)} 
        defaultValue={defaultValue}
        onInput={onInput}
        onKeyDown={onKeyDown}
        />
        {errors[id] && <small className='text-xs text-red-500 italic'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(InputForm)