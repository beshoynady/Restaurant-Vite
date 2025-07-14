import react, { useState, useEffect, useMemo, createContext, useContext } from "react";
import axios from "axios";

const SharedContext = createContext()

export const useShared = useContext(SharedContext)

export const SharedProvider = ({ childern }) => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
    // return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes
      } ${ampm}`;
    return formattedTime;
  };
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    // Get the hour and minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Convert the hour to 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 12-hour format 12 denotes noon

    // Add leading zero to hours and minutes if less than 10
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Format the time
    const formattedTime = hours + ":" + minutes + " " + ampm;

    // Format the date
    const formattedDate = formatDate(date);

    return formattedDate + " " + formattedTime;
  };


    // Reataurant data //
    const [restaurantData, setrestaurantData] = useState({});
    const getRestaurant = async () => {
      try {
        const config = await handleGetTokenAndConfig(); // Get the token and config
        const response = await axios.get(`${apiUrl}/api/restaurant/`, config);
        if (response.status === 200 && response.data.length > 0) {
          const restaurantData = response.data[0];
  
          const currentDate = new Date();
          const subscriptionEndDate = new Date(restaurantData.subscriptionEnd);
  
          if (currentDate > subscriptionEndDate) {
            toast.error(
              "انتهت صلاحية الاشتراك. يرجى تجديد الاشتراك للاستمرار في استخدام النظام.",
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
                className: "big-toast",
              }
            );
            // throw new Error('Subscription has ended.');
          }
          setrestaurantData(restaurantData);
          // toast.success('تم جلب بيانات المطعم بنجاح!');
        } else {
          toast.error("لم يتم العثور على بيانات المطعم..");
          throw new Error("لم يتم العثور على بيانات المطعم.");
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        toast.error("حدث خطأ أثناء جلب بيانات المطعم.");
      }
    };

  //+++++++++++++++++ product ++++++++++++++++++++
  const [allProducts, setAllProducts] = useState([]);
  const [productsOffer, setProductsOffer] = useState([]);
  const [sizesOffer, setSizesOffer] = useState([]);

  const getAllProducts = async () => {
    try {
      // Fetch products from the API
      const response = await axios.get(apiUrl + "/api/product");

      // Check if response is successful
      if (response.status !== 200) {
        throw new Error("Failed to fetch products.");
      }

      const productsList = response.data;

      if (permissionsList) {
        // Set fetched products in the state
        setAllProducts(productsList);

        // Filter products with discount
        const proOffer =
          productsList && productsList.filter((pro) => pro.discount > 0);
        setProductsOffer(proOffer);

        // Filter products that have sizes with discount
        const sizOffer = [];
        productsList.forEach((pro) => {
          if (pro.hasSizes) {
            pro.sizes.forEach((size) => {
              if (size.sizeDiscount > 0) {
                sizOffer.push(size);
              }
            });
          }
        });
        setSizesOffer(sizOffer);
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching products:", error);
      // Additional error handling logic can be added here, such as displaying an error message to the user.
    }
  };

  //+++++++ menu category +++++++++++
  const [allMenuCategories, setAllMenuCategories] = useState([]);
  const getAllMenuCategories = async () => {
    try {
      const config = await handleGetTokenAndConfig();
      // Fetch all categories from the API
      const response = await axios.get(apiUrl + "/api/menucategory", config);

      // Check if response is successful
      if (response.status !== 200) {
        throw new Error("Failed to fetch categories.");
      }
      const allMenuCategories = response.data;
      const activeMenuCategories =
        allMenuCategories &&
        allMenuCategories.filter(
          (menuCategory) => menuCategory.status === true
        );
      // Set fetched categories in the state
      console.log({ activeMenuCategories });

      setAllMenuCategories(activeMenuCategories);

      const mainCategory =
        activeMenuCategories &&
        activeMenuCategories.filter(
          (menuCategory) => menuCategory.isMain === true
        )[0];
      if (mainCategory) {
        setMenuCategoryId(mainCategory._id);
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching categories:", error);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  };


  // ----------- reservation table------------//
  //============================================
  
    const [allReservations, setAllReservations] = useState([]);
    const getAllReservations = async () => {
      try {
        const config = await handleGetTokenAndConfig();
  
        const response = await axios.get(`${apiUrl}/api/reservation`, config);
        if (response.data) {
          setAllReservations(response.data);
        } else {
          console.log("No data returned from the server");
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

  const [availableTableIds, setavailableTableIds] = useState([]);

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
      // setIsLoading(true)

      // Logging input data for debugging purposes
      // console.log({ tableId, tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy });

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
        customerName,
        customerPhone,
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


  const [menuCategoryId, setMenuCategoryId] = useState("");
  
    const filterByMenuCategoryId = (e) => {
      // console.log(e.target.value)
      setMenuCategoryId(e.target.value);
    };
  
    const [count, setCount] = useState(0);
  
    const incrementProductQuantity = (productId, sizeId) => {
      try {
        // incrementProductQuantity the count state
        setCount(count + 1);
        console.log({ productOrderToUpdate, productId, sizeId });
        // Find the product either in the order or in all products
        const findProduct =
          productOrderToUpdate.length > 0
            ? productOrderToUpdate.find((product) => product._id === productId)
            : allProducts.find((product) => product._id === productId);
  
        if (!findProduct) {
          throw new Error("Product not found.");
        }
  
        if (findProduct.hasSizes) {
          findProduct.sizes.map((size) => {
            if (size._id === sizeId) {
              // incrementProductQuantity the quantity of the found product
              size.sizeQuantity += 1;
            }
          });
          itemsInCart.map((item) => {
            if (item.productId === productId && item.sizeId === sizeId) {
              item.quantity += 1;
            }
          });
        } else if (!findProduct.hasSizes) {
          // incrementProductQuantity the quantity of the found product
          findProduct.quantity += 1;
          itemsInCart.map((item) => {
            if (item.productId === productId) {
              item.quantity += 1;
            }
          });
        }
  
        console.log(findProduct);
        console.log(itemsInCart);
      } catch (error) {
        console.error("Error incrementing product quantity:", error.message);
        // You can handle the error appropriately, such as displaying an error message to the user.
      }
    };
  
    const decrementProductQuantity = (productId, sizeId) => {
      try {
        // Decrement the count state
        setCount(count - 1);
  
        // Find the product either in the order or in all products
        const findProduct =
          productOrderToUpdate.length > 0
            ? productOrderToUpdate.find((product) => product._id === productId)
            : allProducts.find((product) => product._id === productId);
  
        console.log({ findProduct });
        if (!findProduct) {
          throw new Error("Product not found.");
        }
  
        if (findProduct.hasSizes) {
          findProduct.sizes.map((size) => {
            if (size._id === sizeId) {
              // incrementProductQuantity the quantity of the found product
              if (size.sizeQuantity < 2) {
                size.sizeQuantity = 0;
                findProduct.notes = "";
                deleteItemFromCart(productId, sizeId);
              } else {
                size.sizeQuantity -= 1;
              }
            }
          });
          itemsInCart.map((item) => {
            if (item.productId === productId && item.sizeId === sizeId) {
              // incrementProductQuantity the quantity of the found product
              if (item.quantity < 2) {
                item.quantity = 0;
                findProduct.notes = "";
                deleteItemFromCart(productId, sizeId);
              } else {
                item.quantity -= 1;
              }
            }
          });
        } else if (!findProduct.hasSizes) {
          // incrementProductQuantity the quantity of the found product
          if (findProduct.quantity < 2) {
            findProduct.quantity = 0;
            findProduct.notes = "";
            deleteItemFromCart(productId);
          } else {
            findProduct.quantity -= 1;
            itemsInCart.map((item) => {
              if (item.productId === productId) {
                item.quantity -= 1;
              }
            });
          }
        }
      } catch (error) {
        console.error("Error decrementing product quantity:", error.message);
      }
    };
  
    const [productNote, setproductNote] = useState("");
  
    const addNoteToProduct = (e, productId, sizeId) => {
      try {
        e.preventDefault();
        console.log({ productNote, productId, sizeId });
        // Find the product either in the order or in all products
        const findProduct =
          productOrderToUpdate.length > 0
            ? productOrderToUpdate.find((product) => product._id === productId)
            : allProducts.find((product) => product._id === productId);
  
        if (!findProduct) {
          throw new Error("Product not found.");
        }
  
        if (sizeId) {
          findProduct.sizes.map((size) => {
            if (size._id === sizeId) {
              // incrementProductQuantity the quantity of the found product
              size.notes = productNote;
            }
          });
          itemsInCart.map((item) => {
            if (item.productId === productId && item.sizeId === sizeId) {
              item.notes = productNote;
            }
          });
        } else {
          // incrementProductQuantity the quantity of the found product
          findProduct.notes = productNote;
          itemsInCart.map((item) => {
            if (item.productId === productId) {
              item.notes = productNote;
            }
          });
        }
  
        console.log(findProduct);
        console.log(itemsInCart);
      } catch (error) {
        console.error("Error incrementing product quantity:", error.message);
        // You can handle the error appropriately, such as displaying an error message to the user.
      }
    };
  
    const [productExtras, setproductExtras] = useState([]);
  
    const handleAddProductExtras = (extra, ind) => {
      // console.log({productExtras, extra, ind})
      const newExtras = [...productExtras];
      console.log({ newExtras1: newExtras });
  
      if (newExtras.length > 0) {
        if (newExtras[ind]) {
          const filteredExtraDetails = newExtras[ind].extraDetails.filter(
            (detail) => detail.extraId !== extra._id
          );
          if (
            filteredExtraDetails.length !== newExtras[ind].extraDetails.length
          ) {
            // إذا كانت الإضافة موجودة وتمت إزالتها
            newExtras[ind].extraDetails = filteredExtraDetails;
            newExtras[ind].totalExtrasPrice -= extra.price; // تخفيض السعر بسعر الإضافة المزيلة
          } else {
            // إذا لم تكن الإضافة موجودة، قم بإضافتها
            newExtras[ind].extraDetails.push({
              extraId: extra._id,
              name: extra.name,
              price: extra.price,
            });
            newExtras[ind].totalExtrasPrice += extra.price; // زيادة السعر بسعر الإضافة المضافة
          }
        } else {
          // إذا لم يكن هناك إضافات للمنتج بعد، قم بإنشاء إدخال جديد
          newExtras[ind] = {
            extraDetails: [
              {
                extraId: extra._id,
                name: extra.name,
                price: extra.price,
              },
            ],
            totalExtrasPrice: extra.price,
          };
        }
      } else {
        // إذا كانت المصفوفة فارغة بالكامل، قم بإنشاء إدخال جديد
        newExtras[ind] = {
          extraDetails: [
            {
              extraId: extra._id,
              name: extra.name,
              price: extra.price,
            },
          ],
          totalExtrasPrice: extra.price,
        };
      }
      console.log({ newExtras2: newExtras });
      calculateOrderCost();
      setproductExtras(newExtras);
    };
  
    const addExtrasToProduct = (e, productId, sizeId) => {
      e.preventDefault();
      console.log({ productId, sizeId, productExtras });
      if (productExtras.length < 1) {
        return;
      }
      try {
        // Find the product either in the order or in all products
        const findProduct =
          productOrderToUpdate.length > 0
            ? productOrderToUpdate.find((product) => product._id === productId)
            : allProducts.find((product) => product._id === productId);
  
        if (!findProduct) {
          throw new Error("Product not found.");
        }
  
        if (sizeId) {
          findProduct.sizes.map((size) => {
            if (size._id === sizeId) {
              // Update the extras for the found product size
              size.extrasSelected = productExtras;
            }
          });
          itemsInCart.map((item) => {
            if (item.productId === productId && item.sizeId === sizeId) {
              item.extras = productExtras;
            }
          });
        } else {
          // Update the extras for the found product
          findProduct.extrasSelected = productExtras;
          itemsInCart.map((item) => {
            if (item.productId === productId) {
              item.extras = productExtras;
              // item.extrasSelected = productExtras;
            }
          });
        }
  
        console.log({ findProduct });
        console.log({ itemsInCart });
        calculateOrderCost();
        setproductExtras([]);
      } catch (error) {
        console.error("Error updating product extras:", error.message);
        // You can handle the error appropriately, such as displaying an error message to the user.
      }
    };
  
    const [itemId, setitemId] = useState([]);
    const [itemsInCart, setitemsInCart] = useState([]);
  
    const addItemToCart = (productId, sizeId) => {
      try {
        // setIsLoading(true)
        // Find the product to add to the cart
        const cartItem = allProducts.find((item) => item._id === productId);
  
        if (cartItem) {
          let newItem = {
            productId: cartItem._id,
            name: cartItem.name,
            quantity: 0,
            notes: "",
            price: 0,
            priceAfterDiscount: 0,
            hasExtras: cartItem.hasExtras,
            image: cartItem.image,
          };
  
          if (sizeId && cartItem.sizes && cartItem.sizes.length > 0) {
            const size = cartItem.sizes.find((size) => size._id === sizeId);
            console.log({ size });
            if (size) {
              newItem.sizeId = size._id;
              newItem.size = size.sizeName;
              newItem.price = size.sizePrice;
              newItem.quantity = size.sizeQuantity;
              newItem.priceAfterDiscount = size.sizePriceAfterDiscount;
              newItem.notes = size.notes ? size.notes : "";
              newItem.extras = size.extrasSelected ? size.extrasSelected : [];
            }
          } else {
            newItem.quantity = cartItem.quantity; // Set default quantity for products without sizes
            newItem.price = cartItem.price;
            newItem.priceAfterDiscount = cartItem.priceAfterDiscount;
            newItem.notes = cartItem.notes ? cartItem.notes : "";
            newItem.extras = cartItem.extrasSelected
              ? cartItem.extrasSelected
              : [];
          }
  
          console.log({ newItem });
          if (itemsInCart.length > 0) {
            if (sizeId) {
              const repeatedItem = itemsInCart.find(
                (item) => item.productId === productId && item.sizeId === sizeId
              );
              if (!repeatedItem) {
                setitemsInCart([...itemsInCart, newItem]);
                setitemId([...itemId, sizeId]);
              }
            } else {
              const repeatedItem = itemsInCart.find(
                (item) => item.productId === productId
              );
              if (!repeatedItem) {
                setitemsInCart([...itemsInCart, newItem]);
                setitemId([...itemId, productId]);
              }
            }
          } else {
            setitemsInCart([newItem]);
            setitemId([sizeId ? sizeId : productId]);
          }
        }
        // console.log({ itemsInCart })
      } catch (error) {
        console.error("Error adding item to cart:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    // delete item from cart by id
  
    const resetProductQuantityAndNotes = (productId, sizeId) => {
      try {
        // Find the product either in the order or in all products
        const productToUpdate =
          productOrderToUpdate.length > 0
            ? productOrderToUpdate.find((product) => product._id === productId)
            : allProducts.find((product) => product._id === productId);
  
        console.log({ productToUpdate });
        if (!productToUpdate) {
          throw new Error("Product not found.");
        }
  
        if (productToUpdate.hasSizes) {
          productToUpdate.sizes.filter(
            (size) => size._id === sizeId
          )[0].sizeQuantity = 0;
          productToUpdate.sizes.filter(
            (size) => size._id === sizeId
          )[0].extrasSelected = [];
          productToUpdate.sizes.filter((size) => size._id === sizeId)[0].notes =
            "";
        } else {
          // Reset the quantity and notes of the found product to zero
          productToUpdate.quantity = 0;
          productToUpdate.extrasSelected = [];
          productToUpdate.notes = "";
        }
        // console.log({ productToUpdate })
      } catch (error) {
        console.error(
          "Error resetting product quantity and notes:",
          error.message
        );
        // You can handle the error appropriately, such as displaying an error message to the user.
      }
    };
  
    const deleteItemFromCart = (id, sizeId) => {
      try {
        if (sizeId) {
          console.log({ itemsInCart, sizeId });
          // Determine which list to operate on based on the presence of items in productOrderToUpdate
          const updatedList =
            productOrderToUpdate.length > 0
              ? productOrderToUpdate.filter(
                  (product) => product.sizeId !== sizeId
                )
              : itemsInCart.filter((item) => item.sizeId !== sizeId);
  
          console.log({ updatedList });
          // Update the list of item IDs
          const updatedItemId = itemId.filter((itemId) => itemId !== sizeId);
          if (updatedList.length === 0) {
            getAllProducts();
            // return
          }
          // console.log({ itemsInCart })
          // Update the state based on the list being modified
          if (productOrderToUpdate.length > 0) {
            setproductOrderToUpdate(updatedList);
          } else {
            setitemsInCart(updatedList);
            setitemId(updatedItemId);
          }
  
          // Reset the quantity and notes of the deleted item
          resetProductQuantityAndNotes(id, sizeId);
        } else {
          console.log({ itemsInCart, id });
          // Determine which list to operate on based on the presence of items in productOrderToUpdate
          const updatedList =
            productOrderToUpdate.length > 0
              ? productOrderToUpdate.filter((product) => product.productId !== id)
              : itemsInCart.filter((item) => item.productId !== id);
  
          console.log({ updatedList });
          // Update the list of item IDs
          const updatedItemId = itemId.filter((itemId) => itemId !== id);
          if (updatedList.length === 0) {
            getAllProducts();
            // return
          }
  
          // Update the state based on the list being modified
          if (productOrderToUpdate.length > 0) {
            setproductOrderToUpdate(updatedList);
          } else {
            setitemsInCart(updatedList);
            setitemId(updatedItemId);
          }
  
          // Reset the quantity and notes of the deleted item
          resetProductQuantityAndNotes(id, sizeId);
        }
      } catch (error) {
        console.error("Error deleting item:", error.message);
        // You can handle the error appropriately, such as displaying an error message to the user.
      }
    };
  
    // Calculate costOrder of cart item
    const [costOrder, setcostOrder] = useState(0);
    const calculateOrderCost = () => {
      try {
        let totalCost = 0;
  
        // Determine which list to operate on based on the presence of items in itemsInCart or productOrderToUpdate
        const itemsList =
          itemsInCart.length > 0 ? itemsInCart : productOrderToUpdate;
  
        // Calculate total cost based on the items in the list
        itemsList.forEach((item) => {
          let totalExtras = 0; // Reset totalExtras for each item
          const itemTotalPrice =
            item.priceAfterDiscount > 0
              ? item.priceAfterDiscount * item.quantity
              : item.price * item.quantity;
  
          if (item.extras.length > 0) {
            item.extras.forEach((extra) => {
              if (extra) {
                totalExtras += extra.totalExtrasPrice;
              }
            });
          }
  
          item.totalprice = itemTotalPrice + totalExtras;
          totalCost += item.totalprice;
          totalExtras = 0;
        });
  
        console.log({ totalCost });
        // Update the state with the total cost
        setcostOrder(totalCost);
      } catch (error) {
        console.error("Error calculating order cost:", error.message);
        // You can handle the error appropriately, such as displaying an error message to the user.
      }
    };
  

  const sharedValue = useMemo(() =>
    apiUrl,
    isRefresh,
    isRefresh
        , [])

  return (
    <SharedContext.Provider value={sharedValue}>
      {childern}
    </SharedContext.Provider>
  )
}

