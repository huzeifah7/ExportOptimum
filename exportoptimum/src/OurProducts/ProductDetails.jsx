import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Image, ConfigProvider } from "antd";
import HeaderP from "../header&footer/header";
import Footer from "../header&footer/Footer";
import Spinner from "../spinner/spinner";
import "@fortawesome/fontawesome-free/css/all.css";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [otherProducts, setOtherProducts] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error state for error handling

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!productResponse.ok) {
                    throw new Error(`HTTP error! Status: ${productResponse.status}`);
                }
                const productData = await productResponse.json();
                setProduct(productData);

                const allProductsResponse = await fetch("http://localhost:5000/api/products");
                if (!allProductsResponse.ok) {
                    throw new Error(`HTTP error! Status: ${allProductsResponse.status}`);
                }
                const allProductsData = await allProductsResponse.json();
                setOtherProducts(allProductsData.filter((item) => item.id !== parseInt(id, 10)).slice(0, 3)); // Limit to 3 products

                setLoading(false);
                window.scrollTo(0, 0); // Scroll to top after data is fetched
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError(error.message); // Set error message in state
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (error && !loading) {
        return (
            <div>
                <HeaderP />
                <div className="text-center py-20">
                    <p className="text-red-500 text-lg">{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product && !loading) {
        return (
            <div>
                <HeaderP />
                <div className="text-center py-20">
                    <p className="text-red-500 text-lg">Product not found!</p>
                </div>
                <Footer />
            </div>
        );
    }

    // Handle the images and parse JSON safely if needed
    let images = [];
    if (product && product.images) {
        try {
            // Check if images are a string that needs to be parsed or an array
            images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
        } catch (e) {
            console.error("Error parsing product images:", e);
            images = []; // Fallback to empty array in case of error
        }
    }

    return (
        <ConfigProvider>
            <div>
                <HeaderP />
                <div className="bg-gray-100 min-h-screen py-10">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                            {/* Main Content Section */}
                            <div className="lg:w-8/12 bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Main Image */}
                                    <div className="md:w-1/2 p-5">
                                        {product.mainImage && (
                                            <img
                                                src={product.mainImage}
                                                alt={product.title}
                                                className="w-full h-64 object-cover rounded-lg shadow-md"
                                            />
                                        )}
                                        <div className="mt-6">
                                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                                More Images
                                            </h2>
                                            <div className="grid grid-cols-3 gap-4">
                                                <Image.PreviewGroup>
                                                    {images.length > 0 ? (
                                                        images.map((image, index) => (
                                                            <Image
                                                                key={index}
                                                                src={image}
                                                                alt={`View ${index + 1}`}
                                                                className="w-full h-auto object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
                                                            />
                                                        ))
                                                    ) : (
                                                        <p>No additional images available</p>
                                                    )}
                                                </Image.PreviewGroup>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="md:w-1/2 p-5 flex flex-col justify-center">
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                            {product.title}
                                        </h1>
                                        <p className="text-gray-600 text-lg mt-2">
                                            {product.description}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                                            {product.MoreDescription}
                                        </p>

                                        {/* Feature Icons */}
                                        <div className="mt-6 text-center space-x-8 flex justify-center">
                                            <div className="flex flex-col items-center">
                                                <i className="fas fa-award text-3xl text-green-600 mb-2"></i>
                                                <span className="text-sm text-gray-700 font-bold">
                                                    High Quality
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <i className="fas fa-leaf text-3xl text-green-600 mb-2"></i>
                                                <span className="text-sm text-gray-700 font-bold">
                                                    Natural Product <br /> without GMO
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <i className="fas fa-tags text-3xl text-green-600 mb-2"></i>
                                                <span className="text-sm text-gray-700 font-bold">
                                                    Beneficial Features
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contact Button */}
                                        <button
                                            className="mt-6 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-2 rounded-full text-sm hover:from-green-600 hover:to-green-800 shadow-md transition"
                                            onClick={() => navigate("/Contact")}
                                        >
                                            Contact Us
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Section */}
                            <div className="bg-white rounded-lg shadow-lg p-10 sticky top-32">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-5">Related Products</h2>
                                <ul className="space-y-2">
                                    {otherProducts.map((otherProduct) => (
                                        <li key={otherProduct.id} className="flex items-center gap-2 border-b pb-8 last:border-b-0">
                                            <div className="overflow-hidden rounded-2xl shadow-md">
                                                <img
                                                    src={otherProduct.mainImage}
                                                    alt={otherProduct.title}
                                                    className="w-24 h-20 object-cover transition-transform transform hover:scale-105"
                                                />
                                            </div>
                                            <div>
                                                <Link
                                                    to={`/OurProducts/${otherProduct.id}`}
                                                    className="text-blue-600 hover:underline font-semibold text-lg transition-colors duration-300"
                                                >
                                                    {otherProduct.title}
                                                </Link>
                                                <p className="text-gray-500 text-sm mt-2">{otherProduct.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                    )}
                </div>
                <Footer />
            </div>
        </ConfigProvider>
    );
};

export default ProductDetails;
