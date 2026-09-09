import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios'; // Import axios

export default function ProductsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]); // State to hold products from the database

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });

    fetchProducts(); // Fetch products from the database

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const extendedProducts =
    products.length < 4
      ? [...products, ...products.slice(0, 4 - products.length)]
      : products;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundColor: '#6d9300',
        backgroundImage: 'linear-gradient(to bottom, #acd629, #6d9300)',
      }}
    >
      <h1
        className="text-5xl font-bold text-[#EECE38] mb-6 text-center"
        style={{ fontFamily: "'Quicksand', sans-serif" }}
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        Sustainable Avocado Farming & Export
      </h1>
      <p
        className="text-lg text-[#fffdde] opacity-85 text-center"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        data-aos="fade-up"
        data-aos-duration="2000"
        data-aos-delay="300"
      >
        We focus on sustainable farming practices, ensuring that our avocados
        are both environmentally friendly and top quality.
      </p>

      <div className="relative w-full max-w-[90%] lg:max-w-[80%]">
        <Swiper
          loop={true}
          direction="horizontal"
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          breakpoints={{
            340: { slidesPerView: 1, spaceBetween: 20 },
            700: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
            1200: { slidesPerView: 3.5, spaceBetween: 80 },
          }}
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Navigation]}
          className="w-full"
        >
          {extendedProducts.map((product, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div
                className="max-w-sm rounded-[5%] overflow-hidden shadow-lg bg-white pb-3 mt-3 "
                data-aos="zoom-in"
                data-aos-duration="1500"
              >
                <img
                  className="w-full h-48 object-cover  transition-transform duration-500 ease-out hover:scale-105"
                  src={`http://localhost:5000${product.mainImage}`} // Updated image path
                  alt={product.title}
                />
                <div className="px-6 py-3">
                  <h2 className="font-semibold text-xl text-gray-800">
                    {product.title}
                  </h2>
                  <p
                    className="text-gray-600 text-sm mt-2 overflow-hidden h-8"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.description}
                  </p>
                </div>
                <div className="px-6 py-2">
                  <Link
                    to={`/OurProducts/${product.id}`}
                    className="text-green-500 flex items-center text-lg font-semibold"
                  >
                    See More
                    <span className="ml-2">&#8594;</span>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {!isMobile && (
          <>
            <div
              className="custom-prev flex items-center justify-center w-[45px] h-[45px] bg-[#fffdde] text-[#6d9300] rounded-full absolute left-[-70px] top-[50%] transform -translate-y-1/2 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
              style={{ fontSize: '1.5rem' }}
            >
              &#x276E;
            </div>
            <div
              className="custom-next flex items-center justify-center w-[45px] h-[45px] bg-[#fffdde] text-[#6d9300] rounded-full absolute right-[-70px] top-[50%] transform -translate-y-1/2 cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300"
              style={{ fontSize: '1.5rem' }}
            >
              &#x276F;
            </div>
          </>
        )}

        {isMobile && (
          <div className="text-center mt-6">
            <button
              className="bg-[#6d9300] text-[#fffdde] py-2 px-4 rounded-full text-lg font-semibold"
              onClick={() => (window.location.href = '/products')}
            >
              See All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}