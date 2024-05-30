import React, { memo } from 'react'
import ads1 from '../../assets/slide1.png'
import ads2 from '../../assets/slide2.png'
import Slider from 'react-slick'


const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000 
};
const Banner = () => {
  const banners = [ads1, ads2]
  return (
    <div className='w-full'>
      <Slider className='custum-slider' {...settings}>
        {banners.map((el, index) => (
          <img
           key={index}
            src={el}
            alt='banner'
            className='w-full object-cover rounded-md'
          />
        ))}
      </Slider>

    </div>
  )
}

export default memo(Banner)