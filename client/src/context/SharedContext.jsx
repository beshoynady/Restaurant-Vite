// Context for sharing common restaurant-wide data and utilities

import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const SharedContext = createContext();
export const useShared = () => useContext(SharedContext);

export const SharedProvider = ({ children }) => {

  
  const apiUrl = import.meta.env.VITE_API_URL;
  const { handleGetTokenAndConfig } = useAuth();

  // ------------------- Global UI State -------------------
  const [isRefresh, setIsRefresh] = useState(false); // trigger for refreshing content
  const [isLoading, setIsLoading] = useState(true);   // global loading indicator
  const [isDarkMode, setIsDarkMode] = useState(false); // dark mode toggle

  // ------------------- Time/Date Formatters -------------------
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

  // ------------------- Restaurant Info -------------------
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

  // ------------------- Products & Offers -------------------
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
            if (size.sizeDiscount > 0) sizeOffers.push(size);
          });
        }
      });
      setSizesOffer(sizeOffers);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ------------------- Menu Categories -------------------
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

  // ------------------- Tables & Reservations -------------------
  const [allTable, setAllTable] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [availableTableIds, setAvailableTableIds] = useState([]);

  const getAllTable = async () => {
    try {
      const response = await axios.get(apiUrl + "/api/table");
      if (response.status === 200) {
        const tables = response.data.allTables || [];
        if (tables.length === 0) {
          toast.warn("لا توجد طاولات مسجلة حالياً.");
        }
        setAllTable(tables);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error getting all tables:", error);
    }
  };

  const getAllReservations = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      const response = await axios.get(`${apiUrl}/api/reservation`, config);
      if (response.data) setAllReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const getAvailableTables = (reservationDate, startTime, endTime) => {
    console.log({ allReservations, reservationDate, startTime, endTime });

    // Filter reservations that match the selected date
    const filterReservationsByDate = allReservations?.filter((reservation) => {

      const reservationDateObj = new Date(reservation.reservationDate);
      const selectedDateObj = new Date(reservationDate);

      return (
        reservationDateObj.getFullYear() === selectedDateObj.getFullYear() &&
        reservationDateObj.getMonth() === selectedDateObj.getMonth() &&
        reservationDateObj.getDate() === selectedDateObj.getDate()
      );
    });

    // Filter reservations that overlap with the selected time range
    const filterReservationsByTime = filterReservationsByDate?.filter(
      (reservation) => {
        if (
          reservation.status === "canceled" ||
          reservation.status === "Missed reservation time"
        ) {
          return false;
        }

        const startReservationTime = new Date(reservation.startTime).getTime();
        const endReservationTime = new Date(reservation.endTime).getTime();
        const startSelectedTime = new Date(startTime).getTime();
        const endSelectedTime = new Date(endTime).getTime();

        // Check if there is a time overlap
        return (
          (startReservationTime <= startSelectedTime &&
            endReservationTime >= startSelectedTime) ||
          (startReservationTime <= endSelectedTime &&
            endReservationTime >= endSelectedTime) ||
          (startSelectedTime <= startReservationTime &&
            endSelectedTime >= endReservationTime)
        );
      }
    );

    console.log({ filterReservationsByDate, filterReservationsByTime });

    // Retrieve all table IDs
    const allTableIds = allTable?.map((table) => table._id) || [];
    console.log({ allTableIds });

    // Retrieve reserved table IDs based on the filtered reservations
    const reservedTableIds = [];
    filterReservationsByTime &&
      filterReservationsByTime?.map((reservation) =>
        reservedTableIds.push(reservation.tableId?._id)
      );

    // Find available tables by excluding reserved ones
    const availableTableIds = allTableIds.filter(
      (tableId) => !reservedTableIds.includes(tableId)
    );
    console.log({ availableTableIds });

    // Update state with available table IDs
    setavailableTableIds(availableTableIds);
    return availableTableIds;
  };

  const createReservations = async (
    e,
    tableId,
    tableNumber,
    userId,
    numberOfGuests,
    clientName,
    clientPhone,
    reservationDate,
    startTime,
    endTime,
    reservationNote,
    createdBy
  ) => {
    try {
      e.preventDefault();
      // setIsLoading(true)

      // Logging input data for debugging purposes
      // console.log({ tableId, tableNumber, userId, numberOfGuests, clientName, clientPhone, reservationDate, startTime, endTime, reservationNote, createdBy });

      // Convert reservationDate to Date object
      const selectedDate = new Date(reservationDate);

      // Logging selectedDate for debugging purposes
      console.log({ selectedDate: selectedDate.getTime() });

      // Filter reservations by table and selected date
      const filterReservationsByTable = allReservations.filter(
        (reservation) => {
          const reservationDateObj = new Date(reservation.reservationDate);
          const selectedDateObj = new Date(selectedDate);

          return (
            reservation.tableId === tableId &&
            reservationDateObj.getFullYear() ===
            selectedDateObj.getFullYear() &&
            reservationDateObj.getMonth() === selectedDateObj.getMonth() &&
            reservationDateObj.getDate() === selectedDateObj.getDate()
          );
        }
      );

      // Logging filterReservationsByTable for debugging purposes
      // console.log({ filterReservationsByTable });
      // Filter reservations by table and selected date
      const conflictingReservation = filterReservationsByTable.find(
        (reservation) => {
          const startReservationTime = new Date(
            reservation.startTime
          ).getTime();
          const endReservationTime = new Date(reservation.endTime).getTime();
          const startSelectedTime = new Date(startTime).getTime();
          const endSelectedTime = new Date(endTime).getTime();
          return (
            (startReservationTime <= startSelectedTime &&
              endReservationTime >= startSelectedTime) ||
            (startReservationTime <= endSelectedTime &&
              endReservationTime >= endSelectedTime) ||
            (startSelectedTime <= startReservationTime &&
              endSelectedTime >= endReservationTime)
          );
        }
      );

      // console.log({ conflictingReservation });

      // Display error message if there is a conflicting reservation
      if (conflictingReservation) {
        toast.error("هذه الطاولة محجوزة في هذا الوقت");
        return;
      }

      // Send request to the server
      const response = await axios.post(`${apiUrl}/api/reservation`, {
        tableId,
        tableNumber,
        numberOfGuests,
        clientName,
        clientPhone,
        reservationDate,
        startTime,
        endTime,
        userId: userId || null,
        createdBy: createdBy || null,
        reservationNote: reservationNote || "",
      });

      // Check if the request was successful
      if (response.status === 201) {
        // Update reservations data
        getAllReservations();
        // Display success message
        toast.success("تم حجز الطاولة بنجاح");
      } else {
        // Display error message if the request was unsuccessful
        toast.error("حدث خطأ أثناء عملية الحجز! الرجاء المحاولة مرة أخرى");
      }
    } catch (error) {
      // Display error message if an error occurred
      console.error(error);
      toast.error("فشل عملية الحجز! الرجاء المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------- Dark Mode Toggle -------------------
  useEffect(() => {
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

  // ------------------- Context Value -------------------
  const sharedValue = useMemo(
    () => ({
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
      allTable,
      getAllTable,
    }),
    [
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
      allTable,
    ]
  );

  return (
    <SharedContext.Provider value={sharedValue}>
      {children}
    </SharedContext.Provider>
  )
}
