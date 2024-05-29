import React, { memo } from 'react'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { showCart } from '../../store/app/appSlice'
import { formatMoney } from '../../ultils/helper'
import Button from '../buttons/Button'
import { ImBin } from "react-icons/im";
import { apiRemoveCart } from '../../apis'
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'
import { useNavigate } from 'react-router-dom'
import path from '../../ultils/path'

const Cart = () => {
    const { currentCart } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const updateCart = async (data) => {
        const response = await apiRemoveCart(data)
        if (response.success) {
            dispatch(getCurrent())
        } else toast.error(response.mes)
    }
    return (
        <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen bg-white grid grid-rows-10 text-gray-700 p-6'>
            <header className='border-b font-bold text-2xl flex justify-between row-span-1 h-full items-center'>
                <span>Your Cart</span>
                <span onClick={() => dispatch(showCart())} className='p-2 cursor-pointer'><IoClose size={24} color='white' className='bg-red-500 rounded-full' /></span>
            </header>
            <section className='row-span-6 h-full flex flex-col gap-3 max-h-full overflow-y-auto py-3'>
                {!currentCart && <span className='text-sm'>Chưa có sản phẩm nào</span>}
                {currentCart && currentCart?.map((el) => (
                    <div key={el._id} className='flex justify-between border rounded-lg items-center bg-gray-200'>
                        <div className='flex gap-2 items-center'>
                            <img src={el.product?.thumb} alt='thumb' className='w-16 h-16 object-cover rounded-md' />
                            <div className='flex flex-col gap-1'>
                                <span className='font-semibold'>{el.product?.title}</span>
                                <span className='text-base text-cyan-600'>{`${formatMoney(el.product?.price)} VNĐ`}</span>
                            </div>
                        </div>
                        <span onClick={() => updateCart(el.product?._id)} className='p-2 rounded-full hover:bg-gray-700 cursor-pointer hover:text-white'><ImBin size={20} /></span>
                    </div>
                ))}
            </section>
            <div className='row-span-3 h-full'>
                <div className='flex items-center justify-between my-4 pt-4 border-t'>
                    <span className='font-semibold'>Tổng cộng: </span>
                    <span className='font-semibold text-xl text-cyan-600'>{`${formatMoney(currentCart?.reduce((sum, el) => sum + Number(el.product?.price)*el.quantity, 0))} VNĐ`}</span>
                </div>
                <span className='italic text-gray-700 text-sm'>Tới trang giỏ hàng để xem chi tiết</span>
                <Button handleOnClick={() => {
                    dispatch(showCart())
                    navigate(`/${path.MEMBER}/${path.DETAIL_CART}`)
                }} fw style={'mt-8 bg-red-600 hover:bg-red-700'} children={'Trang Giỏ Hàng'} />
            </div>
        </div>
    )
}

export default memo(Cart)