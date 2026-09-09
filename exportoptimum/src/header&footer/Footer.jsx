import React from "react";
import logo from "../EOLogo.png"; // Replace with the correct path to your logo
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"; // Import the icons
import DataInfo from "../Data/ContactInfo.json"; // Ensure this JSON file is correctly structured and accessible

export default function Footer() {
  return (
    <footer
      className="footer-container text-[#fffdde]"
      style={{
        backgroundColor: "#232323",
        padding: "40px 20px",
        fontFamily: '"Roboto", serif',
      }}
    >
      {/* Footer Top Section */}
      <div className="footer-top grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        {/* Logo and Company Info */}
        <div className="footer-logo text-center md:text-left">
          <img
            src={logo}
            alt="Export Optimum Logo"
            className="w-[160px] mb-4 mx-auto md:ml-[0]"
          />
          <p className="text-sm opacity-80 leading-relaxed px-4 md:px-0">
            Your trusted partner in avocado farming and export. We are committed
            to quality, sustainability, and excellence in every step of our
            journey.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links text-center md:text-left">
          <h2 className="text-xl font-semibold text-[#EECE38] mb-4">
            Quick Links
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/OurProducts" className="hover:underline">
                Our Products
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/sustainability" className="hover:underline">
                Sustainability
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-contact text-center md:text-left ml-[-80px]">
          <h2 className="text-xl font-semibold text-[#EECE38] mb-4">
            Contact Us
          </h2>
          <ul className="space-y-2 ">
            <li>
              Email:{" "}
              <a
                href={`mailto:${DataInfo.Email}`}
                className="hover:underline"
              >
                {DataInfo.Email}
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href={`tel:${DataInfo.Tel}`}
                className="hover:underline"
              >
                {DataInfo.Tel}
              </a>
            </li>
            <li>Address: {DataInfo.Adress}</li>
          </ul>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="flex justify-center space-x-6 mt-8">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#EECE38] transition-colors duration-300"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#EECE38] transition-colors duration-300"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#EECE38] transition-colors duration-300"
        >
          <FaLinkedinIn size={20} />
        </a>
      </div>

      {/* Footer Bottom Section */}
      <div
        className="footer-bottom text-center border-t border-[#444] mt-8 pt-4 "
        style={{ fontSize: "0.875rem", opacity: 0.7 }}
      >
        <p>
          &copy; {new Date().getFullYear()} EXPORT OPTIMUM. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
