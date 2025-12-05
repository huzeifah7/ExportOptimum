import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setCurrentUser(user);
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/Login', { replace: true });
    };

    return (
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-30">
            {/* Logo */}
            <div className="flex items-center">
                <img 
                    src="/EOLogo.png" 
                    alt="Export Optimum Logo" 
                    className="h-10 w-auto"
                />
            </div>

            {/* Admin Panel Title */}
            <div className="flex-1 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            </div>

            {/* Profile Info with Dropdown */}
            <div className="relative" ref={dropdownRef}>
                {currentUser && (
                    <>
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-200"
                        >
                            <img
                                src={currentUser?.profile_pic ? `http://localhost:5000/${currentUser.profile_pic}` : "/AdminImages/man.png"}
                                alt="Profile"
                                className="rounded-full w-10 h-10 object-cover border-2 border-indigo-500"
                            />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <i className={`bx ${showProfileDropdown ? 'bx-chevron-up' : 'bx-chevron-down'} text-gray-600`}></i>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate('/Admin/ManageProfile');
                                        setShowProfileDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <i className="bx bx-user text-gray-600"></i>
                                    <span>Manage Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/Admin/ChangePassword');
                                        setShowProfileDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <i className="bx bx-key text-gray-600"></i>
                                    <span>Change Password</span>
                                </button>
                                <hr className="my-2 border-gray-200" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                    <i className="bx bx-log-out text-red-600"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
