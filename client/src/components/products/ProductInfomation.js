import React, { memo, useEffect, useState } from 'react';
import { productInfoTabs } from '../../ultils/constants';
import { apiGetProduct } from '../../apis';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import clsx from 'clsx';

const ProductInfomation = () => {
    const { pid } = useParams();
    const [activedTab, setActivedTab] = useState(1);
    const [product, setProduct] = useState(null);
    const [expand, setExpand] = useState(false);

    const fetchProductData = async () => {
        const response = await apiGetProduct(pid);
        if (response.success) {
            setProduct(response.productData);
        } else {
            console.error('Failed to fetch product data:', response.message);
        }
    };

    useEffect(() => {
        if (pid) fetchProductData();
    }, [pid]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-2 border-b">
                {productInfoTabs.map(el => (
                    <span
                        key={el.id}
                        className={clsx(
                            'py-2 px-4 cursor-pointer rounded-t-lg transition-all',
                            activedTab === el.id ? 'bg-white border-t border-l border-r' : 'bg-gray-200 hover:bg-gray-300'
                        )}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.value}
                    </span>
                ))}
            </div>
            <div className="w-full border p-4 mt-4 relative bg-white rounded-lg shadow-md">
                {product && activedTab === 1 ? (
                    <div className="mb-8">
                        <div
                            className={clsx('text-base', expand ? '' : 'line-clamp-6')}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[product.description.length - 1]) }}
                        ></div>
                        <div className="w-full absolute bottom-0 left-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
                            <span
                                onClick={() => setExpand(!expand)}
                                className="cursor-pointer hover:underline select-none p-2"
                            >
                                {expand ? 'Ẩn bớt' : 'Xem thêm'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-700">
                        {product?.category === 'Thuốc'
                            ? 'Sử dụng thuốc khi có yêu cầu từ bác sĩ. Đọc kỹ hướng dẫn sử dụng trước khi dùng'
                            : 'Sản phẩm không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(ProductInfomation);
