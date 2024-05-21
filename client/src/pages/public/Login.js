import React, { useState, useCallback, useEffect } from 'react'
import loginpage from '../../assets/loginpage.jpg'
import { InputField, Button } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../ultils/path'
import { login } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: ''
  })

  const [isForgorPassword, setIsForgorPassword] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: ''
    })
  }

  const [email, setEmail] = useState('')
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({email})
    if(response.success){
      toast.success(response.mes)
    }else{
      toast.error(response.mes)
    }
  }

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload
    if (isRegister) {
      const response = await apiRegister(payload)
      if (response.success) {
        Swal.fire('Congratulations', response.mes, 'success').then(() => {
          setIsRegister(false)
          resetPayload()
        })
      } else {
        Swal.fire('Oops~', response.mes, 'error')
      }
    } else {
      const rs = await apiLogin(data)
      if (rs.success) {
        dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
        navigate(`/${path.HOME}`)
      } else {
        Swal.fire('Oops~', rs.mes, 'error')
      }
    }

  }, [payload, isRegister])
  return (
    <div className='w-screen h-screen relative'>
      {isForgorPassword && <div className='w-full h-full animate-slide-right absolute top-0 lep-0 bottom-0 right-0 z-50 bg-white flex flex-col items-center  py-8'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email'>Nhập email của bạn: </label>
          <input
            type='text'
            id='email'
            className='w-[800px] pb-2 border-b outline-none'
            placeholder='Exp: example@gmail.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className='flex items-center gap-4 justify-end w-full'>
            <Button
              children={'Submit'}
              handleOnClick={handleForgotPassword}
            >
            </Button>
            <Button
              children={'Back'}
              handleOnClick={() => setIsForgorPassword(false)}
              style={'px-4 py-2 my-2 rounded-md text-white bg-red-600 text-semibold'}
            >
            </Button>
          </div>
        </div>
      </div>}
      <img
        src={loginpage}
        alt='login'
        className='w-full h-full object-cover'
      />
      <div className='absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h1>
          {isRegister && <div className='flex items-center gap-2'>
            <InputField
              value={payload.firstname}
              setValue={setPayload}
              nameKey='firstname'
              fullWidth
            />
            <InputField
              value={payload.lastname}
              setValue={setPayload}
              nameKey='lastname'
              fullWidth
            />
          </div>}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
            fullWidth
          />
          {isRegister && <InputField
            value={payload.mobile}
            setValue={setPayload}
            nameKey='mobile'
            fullWidth
          />}
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
            fullWidth
          />
          <Button
            children={isRegister ? 'Register' : 'Login'}
            handleOnClick={handleSubmit}
            fw
          />
          <div className='flex items-center justify-between my-2 w-full text-sm'>
            {!isRegister && <span onClick={() => {setIsForgorPassword(true)}} className='text-gray-500 hover:underline cursor-pointer'>Quên mật khẩu?</span>}
            {!isRegister && <span
              className='text-gray-500 hover:underline cursor-pointer'
              onClick={() => setIsRegister(true)}
            >Tạo tài khoản</span>}
            {isRegister && <span
              className='text-gray-500 w-full text-center hover:underline cursor-pointer'
              onClick={() => setIsRegister(false)}
            >Về đăng nhập</span>}
          </div>
          <Link className='text-gray-500 w-full text-center hover:underline cursor-pointer text-sm' to={`/${path.HOME}`}>Về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}

export default Login