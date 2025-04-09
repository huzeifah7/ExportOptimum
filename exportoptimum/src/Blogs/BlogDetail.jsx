import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../header&footer/header";
import Footer from "../header&footer/Footer";
import DOMPurify from "dompurify"; // Add DOMPurify for sanitizing

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const blogResponse = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(blogResponse.data);

        const allBlogsResponse = await axios.get("http://localhost:5000/api/blogs");
        const allBlogs = allBlogsResponse.data;

        // Get the latest 3 blogs (excluding the current blog)
        const filteredLatestBlogs = allBlogs
          .filter((b) => b.id !== parseInt(id))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setLatestBlogs(filteredLatestBlogs);

      } catch (err) {
        setError("Failed to load blog details. Please try again.");
        console.error("Error fetching blog details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/subscribe", { email });
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-semibold text-red-600 mt-10">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center text-xl font-semibold text-red-600 mt-10">Blog not found!</div>;
  }

  // Sanitize the blog text using DOMPurify to avoid XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(blog.text);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 py-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
              <img
                className="w-full h-96 object-cover rounded-lg mb-8"
                src={blog.image}
                alt={blog.title}
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="text-sm text-gray-600 mb-8">
                <span>By {blog.author}</span> • <span>{blog.date}</span> • <span>{blog.category}</span>
              </div>
              <div className="prose prose-lg text-gray-700">
                {/* Render sanitized HTML content */}
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
              </div>
            </div>

            <div className="lg:w-1/3">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Related Blogs</h3>
              <div className="space-y-4">
                {latestBlogs.map((latestBlog) => (
                  <div key={latestBlog.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <img
                      className="w-full h-32 object-cover"
                      src={latestBlog.image}
                      alt={latestBlog.title}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="p-4">
                      <Link
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        to={`/blogs/${latestBlog.id}`}
                      >
                        {latestBlog.title}
                      </Link>
                      <p className="text-gray-600 text-xs mt-2">{latestBlog.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 mt-16 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enjoyed this article?</h2>
            <p className="text-lg text-gray-600 mb-6">Subscribe to our newsletter for more insightful content.</p>
            <form onSubmit={handleSubmit} className="flex justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
