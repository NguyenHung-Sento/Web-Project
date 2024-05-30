import React, { useEffect, useState } from 'react'
import { apiGetOrders, apiUpdateOrder } from '../../apis'
import { Button, InputField, Pagination, Select } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { formatMoney } from '../../ultils/helper'
import moment from 'moment'
import { orderStatus } from '../../ultils/constants'
import clsx from 'clsx'
import { toast } from 'react-toastify'

const ManageOrders = () => {
  const {register, formState : {errors, isDirty}, watch, handleSubmit, reset} = useForm()
  const [params] = useSearchParams()
  const [orders, setOrders] = useState(null)
  const [editElm, setEditElm] = useState(null)
  const [queries, setQueries] = useState({ search: '' })
  const [update, setUpdate] = useState(false)
  const handleClearInput = () => {
    setQueries(prev => ({ ...prev, search: '' }))
  }
  const queriesDebounce = useDebounce(queries.search, 300)

  const handleUpdate = async (data) => {
    const response = await apiUpdateOrder(data, editElm._id)
    if (response.success) {
      setEditElm(null)
      setUpdate(!update)
      toast.success(response.mes)
    } else toast.error(response.mes)
  }

  const fetchOrders = async (params) => {
    const response = await apiGetOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    })
    if(response.success) setOrders(response)
  }
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.search = queriesDebounce
    fetchOrders(queries)
  }, [queriesDebounce, params, update])

  useEffect(() => {
    if (editElm) {
      reset(editElm)
    }
  }, [editElm, reset])
  return (
    <div className='w-full'>
       <h1 className='bg-white text-gray-800 h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage orders</span>
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
      <form onSubmit={handleSubmit(handleUpdate)} >
      <div className='h-[70px] mb-4'>{editElm && <Button
            style={`mt-8 ${isDirty ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
            type={isDirty ? 'submit' : 'button'}
            children={'Cập nhật'}
          />}</div>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>#</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Products</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Total</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Status</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Created At</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Action</th>
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
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>
              {editElm?._id === el._id ?
                      <Select
                        register={register}
                        errors={errors}
                        id={'status'}
                        defaultValue={editElm?.status}
                        options={orderStatus}
                        style={'text-sm'}
                      /> :
                      <span className={clsx('italic', el.status === 'Processing' ? 'text-blue-700' :(el.status === 'Cancelled'?'text-red-700' : 'text-green-700'))}>{el.status === 'Processing' ? 'Processing' :(el.status === 'Cancelled'?'Cancelled' : 'Succeed')}</span>
                    }
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
              {editElm?._id === el._id ?
                      <span onClick={() => setEditElm(null)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Back</span> :
                      <span onClick={() => setEditElm(el)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>
                    }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </form>
      <div className='w-full my-6 pl-4'>
        <Pagination
          totalCount={orders?.counts}
        />
      </div>
    </div>
  )
}

export default ManageOrders