import React, { useEffect, useState } from 'react'
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from '../../apis/user'
import { InputField, Pagination, InputForm, Select, Button } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { IoClose } from "react-icons/io5";
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { roles, blockStatus } from '../../ultils/constants'
import moment from 'moment'
import Swal from 'sweetalert2'
import clsx from 'clsx';

const ManageUsers = () => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    mobile: '',
    isBlocked: ''
  })
  const [params] = useSearchParams()
  const [users, setUsers] = useState(null)
  const [queries, setQueries] = useState({ q: '' })
  const [editElm, setEditElm] = useState(null)
  const [update, setUpdate] = useState(false)

  const handleClearInput = () => {
    setQueries(prev => ({ ...prev, q: '' }))
  }

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({ ...params, limit: +process.env.REACT_APP_LIMIT })
    if (response.success) setUsers(response)
  }

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editElm._id)
    if (response.success) {
      setEditElm(null)
      setUpdate(!update)
      toast.success(response.mes)
    } else toast.error(response.mes)
  }

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted',
      showCancelButton: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUser(uid)
        if (response.success) {
          setUpdate(!update)
          toast.success(response.mes)
        } else toast.error(response.mes)
      }
    })
  }

  const queriesDebounce = useDebounce(queries.q, 300)

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.q = queriesDebounce
    fetchUsers(queries)
  }, [queriesDebounce, params, update])

  useEffect(() => {
    if (editElm) {
      reset(editElm)
    }
  }, [editElm, reset])

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage users</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4 relative items-center'>
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
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className='h-[70px]'>{editElm && <Button style={'bg-red-600 hover:bg-red-700'} type='submit' children={'Submit'} />}</div>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Firstname</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Lastname</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Role</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Mobile</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Create At</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.users.map((el, index) => (
                <tr key={el._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{index + 1}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {editElm?._id === el._id ?
                      <InputForm
                        register={register}
                        errors={errors}
                        id={'email'}
                        validate={{
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        defaultValue={editElm?.email}
                        placeholder={'Email'}
                        fullWidth
                      /> :
                      <span>{el.email}</span>
                    }
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {editElm?._id === el._id ?
                      <InputForm
                        register={register}
                        errors={errors}
                        id={'firstname'}
                        validate={{ required: 'Require this field' }}
                        defaultValue={editElm?.firstname}
                        placeholder={'First name'}
                        fullWidth
                      /> :
                      <span>{el.firstname}</span>
                    }
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {editElm?._id === el._id ?
                      <InputForm
                        register={register}
                        errors={errors}
                        id={'lastname'}
                        validate={{ required: 'Require this field' }}
                        defaultValue={editElm?.lastname}
                        placeholder={'Last name'}
                        fullWidth
                      /> :
                      <span>{el.lastname}</span>
                    }
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {editElm?._id === el._id ?
                      <Select
                        register={register}
                        errors={errors}
                        id={'role'}
                        validate={{ required: 'Require this field' }}
                        defaultValue={editElm?.role}
                        options={roles}
                      /> :
                      <span>{el.role}</span>
                    }
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {editElm?._id === el._id ?
                      <InputForm
                        register={register}
                        errors={errors}
                        id={'mobile'}
                        validate={{
                          required: 'Require this field',
                          pattern: {
                            value: /^[62|0]+\d{9}/gi,
                            message: "Invalid phone number"
                          }
                        }}
                        defaultValue={editElm?.mobile}
                        placeholder={'Mobile'}
                        fullWidth
                      /> :
                      <span>{el.mobile}</span>
                    }
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {editElm?._id === el._id ?
                      <Select
                        register={register}
                        errors={errors}
                        id={'isBlocked'}
                        validate={{ required: 'Require this field' }}
                        defaultValue={editElm?.isBlocked}
                        options={blockStatus}
                      /> :
                      <span className={clsx('italic',el.isBlocked ? 'text-red-700' : 'text-green-700')}>{el.isBlocked ? 'Blocked' : 'Active'}</span>
                    }
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    {editElm?._id === el._id ?
                      <span onClick={() => setEditElm(null)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Back</span> :
                      <span onClick={() => setEditElm(el)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>
                    }
                    <span onClick={() => handleDeleteUser(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></form>
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
