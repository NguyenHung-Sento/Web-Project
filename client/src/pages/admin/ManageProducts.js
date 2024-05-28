import React, { useCallback, useEffect, useState } from 'react'
import { InputField, Pagination } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { IoClose } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'
import { apiGetProducts, apiDeleteProduct } from '../../apis'
import { formatMoney } from '../../ultils/helper'
import UpdateProduct from './UpdateProduct' 
import moment from 'moment'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const ManageProducts = () => {
  const [params] = useSearchParams()
  const [queries, setQueries] = useState({ search: '' })
  const [products, setProducts] = useState(null)
  const [editElm, setEditElm] = useState(null)
  const [update, setUpdate] = useState(false)

  const handleClearInput = () => {
    setQueries(prev => ({ ...prev, search: '' }))
  }
  
  const render = useCallback(() => {
    setUpdate(!update)
  })

  const hanldeDeleteProduct = (pid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted',
      icon: 'warning',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteProduct(pid)
        if (response.success) {
          render()
          toast.success(response.mes)
        } else toast.error(response.mes)
      }
    })
  }

  const queriesDebounce = useDebounce(queries.search, 300)

  const fetchProducts = async (params) => {
    const response = await apiGetProducts({ ...params, limit: +process.env.REACT_APP_LIMIT, sort : '-createdAt' })
    if (response.success) setProducts(response)
  }

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.search = queriesDebounce
    fetchProducts(queries)
  }, [queriesDebounce, params, update])


  return (
    <div className='w-full flex flex-col relative min-h-screen'>
      {editElm && <div className='absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-100 p-8 rounded-lg w-3/4 h-5/6 animate-scale-up-center overflow-auto relative'>
            <UpdateProduct editElm={editElm} render={render} setEditElm={setEditElm} />
            <IoClose size={24} color='white' className='absolute border top-0 right-0 cursor-pointer bg-red-500' onClick={() => setEditElm(null)} />
          </div>
        </div>}
      <h1 className='bg-white text-gray-800 h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage products</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4 relative items-center'>
          <InputField
            nameKey={'search'}
            value={queries.search}
            setValue={setQueries}
            style={'w-[500px] rounded-xl'}
            placeholder='Search by title or category...'
            isHideLabel
          />
          {queries.search !== '' && <IoClose className='absolute border mr-4 cursor-pointer' onClick={handleClearInput} />}
        </div>
      </div>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>#</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Thumb</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Title</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Price</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Quantity</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Sold</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Category</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Type</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Brand</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Updated At</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.productDatas?.map((el, index) => (
            <tr key={el._id} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px]'>{index + 1}</td>
              <td>
                <img src={el.thumb} alt='thumb' className='px-6 py-4 object-contain' />
              </td>
              <td className='px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{el.title}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{formatMoney(el.price)}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{el.quantity}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{el.sold}</td>
              <td className='px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{el.category}</td>
              <td className='px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{el.productType}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{el.brand}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] max-h-[160px]'>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <span onClick={() => setEditElm(el)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>
                <span onClick={() => hanldeDeleteProduct(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full my-6 pl-4'>
          <Pagination
            totalCount={products?.counts}
          />
        </div>
    </div>
  )
}

export default ManageProducts