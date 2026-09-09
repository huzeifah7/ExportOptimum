import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css'; // CSS for styling; 
import descriptionData from '../../Data/Description.json';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles

const AboutSection = () => {
  // Extract the 'ShortAbout' description from JSON
  const shortAbout = descriptionData.find(item => item.Name === "ShortAbout");

  useEffect(() => {
    AOS.init(); // Initialize AOS when component mounts
  }, []);

  return (
    <section className="about-section">
      {/* Left Content */}
      <div className="about-content" data-aos="fade-up" data-aos-duration="1500">
        <h2 data-aos="fade-up" data-aos-duration="1500">
          ABOUT <div className="SocieteName">EXPORT OPTIMUM</div>
        </h2>
        <p data-aos="fade-up" data-aos-duration="2000" data-aos-delay="300">
          {shortAbout ? shortAbout.Description : "Description not available."}
        </p>
        <div className="read-more-btn" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="300">
          <Link to="/About">Read More ...</Link>
        </div>

        <div className="about-background" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="400"></div>
      </div>
    </section>
  );
};

export default AboutSection;
