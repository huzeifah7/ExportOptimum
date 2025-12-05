import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showBlogsDropdown, setShowBlogsDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/Login', { replace: true });
  };

  const toggleProductsDropdown = () => setShowProductsDropdown(!showProductsDropdown);
  const toggleBlogsDropdown = () => setShowBlogsDropdown(!showBlogsDropdown);
  const toggleSettingsDropdown = () => setShowSettingsDropdown(!showSettingsDropdown);

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white overflow-y-auto shadow-md transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16 -translate-x-0' : 'w-56 translate-x-0'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-20 left-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-50"
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i className={`bx ${isCollapsed ? 'bx-menu' : 'bx-menu-alt-left'} text-gray-500 text-xl`}></i>
      </button>

      {/* Navigation Links - 5 Main Elements */}
      <ul className="flex flex-col py-8 px-2">
        {/* 1. Dashboard */}
        <li>
          <Link to="/Admin" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-home"></i>
            </span>
            {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
          </Link>
        </li>

        {/* 2. Products with Dropdown */}
        <li>
          <button onClick={toggleProductsDropdown} className="flex flex-row items-center h-12 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-box"></i>
            </span>
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium">Products</span>
                <span className="ml-auto pr-4">
                  <i className={`bx ${showProductsDropdown ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                </span>
              </>
            )}
          </button>
          {!isCollapsed && showProductsDropdown && (
            <ul className="pl-12">
              <li>
                <Link to="/Admin/ManageProducts" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Manage Products</span>
                </Link>
              </li>
              <li>
                <Link to="/Admin/AddProducts" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Add Products</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* 3. Blogs with Dropdown */}
        <li>
          <button onClick={toggleBlogsDropdown} className="flex flex-row items-center h-12 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-pencil"></i>
            </span>
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium">Blogs</span>
                <span className="ml-auto pr-4">
                  <i className={`bx ${showBlogsDropdown ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                </span>
              </>
            )}
          </button>
          {!isCollapsed && showBlogsDropdown && (
            <ul className="pl-12">
              <li>
                <Link to="/Admin/ManageBlogs" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Manage Blogs</span>
                </Link>
              </li>
              <li>
                <Link to="/Admin/AddBlog" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Add Blog</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* 4. Settings with Dropdown */}
        <li>
          <button onClick={toggleSettingsDropdown} className="flex flex-row items-center h-12 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-cog"></i>
            </span>
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium">Settings</span>
                <span className="ml-auto pr-4">
                  <i className={`bx ${showSettingsDropdown ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                </span>
              </>
            )}
          </button>
          {!isCollapsed && showSettingsDropdown && (
            <ul className="pl-12">
              <li>
                <Link to="/Admin/ManageAbout" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Manage About</span>
                </Link>
              </li>
              <li>
                <Link to="/Admin/Emails" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Emails</span>
                </Link>
              </li>
              <li>
                <Link to="/Admin/ManageKeyFigures" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Key Figures</span>
                </Link>
              </li>
              <li>
                <Link to="/Admin/ManageAssurance" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Quality Assurance</span>
                </Link>
              </li>
              <li>
                <Link to="/Admin/notifications" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                  <span className="text-sm font-medium">Notifications</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* 5. Logout */}
        <li>
          <button onClick={handleLogout} className="flex flex-row items-center h-12 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-log-out"></i>
            </span>
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
}
