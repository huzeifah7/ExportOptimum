import React, { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import aboutData from "../Data/About.json";
import Header from "../header&footer/header";
import Footer from "../header&footer/Footer";

const About = () => {
    useEffect(() => {
        ScrollReveal().reveal('.reveal', {
            duration: 1000,
            origin: 'bottom',
            distance: '50px',
            easing: 'ease-in-out',
            reset: false,
        });

        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="relative text-white min-h-screen">
            <Header />
            <div className="absolute inset-0 bg-gray-700 bg-opacity-98"></div>
            <div className="relative">
                <section className="mb-12 items-center justify-center mt-12 max-w-4xl mx-auto reveal">
                    <h1 className="text-4xl font-bold mb-2 uppercase text-gray-100 text-left">
                        {aboutData["Who Are We?"].title}
                    </h1>
                    <p className="text-lg text-orange-300 text-left">
                        {aboutData["Who Are We?"].welcomeMessage}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        <div
                            style={{
                                height: "5px",
                                backgroundColor: "#FF5733",
                                width: "30%",
                                bottom: "5px",
                            }}
                        ></div>
                        <div
                            style={{
                                height: "3px",
                                backgroundColor: "#FF5733",
                                width: "70%",
                                marginTop: "2px",
                            }}
                        ></div>
                    </div>
                    <p className="text-xl text-gray-300 max-w-4xl mx-auto mt-4">
                        {aboutData["Who Are We?"].description}
                    </p>
                    <div className="flex justify-center gap-8 mt-8">
                        {aboutData.images.map((image, index) => (
                            <div
                                key={index}
                                className="w-48 h-48 bg-white shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 reveal"
                            >
                                <img src={image} alt={`Avocado ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </section>
                <section className="mb-12 items-center justify-center mt-12 max-w-4xl mx-auto reveal">
                    <h2 className="text-4xl font-bold text-right uppercase">
                        {aboutData.vision.title}
                    </h2>
                    <p className="text-lg text-[#6d9300] italic text-right">
                        {aboutData.vision.tag}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        <div
                            style={{
                                height: "3px",
                                backgroundColor: "#6d9300",
                                width: "70%",
                                marginTop: "4px",
                            }}
                        ></div>
                        <div
                            style={{
                                height: "7px",
                                backgroundColor: "#6d9300",
                                width: "30%",
                                bottom: "5px",
                            }}
                        ></div>
                    </div>
                    <div className="flex mt-8">
                        <div className="w-1/3 p-4 reveal">
                            <img src="/images/Avocadoo.jpg" alt="Vision Left" className="w-[300px] h-full object-cover shadow-lg" />
                        </div>
                        <div className="w-2/3 p-4 mt-5 reveal">
                            <p className="text-xl text-gray-300">{aboutData.vision.content}</p>
                        </div>
                    </div>
                </section>
                <section className="mb-12 items-center justify-center mt-12 max-w-4xl mx-auto reveal">
                    <h2 className="text-3xl font-bold mb-2 text-left uppercase text-gray-100">
                        {aboutData.mission.title}
                    </h2>
                    <p className="text-lg text-[#ffd34e] italic text-left">
                        {aboutData.mission.tag}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        <div
                            style={{
                                height: "5px",
                                backgroundColor: "#ffd34e",
                                width: "30%",
                                bottom: "5px",
                            }}
                        ></div>
                        <div
                            style={{
                                height: "3px",
                                backgroundColor: "#ffd34e",
                                width: "70%",
                                marginTop: "2px",
                            }}
                        ></div>
                    </div>
                    <div className="flex mt-8">
                        <div className="w-2/3 p-4 reveal">
                            <p className="text-xl text-gray-300">{aboutData.mission.content}</p>
                        </div>
                        <div className="w-1/3 p-4 reveal">
                            <img src="/images/Avocadooo.jpg" alt="Mission Right" className="w-full h-full object-cover shadow-lg" />
                        </div>
                    </div>
                </section>
                <section className="p-8 w-full bg-gradient-to-br from-[#acd629] to-[#6d9300] reveal">
                    <div className="items-center justify-between space-x-8">
                        <h2 className="text-3xl font-bold mb-8 uppercase text-white border-b-2 border-yellow-300 pb-5 text-center">
                            Why You Choose Us?
                        </h2>
                        <div className="flex justify-between items-start">
                            <div className="w-1/3 reveal">
                                <img src="/images/whyimage.jpg" alt="Why Choose Us" className="w-[300px] h-auto object-cover rounded-lg" />
                            </div>
                            <div className="w-2/3 text-left reveal">
                                <ul className="space-y-4">
                                    {aboutData.whyChooseUs.map((item, index) => (
                                        <li key={index} className="pb-4">
                                            <div className="text-gray-700 font-bold text-2xl">
                                                {item.title}:
                                            </div>
                                            <p className="text-white">{item.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
};

export default About;