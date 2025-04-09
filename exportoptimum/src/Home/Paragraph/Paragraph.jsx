import React, { useEffect } from "react";
import "./Paragraph.css";
import AOS from 'aos';  // Import AOS
import 'aos/dist/aos.css';  // Import AOS styles

export default function Paragraph() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: 'ease-in-out', // Animation easing
      once: true, // Animation triggers only once
    });
  }, []);

  return (
    <div>
      {/* Paragraph Section */}
      <div className="section-container">
        {/* Image above */}
        <span className="ImageAbove" data-aos="fade-down" data-aos-delay="300"></span>

        <h1 className="section-title" data-aos="fade-up" data-aos-delay="300">
          FRESH MOROCCAN FRUITS ALL ROUND
        </h1>

        <p
          className="section-description"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          ExportOptimum is your trusted partner for premium-quality avocados and a wide range of
          farm-fresh fruits sourced from Morocco. We specialize in processing and exporting
          top-notch fruits to Europe and other global markets, leveraging innovative technology, 
          strict quality standards, and excellent manufacturing practices. Our dedicated team 
          collaborates with Moroccan farmers to ensure the delivery of high-quality, flavorful 
          fruits to our valued clients worldwide. Among our esteemed partners are major retailers, 
          independent fruit outlets, wholesalers, and the food service industry.
        </p>

        {/* Image below */}
        <span className="ImageBelowP" data-aos="fade-up" data-aos-delay="900"></span>
      </div>
    </div>
  );
}
