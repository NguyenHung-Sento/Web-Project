import React, { useState, useEffect, useCallback } from 'react'
import { apiGetProducts } from '../../apis'
import { creatSlug } from '../../ultils/helper'
import { useNavigate, useParams, useSearchParams, createSearchParams } from 'react-router-dom'
import { Breadcrumbs, Product, SearchItem, InputSelect, Pagination } from '../../components'
import { useSelector } from 'react-redux'
import Masonry from 'react-masonry-css'
import { sorts } from '../../ultils/constants'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const Products = () => {
  const { category } = useParams()
  const { categories } = useSelector(state => state.app)
  const [products, setProducts] = useState(null)
  const [activeClick, setActiveClick] = useState(null)
  const [params] = useSearchParams()
  const [sort, setSort] = useState('')
  const navigate = useNavigate()

  const fecthProductsByCategory = async (queries) => {
    const response = await apiGetProducts(queries)
    if (response?.success) {
      setProducts(response)
    }
  }
  useEffect(() => {
    let param = []
    for(let i of params.entries()) param.push(i)
    const queries = {}
    for(let i of params) queries[i[0]] = i[1]
    let priceQuery = {}
    if(queries.from && queries.to) {
        priceQuery = {$and : [
        {price: {gte: queries.from}},
        {price: {lte: queries.to}}
      ]}
      delete queries.price
    }
    if(queries.from) queries.price = {gte: queries.from}
    if(queries.to) queries.price = {lte: queries.to}
    delete queries.from
    delete queries.to
    fecthProductsByCategory({...priceQuery, ...queries})
    window.scrollTo(0,0)
  }, [params])

  const changeActiveFilter = useCallback((name) => {
    if(activeClick === name) setActiveClick(null)
    else setActiveClick(name)
  }, [activeClick])

  const changeValue = useCallback((value) => {
    setSort(value)
  }, [sort])

  useEffect(() => {
    if(sort === ''){
      navigate(`/${category}`)
    } else {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({sort}).toString()
      })
    }
  },[sort])
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold'>SẢN PHẨM</h3>
          <Breadcrumbs category={categories?.find((el => creatSlug(el.title) === category))?.title} />
        </div>
      </div>
      <div className='w-main border p-4 flex justify-between mt-8'>
        <div className='w-4/5 flex-auto flex flex-col gap-3'>
          <span className='font-semibold text-sm'>Filter by</span>
          <div className='flex items-center gap-4'>
            <SearchItem
              name='Giá'
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type='input'
            />
            <SearchItem
              name='Loại sản phẩm'
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
            />
            <SearchItem
              name='Thương hiệu'
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type='checkboxbrand'
            />
          </div>
        </div>
        <div className='w-1/5 flex flex-col gap-3'>
          <span className='font-semibold text-sm'>Sort by</span>
          <div className='w-full text-sm'>
            <InputSelect value={sort} changeValue={changeValue} options={sorts} />
          </div>
        </div>
      </div>
      <div className='mt-8 w-main'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid mx-[-10px]"
          columnClassName="my-masonry-grid_column">
          {products?.productDatas?.map(el => (
            <Product
              key={el._id}
              productDatas={el}
              pid={el._id}
              normal={true}
            />
          ))}
        </Masonry>
      </div>
      <div className='border w-main m-auto my-4 flex justify-center'>
          <Pagination totalCount={products?.counts} />
      </div>
      <div className='h-[500px] w-full'></div>
    </div>
  )
}

export default Products