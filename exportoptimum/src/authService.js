import { jwtDecode } from "jwt-decode";  // Corrected import


// Save token to local storage
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token from local storage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token from local storage (for logout)
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return Date.now() < decoded.exp * 1000;
  } catch (error) {
    return false;
  }
};
