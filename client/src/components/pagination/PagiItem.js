import React, { memo } from 'react'
import clsx from 'clsx'
import { useSearchParams } from 'react-router-dom'

const PagiItem = ({ children, page, handlePagination }) => {
  const [params] = useSearchParams()

  const navigateToPage = () => {
    handlePagination(page)
  }

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300',
        !Number(children) && 'pb-2',
        Number(children) && 'hover:bg-gray-200',
        +params.get('page') === children && 'bg-gray-500 text-white',
        !+params.get('page') && +children === 1 && 'bg-gray-500 text-white'
      )}
      onClick={navigateToPage}
      disabled={!Number(children)}
    >
      {children}
    </button>
  )
}


export default memo(PagiItem)