import React, { memo, useCallback, useEffect, useState } from 'react'
import SelectQuantity from '../common/SelectQuantity'
import { ImBin } from 'react-icons/im'
import { formatMoney } from '../../ultils/helper'
import { useDispatch } from 'react-redux'
import { apiRemoveCart } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'
import { updateCart } from '../../store/user/userSlice'

const OrderItem = ({ el}) => {
    const [quantity, setQuantity] = useState(el.quantity)
    const dispatch = useDispatch()
    const updateDeleteCart = async (data) => {
      const response = await apiRemoveCart(data)
      if (response.success) {
        dispatch(getCurrent())
      } else toast.error(response.mes)
    }
    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return
        } else setQuantity(number)
    }, [quantity])

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])

    useEffect(() => {
        dispatch(updateCart({pid: el.product?._id, quantity: quantity}))
    }, [quantity])
    return (
        <div className='grid grid-cols-10 font-semibold my-8 py-3 mx-auto border w-main rounded-md'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex items-center gap-2'>
                    <img src={el.product?.thumb} alt='thumb' className='w-28 h-28 object-cover rounded-md' />
                    <div className='flex flex-col gap-1 justify-start'>
                        <span className=' text-left'>{el.product?.title}</span>
                        <span className='font-light text-left'>{el.product?.category}</span>
                    </div>
                </div>
            </span>
            <span className='col-span-2 w-full text-center'>
                <div className='flex items-center h-full justify-center'>
                    <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity} />
                </div>
            </span>
            <span className='col-span-1 w-full text-center flex items-center justify-end text-base text-cyan-600'>{`${formatMoney(el.product?.price*quantity)} VNĐ`}</span>
            <span className='col-span-1 flex justify-center items-center p-2 '><div onClick={() => updateDeleteCart(el.product?._id)} className='w-14 h-14 flex justify-center items-center rounded-full hover:bg-gray-700 cursor-pointer select-none hover:text-white'><ImBin size={20} /></div></span>
        </div>
    )
}

export default memo(OrderItem)