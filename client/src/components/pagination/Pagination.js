import React, {memo} from 'react'
import usePagination from '../../hooks/usePagination'
import PagiItem from './PagiItem'

const Pagination = ({totalCount}) => {
  const pagination = usePagination(totalCount,1)
  return (
    <div className='flex items-center'>
      {pagination?.map(el => (
        <PagiItem key={el}>
          {el}
        </PagiItem>
      ))}
    </div>
  )
}

export default memo(Pagination)