import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import data from '../Data/Quality.json';
import Header from '../header&footer/header';
import Spinner from '../spinner/spinner';
import Footer from '../header&footer/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Quality.css';
import axios from 'axios';

const CertificationCarousel = ({ assurances }) => {
    return (
        <div className="certification-carousel">
            <Marquee gradient={false} speed={30} pauseOnHover>
                {assurances.map((assurance) => (
                    <div key={assurance.idAssurance} className="carousel-item px-20">
                        <img
                            src={`/AssuranceImages/${assurance.AssuranceImage}`}
                            alt={assurance.AssuranceName}
                            className="carousel-image w-36 h-auto rounded-lg object-contain shadow-md transition-transform duration-300 hover:scale-105 mr-4" // Minimized width (w-32)
                            onError={(e) => (e.target.src = '/AssuranceImages/GLOBALGAP.png')}
                            
                        />
                        
                    </div>
                ))}
            </Marquee>
        </div>
    );
};



const Quality = () => {
    const [qualityData, setQualityData] = useState(null);
    const [assurances, setAssurances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assurancesResponse = await axios.get('http://localhost:5000/api/assurances');
                setAssurances(assurancesResponse.data);
                setQualityData(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching data', err);
                setLoading(false);
            }
        };

        fetchData();
        AOS.init();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <Header />
            <div className="p-6 bg-gray-100">
                <section data-aos="fade-up" className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600 uppercase">{qualityData.title}</h1>
                    <p className="mt-4 text-lg text-gray-700 m-12">{qualityData.introduction}</p>
                </section>

                <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
                    {qualityData.sections.map((section, index) => (
                        <div key={index} className="quality-card bg-white p-6 shadow-lg rounded-lg">
                            <h2 className="text-2xl font-semibold text-blue-500">{section.title}</h2>
                            <p className="mt-2 text-gray-600">{section.content}</p>
                            <img
                                src={qualityData.visuals[index]}
                                alt={section.title}
                                className="mt-4 w-full h-64 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </section>

                <section className="mt-12" data-aos="fade-up">
                    <h3 className="text-4xl font-semibold text-blue-500 text-center pb-5">Certifications</h3>
                    <CertificationCarousel assurances={assurances} />
                </section>

                <section className="sustainability-section mt-12 bg-gray-50 p-8 rounded-lg shadow-lg" data-aos="fade-up">
                    <h3 className="text-2xl font-semibold text-green-600">{qualityData.sustainability.title}</h3>
                    <p className="mt-2 text-gray-600">{qualityData.sustainability.content}</p>
                </section>

                <section className="mt-12 text-center" data-aos="fade-up">
                    <h3 className="text-2xl font-semibold text-blue-600">{qualityData.callToAction.title}</h3>
                    <p className="mt-2 text-lg text-gray-700">{qualityData.callToAction.content}</p>
                    <div className="cta-button mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg">
                        <Link to="/Contact">Contact Us</Link>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Quality;
