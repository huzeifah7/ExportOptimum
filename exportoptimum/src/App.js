import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.css';

import Contact from './Contact/Contact';
import Index from './Home/Index';
import OurProducts from './OurProducts/OurProducts';
import Quality from './Quality/Quality';
import About from './About/About';
import Blogs from './Blogs/Blogs';
import BlogDetail from './Blogs/BlogDetail';
import ProductDetails from './OurProducts/ProductDetails';
import Login from './Admin/LoginLogout/Login';
import Dashboard from './Admin/Dashboard';
import AddProducts from './Admin/ManageProducts/AddProduct';
import ManageProducts from './Admin/ManageProducts/ManageProducts';
import Messages from './Admin/Notifications/Messages';
import AddBlog from './Admin/ManageBlogs/AddBlog';
import ManageBlogs from './Admin/ManageBlogs/ManageBlog';
import EditAbout from './Admin/ManageAbout/EditAbout';
import Emails from './Admin/EmailsReceived/Email';
import ChangePassword from './Admin/ManageProfile/ChangePassword';
import ManageProfile from './Admin/ManageProfile/ManageProfile';
import EditKeyFigures from './Admin/ManageKeyFigures/EditKeyFigures';
import EditProduct from './Admin/ManageProducts/EditProducts';
import EditBlog from './Admin/ManageBlogs/EditBlogs';
import ManageQualityAssurance from './Admin/QualityAssurance/ManageQualityAssurance';
import Layout from './Admin/Layout';

// Authentication Context
export const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {}
});

const ProtectedRoute = () => {
    const user = localStorage.getItem("user");
    console.log("Protected Route - User:", user);

    return user ? <Outlet /> : <Navigate to="/Login" replace />;
};



function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user"));

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsAuthenticated(!!user); // ✅ Ensure state updates
        if (user && location.pathname === '/Login') {
            navigate('/Admin', { replace: true });
        }
    }, [location, navigate]);  // ✅ Now updates when location changes
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <ConfigProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/OurProducts" element={<OurProducts />} />
                    <Route path="/OurProducts/:id" element={<ProductDetails />} />
                    <Route path="/Quality" element={<Quality />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/Blogs" element={<Blogs />} />
                    <Route path="/Blogs/:id" element={<BlogDetail />} />
                    <Route path="/Login" element={<Login />} />

                    {/* Protected Admin Routes */}
                    <Route path="/Admin" element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="AddProducts" element={<AddProducts />} />
                            <Route path="ManageProducts" element={<ManageProducts />} />
                            <Route path="EditProduct/:id" element={<EditProduct />} />
                            <Route path="Notifications" element={<Messages />} />
                            <Route path="AddBlog" element={<AddBlog />} />
                            <Route path="ManageBlogs" element={<ManageBlogs />} />
                            <Route path="ManageAbout" element={<EditAbout />} />
                            <Route path="Emails" element={<Emails />} />
                            <Route path="ManageKeyFigures" element={<EditKeyFigures />} />
                            <Route path="EditBlog/:id" element={<EditBlog />} />
                            <Route path="ManageAssurance" element={<ManageQualityAssurance />} />
                            <Route path="ChangePassword" element={<ChangePassword />} />
                            <Route path="ManageProfile" element={<ManageProfile />} />
                        </Route>
                    </Route>
                </Routes>
            </ConfigProvider>
        </AuthContext.Provider>
    );
}

export default App;
