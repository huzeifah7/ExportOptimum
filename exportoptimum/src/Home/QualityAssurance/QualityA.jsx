import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Assurance = () => {
    const [paragraph, setParagraph] = useState(null);
    const [assurances, setAssurances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const paragraphResponse = await axios.get("http://localhost:5000/api/quality-assurance-paragraph");
                setParagraph(paragraphResponse.data[0]);

                const assurancesResponse = await axios.get("http://localhost:5000/api/assurances");
                setAssurances(assurancesResponse.data);
            } catch (err) {
                setError(err);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!paragraph) return <p>No paragraph data available.</p>;

    return (
        <div className="flex flex-col md:flex-row items-center gap-10 p-6 bg-gray-100">
            {/* Image Section */}
            <div
                className="w-full md:w-[350px] h-[400px] bg-cover bg-center rounded-lg"
                style={{ backgroundImage: "url('/images/QualityEO.jpg')" }}
            ></div>

            {/* Content Section */}
            <div className="w-full md:w-2/3 flex flex-col">
                {/* Title */}
                <h2 className="text-4xl font-bold text-[#EECE38] mb-4 text-center ">
                    Quality Assurance
                </h2>

                {/* Description */}
                {paragraph.description && (
                    <p className="text-gray-700 text-lg mb-6 text-center">{paragraph.description}</p>
                )}

                {/* Swiper Section */}
                <Swiper
                    modules={[Navigation]}
                    navigation
                    pagination={{
                        clickable: true,
                    }}
                    spaceBetween={20}
                    slidesPerView={3}
                    loop={true}
                    className="w-full custom-swiper"
                >
                    {assurances.map((assurance) => (
                        <SwiperSlide
                            key={assurance.idAssurance}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Assurance Image */}
                            <img
                                src={`/AssuranceImages/${assurance.AssuranceImage}`}
                                alt={assurance.AssuranceName}
                                className="w-[120px] h-[120px] object-contain mb-2 sm:ml-20"
                            />

                            {/* Assurance Name */}
                            <p className="text-sm font-medium text-gray-600">
                                {assurance.AssuranceName}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Assurance;