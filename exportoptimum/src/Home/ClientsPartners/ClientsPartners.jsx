import React, { useEffect } from "react";
import clients from "../../Data/Clients.json";
import AOS from "aos";
import "aos/dist/aos.css";
import { v4 as uuidv4 } from 'uuid'; // Import uuid v4

const OurClients = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    return (
        <div className="bg-gray-100 py-10">
            <div className="text-center mb-8 mt-5">
                <h1 className="text-5xl font-bold text-gray-800" data-aos="fade-up" data-aos-delay="200">
                    Our Clients
                </h1>
                <h3 className="text-xl text-gray-600 mt-2" data-aos="fade-up" data-aos-delay="400">
                    We proudly collaborate with the following brands
                </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-3">
                {clients.map((client) => (
                    <div
                        key={uuidv4()} // Generate a unique key using uuid
                        className="w-44 h-44 p-4 flex items-center justify-center mt-5"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                    >
                        <img
                            src={`/Clients&PartnersImages/${client.client}`}
                            alt={`Client: ${client.name}`}
                            className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OurClients;