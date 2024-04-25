import React, {useState, useEffect, memo} from 'react'
import {ProductCard} from '..'
import {apiGetProducts} from '../../apis'

const FeaturedProducts = () => {

  const [products, setProducts] = useState(null)
  const fetchProducts = async () => {
    const response = await apiGetProducts({limit:9})
    if(response.success){
      setProducts(response.productDatas)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])
  return (
    <div className='w-full'>
      <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>NỔI BẬT</h3>
      <div className='flex flex-wrap mt-[15px] mx-[-10px]'>
        {products?.map(el => (
          <ProductCard 
          key={el._id} 
          image={el.thumb[0]}
          title={el.title}
          price={el.price}
          _id={el._id}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(FeaturedProducts)