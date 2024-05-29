import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, InputForm } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import moment from 'moment'
import { IoClose } from 'react-icons/io5'
import { apiUpdateCurrent } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Personal = () => {
  const { register: register1, formState: { errors: errors1, isDirty: isDirty1 }, reset: reset1, handleSubmit: handleSubmit1, watch: watch1 } = useForm()
  const { register: register2, formState: { errors: errors2, isDirty: isDirty2 }, reset: reset2, handleSubmit: handleSubmit2, watch: watch2 } = useForm()
  const { current } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [changePassword, setChangePassword] = useState(false)
  const handleUpdateInfo = async (data) => {
    const response = await apiUpdateCurrent(data)
    if(response.success){
      dispatch(getCurrent())
      toast.success(response.mes)
      if(searchParams.get('redirect')) navigate(searchParams.get('redirect'))
    } else {
      toast.error(response.mes)
    }
  }
  const password  = watch1("password")
  useEffect(() => {
    reset2({
      firstname: current?.firstname || '',
      lastname: current?.lastname || '',
      email: current?.email || '',
      mobile: current?.mobile || '',
    })
  }, [current])

  useEffect(() => {
    reset1()
  }, [changePassword])

  return (
    <div className='w-full relative'>
      {changePassword && <div className='absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-100 p-8 rounded-lg w-3/4 h-5/6 animate-scale-up-center overflow-auto relative'>
            <div className='w-full p-4'>
            <form onSubmit={handleSubmit1(handleUpdateInfo)}>
            <div className='w-full flex flex-col gap-5'>
            <InputForm
              label='Mật khẩu mới'
              register={register1}
              errors={errors1}
              type='password'
              id='password'
              validate={{
                required: 'Require this field',
                validate: value => value.length >= 6 || 'Password must be at least 6 characters long' 
              }}
              fullWidth
              onInput={(e) => {
                if (e.target.value.startsWith(' ')) {
                  return e.target.value = e.target.value.trimStart();
                }
              }}
              placeholder='Nhập mật khẩu mới...' 
            />
            <InputForm
              label='Nhập lại mật khẩu mới'
              register={register1}
              errors={errors1}
              type='password'
              id='confirmPassword'
              validate={{
                required: 'Require this field',
                validate: value => value === password || 'Passwords do not match'
              }}
              fullWidth
              onInput={(e) => {
                if (e.target.value.startsWith(' ')) {
                  return e.target.value = e.target.value.trimStart();
                }
              }}
              placeholder='Nhập lại mật khẩu mới...' 
            />
            <Button children={'Xác nhận'} type='submit' />
            </div>
            </form>
            </div>
            <IoClose size={24} color='white' className='absolute border top-0 right-0 cursor-pointer bg-red-500' onClick={() => setChangePassword(false)} />
          </div>
        </div>}
      <h1 className='bg-white text-gray-800 h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Personal</span>
      </h1>
      <div className='p-4 w-3/5 mx-auto'>
        <form onSubmit={handleSubmit2(handleUpdateInfo)}>
          <div className='w-full flex flex-col gap-5'>
            <InputForm
              label='Họ (tên đệm)'
              register={register2}
              errors={errors2}
              id='firstname'
              validate={{
                required: 'Require this field'
              }}
              fullWidth
              onInput={(e) => {
                if (e.target.value.startsWith(' ')) {
                  return e.target.value = e.target.value.trimStart();
                }
              }}
            />
            <InputForm
              label='Tên'
              register={register2}
              errors={errors2}
              id='lastname'
              validate={{
                required: 'Require this field'
              }}
              fullWidth
              onInput={(e) => {
                if (e.target.value.startsWith(' ')) {
                  return e.target.value = e.target.value.trimStart();
                }
              }}
            />
            <InputForm
              label='Email'
              register={register2}
              errors={errors2}
              id='email'
              validate={{
                required: 'Require this field',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              fullWidth
              onInput={(e) => {
                if (e.target.value.startsWith(' ')) {
                  return e.target.value = e.target.value.trimStart();
                }
              }}
            />
            <InputForm
              label='Số điện thoại'
              register={register2}
              errors={errors2}
              id='mobile'
              validate={{
                required: 'Require this field',
                pattern: {
                  value: /^[62|0]+\d{9}$/gi,
                  message: "Invalid phone number"
                }
              }}
              fullWidth
              onInput={(e) => {
                if (e.target.value.startsWith(' ')) {
                  return e.target.value = e.target.value.trimStart();
                }
              }}
            />
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>Trạng thái tài khoản: </span>
              <span className={clsx('italic', current.isBlocked ? 'text-red-700' : 'text-green-700')}>{current.isBlocked ? 'Bị khoá' : 'Hoạt động'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>Quyền hạn: </span>
              <span className='italic text-orange-600'>{current.role === 'admin' ? 'Người quản trị' : 'Người dùng'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>Ngày tạo tài khoản: </span>
              <span className='italic text-gray-600'>{moment(current.createdAt).format('DD/MM/YYYY')}</span>
            </div>
            <div className='flex justify-end'>
              <Button handleOnClick={() => setChangePassword(true)} children={'Đổi mật khẩu'} />
            </div>
          </div>
          <div className='flex justify-end'><Button
            style={`mt-8 ${isDirty2 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
            type={isDirty2 ? 'submit' : 'button'}
            children={'Cập nhật'}
          />
          </div>
        </form>

      </div>
    </div>
  )
}

export default Personal