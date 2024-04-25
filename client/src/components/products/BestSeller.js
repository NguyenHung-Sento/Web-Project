import React, { useState, useEffect, memo } from 'react'
import { apiGetProducts } from '../../apis'
import CustomSlider from '../common/CustomSlider'
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'
import event from '../../assets/event.png'

const tabs = [
    { id: 1, name: 'bán chạy' },
    { id: 2, name: 'sản phẩm mới' },
]


const BestSeller = () => {
    const [bestSellers, setBetSellers] = useState(null)
    const [newProducts, setNewProducts] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
    const [products, setProducts] = useState(null)

    const fecthProducts = async () => {
        const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: '-createdAt' })])
        if (response[0]?.success) {
            setBetSellers(response[0].productDatas)
            setProducts(response[0].productDatas)
        }
        if (response[1]?.success) setNewProducts(response[1].productDatas)
        setProducts(response[0].productDatas)
    }
    useEffect(() => {
        fecthProducts()
    }, [])
    useEffect(() => {
        if (activedTab === 1) setProducts(bestSellers)
        if (activedTab === 2) setProducts(newProducts)
    }, [activedTab])
    return (
        <div className='w-full flex-auto'>
            <div className='flex text-[20px] ml-[-32px]'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold capitalize px-8 cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-cyan-700 underline underline-offset-8' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className='mt-4 border-t-2 border-main py-4 bg-gradient-to-b from-cyan-300 to-blue-400'>
                <CustomSlider products={products} activedTab={activedTab} />
            </div>
            <div className='flex flex-col mt-8 pt-2 gap-2 border-t-2 border-grey-400'>
                <div>
                    <img className='object-cover rounded-3xl' src={event} alt='event' />
                </div>
                <div className='flex'>
                    <div><img src={banner1} alt='banner' /></div>
                    <div><img src={banner2} alt='banner' /></div>
                    <div><img src={banner3} alt='banner' /></div>
                </div>
            </div>
        </div>
    )
}

export default memo(BestSeller)