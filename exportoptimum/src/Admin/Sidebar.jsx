import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showBlogsDropdown, setShowBlogsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
}, [localStorage.getItem('user')]); // Ensure it updates when user logs out


const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null); // Reset user state to avoid unnecessary re-renders
    navigate('/Login', { replace: true });
};



  const toggleProductsDropdown = () => setShowProductsDropdown(!showProductsDropdown);
  const toggleBlogsDropdown = () => setShowBlogsDropdown(!showBlogsDropdown);
  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white overflow-hidden shadow-md transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16 -translate-x-0' : 'w-56 translate-x-0'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-50"
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i className={`bx ${isCollapsed ? 'bx-menu' : 'bx-menu-alt-left'} text-gray-500 text-xl`}></i>
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center justify-center h-20 shadow-md mt-2">
        {currentUser && (
          <>
            {!isCollapsed && (
              <div>
                <div className="flex justify-center">
                  <img
                    src={currentUser?.profile_pic ? `http://localhost:5000/${currentUser.profile_pic}` : "/AdminImages/man.png"}
                    alt="Profile"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                </div>
                <h1 className="text-sm uppercase text-indigo-600">
                  {currentUser.name}
                </h1>
              </div>
            )}
          </>
        )}
      </div>



            {/* Navigation Links */}
            <ul className="flex flex-col py-4">
                <li>
                    <Link to="/Admin" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                            <i className="bx bx-home"></i>
                        </span>
                        {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <button onClick={toggleProfileDropdown} className="flex flex-row items-center h-12 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                            <i className="bx bx-user"></i>
                        </span>
                        {!isCollapsed && (
                            <>
                                <span className="text-sm font-medium">Profile</span>
                                <span className="ml-auto pr-4">
                                    <i className={`bx ${showProfileDropdown ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                                </span>
                            </>
                        )}
                    </button>
                    {!isCollapsed && showProfileDropdown && (
                        <ul className="pl-12">
                            <li>
                                <Link to="/Admin/ManageProfile" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                                    <span className="text-sm font-medium">Manage Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/Admin/ChangePassword" className="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                                    <span className="text-sm font-medium">Edit Password</span>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li>
                    <Link to="/Admin/notifications" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                            <i className="bx bx-bell"></i>
                        </span>
                        {!isCollapsed && (
                            <>
                                <span className="text-sm font-medium">Notifications</span>
                            </>
                        )}
                    </Link>
                </li>
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
                <li>
                    <button onClick={toggleBlogsDropdown} className="flex flex-row items-center h-12 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                            <i className="bx bx-pencil"></i>
                        </span>
                        {!isCollapsed && (
                            <>
                                <span className="text-sm font-medium">Manage Blogs</span>
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

                <li>
                    <Link to="/Admin/ManageAbout" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                            <i className="bx bx-info-circle"></i>
                        </span>
                        {!isCollapsed && <span className="text-sm font-medium">Manage About</span>}
                    </Link>
                </li>

                <li>
                    <Link to="/Admin/Emails" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                            <i className="bx bx-mail-send"></i>
                        </span>
                        {!isCollapsed && <span className="text-sm font-medium">Emails Subscribed</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/Admin/ManageKeyFigures" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                        <i className='bx bxs-bar-chart-alt-2'></i>
                        </span>
                        {!isCollapsed && <span className="text-sm font-medium">Manage Key Figures</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/Admin/ManageAssurance" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                        <i className="bx bx-ball"></i>  
                        </span>
                        {!isCollapsed && <span className="text-sm font-medium">Manage Quality Assurance</span>}
                    </Link>
                </li>

                <li>
                    <button onClick={handleLogout} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
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
