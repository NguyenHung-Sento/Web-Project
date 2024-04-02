import React, {useState, useEffect, useCallback} from 'react'
import { apiGetProducts } from '../apis/product'  
import Product from './Product'
import Slider from 'react-slick'

const tabs = [
    {id:1, name:'bán chạy'},
    {id:2, name:'sản phẩm mới'},
]

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };


const BestSeller = () => {
    const [bestSellers, setBetSellers] = useState(null)
    const [newProducts, setNewProducts] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
  
    const fecthProducts = async () => {
        const response = await Promise.all([apiGetProducts({sort: '-sold'}), apiGetProducts({sort: '-createAt'})])
        if(response[0]?.success) setBetSellers(response[0].productDatas)
        if(response[1]?.success) setNewProducts(response[1].productDatas)
    }
    useEffect(() => {
        fecthProducts()
    }, [])
    return (
        <div> 
            <div className='flex text-[20px] gap-8 pb-4 border-2 border-main'>
                {tabs.map(el => (
                    <span 
                    key={el.id} 
                    className={`font-semibold capitalize border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-blue-900' : ''}`}
                    onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
            ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <Slider {...settings}>
                    {bestSellers?.map(el => (
                        <Product
                         key={el._id}
                         productDatas={el} 
                         />
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default BestSeller