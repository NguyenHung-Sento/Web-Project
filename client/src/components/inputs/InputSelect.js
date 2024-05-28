import React, {memo} from 'react'

const InputSelect = ({value, changeValue, options, label, defaultValue}) => {
  return (
    <select className='cursor-pointer w-full h-full text-xs border border-gray-800' value={value} onChange={e => changeValue(e.target.value)}>
        <option  value={defaultValue ? defaultValue : ''}>{`${label ? label : '---'}`}</option>
        {options?.map(el => (
            <option key={el.id} value={el.value}>{el.text}</option>
        ))}
    </select>
  )
}

export default memo(InputSelect)