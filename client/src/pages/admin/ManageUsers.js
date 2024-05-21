import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers } from '../../apis/user'
import moment from 'moment'
import { InputField, Pagination } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { IoClose } from "react-icons/io5";

const ManageUsers = () => {
  const [users, setUsers] = useState(null)
  const [queries, setQueries] = useState({
    q: '',

  })

  const handleClearInput = () => {
    setQueries(prev => ({ ...prev, q: '' }))
  }

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({...params, limit: 1})
    if (response.success) setUsers(response)
  }

  const queriesDebounce = useDebounce(queries.q, 300)
 
  useEffect(() => {
    const params = {}
    if (queriesDebounce) params.q = queriesDebounce
    fetchUsers(params)
  }, [queriesDebounce])

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage users</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4 relative flex items-center'>
          <InputField
            nameKey={'q'}
            value={queries.q}
            setValue={setQueries}
            style={'w-[500px] rounded-xl'}
            placeholder='Search name or email user...'
            isHideLabel
          />
          {queries.q !== '' && <IoClose className='absolute z-10 border mr-4 cursor-pointer' onClick={handleClearInput} />}
        </div>
        <table className='table-auto mb-6 text-left w-full'>
          <thead className='bg-cyan-700 text-[13px] border border-gray-600 text-white'>
            <tr>
              <th className='px-4 py-2'>#</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Firstname</th>
              <th className='px-4 py-2'>Lastname</th>
              <th className='px-4 py-2'>Role</th>
              <th className='px-4 py-2'>Phone</th>
              <th className='px-4 py-2'>Status</th>
              <th className='px-4 py-2'>Create At</th>
              <th className='px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.users.map((el, index) => (
              <tr key={el._id} className='border border-gray-600'>
                <td className='px-4 py-2'>{index + 1}</td>
                <td className='px-4 py-2'>{el.email}</td>
                <td className='px-4 py-2'>{el.firstname}</td>
                <td className='px-4 py-2'>{el.lastname}</td>
                <td className='px-4 py-2'>{el.role}</td>
                <td className='px-4 py-2'>{el.mobile}</td>
                <td className='px-4 py-2'>{el.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className='px-4 py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                <td>
                  <span className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>
                  <span className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='w-full'>
          <Pagination 
          totalCount={users?.counts}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageUsers