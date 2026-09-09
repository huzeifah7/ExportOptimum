import React, { Suspense, useState, useEffect } from 'react';
import Spinner from '../spinner/spinner';
import Header from '../header&footer/header';
import Footer from '../header&footer/Footer';

import Home from './FirstComponent/Home';
import QualityA from './QualityAssurance/QualityA';
import KeyFiguresSection from './KeyFigures/KeyFiguresSection';
import AboutSection from './AboutSection/AboutSection';
import Paragraph from './Paragraph/Paragraph';
import TrackShipment from './TrackShipment/TrackShipment';
import BlogSection from './BlogSection/BlogSection';
import ProductsSection from './ProductSection/ProductsSection';
import ClientsPartners from './ClientsPartners/ClientsPartners';

// Create a component wrapper with loaded state
const LoadedContent = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading completion (replace with actual loading logic)
    const simulateLoad = () => {
      setIsLoaded(true);
    };

    // Example of simulating loading completion after all images are loaded
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;

    const imageLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === images.length) {
        simulateLoad();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        imageLoaded();
      } else {
        img.onload = imageLoaded;
        img.onerror = imageLoaded; // Handle image loading errors as well
      }
    });

    // If no images are present, simulate load immediately
    if (images.length === 0) {
      simulateLoad();
    }
  }, []);

  if (!isLoaded) {
    return <Spinner />;
  }

  return children;
};

export default function Index() {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <LoadedContent>
          <Header />
          <Home />
          <AboutSection />
          <QualityA />
          <ProductsSection />
          <KeyFiguresSection />
          <Paragraph />
          <ClientsPartners />
          <TrackShipment />
          <BlogSection />
          <Footer />
        </LoadedContent>
      </Suspense>
    </div>
  );
}