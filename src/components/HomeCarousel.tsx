import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const carouselItems = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
    alt: 'Diverse team collaboration'
  },
  {
    type: 'image',
    src: 'https://cy-747263170.imgix.net/213213123.png',
    alt: 'Modern gym facilities'
  },
  {
    type: 'image',
    src: 'https://cy-747263170.imgix.net/11111.png',
    alt: 'Professional workout equipment'
  },
  {
    type: 'image',
    src: 'https://cy-747263170.imgix.net/7455775.png',
    alt: 'Quality dining options'
  },
  {
    type: 'image',
    src: 'https://cy-747263170.imgix.net/564122246.png',
    alt: 'Healthy meal options'
  },
  {
    type: 'image',
    src: 'https://cy-747263170.imgix.net/4524242452.png',
    alt: 'Staff accommodation'
  },
  {
    type: 'image',
    src: 'https://cy-747263170.imgix.net/11111.png',
    alt: 'Recreational facilities'
  }
];

export function HomeCarousel() {
  return (
    <div className="relative w-full h-[300px] md:h-[500px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {carouselItems.map((item, index) => (
          <SwiperSlide key={index} className="relative">
            {item.type === 'image' ? (
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={item.src}
                title={item.title}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                frameBorder="0"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}