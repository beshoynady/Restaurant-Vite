import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SharedContext = createContext();
export const useShared = () => useContext(SharedContext);

export const SharedProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = formatDate(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${formattedDate} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  const [restaurantData, setRestaurantData] = useState({});
  const getRestaurant = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/restaurant/`, config);
      if (response.status === 200 && response.data.length > 0) {
        const data = response.data[0];
        const currentDate = new Date();
        const subscriptionEndDate = new Date(data.subscriptionEnd);
        if (currentDate > subscriptionEndDate) {
          toast.error("انتهت صلاحية الاشتراك. يرجى التجديد.");
        }
        setRestaurantData(data);
      } else {
        toast.error("لم يتم العثور على بيانات المطعم.");
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      toast.error("حدث خطأ أثناء جلب بيانات المطعم.");
    }
  };

  const [allProducts, setAllProducts] = useState([]);
  const [productsOffer, setProductsOffer] = useState([]);
  const [sizesOffer, setSizesOffer] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product`);
      if (response.status !== 200) throw new Error("فشل تحميل المنتجات");

      const productsList = response.data;
      setAllProducts(productsList);

      setProductsOffer(productsList.filter((pro) => pro.discount > 0));

      const sizeOffers = [];
      productsList.forEach((pro) => {
        if (pro.hasSizes) {
          pro.sizes.forEach((size) => {
            if (size.sizeDiscount > 0) {
              sizeOffers.push(size);
            }
          });
        }
      });
      setSizesOffer(sizeOffers);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [allMenuCategories, setAllMenuCategories] = useState([]);
  const [menuCategoryId, setMenuCategoryId] = useState("");

  const getAllMenuCategories = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/menucategory`, config);
      if (response.status !== 200) throw new Error("فشل تحميل التصنيفات");

      const activeCategories = response.data.filter((c) => c.status === true);
      setAllMenuCategories(activeCategories);

      const mainCategory = activeCategories.find((cat) => cat.isMain === true);
      if (mainCategory) setMenuCategoryId(mainCategory._id);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const [allReservations, setAllReservations] = useState([]);
  const getAllReservations = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/reservation`, config);
      if (response.data) {
        setAllReservations(response.data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const [availableTableIds, setAvailableTableIds] = useState([]);

  const getAvailableTables = (reservationDate, startTime, endTime) => {
    const filteredByDate = allReservations.filter((res) => {
      const resDate = new Date(res.reservationDate);
      const selDate = new Date(reservationDate);
      return resDate.toDateString() === selDate.toDateString();
    });

    const overlapping = filteredByDate.filter((res) => {
      if (["canceled", "Missed reservation time"].includes(res.status)) return false;

      const startRes = new Date(res.startTime).getTime();
      const endRes = new Date(res.endTime).getTime();
      const startSel = new Date(startTime).getTime();
      const endSel = new Date(endTime).getTime();

      return (
        (startRes <= startSel && endRes >= startSel) ||
        (startRes <= endSel && endRes >= endSel) ||
        (startSel <= startRes && endSel >= endRes)
      );
    });

    const allTableIds = allTable?.map((table) => table._id) || [];
    const reservedIds = overlapping.map((res) => res.tableId?._id);
    const availableIds = allTableIds.filter((id) => !reservedIds.includes(id));
    setAvailableTableIds(availableIds);
    return availableIds;
  };

  const createReservations = async (
    e,
    tableId,
    tableNumber,
    userId,
    numberOfGuests,
    customerName,
    customerPhone,
    reservationDate,
    startTime,
    endTime,
    reservationNote,
    createdBy
  ) => {
    try {
      e.preventDefault();
      const selectedDate = new Date(reservationDate);
      const conflict = allReservations.find((res) => {
        const sameTable = res.tableId === tableId;
        const sameDate = new Date(res.reservationDate).toDateString() === selectedDate.toDateString();
        const overlap =
          (new Date(res.startTime).getTime() <= new Date(startTime).getTime() &&
            new Date(res.endTime).getTime() >= new Date(startTime).getTime()) ||
          (new Date(res.startTime).getTime() <= new Date(endTime).getTime() &&
            new Date(res.endTime).getTime() >= new Date(endTime).getTime());

        return sameTable && sameDate && overlap;
      });

      if (conflict) return toast.error("هذه الطاولة محجوزة في هذا الوقت");

      const response = await axios.post(`${apiUrl}/api/reservation`, {
        tableId,
        tableNumber,
        numberOfGuests,
        customerName,
        customerPhone,
        reservationDate,
        startTime,
        endTime,
        userId: userId || null,
        createdBy: createdBy || null,
        reservationNote: reservationNote || "",
      });

      if (response.status === 201) {
        getAllReservations();
        toast.success("تم الحجز بنجاح");
      } else {
        toast.error("حدث خطأ أثناء الحجز");
      }
    } catch (error) {
      // Display error message if an error occurred
      console.error(error);
      toast.error("فشل الحجز! حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    // Toggle dark mode styles
    const body = document.body;
    if (isDarkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


  const sharedValue = useMemo(() => ({
    apiUrl,
    isRefresh,
    setIsRefresh,
    isLoading,
    setIsLoading,
    isDarkMode,
    setIsDarkMode,
    formatDate,
    formatTime,
    formatDateTime,
    toggleDarkMode,
    restaurantData,
    getRestaurant,
    allProducts,
    setAllProducts,
    getAllProducts,
    productsOffer,
    sizesOffer,
    allMenuCategories,
    getAllMenuCategories,
    menuCategoryId,
    setMenuCategoryId,
    allReservations,
    getAllReservations,
    availableTableIds,
    getAvailableTables,
    createReservations,
  }), [
    apiUrl,
    isRefresh,
    isLoading,
    isDarkMode,
    restaurantData,
    allProducts,
    productsOffer,
    sizesOffer,
    allMenuCategories,
    menuCategoryId,
    allReservations,
    availableTableIds,
  ]);

  return (
    <SharedContext.Provider value={sharedValue}>
      {children}
    </SharedContext.Provider>
  );
};
