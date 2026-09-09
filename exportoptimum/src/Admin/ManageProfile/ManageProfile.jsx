import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/Login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      setCurrentUser(user);
      setEditedUser({ ...user });
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.removeItem('user');
      navigate('/Login');
      setError('Error loading profile. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleEditToggle = async () => {
    if (editMode) {
      setLoading(true);
      try {
        let profilePic = editedUser.profile_pic;

        if (selectedFile) {
          const formData = new FormData();
          formData.append('profile_pic', selectedFile);

          const uploadResponse = await fetch('http://localhost:5000/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            profilePic = uploadData.filename; // Use the filename returned by the server
          } else {
            setError('Failed to upload image.');
            setLoading(false);
            return;
          }
        }

        const updatedUser = { ...editedUser, profile_pic: profilePic };

        const response = await fetch(`http://localhost:5000/update-profile/${updatedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          setEditMode(false);
          setSelectedFile(null); // Reset selected file after successful upload
        } else {
          setError('Failed to update profile.');
        }
      } catch (err) {
        console.error('Error updating profile:', err);
        setError('Failed to update profile. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setEditMode(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center min-h-screen">User data not found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-[60%] ">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Profile</h2>

        <div className="flex justify-center mb-4">
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)  // Temporary URL for the uploaded file
                : currentUser.profile_pic && currentUser.profile_pic !== "" // Check if profile_pic exists
                ? `http://localhost:5000/AdminImages/${currentUser.profile_pic.split('/').pop()}` // Full image path
                : '/AdminImages/man.png'  // Default image if no profile picture exists
            }
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700">Name:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p>{currentUser.name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 bold">Username:</label>
            {editMode ? (
              <input
                type="text"
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p>{currentUser.username}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Email:</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p>{currentUser.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Profile Picture:</label>
            {editMode ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded mt-1"
              />
            ) : (
              <p>{currentUser.profile_pic}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : editMode ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
