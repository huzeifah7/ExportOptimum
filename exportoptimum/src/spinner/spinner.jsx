import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="loader"><span /></div>
        <div className="loader"><span /></div>
        <div className="loader"><i /></div>
        <div className="loader"><i /></div>
        <img src="../EOlogo.png" alt="EO Logo" className="logo" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Set the height to 100% of the viewport height */
  width: 100vw; /* Set the width to 100% of the viewport width */
  position: fixed; /* fix the spinner to the viewport */
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8); /* optional background color to make it cover the whole screen */
  z-index: 9999; /* Ensure it's on top of other content */

  .container {
    position: relative;
    width: 200px; /* Adjust as needed */
    height: 200px; /* Adjust as needed */
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-box-reflect: below 0 linear-gradient(transparent, transparent, #0005);
  }

  .container .loader {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    animation: animate 2s ease-in-out infinite;
  }

  .container .loader:nth-child(2),
  .container .loader:nth-child(4) {
    animation-delay: -0.5s;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg) scale(1);
      filter: hue-rotate(360deg) brightness(1.2);
    }
    50% {
      transform: rotate(180deg) scale(1.1);
      filter: hue-rotate(180deg) brightness(1.5);
    }
    100% {
      transform: rotate(360deg) scale(1);
      filter: hue-rotate(0deg) brightness(1.2);
    }
  }

  .container .loader:nth-child(1)::before,
  .container .loader:nth-child(2)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to top, transparent, rgba(0, 255, 249, 0.5));
    background-size: 100px 180px;
    background-repeat: no-repeat;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  .container .loader i {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 25px;
    background: #00fff9;
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 0 15px #00fff9,
      0 0 35px #00fff9,
      0 0 55px #00fff9,
      0 0 75px #00fff9;
    animation: glow 1.5s infinite alternate;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 10px #00fff9,
        0 0 20px #00fff9;
    }
    100% {
      box-shadow: 0 0 20px #00fff9,
        0 0 40px #00fff9,
        0 0 60px #00fff9;
    }
  }

  .container .loader span {
    position: absolute;
    inset: 20px;
    background: #e8e8e8;
    border-radius: 50%;
    z-index: 1;
  }

  .container .logo {
    position: absolute;
    width: 80px;
    height: 80px;
    z-index: 10;
    animation: logoSpin 4s linear infinite;
  }

  @keyframes logoSpin {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.05);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;

export default Loader;