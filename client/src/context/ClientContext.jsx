// ClientContext.jsx - Manages client user session and order actions
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import { useShared } from './SharedContext';
import { useCartCard } from './CartContext';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ClientContext = createContext();
export const useClient = () => useContext(ClientContext);

const ClientProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { handleGetTokenAndConfig } = useAuth();
  const {
    allOrders,
    allUsers,
    allTable,
    getAllProducts,
    createSerial,
    tablenum,
    settablenum,
    setmyOrder,
    setmyOrderId,
    setlistProductsOrder,
    setorderUpdateDate,
    setorderTotal,
    setorderSubtotal,
    setorderdeliveryFee,
    addition,
    discount,
    salesTax,
    serviceTax,
    setIsLoading
  } = useShared();
  const { cashierSocket } = useSocket();
  const { itemsInCart, setItemsInCart, costOrder } = useCartCard();

  const [isTokenValid, setIsTokenValid] = useState(true);
  const [userLoginInfo, setUserLoginInfo] = useState(null);
  const [clientInfo, setClientInfo] = useState({});

  // ------------------- Decode client token -------------------
  const getUserInfoFromToken = async () => {
    const userToken = localStorage.getItem("token_u");
    if (!userToken) {
      toast.error("رجاء تسجيل الدخول مره أخرى");
      setIsTokenValid(false);
      return;
    }

    try {
      const decodedToken = jwt_decode(userToken);
      setUserLoginInfo(decodedToken);
      const userId = decodedToken?.userinfo?.id;
      if (userId) {
        const res = await axios.get(`${apiUrl}/api/user/${userId}`);
        setClientInfo(res.data);
      }
      setIsTokenValid(true);
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("خطأ أثناء التحقق من التوكن. يرجى تسجيل الدخول مرة أخرى.");
      setIsTokenValid(false);
    }
  };

  // ------------------- Create or Update Delivery Order -------------------
  const createDeliveryOrderByClient = async (userId, currentAddress, delivery_fee) => {
    try {
      setIsLoading(true);
      const config = await handleGetTokenAndConfig();

      const userOrders = allOrders?.filter((order) => order.user?._id === userId);
      const lastUserOrder = userOrders?.[0] || null;

      const updatedProducts = itemsInCart.map((item) => ({ ...item, isAdd: true }));
      const subTotal = costOrder + (lastUserOrder?.subTotal || 0);
      const deliveryFee = delivery_fee;
      const newsalesTax = (lastUserOrder?.salesTax || 0) + salesTax;
      const total = subTotal + newsalesTax + deliveryFee;

      if (lastUserOrder?.isActive) {
        const orderId = lastUserOrder._id;
        const products = lastUserOrder.status === "Preparing"
          ? [...updatedProducts, ...lastUserOrder.products]
          : [...itemsInCart, ...lastUserOrder.products];

        await axios.put(`${apiUrl}/api/order/${orderId}`, {
          products,
          subTotal,
          deliveryFee,
          salesTax: newsalesTax,
          total,
          status: "Pending",
          orderType: "Delivery",
        }, config);

        cashierSocket.emit("neworder", `تعديل/إضافة طلب ديليفري للرقم ${lastUserOrder.serial}`);
        toast.success("تم تعديل/إضافة الطلب بنجاح!");
      } else {
        const serial = createSerial();
        const findUser = allUsers.find((u) => u._id === userId);

        await axios.post(`${apiUrl}/api/order`, {
          serial,
          products: itemsInCart,
          subTotal: costOrder,
          salesTax,
          deliveryFee,
          total,
          user: findUser?._id || null,
          name: findUser?.username || "",
          phone: findUser?.phone || "",
          address: currentAddress,
          orderType: "Delivery"
        }, config);

        cashierSocket.emit("neworder", "اوردر ديليفري جديد");
        toast.success("تم عمل أوردر جديد بنجاح!");
      }

      setItemsInCart([]);
      getAllProducts();
    } catch (error) {
      console.error("Error processing delivery order:", error);
      toast.error("حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------- Create or Update Table Order -------------------
  const createOrderForTableByClient = async (tableId) => {
    setIsLoading(true);
    try {
      const tableOrders = allOrders?.filter((order) => order.table?._id === tableId);
      const lastOrder = tableOrders?.[0];
      const subTotal = costOrder + (lastOrder?.subTotal || 0);
      const total = subTotal + salesTax + serviceTax + addition - discount;

      const newOrderData = {
        products: [...itemsInCart, ...(lastOrder?.products || [])],
        subTotal,
        addition: (lastOrder?.addition || 0) + addition,
        discount: (lastOrder?.discount || 0) + discount,
        salesTax: (lastOrder?.salesTax || 0) + salesTax,
        serviceTax: (lastOrder?.serviceTax || 0) + serviceTax,
        total,
        status: lastOrder?.status === "Preparing" ? "Pending" : "Pending",
      };

      if (lastOrder?.isActive) {
        await axios.put(`${apiUrl}/api/order/${lastOrder._id}`, newOrderData);
        toast.success("تم تحديث الطلب بنجاح!");
        cashierSocket.emit("neworder", `طلب محدث للطاولة ${lastOrder?.tableNumber}`);
      } else {
        const serial = createSerial();
        const table = allTable.find((t) => t._id === tableId);
        const user = allUsers.find((u) => u._id === tableId);

        await axios.post(`${apiUrl}/api/order`, {
          ...newOrderData,
          serial,
          table: table?._id,
          user: user?._id,
          orderType: "Internal",
        });
        toast.success("تم إنشاء طلب جديد بنجاح!");
        cashierSocket.emit("neworder", `طلب جديد للطاولة ${table?.tableNumber}`);
      }

      setItemsInCart([]);
      getAllProducts();
    } catch (error) {
      console.error("Error processing table order:", error);
      toast.error("حدث خطأ أثناء تنفيذ الطلب على الطاولة");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------- Fetch and Display Active Invoice -------------------
  const invoice = async (clientId) => {
    if (!clientId) return toast.error("يرجى تسجيل الدخول أو مسح رمز الاستجابة السريعة");

    try {
      const tableOrder = allOrders?.filter((o) => o.table?._id === clientId)[0];
      const userOrder = allOrders?.filter((o) => o.user?._id === clientId)[0];
      const activeOrder = tableOrder?.isActive ? tableOrder : userOrder?.isActive ? userOrder : null;

      if (activeOrder) {
        const res = await axios.get(`${apiUrl}/api/order/${activeOrder._id}`);
        const data = res.data;

        if (tableOrder?.isActive) settablenum(data.tableNumber);
        setmyOrder(data);
        setmyOrderId(data._id);
        setlistProductsOrder(data.products);
        setorderUpdateDate(data.updatedAt);
        setorderTotal(data.total);
        setorderSubtotal(data.subTotal);
        setorderdeliveryFee(data.deliveryFee || 0);
        setItemsInCart([]);
      } else {
        toast.info("لا توجد طلبات نشطة لهذا العميل");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("حدث خطأ أثناء جلب الفاتورة");
    }
  };

  // ------------------- Checkout: Request the bill -------------------
  const checkout = async () => {
    try {
      const updated = await axios.put(`${apiUrl}/api/order/${myOrderId}`, {
        isActive: false,
        help: "Requesting the bill",
        helpStatus: "Not send",
      });
      if (updated) {
        toast.success("تم طلب الحساب");
        cashierSocket.emit("helprequest", `طاولة ${tablenum} تطلب الحساب`);
        setTimeout(() => {
          window.location.href = `https://${window.location.hostname}`;
        }, 60000 * 10);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("حدث خطأ اثناء طلب الحساب ! حاول مره اخري");
    }
  };

  // ------------------- Exposed Context -------------------
  const clientValue = useMemo(() => ({
    isTokenValid,
    userLoginInfo,
    clientInfo,
    getUserInfoFromToken,
    createDeliveryOrderByClient,
    createOrderForTableByClient,
    invoice,
    checkout
  }), [
    isTokenValid,
    userLoginInfo,
    clientInfo,
    itemsInCart,
    costOrder,
    allOrders
  ]);

  return (
    <ClientContext.Provider value={clientValue}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
