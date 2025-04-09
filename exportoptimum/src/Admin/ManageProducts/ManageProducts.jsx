import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchProducts(); // Refresh products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

    const handleEdit = (id) => {
        navigate(`/Admin/EditProduct/${id}`);
    };

  return (
    <div className="flex min-h-screen bg-gray-100">


      <div className="flex-1 p-4 md:p-8 mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Manage Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-gray-50 rounded-xl shadow-md flex flex-col"
              >
                <img
                  src={product.mainImage}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between mt-auto">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;