// AuthContext.jsx - Manages employee authentication, token validation, and permissions
import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

// Create the context and custom hook
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ Children }) => {
  // Store permissions assigned to the logged-in employee
  const [permissionsList, setPermissionsList] = useState([]);

  // Store decoded employee login info (like name, id, role, etc.)
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState(null);

  // Store whether the employee token is valid or expired
  const [isTokenValid, setIsTokenValid] = useState(true);

  // Refresh the access token using refresh-token endpoint
  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/employee/refresh-token`,
        {},
        { withCredentials: true }
      );

      if (response && response.data.accessToken) {
        localStorage.setItem("token_e", response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      toast.error("انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.");
      return <Navigate to="/login" />;
    }
  };

  // Verify if the current token is still valid or expired
  const verifyToken = async () => {
    const employeeToken = localStorage.getItem("token_e");
    if (!employeeToken) {
      await refreshToken();
    } else {
      const decodedToken = jwt_decode(employeeToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        await refreshToken();
      }
    }
  };

  // Get logged-in employee info from token, then fetch permissions
  const getUserInfoFromToken = async () => {
    const employeeToken = localStorage.getItem("token_e");

    if (!employeeToken) {
      toast.error("رجاء تسجيل الدخول مره أخرى");
      setIsTokenValid(false);
      return;
    }

    try {
      const decodedToken = jwt_decode(employeeToken);
      setEmployeeLoginInfo(decodedToken);
      await getPermissions(decodedToken);
      setIsTokenValid(true);
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("خطأ أثناء التحقق من التوكن. يرجى تسجيل الدخول مرة أخرى.");
      setIsTokenValid(false);
    }
  };

  // Get token with authorization header for secure API calls
  const handleGetTokenAndConfig = async () => {
    await verifyToken();
    const token = localStorage.getItem("token_e");
    if (!token) {
      toast.error("!رجاء تسجيل الدخول مره اخري");
      return null;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return config;
  };

  // Fetch permission list assigned to the employee from backend
  const getPermissions = async (decodedToken) => {
    try {
      const id = decodedToken.id;
      const config = await handleGetTokenAndConfig();
      if (id) {
        const response = await axios.get(
          `${apiUrl}/api/permission/employee/${id}`,
          config
        );
        if (response.status === 200) {
          const data = response.data.Permissions;
          setPermissionsList(data);
        } else {
          throw new Error("Failed to fetch permissions: Unexpected status code");
        }
      }
    } catch (error) {
      console.error("Error fetching permissions:", error.message);
    }
  };

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      await verifyToken();
      await getUserInfoFromToken();
    };
    initializeSession();
  }, []);

  // Context value (exported functions & state)
  const authValue = {
    isTokenValid,
    employeeLoginInfo,
    permissionsList,
    getUserInfoFromToken,
    refreshToken,
    verifyToken,
    handleGetTokenAndConfig,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {Children}
    </AuthContext.Provider>
  );
};
