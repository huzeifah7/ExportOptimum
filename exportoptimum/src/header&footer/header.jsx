import React, { useRef } from 'react'; 
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../EOLogo.png';
import './header.css'
export default function Header() {
  const navRef = useRef();

  const showNav = () => {
    navRef.current.classList.toggle('unique_responsive_nav');
  };

  return (
    <header className="unique_header">
      <Link to="/">
        <img src={Logo} alt="Logo" className="unique_HeaderLogo" width='110'/>
      </Link>
      <nav ref={navRef} className="unique_NavHeader">
        <span className="unique_NavHeader1">
          <Link to="/" className="unique_compo">HOME</Link>
          <Link to="/OurProducts" className="unique_compo">OUR PRODUCTS</Link>
          <Link to="/About" className="unique_compo">ABOUT US</Link>
          <Link to="/Quality" className="unique_compo">QUALITY</Link>
          <Link to="/Blogs" className="unique_compo">BLOGS</Link>
        </span>
        <span className="unique_GetInHeader">
          <Link to="/Contact" className="unique_cssbuttons-io-button1">
            GET IN TOUCH
          </Link>
        </span>
        <button className="unique_nav-btn unique_nav-close-btn" onClick={showNav}>
          <FaTimes />
        </button>
      </nav>
      <button className="unique_nav-btn" onClick={showNav}>
        <FaBars />
      </button>
    </header>
  );
}