import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, InputForm, Loading, MarkdownEditor, Select } from '../../components';
import { useForm } from 'react-hook-form';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { getBase64, validate } from '../../ultils/helper';
import { toast } from 'react-toastify';
import { apiUpdateProduct } from '../../apis';

const UpdateProduct = ({ editElm, render, setEditElm }) => {
    const { register, formState: { errors, isDirty }, reset, handleSubmit, watch } = useForm()
    const { categories } = useSelector(state => state.app)
    const { brands } = useSelector(state => state.brand)
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
        if (preview.images?.some(el => el === name)) {
            setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el !== name) }))
            setFileCount(prev => prev - 1)
        }
    }

    const handleUpdateProduct = async (data) => {
        const invalids = validate({ ...payload, ...details }, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
            const handlePayload = {
                ...data,
                ...payload,
                description: [payload.description, details.details]
            };
            const { description, ...prePayload } = handlePayload
            const formData = new FormData()
            if (prePayload.thumb) formData.append('thumb', prePayload.thumb?.length === 0 ? preview.thumb : prePayload.thumb[0])
            if (prePayload.images) {
                const images = prePayload.images?.length === 0 ? preview.images : prePayload.images
                for (let image of images) formData.append('images', image)
            }
            const { thumb, images, ...finalPayload } = prePayload
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
            if (description) {
                for (let text of description) formData.append('description', text)
            }
            setLoading(true)
            const response = await apiUpdateProduct(formData, editElm?._id)
            if (response.success) {
                setLoading(false)
                toast.success(response.mes)
                render()
                setEditElm(null)

            } else {
                setLoading(false)
                toast.error(response.mes)
            }
        }
    }

    useEffect(() => {
        reset({
            title: editElm?.title || '',
            price: editElm?.price || '',
            quantity: editElm?.quantity || '',
            category: categories.find(el => el.title === editElm?.category)?._id || '',
            productType: editElm?.productType || '',
            brand: editElm?.brand || '',
        })
        setPayload({ description: typeof editElm?.description === 'object' ? editElm?.description.slice(0, editElm?.description.length - 1).join(', ') : editElm?.description })
        setDetails({ details: editElm?.description[editElm?.description.length - 1] })
        setPreview({
            thumb: editElm?.thumb || '',
            images: editElm?.images || []
        })
        setFileCount(editElm?.images.length)
    }, [editElm])

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0)
            handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0)
            handlePreviewImages(watch('images'))
    }, [watch('images')])

    return (
        <div className='w-full'>
            {loading && <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
                <Loading size={50} />
            </div>}
            <h1 className='flex justify-between items-center text-xl font-bold border-b text-gray-600'>
                <span>Update product</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                            {...register('thumb')}
                            className='hidden'
                        />
                        <div className='flex gap-2 items-center'>
                            <label htmlFor='thumb' className='w-fit cursor-pointer py-2 px-4 bg-cyan-600 text-white rounded'>Choose Image</label>
                            {preview.thumb?.name ? <span className='ml-2'>{preview.thumb?.name}</span> : (preview.thumb ? <span className='ml-2'>1 file selected</span> : '')}
                        </div>
                        {errors['thumb'] && <small className='text-xs text-red-500 italic'>{errors['thumb']?.message}</small>}
                    </div>
                    {preview.thumb && <div className='my-4'>
                        <div
                            className='w-fit relative'
                            onMouseEnter={() => setHoverElm(preview.thumb)}
                            onMouseLeave={() => setHoverElm(null)}
                        >
                            <img src={preview.thumb.path ? preview.thumb.path : preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />
                            {hoverElm === preview.thumb && <div
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
                            {...register('images')}
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
                                key={el}
                                className='w-fit relative'
                                onMouseEnter={() => setHoverElm(el)}
                                onMouseLeave={() => setHoverElm(null)}
                            >
                                <img src={el.path ? el.path : el} alt='image' className='w-[200px] object-contain' />
                                {hoverElm === el && <div
                                    onClick={() => handleRemoveImage(el)}
                                    className='absolute animate-scale-up-center inset-0 bg-opacity-75 bg-black flex justify-center items-center cursor-pointer'>
                                    <RiDeleteBin2Fill size={24} color='white' />
                                </div>}
                            </div>
                        ))}
                    </div>}
                    <Button
                        style={`mt-8 ${isDirty ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        type={isDirty ? 'submit' : 'button'}
                        children={'Cập nhật'}
                    />
                </form>
            </div>
        </div>
    )
}

export default memo(UpdateProduct)