import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header&footer/header";
import Footer from "../header&footer/Footer";

const BLOGS_PER_PAGE = 9;

const Blogs = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsData, setBlogsData] = useState([]); // State to hold blogs from the database
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogsData(response.data);
      } catch (err) {
        setError("Failed to load blogs. Please try again later.");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Sort blogsData in reverse chronological order (newest first)
  const sortedBlogs = useMemo(
    () => [...blogsData].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [blogsData]
  );

  // Calculate total pages and current blogs using useMemo
  const totalPages = useMemo(
    () => Math.ceil(sortedBlogs.length / BLOGS_PER_PAGE),
    [sortedBlogs.length]
  );
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    return sortedBlogs.slice(startIndex, endIndex);
  }, [currentPage, sortedBlogs]);

  const handleCardClick = (id) => {
    navigate(`/Blogs/${id}`);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-avocado-light min-h-screen font-sans">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-avocado-dark mb-12 font-serif">
          Our Latest Blogs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onClick={() => handleCardClick(blog.id)}
            />
          ))}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageClick={handlePageClick}
        />
      </div>
      <Footer />
    </div>
  );
};

const BlogCard = ({ blog, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
    onClick={onClick}
  >
    <img className="w-full h-48 object-cover" src={blog.image} alt={blog.title} />
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="bg-avocado-light text-avocado-dark text-sm font-medium px-3 py-1 rounded-full font-sans">
          {blog.category}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-avocado-dark mb-2 font-serif">
        {blog.title}
      </h2>
      <p className="text-gray-600 line-clamp-3 font-sans">{blog.summary}</p>
      <div className="mt-4 flex items-center">
        <span className="text-sm text-avocado-dark hover:text-avocado-light transition-colors font-sans">
          Read more →
        </span>
      </div>
    </div>
  </div>
);

const Pagination = ({ totalPages, currentPage, onPageClick }) => (
  <div className="flex justify-center mt-12 space-x-3 font-sans">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        className={`px-5 py-2 rounded-lg text-lg font-semibold transition-all ${
          currentPage === index + 1
            ? "bg-avocado-dark text-white"
            : "bg-avocado-light text-avocado-dark"
        } hover:bg-avocado-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-avocado-dark focus:ring-opacity-50`}
        onClick={() => onPageClick(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default Blogs;