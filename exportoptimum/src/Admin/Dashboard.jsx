import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Sidebar from './Sidebar';
import emails from '../Data/Emails.json';
import notificationss from '../Data/Contact.json';
import axios from 'axios';

Chart.register(...registerables);

export default function Dashboard() {
  const navigate = useNavigate();
  const [blogCount, setBlogCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [visitorsData, setVisitorsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/Login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      navigate('/Login');
      return;
    }

    fetchVisitorCountry();
    fetchProducts();
    fetchBlogCount();
  }, [navigate]);

  // Fetch Products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  // Fetch Visitor Country Data from API
  const fetchVisitorCountry = async () => {
    try {
      const apiKey = '68c81e1f48e449c09c93f2587aa0e217';
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`);
      const data = await response.json();
      const country = data.country_name;

      updateVisitorData(country);
    } catch (error) {
      console.error('Error fetching visitor data:', error);
    }
  };

  // Update Visitor Data
  const updateVisitorData = (country) => {
    setVisitorsData((prevData) => {
      const existingCountry = prevData.find((data) => data.country === country);
      if (existingCountry) {
        return prevData.map((data) =>
          data.country === country ? { ...data, visitors: data.visitors + 1 } : data
        );
      } else {
        return [...prevData, { country, visitors: 1 }];
      }
    });
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/Login');
  };

  // Analytics Data for Website
  const websiteAnalyticsData = {
    labels: ['Emails', 'Blogs', 'Notifications', 'Products'],
    datasets: [
      {
        label: 'Statistics',
        data: [emails.length, blogCount, notificationss.messages.length, products.length],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  // Fetch Blog Count from API
  const fetchBlogCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogCount(response.data.length);
    } catch (err) {
      setError('Failed to load blog count. Please try again.');
      console.error('Error fetching blog count:', err);
    } finally {
      setLoading(false);
    }
  };

  // Analytics Data for Visitors by Country
  const visitorAnalyticsData = {
    labels: visitorsData.map((data) => data.country),
    datasets: [
      {
        label: 'Visitors by Country',
        data: visitorsData.map((data) => data.visitors),
        backgroundColor: '#4F46E5',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold">Website Statistics</h1>

        {currentUser ? (
          <div className="flex justify-between items-center mb-4">
            <span>Hello, {currentUser.name}</span>
            <button onClick={handleLogout} className="text-indigo-600">Logout</button>
          </div>
        ) : (
          <div>Loading...</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-2xl">{notificationss.messages.length}</p>
            <button onClick={() => navigate('/Admin/Notifications')} className="mt-2 text-indigo-600">
              View Notifications
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-lg font-semibold">Emails</h2>
            <p className="text-2xl">{emails.length}</p>
            <button onClick={() => navigate('/Admin/Emails')} className="mt-2 text-indigo-600">
              View Emails
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl">{products.length}</p>
            <button onClick={() => navigate('/Admin/ManageProducts')} className="mt-2 text-indigo-600">
              View Products
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-lg font-semibold">Total Blogs</h2>
            <p className="text-2xl">{blogCount}</p>
            <button onClick={() => navigate('/Admin/ManageBlogs')} className="mt-2 text-indigo-600">
              View Blogs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Visitors by Country</h2>
            <Bar data={visitorAnalyticsData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold mb-4">Website Analytics</h1>
            <Doughnut data={websiteAnalyticsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
