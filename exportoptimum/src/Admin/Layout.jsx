import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Header */}
            <Header />
            
            {/* Sidebar */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-56'}`}>
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    currentUser={currentUser}
                />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 pt-20 p-6 bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
}
