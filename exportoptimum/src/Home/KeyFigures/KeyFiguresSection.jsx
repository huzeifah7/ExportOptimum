import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import "./KeyFiguresSection.css";

const KeyFiguresSection = () => {
  const [keyFigures, setKeyFigures] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
    fetchKeyFigures();
  }, []);

  const fetchKeyFigures = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/keyfigures");
      setKeyFigures(response.data);
    } catch (error) {
      console.error("Error fetching key figures:", error);
    }
  };

  const formatValueWithSuffix = (value, type) => {
    if (type === "tons") {
      if (value >= 1000000) return { formattedValue: value / 1000000, suffix: "M" };
      if (value >= 1000) return { formattedValue: value / 1000, suffix: "K" };
    } else if (type === "employee" || type === "customer") {
      const roundedValue = Math.floor(value / 10) * 10;
      return { formattedValue: roundedValue, suffix: value % 10 === 0 ? "" : "+" };
    }
    return { formattedValue: value, suffix: "" };
  };

  return (
    <div className="key-figures-container">
      <div className="key-figures-header" data-aos="fade-up">
        <p className="key-figures-title">Key figures</p>
        <h2 className="key-figures-heading" data-aos="fade-up" data-aos-delay="300">
          Leading the export of <br />
          Moroccan Avocados
        </h2>
      </div>

      <div className="key-figures-stats">
        {keyFigures.map((item) => {
          const { formattedValue, suffix } = formatValueWithSuffix(item.value, item.type);
          return (
            <div key={item.id} className="stat-card" data-aos="zoom-in" data-aos-delay="300">
              <motion.h2
                className="stat-value"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.span
                  initial={{ count: 0 }}
                  animate={{ count: formattedValue }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  {Math.round(formattedValue)}
                </motion.span>
                <span className="stat-suffix">{suffix}</span>
              </motion.h2>
              <p className="stat-description">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyFiguresSection;
