import React, { memo, useEffect, useState } from 'react'
import { productInfoTabs } from '../../ultils/constants'
import { apiGetProduct } from '../../apis'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'


const ProductInfomation = () => {
    const { pid } = useParams()
    const [activedTab, setActivedTab] = useState(1)
    const [product, setProduct] = useState(null)

    const fetchProductData = async () => {

        const response = await apiGetProduct(pid);
        if (response.success) {
            setProduct(response.productData);
        } else {
            console.error('Failed to fetch product data:', response.message);
        }

    };

    useEffect(() => {
        if (pid) fetchProductData()
    }, [pid])

    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs.map(el => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === el.id ? 'bg-white border border-b-0' : 'bg-gray-200'} `}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.value}
                    </span>
                ))}
            </div>
            <div className='w-full border p-4' >
                {product && activedTab === 1 ?
                    (<div className='line-clamp-6 mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[product.description.length - 1]) }}></div>) :
                    (product?.category === 'Thuốc' ?
                        'Sử dụng thuốc khi có yêu cầu từ bác sĩ. Đọc kỹ hướng dẫn sử dụng trước khi dùng' :
                        'Sản phẩm không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh')}

            </div>
        </div>
    )
}

export default memo(ProductInfomation)