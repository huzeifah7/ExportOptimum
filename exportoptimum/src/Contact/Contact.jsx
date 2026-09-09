import React, { useState, useEffect } from 'react';
import { InView } from 'react-intersection-observer';
import Header from '../header&footer/header';
import Footer from '../header&footer/Footer';
import './Contact.css';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    subject: '',
    message: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const SendEmail = (e) => {
    e.preventDefault();

    const { fullName, email, country, subject, message } = formData;

    if (!fullName || !email || !country || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }

    emailjs
      .sendForm('service_6fm8f0o', 'template_vwbievm', e.target, '6MH_KK4KcTnc9M-Nh')
      .then(
        (result) => {
          setSuccessMessage('Message sent successfully!');
          setError(null);
          setFormData({
            fullName: '',
            email: '',
            country: '',
            subject: '',
            message: '',
          });
          setIsModalOpen(true);
        },
        (error) => {
          console.error(error.text);
          setError('Failed to send message. Please try again.');
        }
      );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100">
      <Header />
      <div className="contact-container flex flex-col md:flex-row bg-gray-100">
        <div className="imgContactBg"></div>

        <InView triggerOnce>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`form-container md:w-1/2 p-6 ml-2 transition-transform duration-1000 ease-in-out ${
                inView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
              id="Contact"
            >
              <h1 className="text-4xl font-semibold text-left titleContact pt-5 pl-5">
                <span className="letterTitle">G</span>et in <span className="letterTitle">T</span>ouch
              </h1>
              <p className="summa text-3xl text-gray-700 text-left pl-48">Questions? Concerns?</p>
              <p className="text-gray-600 mt-4 ml-8 w-3xl mx-auto">
                Feel free to reach out to the team at Export Optimum; we would be delighted to explore how we can assist you.
              </p>

              <form onSubmit={SendEmail} className="mt-8 max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                {error && <div className="text-red-500">{error}</div>}

                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="5"
                  />

                  <button type="submit" className="w-full mt-4 py-3 bg-[#acd629] text-white font-semibold rounded-lg">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          )}
        </InView>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-6 rounded-lg max-w-sm mx-auto animate-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content text-center">
                <div className="checkmark-icon">
                  <span className="checkmark">✓</span>
                </div>
                <h2 className="text-2xl font-semibold text-center text-green-600 mt-4">Success!</h2>
                <p className="text-center text-gray-800 mt-4">{successMessage}</p>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={closeModal}
                    className="bg-[#acd629] text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        <InView triggerOnce>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`map-container md:w-1/2 p-6 mt-48 transition-opacity duration-1000 ease-in-out ${
                inView ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="map-container relative">
                <div className="map-placeholder"></div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.7520424391584!2d-6.0869577!3d35.0590408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0a35c19587a823%3A0x2fcb600171fc75d9!2sExport%20Optimum%20SARL!5e0!3m2!1sen!2sma!4v1678997611642!5m2!1sen!2sma"
                  width="80%"
                  height="300"
                  style={{ border: 0, boxShadow: '10px 1px 50px rgba(0, 0, 0, 0.5)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative"
                ></iframe>
              </div>
            </div>
          )}
        </InView>
      </div>

      {/* Connect Section */}
      <InView triggerOnce>
        {({ inView, ref }) => (
          <div
            ref={ref}
            className={`connect-section p-6 text-left mt-2 transition-opacity duration-1000 ease-in-out ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 className="text-3xl font-bold text-gray-600">Let's Connect Virtually</h1>
            <p className="text-lg text-gray-700 mt-4">
              Learn more about how Export Optimum can elevate your avocado export needs by connecting face-to-face with our experts today.
            </p>
          </div>
        )}
      </InView>

      {/* Client Section */}
      <InView triggerOnce>
        {({ inView, ref }) => (
          <div
            ref={ref}
            className={`client-section p-6 text-left transition-opacity duration-1000 ease-in-out ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 className="text-4xl font-bold text-gray-600">Client is First</h1>
            <div className="flex flex-col md:flex-row gap-6">
              <p className="text-lg text-gray-700 mt-4">
                At Export Optimum, trust is our priority. We strive to make every customer feel like family, fostering strong relationships and ensuring a collaborative experience that goes beyond being just another company in the industry.
              </p>
              <button
                onClick={() => document.getElementById('Contact').scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 text-lg font-semibold bg-[#acd629] text-white py-2 px-6 rounded-lg w-fit"
              >
                Request a meeting
              </button>
            </div>
          </div>
        )}
      </InView>

      <Footer />
    </div>
  );
};

export default Contact;
