import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's CSS

const AddBlogs = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: "",
    summary: "",
    category: "",
    text: "", // Quill will update this field with HTML content
    image: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const quillRef = useRef(null); // Ref to store Quill editor

  // Initialize Quill editor on component mount
  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            ["blockquote", "code-block"],
          ],
        },
      });

      // Bind editor content to formData.text
      quill.on("text-change", function () {
        setFormData((prevData) => ({
          ...prevData,
          text: quill.root.innerHTML, // Save HTML content
        }));
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      let imageUrl = null;
      if (formData.image) {
        const imageForm = new FormData();
        imageForm.append("image", formData.image);
        const imageUploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          imageForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrl = imageUploadResponse.data.imageUrl;
      }

      const blogData = {
        ...formData,
        image: imageUrl, // Use the uploaded image URL
      };

      const response = await axios.post(
        "http://localhost:5000/api/blogs",
        blogData
      );

      if (response.status === 200) {
        alert("Blog added successfully!");
        setFormData({
          title: "",
          author: "",
          date: "",
          summary: "",
          category: "",
          text: "",
          image: null,
        });
        navigate("/Admin/ManageBlogs"); // Redirect to manage blogs
      } else {
        alert("Error adding blog.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

        <div className="container mx-auto ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Blog Post
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
          >
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-gray-700 font-medium">
                Author:
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-gray-700 font-medium">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="summary" className="block text-gray-700 font-medium">
                Summary:
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium">
                Category:
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="text" className="block text-gray-700 font-medium">
                Content:
              </label>
              <div
                ref={quillRef}
                className="w-full h-60 border border-gray-300 rounded-md"
              ></div>
            </div>
            <div>
              <label htmlFor="image" className="block text-gray-700 font-medium">
                Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Image Preview"
                    className="max-w-sm h-auto rounded-md"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Blog
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddBlogs;
