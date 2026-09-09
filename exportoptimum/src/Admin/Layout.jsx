import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ensure correct path

export default function Layout() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const userString = localStorage.getItem('user');
    
        if (userString) {
            try {
                const user = JSON.parse(userString);
                setCurrentUser(user);
            } catch (err) {
                console.error('Error parsing user data:', err);
                localStorage.removeItem('user');
                if (window.location.pathname !== '/Login') {
                    navigate('/Login', { replace: true });
                }
            }
        } else {
            if (window.location.pathname !== '/Login') {
                navigate('/Login', { replace: true });
            }
        }
    }, []);
    
    

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-56'}`}>
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    currentUser={currentUser} // Pass currentUser as a prop
                />
            </div>
            <div className="flex-1 p-6 bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
}
