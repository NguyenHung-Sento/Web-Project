import React, { useState, useEffect, useCallback } from 'react'
import { apiGetProducts } from '../../apis'
import { creatSlug } from '../../ultils/helper'
import { useNavigate, useParams, useSearchParams, createSearchParams } from 'react-router-dom'
import { Breadcrumbs, Product, SearchItem, InputSelect, Pagination, InputField } from '../../components'
import { useSelector } from 'react-redux'
import Masonry from 'react-masonry-css'
import { sorts } from '../../ultils/constants'
import useDebounce from '../../hooks/useDebounce'
import { IoClose } from 'react-icons/io5'

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
  const [search, setSearch] = useState({
    search: '',

  })

  const handleClearInput = () => {
    setSearch(prev => ({ ...prev, search: '' }))
  }

  const queriesDebounce = useDebounce(search.search, 300)

  const fecthProductsByCategory = async (queries) => {
    const response = await apiGetProducts(queries)
    if (response?.success) {
      setProducts(response)
    }
  }

  const queries = Object.fromEntries([...params])
  useEffect(() => {
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
    if (queriesDebounce){
       queries.search = queriesDebounce
    }
    fecthProductsByCategory({...priceQuery, ...queries})
    window.scrollTo(0,0)
  }, [params, queriesDebounce])

  const changeActiveFilter = useCallback((name) => {
    if(activeClick === name) setActiveClick(null)
    else setActiveClick(name)
  }, [activeClick])

  const changeValue = useCallback((value) => {
    setSort(value)
  }, [sort])

  const navigateSearch = () => {
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
  }
  useEffect(() => {
    if(sort === ''){
      delete queries.sort
      navigateSearch()
    } else {
      queries.sort = sort 
      navigateSearch()
    }
  },[sort])

  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold'>SẢN PHẨM</h3>
          <Breadcrumbs category={categories?.find((el => creatSlug(el.title) === category))?.title} />
        </div>
        <div className='flex justify-end py-4 relative flex items-center'>
          <InputField
            nameKey={'search'}
            value={search.search}
            setValue={setSearch}
            style={'w-[500px] rounded-xl'}
            placeholder='Search product...'
            isHideLabel
          />
          {search.search !== '' && <IoClose className='absolute z-10 border mr-4 cursor-pointer' onClick={handleClearInput} />}
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
      <div className='w-main m-auto my-4 flex justify-center'>
          <Pagination totalCount={products?.counts} />
      </div>
      <div className='h-[500px] w-full'></div>
    </div>
  )
}

export default Products