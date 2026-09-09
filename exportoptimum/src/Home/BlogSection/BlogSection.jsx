import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import AOS from "aos";
import "aos/dist/aos.css";

const BlogSection = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        const sortedBlogs = response.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7);
        setLatestBlogs(sortedBlogs);
      } catch (err) {
        setError("Failed to load blogs. Please try again.");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="blog-section bg-gray-50 px-6 py-16">
      <h2
        className="text-4xl font-bold text-center text-blue-600 mb-10"
        data-aos="fade-up"
      >
        Latest Blogs
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="blog-swiper"
      >
        {latestBlogs.map((blog, index) => (
          <SwiperSlide key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              <div
                className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div
                  className="h-64 w-full bg-cover bg-center rounded-t-lg relative"
                  style={{
                    backgroundImage: `url(${blog.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70"></div>
                </div>

                <div className="p-6 bg-white rounded-b-lg">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">{blog.summary}</p>
                  <div className="flex items-center justify-between text-gray-600 text-xs">
                    <span className="font-bold text-gray-800">
                      By {blog.author}
                    </span>
                    <span className="italic">{blog.date}</span>
                  </div>
                  <button className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogSection;