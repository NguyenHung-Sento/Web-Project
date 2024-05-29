import React, { memo, useEffect, useState } from 'react'
import icons from '../../ultils/icons'
import { useSelector} from 'react-redux'
import { useParams, createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { creatSlug } from '../../ultils/helper'
import { apiGetProducts} from '../../apis'



const { AiOutlineDown, IoSearchCircleOutline } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { category } = useParams()
  const { categories } = useSelector(state => state.app)
  const { brands } = useSelector(state => state.brand)
  const [selected, setSelected] = useState([])
  const [selectBrands, setSelectBrands] = useState([])
  const [highestPrice, setHighestPrice] = useState(null)
  const [price, setPrice] = useState({
    from: '',
    to: ''
  })
  const handleSelect = (e) => {
    const alreadyEl = selected.find(el => el === e.target.value)
    if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
    else setSelected(prev => [...prev, e.target.value])
  }
  const handleSelectBrand = (e) => {
    const alreadyEl = selectBrands.find(el => el === e.target.value)
    if (alreadyEl) setSelectBrands(prev => prev.filter(el => el !== e.target.value))
    else setSelectBrands(prev => [...prev, e.target.value])
  }
  const handleClick = () => {
    const data = {}
    if(Number(price.from) >= 0) data.from = price.from
    if(Number(price.to) > 0) data.to = price.to
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(data).toString()
    })
  }  
  const fecthHighestPriceProduct = async() => {
    const response = await apiGetProducts({sort : '-price', limit: 1})
    if(response.success) setHighestPrice(response.productDatas[0]?.price)
  }

  const queries = Object.fromEntries([...params])

  const navigateSearch = () => {
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
  }

  useEffect(() => {
    if (selected.length > 0) {
      queries.productType = selected.join(',')
      navigateSearch()
    } else {
      delete queries.productType
      navigateSearch()
    }
  }, [selected])

  useEffect(() => {
    if (selectBrands.length > 0) {
      queries.brand = selectBrands.join(',')
      navigateSearch()
    } else {
      delete queries.brand
      navigateSearch()
    }
  }, [selectBrands])

  useEffect(() => {
    if(type === 'input') fecthHighestPriceProduct()
  }, [type])

  return (
    <div
      className='p-3 cursor-pointer text-xs relative border border-gray-800 flex items-center justify-between gap-6 rounded-md shadow-md select-none'
      onClick={() => changeActiveFilter(name)}
    >
      <span>{name}</span>
      <AiOutlineDown />
      {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border border-gray-800 bg-white min-w-[300px]'>
        {type === 'checkbox' && <div className='text-sm'>
          <div className='p-4 items-center flex justify-center gap-8 border-b'>
            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
            <span onClick={e => {
              e.stopPropagation()
              setSelected([])
            }} className='underline cursor-pointer hover:text-main'>Reset</span>
          </div>
          <div onClick={e => e.stopPropagation()} className='flex flex-col gap-4 mt-4'>
            {categories?.find((el => creatSlug(el.title) === category))?.productType?.map((el, index) => (
              <div className='flex gap-2 items-center'>
                <span>
                  <input
                    type='checkbox'
                    key={index}
                    className='w-4 h-4 rounded focus:ring-blue-500'
                    value={el}
                    id={el}
                    onChange={handleSelect}
                    checked={selected.some(selectedItem => selectedItem === el)}
                  />
                </span>
                <label htmlFor={el}>{el}</label>
              </div>
            ))}
          </div>
        </div>}
        {type === 'input' && <div className='text-sm'  onClick={e => e.stopPropagation()}>
          <div className='p-4 items-center flex justify-center gap-8 border-b'>
            <span className='whitespace-nowrap'>{`Giá cao nhất ${Number(highestPrice).toLocaleString()} VNĐ`}</span>
            <span onClick={e => {
              navigate(`/${category}`)
              setPrice({from: '', to: ''})
            }} className='underline cursor-pointer hover:text-main'>Reset</span>
          </div>
          <div className='flex items-center p-2 gap-2'>
            <div className='flex items-center gap-2'>
              <label htmlFor='from'>Từ</label>
              <input onChange={e => setPrice(prev => ({...prev, from: e.target.value}))} value={price[0]} className='border h-6' type='number' id='from'/>
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='to'>đến</label>
              <input onChange={e => setPrice(prev => ({...prev, to: e.target.value}))} value={price[1]} className='border h-6' type='number' id='to'/>
            </div>
            <IoSearchCircleOutline className='cursor-pointer w-8 h-8 hover:bg-cyan-200 rounded-xl' onClick={handleClick} />
          </div>
        </div>}
        {type === 'checkboxbrand' && <div className='text-sm'>
          <div className='p-4 items-center flex justify-center gap-8 border-b'>
            <span className='whitespace-nowrap'>{`${selectBrands.length} selected`}</span>
            <span onClick={e => {
              e.stopPropagation()
              setSelectBrands([])
            }} className='underline cursor-pointer hover:text-main'>Reset</span>
          </div>
          <div onClick={e => e.stopPropagation()} className='flex flex-col gap-4 mt-4'>
            {brands?.map((el, index) => (
              <div className='flex gap-2 items-center'>
                <span>
                  <input
                    type='checkbox'
                    key={index}
                    className='w-4 h-4 rounded focus:ring-blue-500'
                    value={el.title}
                    id={el._id}
                    onChange={handleSelectBrand}
                    checked={selectBrands.some(selectedItem => selectedItem === el.title)}
                  />
                </span>
                <label htmlFor={el._id}>{el.title}</label>
              </div>
            ))}
          </div>
        </div>}
      </div>}
    </div>
  )
}

export default memo(SearchItem) 