import React, {useState} from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const {token} = useParams()
  const handleResetPassword = async() => {
    const response = await apiResetPassword({password, token})
    if(response.success){
      toast.success(response.mes)
    }else{
      toast.error(response.mes)
    }
  }
  return (
    <div className='w-full h-full absolute top-0 lep-0 bottom-0 right-0 z-50 bg-white flex flex-col items-center  py-8'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='password'>Nhập mật khẩu mới của bạn: </label>
          <input
            type='text'
            id='password'
            className='w-[800px] px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-cyan-500 focus:border-cyan-500 transition-shadow  mt-2 placeholder-gray-500 placeholder-italic outline-none'
            placeholder='Enter password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className='flex items-center gap-4 justify-end w-full'>
            <Button
              children={'Submit'}
              handleOnClick={handleResetPassword}
            >
            </Button>
          </div>
        </div>
      </div>
  )
}

export default ResetPassword