import React, {memo} from 'react'
import usePagination from '../../hooks/usePagination'
import PagiItem from './PagiItem'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({totalCount}) => {
  const [params] = useSearchParams()
  const pagination = usePagination(totalCount,+params.get('page') || 1)
  const range = () => {
    const currentPage = +params.get('page') || 1
    const pageSize =  +process.env.REACT_APP_LIMIT || 10
    const start = (currentPage - 1)*pageSize + 1
    const end = Math.min(currentPage*pageSize, totalCount)
    return `${start} - ${end}`
  }
  return (
    <div className='flex w-main justify-between items-center'>
      <span className='text-sm italic'>{`Show products ${range()} of ${totalCount}`}</span>
      <div className='flex items-center'>
      {pagination?.map(el => (
        <PagiItem key={el}>
          {el}
        </PagiItem>
      ))}
      </div>
    </div>
  )
}

export default memo(Pagination)