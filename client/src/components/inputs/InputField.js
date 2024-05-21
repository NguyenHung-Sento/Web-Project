import React, {memo} from 'react'
import clsx from 'clsx'

const InputField = ({ value, setValue, nameKey, type, invalidField, setInvalidField, style, fullWidth, placeholder, isHideLabel }) => {
    return (
        <div className={clsx('relative mb-2', fullWidth && 'w-full')}>
            {!isHideLabel && value?.trim() !== '' && <label className='text-[12px] absolute top-0 left-2 block bg-white px-1' htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                type={type || 'text'}
                className={clsx('px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none', style)}
                placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
            />
            <small className='text-red-500 text-[12px] italic'>Require {`${nameKey}`}</small>
        </div>
    )
}

export default memo(InputField)