import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderP from "../header&footer/header";
import Footer from "../header&footer/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './OurProducts.css';
import Spinner from '../spinner/spinner'; // Import your Spinner component

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching products:", error);
                setIsLoading(false); // Set loading to false even on error
            }
        };

        fetchData();
        AOS.init();
        window.scrollTo(0, 0); // Scroll to top on component mount
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <HeaderP />
            <div className="bg-gray-50 py-10 Products">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 titt">OUR PRODUCE</h1>
                    <p className="text-gray-600 mt-4 max-w-5xl mx-auto">
                        Together with our dedicated growers, we guarantee that only the
                        healthiest avocados are carefully harvested and packed, adhering to
                        the highest standards of food quality and exceptional taste.
                    </p>
                </div>

                <div className="flex justify-center items-center py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col h-full overflow-hidden"
                                data-aos="fade-up"
                            >
                                <div className="relative h-64 w-full">
                                    <img
                                        src={product.mainImage}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-6 flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                                        <p className="text-gray-600 text-base mb-4 line-clamp-3">{product.description}</p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate(`./${product.id}`)}
                                            className="w-full bg-green-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Products;