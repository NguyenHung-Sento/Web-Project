import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Select, Button, MarkdownEditor, Loading } from '../../components'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { validate, getBase64, formatMoney } from '../../ultils/helper'
import { toast } from 'react-toastify'
import { RiDeleteBin2Fill } from "react-icons/ri";
import { apiCreateProduct } from '../../apis'
import { apiGetProducts } from '../../apis/product'

const CreateProducts = () => {
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
  const { categories } = useSelector(state => state.app)
  const { brands } = useSelector(state => state.brand)
  const [products, setProducts] = useState(null)
  const [hoverElm, setHoverElm] = useState(null)
  const [fileCount, setFileCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [payload, setPayload] = useState({
    description: ''
  })
  const [details, setDetails] = useState({
    details: ''
  })
  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })

  const changeValue = useCallback((e) => {
    setPayload(e)
  }, [payload])

  const changeDetails = useCallback((e) => {
    setDetails(e)
  }, [details])


  const handlePreviewThumb = async (file) => {
    if (!file) return
    const thumbPreview = {}
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      const base64Thumb = await getBase64(file)
      thumbPreview.name = file.name
      thumbPreview.path = base64Thumb
    } else {
      toast.warning('Not image file')
      return
    }
    setPreview(prev => ({ ...prev, thumb: thumbPreview }))
  }

  const handlePreviewImages = async (files) => {
    if (!files) return
    const imagesPreview = []
    for (let file of files) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const base64Image = await getBase64(file)
        imagesPreview.push({ name: file.name, path: base64Image })
      } else {
        toast.warning('Not image file')
        return
      }
    }
    setPreview(prev => ({ ...prev, images: imagesPreview }))
    setFileCount(files.length)
  }

  const handleRemoveThumb = () => {
    setPreview(prev => ({ ...prev, thumb: null }))
  }

  const handleRemoveImage = async (name) => {
    if (preview.images?.some(el => el.name === name)) {
      setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))
      setFileCount(prev => prev - 1)
    }
  }


  const handleCreateProduct = async (data) => {
    const invalids = validate({ ...payload, ...details }, setInvalidFields)
    if (invalids === 0) {
      if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
      const handlePayload = {
        ...data,
        ...payload,
        description: [payload.description, details.details]
      };
      const { description, ...finalPayload } = handlePayload
      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
      if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append('images', image)
      }
      if (description) {
        for (let text of description) formData.append('description', text)
      }
      if (products.some(product => product.title.toLowerCase() === finalPayload.title.toLowerCase())) {
        toast.error('Product is already exist')
      } else {
        setLoading(true)
        const response = await apiCreateProduct(formData)
        if (response.success) {
          setLoading(false)
          toast.success(response.mes)
          reset()
          setPreview({
            thumb: null,
            images: []
          })
        } else {
          setLoading(false)
          toast.error(response.mes)
        }
      }
    }
  }
  useEffect(() => {
    handlePreviewThumb(watch('thumb')[0])
  }, [watch('thumb')])

  useEffect(() => {
    handlePreviewImages(watch('images'))
  }, [watch('images')])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiGetProducts()
      if (response.success) {
        setProducts(response.productDatas)
      }
    }
    fetchProducts()
  }, [])


  return (
    <div className='w-full'>
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Loading size={50} />
      </div>}
      <h1 className='bg-white text-gray-800 h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create products</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label='Tên sản phẩm'
            register={register}
            errors={errors}
            id='title'
            validate={{
              required: 'Require this field'
            }}
            fullWidth
            placeholder='Tên sản phẩm mới'
            onInput={(e) => {
              if (e.target.value.startsWith(' ')) {
                return e.target.value = e.target.value.trimStart();
              }
            }}
          />
          <div className='w-full my-6 flex gap-4'>
            <InputForm
              label='Giá'
              register={register}
              errors={errors}
              id='price'
              validate={{
                required: 'Require this field'
              }}
              style='flex-1'
              placeholder='Giá của sản phẩm'
              type='number'
              onInput={(e) => {
                if (e.target.value < 1) {
                  return e.target.value = null;
                }
              }}
              onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
            />
            <InputForm
              label='Số lượng'
              register={register}
              errors={errors}
              id='quantity'
              validate={{
                required: 'Require this field'
              }}
              style='flex-1'
              placeholder='Số lượng của sản phẩm'
              type='number'
              onInput={(e) => {
                if (e.target.value < 1) {
                  return e.target.value = null;
                }
              }}
              onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
            />
          </div>
          <div className='w-full my-6 flex gap-4'>
            <Select
              label='Danh mục'
              options={categories?.map(el => ({ code: el._id, value: el.title }))}
              register={register}
              id='category'
              validate={{
                required: 'Require this field'
              }}
              style='flex-1'
              errors={errors}
              defaultSelect
            />
            <Select
              label='Loại sản phẩm'
              options={categories?.find(el => el._id === watch('category'))?.productType?.map(el => ({ code: el, value: el }))}
              register={register}
              id='productType'
              validate={{
                required: 'Require this field'
              }}
              style='flex-1'
              errors={errors}
              defaultSelect
            />
            <Select
              label='Thương hiệu'
              options={brands?.map(el => ({ code: el.title, value: el.title }))}
              register={register}
              id='brand'
              validate={{
                required: 'Require this field'
              }}
              style='flex-1'
              errors={errors}
              defaultSelect
            />
          </div>
          <div className='flex flex-col gap-6'>
            <MarkdownEditor
              nameKey='description'
              changeValue={changeValue}
              label='Mô tả'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.description}
            />
            <MarkdownEditor
              nameKey='details'
              changeValue={changeDetails}
              label='Chi tiết sản phẩm'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              value={details.details}
            />
          </div>
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='thumb'>Tải lên ảnh đại diện</label>
            <input
              type='file'
              id='thumb'
              {...register('thumb', { required: 'Need uploading' })}
              className='hidden'
            />
            <div className='flex gap-2 items-center'>
              <label htmlFor='thumb' className='w-fit cursor-pointer py-2 px-4 bg-cyan-600 text-white rounded'>Choose Image</label>
              {preview.thumb && <span className='ml-2'>{preview.thumb.name}</span>}
            </div>
            {errors['thumb'] && <small className='text-xs text-red-500 italic'>{errors['thumb']?.message}</small>}
          </div>
          {preview.thumb && <div className='my-4'>
            <div
              className='w-fit relative'
              onMouseEnter={() => setHoverElm(preview.thumb.name)}
              onMouseLeave={() => setHoverElm(null)}
            >
              <img src={preview.thumb.path} alt='thumbnail' className='w-[200px] object-contain' />
              {hoverElm === preview.thumb.name && <div
                onClick={() => handleRemoveThumb()}
                className='absolute animate-scale-up-center inset-0 bg-opacity-75 bg-black flex justify-center items-center cursor-pointer'>
                <RiDeleteBin2Fill size={24} color='white' />
              </div>}
            </div>
          </div>}
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='images'>Tải lên ảnh sản phẩm</label>
            <input
              type='file'
              id='images'
              multiple
              {...register('images', { required: 'Need uploading' })}
              className='hidden'
            />
            <div className='flex gap-2 items-center'>
              <label htmlFor='images' className='w-fit cursor-pointer py-2 px-4 bg-cyan-600 text-white rounded'>Choose Images</label>
              {fileCount > 0 && <span className='ml-2'>{fileCount} file(s) selected</span>}
            </div>
            {errors['images'] && <small className='text-xs text-red-500 italic'>{errors['images']?.message}</small>}
          </div>
          {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
            {preview.images?.map(el => (
              <div
                key={el.name}
                className='w-fit relative'
                onMouseEnter={() => setHoverElm(el.name)}
                onMouseLeave={() => setHoverElm(null)}
              >
                <img src={el.path} alt='image' className='w-[200px] object-contain' />
                {hoverElm == el.name && <div
                  onClick={() => handleRemoveImage(el.name)}
                  className='absolute animate-scale-up-center inset-0 bg-opacity-75 bg-black flex justify-center items-center cursor-pointer'>
                  <RiDeleteBin2Fill size={24} color='white' />
                </div>}
              </div>
            ))}
          </div>}
          <Button style={'bg-red-600 hover:bg-red-700 mt-8'} type='submit' children={'Tạo mới'} />
        </form>
      </div>
    </div>
  )
}

export default CreateProducts