import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
import Sidebar from "../Sidebar";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editedBlog, setEditedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const quillRef = useRef(null); // Create a ref for the Quill editor

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      const blogData = response.data;

      if (blogData.date) {
        const date = new Date(blogData.date);
        const formattedDate = date.toISOString().split("T")[0];
        blogData.date = formattedDate;
      }

      setBlog(blogData);
      setEditedBlog(blogData);
    } catch (err) {
      setError("Failed to load blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setSelectedImage(e.target.files[0]);
    } else {
      setEditedBlog({ ...editedBlog, [e.target.name]: e.target.value });
    }
  };

  const handleQuillChange = (value) => {
    setEditedBlog({ ...editedBlog, text: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editedBlog.image;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.imageUrl;
      }

      await axios.put(`http://localhost:5000/api/blogs/${id}`, {
        ...editedBlog,
        image: imageUrl,
      });
      navigate("/Admin/ManageBlogs");
    } catch (err) {
      setError("Failed to update blog. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ease-in-out md:ml-${
          isSidebarCollapsed ? "16" : "56"
        }`}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Blog</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={editedBlog.title || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={editedBlog.author || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={editedBlog.date || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <textarea
                name="summary"
                value={editedBlog.summary || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {selectedImage && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {selectedImage.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={editedBlog.category || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Text
              </label>
              {/* Quill Editor */}
              <div
                ref={quillRef}
                className="w-full h-60 border border-gray-300 rounded-md"
              >
                <ReactQuill
                  value={editedBlog.text || ""}
                  onChange={handleQuillChange}
                  className="w-full h-48"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4  py-2 rounded-md hover:bg-blue-700"
            >
              Update Blog
            </button>
            <button
              onClick={() => navigate("/Admin/ManageBlogs")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 ml-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
