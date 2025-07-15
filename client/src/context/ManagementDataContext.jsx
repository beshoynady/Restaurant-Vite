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

          const [StartDate, setStartDate] = useState(new Date());
        const [EndDate, setEndDate] = useState(new Date());

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


      const [startPagination, setStartPagination] = useState(0);
      const [endPagination, setEndPagination] = useState(5);
    
      // const [pagination, setpagination] = useState(5)
      const EditPagination = (e) => {
        if (e.target.innerHTML === "التالي") {
          setStartPagination(startPagination + 5);
          setEndPagination(endPagination + 5);
        } else if (e.target.innerHTML === "السابق") {
          if (endPagination <= 5) {
            setStartPagination(0);
            setEndPagination(5);
          } else {
            setStartPagination(startPagination - 5);
            setEndPagination(endPagination - 5);
          }
        } else {
          setStartPagination(e.target.innerHTML * 5 - 5);
          setEndPagination(e.target.innerHTML * 5);
        }
      };

  // Filter by relative time range


  const filterByTime = (timeRange, array) => {
    let filtered = [];

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // console.log({
    //   now,
    //   startOfToday,
    //   startOfWeek,
    //   startOfMonth,
    //   startOfYear,
    //   day: new Date().getDay(),
    //   date: new Date().getDate(),
    //   month: new Date().getMonth(),
    //   year: new Date().getFullYear(),
    // });

    switch (timeRange) {
      case "today":
        filtered = array.filter(
          (item) => new Date(item.createdAt) >= startOfToday
        );
        break;
      case "week":
        filtered = array.filter(
          (item) => new Date(item.createdAt) >= startOfWeek
        );
        break;
      case "month":
        filtered = array.filter(
          (item) => new Date(item.createdAt) >= startOfMonth
        );
        break;
      case "year":
        filtered = array.filter(
          (item) => new Date(item.createdAt) >= startOfYear
        );
        break;
      default:
        filtered = array;
    }

    return filtered;
  };
      

  // Filter by custom date range
  const filterByDateRange = (array) => {
    const start = new Date(StartDate);
    const end = new Date(EndDate);

    const filtered = array.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= start && createdAt <= end;
    });

    return filtered;
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
