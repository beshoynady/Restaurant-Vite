import { createContext, useContext } from 'react'
import react, { useState, useEffect, useMemo, createContext, useContext } from "react"

import { useShared } from './SharedContext';

const ClientContext = createContext();
export const useClient = useContext(ClientContext)

const ClientProvider = ({ childern }) => {
      const [isTokenValid, setIsTokenValid] = useState(true);
  const [userLoginInfo, setUserLoginInfo] = useState(null);
  const [clientInfo, setClientInfo] = useState({});

  const getUserInfoFromToken = async () => {
    const userToken = localStorage.getItem("token_u");

    if (!userToken) {
      toast.error("رجاء تسجيل الدخول مره أخرى");
      setIsTokenValid(false);
      return;
    }

    try {
      let decodedToken = null;

      

      if (userToken) {
        decodedToken = jwt_decode(userToken);
        setUserLoginInfo(decodedToken);

        if (decodedToken) {
          const userId = decodedToken.userinfo.id;
          if (userId) {
            const clientResponse = await axios.get(
              `${apiUrl}/api/user/${userId}`
            );
            setClientInfo(clientResponse.data);
          }
        }
      }

      setIsTokenValid(true);
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("خطأ أثناء التحقق من التوكن. يرجى تسجيل الدخول مرة أخرى.");
      setIsTokenValid(false);
    }
  };

const createDeliveryOrderByClient = async (
    userId,
    currentAddress,
    delivery_fee
  ) => {
    try {
      setIsLoading(true);
      const config = await handleGetTokenAndConfig();
      // console.log({ itemsInCart })
      // Find the user's orders
      const userOrders =
        allOrders &&
        allOrders.filter((order) => order.user && order.user?._id === userId);
      const lastUserOrder = userOrders.length > 0 ? userOrders[0] : null;

      // Check if the last user order is active
      if (lastUserOrder && lastUserOrder.isActive) {
        const orderId = lastUserOrder._id;
        const oldProducts = lastUserOrder.products;
        const oldSubTotal = lastUserOrder.subTotal;
        const newsalesTaxt = lastUserOrder.salesTax + salesTax;
        const subTotal = costOrder + oldSubTotal;
        const deliveryFee = delivery_fee;
        const total = subTotal + salesTax + deliveryFee;

        // Update order if it's in 'Preparing' status
        if (lastUserOrder.status === "Preparing") {
          const updatedProducts = itemsInCart.map((item) => ({
            ...item,
            isAdd: true,
          }));
          const products = [...updatedProducts, ...oldProducts];
          const status = "Pending";
          const orderType = "Delivery";

          await axios.put(
            `${apiUrl}/api/order/${orderId}`,
            {
              products,
              subTotal,
              deliveryFee,
              salesTaxt: newsalesTaxt,
              total,
              status,
              orderType,
            },
            config
          );

          setitemsInCart([]);
          setitemId([]);
          getAllProducts();
          cashierSocket.emit(
            "neworder",
            `اضافه طلبات الي اوردر ديليفري ${lastUserOrder.serial}`
          );

          toast.success("تم اضافه الاصناف الي الاوردر!");
        } else {
          const products = [...itemsInCart, ...oldProducts];
          const status = "Pending";
          const orderType = "Delivery";

          await axios.put(
            `${apiUrl}/api/order/${orderId}`,
            {
              products,
              subTotal,
              deliveryFee,
              salesTaxt: newsalesTaxt,
              total,
              status,
              orderType,
            },
            config
          );

          setitemsInCart([]);
          getAllProducts();
          cashierSocket.emit("neworder", "تم تعديل ارودر ديفرري");
          toast.success("تم تعديل الاوردر بنجاح!");
        }

        setIsLoading(false);
      } else {
        // Create a new order
        const serial = createSerial();
        const findUser = allUsers.find((u, i) => u._id === userId);
        const user = findUser ? userId : null;
        const products = [...itemsInCart];
        const subTotal = costOrder;
        const deliveryFee = delivery_fee;
        const name = findUser ? findUser.username : "";
        const phone = findUser ? findUser.phone : "";
        const address = currentAddress;
        const orderType = "Delivery";
        const total = subTotal + deliveryFee + salesTax;

        await axios.post(
          `${apiUrl}/api/order`,
          {
            serial,
            products,
            subTotal,
            salesTax,
            deliveryFee,
            total,
            user,
            name,
            address,
            phone,
            orderType,
          },
          config
        );

        setitemsInCart([]);
        setitemId([]);
        getAllProducts();
        toast.success("تم عمل اوردر جديد بنجاح!");
        cashierSocket.emit("neworder", "اوردر ديليفري جديد");
        setIsLoading(false);
      }

      setitemsInCart([]);
      setitemId([]);
      setIsLoading(false);
    } catch (error) {
      console.error("An error occurred while processing the order:", error);
      toast.error("حدث خطأ اثناء عمل الاوردر رجاء المحاوله مره اخري");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrderForTableByClient = async (tableId) => {
    setIsLoading(true);
    try {
      // Find orders for the specified table
      const tableOrders =
        allOrders && allOrders.filter((order) => order.table?._id === tableId);
      const lastTableOrder = tableOrders.length > 0 ? tableOrders[0] : {};
      const lastTableOrderActive = lastTableOrder && lastTableOrder.isActive;

      if (lastTableOrderActive) {
        const orderId = lastTableOrder._id;
        const oldProducts = lastTableOrder.products;

        const oldSubTotal = lastTableOrder.subTotal;
        const newAddition = lastTableOrder.addition + addition;
        const newDiscount = lastTableOrder.discount + discount;
        const newsalesTaxt = lastTableOrder.salesTax + salesTax;
        const newserviceTax = lastTableOrder.serviceTax + serviceTax;
        const oldTotal = lastTableOrder.total;
        const status = lastTableOrder.status;
        const subTotal = costOrder + oldSubTotal;
        const total =
          oldTotal + costOrder + salesTax + serviceTax + addition - discount;

        // Update the existing order
        if (status === "Preparing") {
          const updatedProducts = itemsInCart.map((item) => ({
            ...item,
            isAdd: true,
          }));
          const products = [...updatedProducts, ...oldProducts];
          const newOrderData = {
            products,
            subTotal,
            addition: newAddition,
            discount: newDiscount,
            salesTax: newsalesTaxt,
            serviceTax: newserviceTax,
            total,
            status,
          };

          await axios.put(`${apiUrl}/api/order/${orderId}`, newOrderData);
          // Toast for updating order
          toast.success("تم تحديث الطلب بنجاح!");
          cashierSocket.emit(
            "neworder",
            ` اضافت طاولة${lastTableOrderActive.tableNumber} طلبات جديدة`
          );
        } else {
          const products = [...itemsInCart, ...oldProducts];
          const newOrderData = {
            products,
            subTotal,
            addition: newAddition,
            discount: newDiscount,
            salesTax: newsalesTaxt,
            serviceTax: newserviceTax,
            total,
            status: "Pending",
          };

          await axios.put(`${apiUrl}/api/order/${orderId}`, newOrderData);
          // Toast for updating order
          cashierSocket.emit(
            "neworder",
            ` اضافت طاولة${lastTableOrderActive.tableNumber} طلبات جديدة`
          );

          toast.success("تم تحديث الطلب بنجاح!");
        }
      } else {
        // Create a new order
        const serial = createSerial();
        const table = allTable.find((t) => t._id === tableId) ? tableId : null;
        const user = allUsers.find((u) => u._id === tableId) ? tableId : null;
        const products = [...itemsInCart];
        const subTotal = costOrder;
        const total = subTotal + salesTax + serviceTax;
        const orderType = "Internal";

        const newOrderData = {
          serial,
          products,
          subTotal,
          salesTax,
          serviceTax,
          total,
          table,
          user,
          orderType,
        };

        await axios.post(`${apiUrl}/api/order`, newOrderData);
        // Toast for creating a new order
        toast.success("تم إنشاء طلب جديد بنجاح!");
        cashierSocket.emit(
          "neworder",
          `اوردر جديد علي طاوله ${table.tableNumber}`
        );
      }

      // Reset cart items and reload products
      setitemsInCart([]);
      setitemId([]);
      getAllProducts();
    } catch (error) {
      console.error(error);
      // Toast for error
      toast.error("حدث خطأ أثناء إنشاء/تحديث الطلب");
    } finally {
      setIsLoading(false);
    }
  };


    const invoice = async (clientId) => {
      if (!clientId) {
        toast.error("يرجى تسجيل الدخول أو مسح رمز الاستجابة السريعة");
        return;
      }
  
      try {
        // Log client ID for debugging
        console.log(clientId);
  
        // Filter orders related to the client's table
        const tableOrder =
          allOrders &&
          allOrders.filter(
            (order) => order.table && order.table._id === clientId
          );
        const lastTableOrder = tableOrder.length > 0 ? tableOrder[0] : null;
        const lastTableOrderActive = lastTableOrder
          ? lastTableOrder.isActive
          : false;
  
        // Filter orders related to the user
        const userOrder =
          allOrders &&
          allOrders.filter((order) => order.user && order.user._id === clientId);
        const lastUserOrder = userOrder.length > 0 ? userOrder[0] : null;
        const lastUserOrderActive = lastUserOrder
          ? lastUserOrder.isActive
          : false;
  
        // Fetch and set order details based on the active order found
        if (lastTableOrderActive) {
          const orderId = lastTableOrder._id;
          const myOrder = await axios.get(`${apiUrl}/api/order/${orderId}`);
          const data = myOrder.data;
  
          // Update state with the order details
          settablenum(data.tableNumber);
          setmyOrder(data);
          setmyOrderId(data._id);
          setlistProductsOrder(data.products);
          setorderUpdateDate(data.updatedAt);
          setorderTotal(data.total);
          setorderSubtotal(data.subTotal);
          setitemsInCart([]);
        } else if (lastUserOrderActive) {
          const orderId = lastUserOrder._id;
          const myOrder = await axios.get(`${apiUrl}/api/order/${orderId}`);
          const data = myOrder.data;
  
          // Update state with the order details
          setmyOrder(data);
          setmyOrderId(data._id);
          setlistProductsOrder(data.products);
          setorderUpdateDate(data.updatedAt);
          setorderTotal(data.total);
          setorderSubtotal(data.subTotal);
          setorderdeliveryFee(data.deliveryFee);
          setitemsInCart([]);
        } else {
          toast.info("لا توجد طلبات نشطة لهذا العميل");
        }
      } catch (error) {
        console.error("Error fetching the invoice:", error);
        toast.error("حدث خطأ أثناء جلب الفاتورة");
      }
    };
  


      const checkout = async () => {
        try {
          const id = myOrderId;
          const isActive = false;
          const help = "Requesting the bill";
          const helpStatus = "Not send";
    
          // Update order to mark it for checkout
          const updatedOrder = await axios.put(`${apiUrl}/api/order/${id}`, {
            isActive,
            help,
            helpStatus,
          });
          if (updatedOrder) {
            // Show success toast after successfully marking order for checkout
            toast.success("تم طلب الحساب");
            cashierSocket.emit("helprequest", `  طاولة${tablenum} تطلب الحساب`);
    
            // Redirect after 10 minutes
            setTimeout(() => {
              window.location.href = `https://${window.location.hostname}`;
            }, 60000 * 10);
          }
        } catch (error) {
          console.log(error);
          // Show error toast if there's an issue with marking the order for checkout
          toast.error("حدث خطأ اثناء طلب الحساب ! حاول مره اخري");
        }
      };

    useMemo(() =>
        [second])
    return (
        <ClientContext.Provider >
            {childern}
        </ClientContext.Provider>

    )
}

export default ClientProvider