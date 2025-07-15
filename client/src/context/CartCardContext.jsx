// CartContext.jsx - Manages cart state and product operations
import { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'react-toastify';

const CartCardContext = createContext();
export const useCartCard = () => useContext(CartCardContext);

export const CartCardProvider = ({ children }) => {
  // States
  const [itemsInCart, setItemsInCart] = useState([]);
  const [itemId, setItemId] = useState([]);
  const [count, setCount] = useState(0);
  const [productNote, setProductNote] = useState('');
  const [productExtras, setProductExtras] = useState([]);
  const [costOrder, setCostOrder] = useState(0);
  const [productOrderToUpdate, setProductOrderToUpdate] = useState([]);
  const [menuCategoryId, setMenuCategoryId] = useState("");

  // Filter menu by category
  const filterByMenuCategoryId = (e) => setMenuCategoryId(e.target.value);

  // Add product note
  const addNoteToProduct = (e, productId, sizeId) => {
    e.preventDefault();
    const findProduct = productOrderToUpdate.length > 0
      ? productOrderToUpdate.find((p) => p._id === productId)
      : allProducts.find((p) => p._id === productId);
    if (!findProduct) return;

    if (sizeId) {
      findProduct.sizes?.forEach((s) => {
        if (s._id === sizeId) s.notes = productNote;
      });
      itemsInCart.forEach((item) => {
        if (item.productId === productId && item.sizeId === sizeId) item.notes = productNote;
      });
    } else {
      findProduct.notes = productNote;
      itemsInCart.forEach((item) => {
        if (item.productId === productId) item.notes = productNote;
      });
    }
  };

  // Add extra selections to cart item
  const toggleExtraSelectionForProduct = (extra, productIndex) => {
    const updatedExtras = [...productExtras];
    if (!updatedExtras[productIndex]) {
      updatedExtras[productIndex] = { extraDetails: [], totalExtrasPrice: 0 };
    }
    const existing = updatedExtras[productIndex].extraDetails;
    const exists = existing.some((d) => d.extraId === extra._id);

    if (exists) {
      updatedExtras[productIndex].extraDetails = existing.filter((d) => d.extraId !== extra._id);
      updatedExtras[productIndex].totalExtrasPrice -= extra.price;
    } else {
      updatedExtras[productIndex].extraDetails.push({ extraId: extra._id, name: extra.name, price: extra.price });
      updatedExtras[productIndex].totalExtrasPrice += extra.price;
    }
    setProductExtras(updatedExtras);
    calculateOrderCost();
  };

  // Apply selected extras to product in cart
  const applyExtrasToCartProduct = (e, productId, sizeId) => {
    e.preventDefault();
    if (!productExtras.length) return;
    const target = productOrderToUpdate.length > 0
      ? productOrderToUpdate.find((p) => p._id === productId)
      : allProducts.find((p) => p._id === productId);
    if (!target) return;

    if (sizeId) {
      target.sizes?.forEach((s) => { if (s._id === sizeId) s.extrasSelected = productExtras; });
      itemsInCart.forEach((item) => {
        if (item.productId === productId && item.sizeId === sizeId) item.extras = productExtras;
      });
    } else {
      target.extrasSelected = productExtras;
      itemsInCart.forEach((item) => {
        if (item.productId === productId) item.extras = productExtras;
      });
    }
    calculateOrderCost();
    setProductExtras([]);
  };

  // Add item to cart
  const addItemToCart = (productId, sizeId) => {
    const cartItem = allProducts.find((item) => item._id === productId);
    if (!cartItem) return;
    let newItem = {
      productId: cartItem._id,
      name: cartItem.name,
      quantity: cartItem.quantity || 0,
      notes: cartItem.notes || "",
      price: cartItem.price,
      priceAfterDiscount: cartItem.priceAfterDiscount,
      hasExtras: cartItem.hasExtras,
      image: cartItem.image,
      extras: cartItem.extrasSelected || []
    };

    if (sizeId && cartItem.sizes?.length) {
      const size = cartItem.sizes.find((s) => s._id === sizeId);
      if (size) {
        newItem = { ...newItem, sizeId: size._id, size: size.sizeName, price: size.sizePrice, quantity: size.sizeQuantity, priceAfterDiscount: size.sizePriceAfterDiscount };
      }
    }

    const exists = itemsInCart.find((item) => item.productId === productId && (!sizeId || item.sizeId === sizeId));
    if (!exists) {
      setItemsInCart([...itemsInCart, newItem]);
      setItemId([...itemId, sizeId || productId]);
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

  // Calculate order total cost
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

  // Context value
  const cartValue = useMemo(() => ({
    itemsInCart,
    setItemsInCart,
    costOrder,
    setCostOrder,
    addItemToCart,
    deleteItemFromCart,
    incrementProductQuantity,
    decrementProductQuantity,
    applyExtrasToCartProduct,
    toggleExtraSelectionForProduct,
    addNoteToProduct,
    setProductNote,
    filterByMenuCategoryId,
  }), [itemsInCart, costOrder]);

  return (
    <CartCardContext.Provider value={cartValue}>
      {children}
    </CartCardContext.Provider>
  );
};
