import React, {memo} from 'react'
import clsx from 'clsx'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, style, fullWidth, placeholder, isHideLabel}) => {
    const handleFocus = () => {
        setInvalidFields(prev => prev.filter(el => el.name !== nameKey))
    }

    return (
        <div className={clsx('relative mb-2', fullWidth && 'w-full')}>
            {!isHideLabel && value?.trim() !== '' && <label className='text-[12px] absolute top-0 left-2 block bg-white px-1' htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                type={type || 'text'}
                className={clsx('px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-cyan-500 focus:border-cyan-500 transition-shadow  mt-2 placeholder-gray-500 placeholder-italic outline-none',fullWidth && 'w-full', style)}
                placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={setInvalidFields && handleFocus}
            />
            {invalidFields?.some(el => el.name === nameKey) && <small className='text-red-500 text-[12px] italic'>{invalidFields.find(el => el.name === nameKey)?.mes + `${nameKey}`}</small>}
        </div>
    )
}

export default memo(InputField)