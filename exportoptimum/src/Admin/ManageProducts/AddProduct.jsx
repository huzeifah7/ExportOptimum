import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "leaflet";
import "leaflet/dist/leaflet.css";

const AddProducts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moreDescription, setMoreDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    if (e.target.name === "mainImage") {
      setMainImage(e.target.files[0]);
    } else {
      const uploadedImages = Array.from(e.target.files);

      if (images.length + uploadedImages.length > 3) {
        setError("You can only upload a maximum of 3 additional images.");
        return;
      }

      setImages([...images, ...uploadedImages]);
    }
  };

  const handleImageDelete = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !moreDescription || !mainImage || images.length !== 3) {
      setError("Please fill in all fields and upload exactly 3 additional images.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("MoreDescription", moreDescription);
    formData.append("mainImage", mainImage);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/Admin/ManageProducts");
        }, 3000);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ease-in-out  `}>
        <div className="container mx-auto">
          <div className="w-full font-bold mb-4 text-2xl text-gray-800">Add New Product</div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700 mb-1">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block font-medium text-gray-700 mb-1">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label htmlFor="moreDescription" className="block font-medium text-gray-700 mb-1">More Description:</label>
              <textarea
                id="moreDescription"
                value={moreDescription}
                onChange={(e) => setMoreDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                rows="4"
                required
              />
            </div>

            <div>
              <label htmlFor="mainImage" className="block font-medium text-gray-700 mb-1">Main Image:</label>
              <input
                type="file"
                id="mainImage"
                name="mainImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
              {mainImage && (
                <div className="mt-2">
                  <img src={URL.createObjectURL(mainImage)} alt="Main Preview" className="max-w-sm h-auto rounded-md" />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="images" className="block font-medium text-gray-700 mb-1">Additional Images (Up to 3):</label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
              />
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap -mx-2">
                  {images.map((image, index) => (
                    <div key={index} className="px-2 py-2 relative">
                      <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} className="max-w-sm h-auto rounded-md" />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full text-xs focus:outline-none"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200"
            >
              Add Product
            </button>
          </form>

          {success && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-600 mb-2">Product added successfully!</h2>
              <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "300px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                  <Popup>🎉 Product added successfully!</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProducts;