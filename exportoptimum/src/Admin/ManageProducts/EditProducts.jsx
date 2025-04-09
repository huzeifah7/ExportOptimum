import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    MoreDescription: "",
    mainImage: null,
    images: [],
  });
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]); // Initialize as an empty array
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
      setPreviewMainImage(data.mainImage);
      try {
        setPreviewImages(JSON.parse(data.images)); // Parse data.images as JSON
      } catch (error) {
        setPreviewImages([]); // set to empty array if parsing fails.
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "mainImage") {
      setProduct({ ...product, mainImage: e.target.files[0] });
      setPreviewMainImage(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "images") {
      setProduct({ ...product, images: e.target.files });
      setPreviewImages(Array.from(e.target.files).map(file => URL.createObjectURL(file)));
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("MoreDescription", product.MoreDescription);
    if (product.mainImage) {
      formData.append("mainImage", product.mainImage);
    }
    if (product.images) {
      for (let i = 0; i < product.images.length; i++) {
        formData.append("images", product.images[i]);
      }
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate("/Admin/ManageProducts");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-8 mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Edit Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                More Description
              </label>
              <textarea
                name="MoreDescription"
                value={product.MoreDescription}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Main Image
              </label>
              <input
                type="file"
                name="mainImage"
                onChange={handleChange}
                accept="image/*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {previewMainImage && (
                <img
                  src={previewMainImage}
                  alt="Main Image Preview"
                  className="mt-2 max-w-xs"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Images (3)
              </label>
              <input
                type="file"
                name="images"
                onChange={handleChange}
                accept="image/*"
                multiple
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex mt-2">
                {previewImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="max-w-xs mr-2"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;