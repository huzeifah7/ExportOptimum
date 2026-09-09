import React from 'react';
import './TrackShipment.css';

export default function TrackShipment() {

  return (
    <div className="track-shipment-container">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="/images/TruckShippement.mp4" type="video/mp4" />
      </video>

      {/* Content Section */}
      <div className="contentTrack">
        <h1 className="titleTrack">Track Your Shipment Now</h1>
        <p className="descriptionTrack">
          Stay updated on your shipment status in real-time. Use our easy-to-use tracking feature
          and get all the information you need at your fingertips. Reliability, transparency, and
          efficiency are just a click away.
        </p>
        <button className="buttonTrack" onClick={() => window.location.href = "https://www.sensiwatch.com"}>
  Track Now
  <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
    <path
      clipRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
      fill-rule="evenodd"
    ></path>
  </svg>
</button>

        
      </div>

      {/* Top-right Image */}
      <img src="/images/sensiwatchLogo.png" alt="Top-right Decoration" className="top-right-image" />
    </div>
  );
}
