import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditKeyFigures = () => {
  const [keyFigures, setKeyFigures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKeyFigures();
  }, []);

  const fetchKeyFigures = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/keyfigures");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("📊 Key Figures Fetched from Server:", data);
      setKeyFigures(data);
    } catch (error) {
      console.error("❌ Error fetching key figures:", error);
    }
  };

  const handleChange = (id, value) => {
    setKeyFigures((prevKeyFigures) =>
      prevKeyFigures.map((kf) =>
        kf.id === id ? { ...kf, value: Number(value) } : kf
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submitting updates...");

    try {
      const updateResponses = await Promise.all(
        keyFigures.map(async (kf) => {
          console.log(`📡 Sending Update: ID ${kf.id}, Value: ${kf.value}`);

          const response = await fetch(
            `http://localhost:5000/api/keyfigures/${kf.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ value: Number(kf.value) }),
            }
          );

          if (!response.ok) {
            throw new Error(`❌ Failed to update ID ${kf.id}: ${response.status}`);
          }

          const updatedData = await response.json();
          console.log(`✅ Server Response for ID ${kf.id}:`, updatedData);

          return updatedData;
        })
      );

      console.log("✅ All key figures updated successfully:", updateResponses);

      setKeyFigures(updateResponses);

      alert("All key figures updated successfully");
    } catch (error) {
      console.error("❌ Error updating key figures:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">


      <div className="flex-1 p-4 md:p-8 mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Edit Key Figures
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {keyFigures.map((kf) => (
                <div
                  key={kf.id}
                  className="p-4 bg-gray-50 rounded-xl shadow-md flex flex-col items-center"
                >
                  <h2 className="text-lg font-semibold text-gray-700 text-center">
                    {kf.description}
                  </h2>
                  <input
                    type="number"
                    value={kf.value}
                    onChange={(e) => handleChange(kf.id, e.target.value)}
                    className="w-full text-center text-lg px-4 py-2 mt-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Update All
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditKeyFigures;