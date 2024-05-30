import React, { useEffect, useState } from 'react'
import { apiGetUserOrders } from '../../apis'
import { InputField, Pagination } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { formatMoney } from '../../ultils/helper'
import moment from 'moment'
import clsx from 'clsx'


const History = () => {
  const {register, formState : {errors}, watch, handleSubmit} = useForm()
  const [params] = useSearchParams()
  const [orders, setOrders] = useState(null)
  const [queries, setQueries] = useState({ search: '' })
  const handleClearInput = () => {
    setQueries(prev => ({ ...prev, search: '' }))
  }
  const queriesDebounce = useDebounce(queries.search, 300)
  const fetchOrders = async (params) => {
    const response = await apiGetUserOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    })
    if(response.success) setOrders(response)
  }
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.search = queriesDebounce
    fetchOrders(queries)
  }, [queriesDebounce, params])
  return (
    <div className='w-full'>
       <h1 className='bg-white text-gray-800 h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>History</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4 relative items-center'>
          <InputField
            nameKey={'search'}
            value={queries.search}
            setValue={setQueries}
            style={'w-[500px] rounded-xl'}
            placeholder='Search by status...'
            isHideLabel
          />
          {queries.search !== '' && <IoClose className='absolute border mr-4 cursor-pointer' onClick={handleClearInput} />}
        </div>
      </div>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>#</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Products</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Total</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Status</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Created At</th>
         
          </tr>
        </thead>
        <tbody>
          {orders?.orders.map((el, index) => (
            <tr key={el._id} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px]'>{(+params.get('page') > 1 ? +params.get('page') - 1 : 0)*process.env.REACT_APP_LIMIT + index + 1}</td>
              <td>
                <span className='flex flex-col'>
                  {el.products?.map(item => <span key={item._id}>
                    {`• ${item.title}`}
                  </span>)}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{formatMoney(el.total)}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'> <span className={clsx('italic', el.status === 'Processing' ? 'text-blue-700' :(el.status === 'Cancelled'?'text-red-700' : 'text-green-700'))}>{el.status === 'Processing' ? 'Processing' :(el.status === 'Cancelled'?'Cancelled' : 'Succeed')}</span></td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full my-6 pl-4'>
        <Pagination
          totalCount={orders?.counts}
        />
      </div>
    </div>
  )
}

export default History