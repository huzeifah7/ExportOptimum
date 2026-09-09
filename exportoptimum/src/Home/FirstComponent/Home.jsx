import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles

export default function Home() {
  useEffect(() => {
    AOS.init(); // Initialize AOS when component mounts
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/images/homevideo.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 space-y-8 text-center">
        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          data-aos="fade-up" // Added AOS animation
          data-aos-duration="1500" // Set animation duration
        >
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
            EXPORT
          </span>{" "}
          <span className="text-gray-100">OPTIMUM</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl"
          data-aos="fade-up" // Added AOS animation
          data-aos-duration="2000" // Set animation duration
          data-aos-delay="300" // Added delay for smoother effect
        >
          Delivering premium avocados with unmatched quality, ensuring freshness
          and exceptional flavor worldwide.
        </p>

        {/* Call-to-Action */}
        <div className="flex justify-center gap-4">
          <Link
            to="/About"
            className="px-8 py-3 bg-yellow-500 text-gray-900 font-medium text-lg rounded-lg shadow-lg hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
            data-aos="fade-up" // Added AOS animation
            data-aos-duration="2500" // Set animation duration
            data-aos-delay="500" // Added delay for smooth transition
          >
            Learn More
          </Link>
          <Link
            to="/Contact"
            className="px-8 py-3 bg-gray-800 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all duration-300"
            data-aos="fade-up" // Added AOS animation
            data-aos-duration="2500" // Set animation duration
            data-aos-delay="700" // Added delay
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
