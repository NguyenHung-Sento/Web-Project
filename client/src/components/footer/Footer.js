import React, { memo } from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaHome, FaEnvelope, FaPhone } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <div className='w-full'>
      <div className='flex h-[50px] w-full bg-cyan-500 text-white items-center pl-2'>
        <div className='w-main flex flex-col justify-between'>
          <span>Blue Medic</span>
          <small>*Nhà thuốc uy tín 100%</small>
        </div>
        <div className="flex space-x-3">
          <a href="//www.facebook.com" target="_blank" className="text-gray-600" rel="noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com" target="_blank" className="text-gray-600" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com" target="_blank" className="text-gray-600" rel="noreferrer">
            <FaLinkedinIn />
          </a>
          <a href="https://github.com" target="_blank" className="text-gray-600" rel="noreferrer">
            <FaGithub />
          </a>
        </div>
      </div>
      <div className='h-[200px] w-full bg-gray-300 flex items-center justify-center'>
        <div className="text-gray-600 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Logo" className="w-fit" />
              <span className="font-semibold uppercase">Pharmacy Organization</span>
            </div>
            <p>
              Mỗi khách hàng là một con người - một cá thể riêng biệt, sức khoẻ của họ cần được tôn trọng, quan tâm,
              lắng nghe, thấu hiểu và phục vụ một cách riêng biệt.
            </p>
          </div>
          <div className="mb-6 lg:mb-0">
            <h6 className="font-semibold uppercase mb-4">TRANG KHÁC</h6>
            <p><a href="#!" className="text-gray-600">Chính sách</a></p>
            <p><a href="#!" className="text-gray-600">Điều khoản</a></p>
            <p><a href="#!" className="text-gray-600">Hỗ trợ</a></p>
            <p><a href="#!" className="text-gray-600">Khác</a></p>
          </div>
          <div>
            <h6 className="font-semibold uppercase mb-4">LIÊN HỆ</h6>
            <p className="flex items-center mb-2">
              <FaHome className="mr-2" /> Q.Hà Đông, Hà Nội
            </p>
            <p className="flex items-center mb-2">
              <FaEnvelope className="mr-2" /> hungnguyendecade@gmail.com
            </p>
            <p className="flex items-center mb-2">
              <FaPhone className="mr-2" /> 0325666777
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Footer)

