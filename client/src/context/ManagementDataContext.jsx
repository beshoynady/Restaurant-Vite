import { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // Needed for authorized requests

const ManagementDataContext = createContext();
export const useManagementData = () => useContext(ManagementDataContext);

const ManagementDataProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { handleGetTokenAndConfig } = useAuth(); // Secure requests

  // Orders, Users, Employees
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  // Filters & Pagination
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [timeFilter, setTimeFilter] = useState("all"); // today, week, etc.
  const [dateRange, setDateRange] = useState({ start: null, end: null }); // custom range

  // Fetch all orders
  const getAllOrders = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/order`, config);
      if (response.status === 200) {
        setAllOrders(response.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("فشل تحميل الطلبات");
    }
  };

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user`);
      if (response.status === 200) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("فشل تحميل المستخدمين");
    }
  };

  // Fetch all employees
  const getAllEmployees = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/employee`, config);
      if (response.status === 200) {
        setAllEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("فشل تحميل الموظفين");
    }
  };

  // Filter by relative time range
  const filterByTime = (timeRange, array) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (timeRange) {
      case "today":
        return array.filter((item) => new Date(item.createdAt) >= startOfToday);
      case "week":
        return array.filter((item) => new Date(item.createdAt) >= startOfWeek);
      case "month":
        return array.filter((item) => new Date(item.createdAt) >= startOfMonth);
      case "year":
        return array.filter((item) => new Date(item.createdAt) >= startOfYear);
      default:
        return array;
    }
  };

  // Filter by custom date range
  const filterByDateRange = (array) => {
    if (!dateRange.start || !dateRange.end) return array;
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return array.filter((item) => {
      const created = new Date(item.createdAt);
      return created >= start && created <= end;
    });
  };

  // Auto-fetch all data on mount
  useEffect(() => {
    getAllOrders();
    getAllUsers();
    getAllEmployees();
  }, []);

  const managementDataValue = useMemo(
    () => ({
      allOrders,
      allUsers,
      allEmployees,
      getAllOrders,
      getAllUsers,
      getAllEmployees,
      pagination,
      setPagination,
      timeFilter,
      setTimeFilter,
      dateRange,
      setDateRange,
      filterByTime,
      filterByDateRange,
    }),
    [
      allOrders,
      allUsers,
      allEmployees,
      pagination,
      timeFilter,
      dateRange,
    ]
  );

  return (
    <ManagementDataContext.Provider value={managementDataValue}>
      {children}
    </ManagementDataContext.Provider>
  );
};

export default ManagementDataProvider;
