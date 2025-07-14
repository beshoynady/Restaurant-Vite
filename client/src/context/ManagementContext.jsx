import React,{useState, useEffect, useMemo, createContext, useContext} from 'react'

const ManagementContext = createContext();
export const useManagement = useContext(ManagementContext)

export const ManagementProvider = ({Children}) => {

  
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
    
      const [StartDate, setStartDate] = useState(new Date());
      const [EndDate, setEndDate] = useState(new Date());
    
      const filterByDateRange = (array) => {
        const start = new Date(StartDate);
        const end = new Date(EndDate);
    
        const filtered = array.filter((item) => {
          const createdAt = new Date(item.createdAt);
          return createdAt >= start && createdAt <= end;
        });
    
        return filtered;
      };

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

  const createSerial = () => {
    const serial =
      allOrders && allOrders.length > 0
        ? String(Number(allOrders[0].serial) + 1).padStart(6, "0")
        : "000001";
    return serial;
  };
    
      // ++++++++++ order ++++++++++++

      const [allOrders, setAllOrders] = useState([]);
      const getAllOrders = async () => {
        try {
          const config = await handleGetTokenAndConfig();
          // Fetch all orders from the API
          const response = await axios.get(apiUrl + "/api/order", config);
          console.log({ order: response });
          // Check if response is successful
          if (response.status !== 200) {
            throw new Error("Failed to fetch orders.");
          }
    
          // Set fetched orders in the state
          setAllOrders(response.data.reverse());
        } catch (error) {
          // Handle errors
          console.error("Error fetching orders:", error.message);
          // You can add additional error handling logic here, such as displaying an error message to the user.
        }
      };
    
      //+++++++++++ table ++++++++++++++
      const [allTable, setAllTable] = useState([]);
    
      const getAllTable = async () => {
        try {
          const response = await axios.get(apiUrl + "/api/table");
    
          if (response.status === 200) {
            const tables = response.data.allTables || [];
    
            if (tables.length === 0) {
              console.warn(
                "No tables found. The restaurant may be new or data is missing."
              );
              toast.warn(
                "No tables found. The restaurant may be new or data is missing."
              );
            }
    
            setAllTable(tables);
            console.log("Tables retrieved successfully:", tables);
          } else {
            console.error("Unexpected response status:", response.status);
          }
        } catch (error) {
          console.error(
            "Error getting all tables:",
            error?.response?.data?.message || error.message
          );
        }
      };
    
      // +++++++++++++++ user +++++++++++++
      const [allUsers, setAllUsers] = useState([]);
      const getAllUsers = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/user`);
          if (response.status === 200) {
            setAllUsers(response.data);
          } else {
            console.error(
              "Failed to fetch users data: Unexpected response status",
              response.status
            );
          }
        } catch (error) {
          console.error("Error fetching users data:", error);
        }
      };
    
      const [allEmployees, setAllEmployees] = useState([]);
      const getAllEmployees = async () => {
        try {
          const config = await handleGetTokenAndConfig();
          const response = await axios.get(`${apiUrl}/api/employee`, config);
    
          if (response.status === 200) {
            setAllEmployees(response.data);
            console.log("Employees data fetched successfully:", response.data);
          } else {
            console.error(
              "Failed to fetch employees data: Unexpected response status",
              response.status
            );
            // يمكنك إطلاق استثناء هنا أو عرض رسالة خطأ للمستخدم
          }
        } catch (error) {
          console.error("Error fetching employees data:", error);
          // يمكنك إطلاق استثناء هنا أو عرض رسالة خطأ للمستخدم
        }
      };
    
  const [newlistofproductorder, setnewlistofproductorder] = useState([]);
  const getOrderProductForTable = async (e, tableId) => {
    e.preventDefault();
    const config = await handleGetTokenAndConfig();

    // setIsLoading(true)
    try {
      const tableorder =
        allOrders &&
        allOrders.filter(
          (order, i) => order.table && order.table._id === tableId
        );
      const lasttableorder =
        tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
      const lasttableorderactive = lasttableorder.isActive;
      // console.log({ lasttableorder });
      // console.log({ lasttableorderactive });
      if (lasttableorderactive) {
        const id = await lasttableorder._id;
        const myOrder = await axios.get(apiUrl + "/api/order/" + id);
        const data = myOrder.data;
        // console.log(data);
        // console.log(data._id);
        // console.log({ listProductsOrder: data.products });
        setmyOrder(data);
        setmyOrderId(data._id);
        setorderTotal(data.total);
        setorderaddition(data.addition);
        setorderdiscount(data.discount);
        setorderSubtotal(data.subTotal);
        setlistProductsOrder(data.products);
        setnewlistofproductorder(data.products);
        // console.log({ JSONlistProductsOrder: JSON.parse(JSON.stringify(data.products)) });
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء جلب بيانات الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };


   const [myOrder, setmyOrder] = useState({});
    const [listProductsOrder, setlistProductsOrder] = useState([]);
    const [orderUpdateDate, setorderUpdateDate] = useState("");
    const [myOrderId, setmyOrderId] = useState();
    const [tablenum, settablenum] = useState();
    const [orderTotal, setorderTotal] = useState();
    const [orderSubtotal, setorderSubtotal] = useState();
    const [orderdeliveryFee, setorderdeliveryFee] = useState();
    const [orderdiscount, setorderdiscount] = useState(0);
    const [orderaddition, setorderaddition] = useState(0);
    const [discount, setdiscount] = useState(0);
    const [addition, setaddition] = useState(0);
  
    const [clientname, setclientname] = useState("");
    const [clientNotes, setclientNotes] = useState("");
    const [clientphone, setclientphone] = useState("");
    const [clientaddress, setclientaddress] = useState("");
    const [deliveryAreaId, setdeliveryAreaId] = useState(0);
    const [deliveryFee, setdeliveryFee] = useState(0);
  
    const [salesTax, setsalesTax] = useState(0);
    const [serviceTax, setserviceTax] = useState(0);
  
    const createWaiterOrderForTable = async (tableId, waiterId) => {
      setIsLoading(true);
      try {
        const config = await handleGetTokenAndConfig();
        // Check for active orders for the table
        const tableOrder =
          allOrders &&
          allOrders.filter((order) => order.table && order.table._id === tableId);
        const lastTableOrder = tableOrder.length > 0 ? tableOrder[0] : null;
        const lastTableOrderActive = lastTableOrder
          ? lastTableOrder.isActive
          : false;
  
        if (lastTableOrderActive) {
          // Update the existing order
          const orderId = lastTableOrder._id;
          const orderData =
            allOrders && allOrders.find((order) => order._id === orderId);
          const oldProducts = orderData.products;
          const oldSubTotal = orderData.subTotal;
          const oldTotal = orderData.total;
          const newAddition = orderData.addition + addition;
          const newDiscount = orderData.discount + discount;
          const newsalesTaxt = orderData.salesTax + salesTax;
          const newserviceTax = orderData.serviceTax + serviceTax;
          const products = [...itemsInCart, ...oldProducts];
          const subTotal = oldSubTotal + costOrder;
          const total =
            oldTotal + costOrder + salesTax + serviceTax + addition - discount;
          const status = "Pending";
          const createdBy = waiterId;
  
          const updatedOrder = await axios.put(
            `${apiUrl}/api/order/${orderId}`,
            {
              products,
              subTotal,
              addition: newAddition,
              discount: newDiscount,
              salesTax: newsalesTaxt,
              serviceTax: newserviceTax,
              total,
              status,
              createdBy,
            },
            config
          );
          toast.success("تم تحديث الطلب بنجاح!");
          cashierSocket.emit("neworder", "اوردر جديد من الويتر");
          setItemsInCart([]);
          setItemsInCart([]);
          setaddition(0);
          setdiscount(0);
          setclientname("");
          setclientNotes("");
          setclientphone("");
          setclientaddress("");
          setdeliveryAreaId(0);
          setdeliveryFee(0);
          setsalesTax(0);
          setserviceTax(0);
        } else {
          // Create a new order
          const serial = createSerial();
          const products = [...itemsInCart];
          const subTotal = costOrder;
          const total = subTotal + salesTax + serviceTax + addition - discount;
          const orderType = "Internal";
  
          const newOrder = await axios.post(
            `${apiUrl}/api/order`,
            {
              serial,
              table: tableId,
              products,
              subTotal,
              discount,
              addition,
              salesTax,
              serviceTax,
              total,
              orderType,
              createdBy: waiterId,
            },
            config
          );
  
          toast.success("تم إنشاء طلب جديد بنجاح!");
          cashierSocket.emit("neworder", "اوردر جديد من الويتر");
          setItemsInCart([]);
          setItemsInCart([]);
          setaddition(0);
          setdiscount(0);
          setclientname("");
          setclientNotes("");
          setclientphone("");
          setclientaddress("");
          setdeliveryAreaId(0);
          setdeliveryFee(0);
          setsalesTax(0);
          setserviceTax(0);
        }
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsLoading(false);
      }
    };
  
    const createcashierOrder = async (
      cashierId,
      clientName,
      clientPhone,
      clientAddress,
      orderType,
      deliveryFee,
      discount,
      addition
    ) => {
      // setIsLoading(true)
      try {
        const config = await handleGetTokenAndConfig();
  
        const dayOrders =
          allOrders &&
          allOrders.filter(
            (order) =>
              new Date(order.createdAt).toDateString() ===
              new Date().toDateString()
          );
        const takeawayOrders =
          dayOrders &&
          dayOrders.filter((order) => order.orderType === "Takeaway");
        const orderNum =
          orderType === "Takeaway"
            ? takeawayOrders.length === 0
              ? 1
              : takeawayOrders[0].orderNum + 1
            : null;
  
        const serial = createSerial();
  
        const products = [...itemsInCart];
  
        const subTotal = costOrder;
  
        const total =
          subTotal + salesTax + serviceTax + deliveryFee + addition - discount;
  
        const name = clientName;
        const phone = clientPhone;
        const address = clientAddress;
        const createdBy = cashierId;
        const cashier = cashierId;
        const status = "Approved";
  
        const newOrder = await axios.post(
          `${apiUrl}/api/order`,
          {
            serial,
            orderNum,
            products,
            subTotal,
            deliveryFee,
            salesTax,
            serviceTax,
            discount,
            addition,
            total,
            orderType,
            createdBy,
            cashier,
            name,
            phone,
            address,
            status,
          },
          config
        );
  
        if (newOrder) {
          toast.success("تم إنشاء الطلب بنجاح");
          setItemsInCart([]);
          setItemsInCart([]);
          setaddition(0);
          setdiscount(0);
          setclientname("");
          setclientNotes("");
          setclientphone("");
          setclientaddress("");
          setdeliveryAreaId(0);
          setdeliveryFee(0);
          setsalesTax(0);
          setserviceTax(0);
          cashierSocket.emit("orderkitchen", "استلام اوردر ديليفري جديد");
        } else {
          throw new Error("هناك خطأ في إنشاء الطلب");
        }
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ. يرجى المحاولة مرة أخرى");
      } finally {
        setIsLoading(false);
      }
    };

  const putNumOfPaid = (id, sizeid, numOfPaid) => {
    try {
      console.log({ listProductsOrder, newlistofproductorder });

      const updatedProducts = newlistofproductorder.map((product) => {
        if (
          (sizeid &&
            product.productId._id === id &&
            product.sizeId === sizeid) ||
          (!sizeid && product.productId._id === id && !product.sizeId)
        ) {
          const originalProduct = listProductsOrder.find(
            (pro) =>
              (sizeid && pro.productId._id === id && pro.sizeId === sizeid) ||
              (!sizeid && pro.productId._id === id && !pro.sizeId)
          );

          if (originalProduct) {
            return {
              ...product,
              numOfPaid: originalProduct.numOfPaid + numOfPaid,
            };
          }
        }
        return product;
      });

      setnewlistofproductorder(updatedProducts);
      console.log({ listProductsOrder, updatedProducts });

      calcSubtotalSplitOrder(updatedProducts);
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred while updating the number of paid products."
      );
    }
  };

  const [subtotalSplitOrder, setsubtotalSplitOrder] = useState(0);

  const calcSubtotalSplitOrder = (products = newlistofproductorder) => {
    try {
      let total = 0;

      products.forEach((product) => {
        let originalProduct;

        if (product.sizeId) {
          originalProduct = listProductsOrder.find(
            (pro) =>
              pro.productId._id === product.productId._id &&
              pro.sizeId === product.sizeId
          );
        } else {
          originalProduct = listProductsOrder.find(
            (pro) => pro.productId._id === product.productId._id
          );
        }

        if (originalProduct) {
          const numOfPaidDifference = Math.abs(
            originalProduct.numOfPaid - product.numOfPaid
          );
          console.log({ numOfPaidDifference });

          const priceToUse =
            originalProduct.priceAfterDiscount > 0
              ? originalProduct.priceAfterDiscount
              : originalProduct.price;
          const subTotal = numOfPaidDifference * priceToUse;

          total += subTotal;
        }
      });

      setsubtotalSplitOrder(total);
      console.log({ total, products });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حساب المجموع للطلب المقسم.");
    }
  };

  const handlePayExtras = (productIndex, extraId, isPaid) => {
    const updatedProducts = newlistofproductorder.map((product, i) => {
      if (i === productIndex) {
        return {
          ...product,
          extras: product.extras.map((extra, j) => {
            if (extra) {
              if (extra._id === extraId) {
                isPaid
                  ? setsubtotalSplitOrder(
                      subtotalSplitOrder + extra.totalExtrasPrice
                    )
                  : setsubtotalSplitOrder(
                      subtotalSplitOrder - extra.totalExtrasPrice
                    );
                return {
                  ...extra,
                  isPaid: isPaid,
                };
              }
              return extra;
            }
          }),
        };
      }
      return product;
    });

    setnewlistofproductorder(updatedProducts);
    // calculateExtrasSubtotal(updatedProducts);
  };

  // Function to split the invoice and pay a portion of it
  const splitInvoice = async (e) => {
    try {
      e.preventDefault();

      console.log({ newlistofproductorder });
      // Send a PUT request to update the order with split details
      const updateOrder = await axios.put(`${apiUrl}/api/order/${myOrderId}`, {
        products: newlistofproductorder,
        isSplit: true,
        subtotalSplitOrder,
      });
      if (updateOrder) {
        console.log({ updateOrder });
        // Display a success toast message upon successful payment
        toast.success("تم دفع جزء من الفاتورة بنجاح");

        // Log the updated order details
        // console.log({ updateOrder });
      }
    } catch (error) {
      // Display an error toast message if payment fails
      toast.error("حدث خطأ أثناء دفع جزء من الفاتورة");

      // Log the error to the console
      console.error("Error updating order:", error);
    }
  };

  const lastInvoiceByCashier = async (checkId) => {
    try {
      // Filter orders created by the employee
      const employeeOrders =
        allOrders?.filter((order) => order.createdBy?._id === checkId) || [];

      // Get the last order created by the employee
      const lastEmployeeOrder =
        employeeOrders[employeeOrders.length - 1] || null;

      if (lastEmployeeOrder) {
        // Check if the last employee order is active
        const lastEmployeeOrderActive = await lastEmployeeOrder.isActive;

        if (lastEmployeeOrderActive) {
          // If the order is active, fetch its details
          const { _id: orderId } = lastEmployeeOrder;
          const response = await axios.get(`${apiUrl}/api/order/${orderId}`);
          const orderData = response.data;

          // Update states with order details
          setmyOrder(orderData);
          setmyOrderId(orderData._id);
          setlistProductsOrder(orderData.products);
          setorderUpdateDate(orderData.updatedAt);
          setorderTotal(orderData.total);
          setorderaddition(orderData.addition);
          setorderdiscount(orderData.discount);
          setorderSubtotal(orderData.subTotal);
          setorderdeliveryFee(orderData.deliveryFee);
          setItemsInCart([]);
        }
      } else {
        // Handle the case when there are no orders for the employee
        toast.info("No orders found for this employee.");
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error("Error fetching the last invoice:", error);

      // Display an error toast message
      toast.error("An error occurred while fetching the invoice.");
    }
  };

    //######### get order ditalis by serial

  const [orderDetalisBySerial, setorderDetalisBySerial] = useState({});
  const [productOrderToUpdate, setProductOrderToUpdate] = useState([]);

  const getOrderDetailsBySerial = async (e, serial) => {
    e.preventDefault();

    if (!serial) {
      toast.error("يرجى إدخال رقم مسلسل صالح.");
      return;
    }

    try {
      const res = await axios.get(`${apiUrl}/api/order`);
      const orders = res.data;

      if (!orders || orders.length === 0) {
        toast.warn("لم يتم العثور على أي طلبات.");
        return;
      }

      const order = orders.find((o) => o.serial === serial);

      if (!order) {
        toast.warn(`لم يتم العثور على طلب بهذا الرقم: ${serial}`);
        return;
      }

      setorderDetalisBySerial(order);
      setProductOrderToUpdate(order.products || []);
      setaddition(order.addition || 0);
      setdiscount(order.discount || 0);

      toast.success("تم جلب تفاصيل الطلب بنجاح.");
    } catch (error) {
      console.error("حدث خطأ أثناء جلب تفاصيل الطلب:", error);

      if (error.response) {
        toast.error(
          `خطأ: ${error.response.data.message || "فشل في جلب تفاصيل الطلب."}`
        );
      } else if (error.request) {
        toast.error("خطأ في الشبكة: تعذر الوصول إلى السيرفر.");
      } else {
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const updateOrder = async (e) => {
    e.preventDefault();
    const id = orderDetalisBySerial._id;
    setIsLoading(true);

    try {
      const subTotal = costOrder;
      const total = subTotal + addition - discount;

      console.log({ subTotal });
      console.log({ total });
      console.log({ updatelist: productOrderToUpdate });

      const response = await axios.put(`${apiUrl}/api/order/${id}`, {
        products: productOrderToUpdate,
        subTotal,
        discount,
        addition,
        total,
      });

      if (response.status === 200) {
        setorderDetalisBySerial({});
        setProductOrderToUpdate([]);
        setaddition(0);
        setdiscount(0);
        toast.success("تم تعديل الاوردر");
      } else {
        throw new Error("هناك خطأ في تعديل الاوردر");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("حدث خطأ أثناء تعديل الأوردر.");
    } finally {
      setIsLoading(false);
    }
  };

    const [isDarkMode, setIsDarkMode] = useState(false);
  
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


  return (
    <ManagementContext.Provider >
        {Children}
    </ManagementContext.Provider>
  )
}

