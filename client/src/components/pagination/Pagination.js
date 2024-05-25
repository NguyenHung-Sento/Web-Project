import React, { memo } from 'react'
import clsx from 'clsx'
import usePagination from '../../hooks/usePagination'
import PagiItem from './PagiItem'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'

const Pagination = ({ totalCount }) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const location = useLocation()
  const currentPage = +params.get('page') || 1
  const pageSize = +process.env.REACT_APP_LIMIT || 10

  const handlePagination = (page) => {
    const queries = Object.fromEntries([...params])
    queries.page = page
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString()
    })
  }

  const pagination = usePagination(totalCount, +params.get('page') || 1)

  const range = () => {
    
    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, totalCount)
    return `${start} - ${end}`
  }


  return (
    <div className='flex w-main justify-between items-center'>
      <span className='text-sm italic'>{`Showing ${range()} of ${totalCount} products`}</span>
      <div className='flex space-x-2'>
        <button
          className={clsx(
            'inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300',
            'hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500',
            currentPage === 1 && 'disabled:bg-gray-100 disabled:text-gray-500'
          )}
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        {pagination?.map((el, index) => (
          <PagiItem key={index} page={el} handlePagination={handlePagination}>{el}</PagiItem>
        ))}
        <button
          className={clsx(
            'inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300',
            'hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500',
            currentPage === Math.ceil(totalCount / pageSize) && 'disabled:bg-gray-100 disabled:text-gray-500'
          )}
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalCount / pageSize)}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default memo(Pagination)