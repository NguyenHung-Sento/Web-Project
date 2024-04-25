import React, { useEffect, useState, memo } from 'react'
import deallogo from '../../assets/deallogo.png'
import { apiGetProducts } from '../../apis/product'
import { formatMoney, formatSold } from '../../ultils/helper'
import icons from '../../ultils/icons'
import Countdown from '../common/Countdown'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'

const { IoMenu } = icons
let idInterval
const DealDaily = () => {
    const [dealDaily, setDealDaily] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 1, page: Math.round(Math.random() * 4) })
        if (response.success) {
            setDealDaily(response.productDatas[0])
            const h = 23 - new Date().getHours()
            const m = 59 - new Date().getMinutes()
            const s = 60 - new Date().getSeconds()
            setHour(h)
            setMinute(m)
            setSecond(s)
        } else {
            setHour(5)
            setMinute(59)
            setSecond(59)
        }
    }


    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily()

    }, [expireTime])
    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) setSecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [hour, minute, second, expireTime])
    return (
        <div className='border w-full pb-4 rounded-t-lg'>
            <div className='w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-300 rounded-t-lg'>
                <img src={deallogo} alt='deal' />
            </div>
            <div className='w-full flex flex-col items-center pt-8 gap-2'>
                <img
                    src={dealDaily?.thumb[0] || 'https://th.bing.com/th/id/OIP.ZWOHnGJ4OUzFZnsKMgdCtgHaHa?rs=1&pid=ImgDetMain'}
                    alt=''
                    className='w-full object-contain'
                />
                <span className='line-clamp-1 text-center'>{dealDaily?.title}</span>
                <span className='text-main text-[20px]'>{`${formatMoney(dealDaily?.price)} VNĐ`}</span>
                <span className='text-sm'>{`Đã bán ${formatSold(dealDaily?.sold)}`}</span>
            </div>
            <div className='px-4 mt-4'>
                <div className='flex justify-center gap-2 items-center mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-300'>
                    <Countdown unit={'Giờ'} number={hour} />
                    <Countdown unit={'Phút'} number={minute} />
                    <Countdown unit={'Giây'} number={second} />
                </div>
                <Link to={`${path.DETAIL_PRODUCT}/${dealDaily?._id}/${dealDaily?.title}`}>
                    <button
                        type='button'
                        className='flex gap-2 items-center justify-center text-white font-medium w-full py-4 rounded-lg bg-cyan-600 hover:bg-gradient-to-r from-blue-600 to-cyan-300'
                    >
                        <IoMenu />
                        <span>Options</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default memo(DealDaily)