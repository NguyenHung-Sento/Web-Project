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
            className='w-[800px] pb-2 border-b outline-none'
            placeholder='Exp: example@gmail.com'
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