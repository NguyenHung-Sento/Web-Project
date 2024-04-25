import React, {memo} from 'react'

const InputSelect = ({value, changeValue, options}) => {
  return (
    <select className='w-full border border-gray-800 h-8' value={value} onChange={e => changeValue(e.target.value)}>
        <option value=''>---</option>
        {options?.map(el => (
            <option key={el.id} value={el.value}>{el.text}</option>
        ))}
    </select>
  )
}

export default memo(InputSelect)