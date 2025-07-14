import { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'react-toastify';

const CartCardContext = createContext();
export const useCartCard = () => useContext(CartCardContext);

export const CartCardProvider = ({ children }) => {


    const [itemsInCart, setItemsInCart] = useState([]);
    const [itemId, setItemId] = useState([]);
    const [count, setCount] = useState(0);
    const [productNote, setProductNote] = useState('');
    const [productExtras, setProductExtras] = useState([]);
    const [costOrder, setCostOrder] = useState(0);
    const [productOrderToUpdate, setProductOrderToUpdate] = useState([]);


    const [menuCategoryId, setMenuCategoryId] = useState("");

    const filterByMenuCategoryId = (e) => {
        // console.log(e.target.value)
        setMenuCategoryId(e.target.value);
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


    const toggleExtraSelectionForProduct = (extra, productIndex) => {
        const updatedExtras = [...productExtras];

        // Ensure the current product has an extras object
        if (!updatedExtras[productIndex]) {
            updatedExtras[productIndex] = {
                extraDetails: [],
                totalExtrasPrice: 0,
            };
        }

        const existingExtras = updatedExtras[productIndex].extraDetails;
        const isAlreadySelected = existingExtras.some(
            (detail) => detail.extraId === extra._id
        );

        if (isAlreadySelected) {
            // Remove the extra if it exists
            updatedExtras[productIndex].extraDetails = existingExtras.filter(
                (detail) => detail.extraId !== extra._id
            );
            updatedExtras[productIndex].totalExtrasPrice -= extra.price;
        } else {
            // Add the extra
            updatedExtras[productIndex].extraDetails.push({
                extraId: extra._id,
                name: extra.name,
                price: extra.price,
            });
            updatedExtras[productIndex].totalExtrasPrice += extra.price;
        }

        setProductExtras(updatedExtras);
        calculateOrderCost();
    };

    const applyExtrasToCartProduct = (e, productId, sizeId) => {
        e.preventDefault();
        if (productExtras.length === 0) return;

        try {
            const targetProduct =
                productOrderToUpdate.length > 0
                    ? productOrderToUpdate.find((p) => p._id === productId)
                    : allProducts.find((p) => p._id === productId);

            if (!targetProduct) throw new Error("Product not found.");

            if (sizeId) {
                // Apply extras to specific size in product
                targetProduct.sizes.forEach((size) => {
                    if (size._id === sizeId) size.extrasSelected = productExtras;
                });

                itemsInCart.forEach((item) => {
                    if (item.productId === productId && item.sizeId === sizeId) {
                        item.extras = productExtras;
                    }
                });
            } else {
                // Apply extras to the product (no size)
                targetProduct.extrasSelected = productExtras;

                itemsInCart.forEach((item) => {
                    if (item.productId === productId) {
                        item.extras = productExtras;
                    }
                });
            }

            calculateOrderCost();
            setProductExtras([]);
        } catch (error) {
            console.error("Error applying extras to product:", error.message);
            toast.error("فشل في تطبيق الإضافات على المنتج.");
        }
    };


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
                            setItemsInCart([...itemsInCart, newItem]);
                            setItemsInCart([...itemId, sizeId]);
                        }
                    } else {
                        const repeatedItem = itemsInCart.find(
                            (item) => item.productId === productId
                        );
                        if (!repeatedItem) {
                            setItemsInCart([...itemsInCart, newItem]);
                            setItemsInCart([...itemId, productId]);
                        }
                    }
                } else {
                    setItemsInCart([newItem]);
                    setItemsInCart([sizeId ? sizeId : productId]);
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
                    setProductOrderToUpdate(updatedList);
                } else {
                    setItemsInCart(updatedList);
                    setItemsInCart(updatedItemId);
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
                    setProductOrderToUpdate(updatedList);
                } else {
                    setItemsInCart(updatedList);
                    setItemsInCart(updatedItemId);
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
            setCostOrder(totalCost);
        } catch (error) {
            console.error("Error calculating order cost:", error.message);
            // You can handle the error appropriately, such as displaying an error message to the user.
        }
    };

 const cartValue = useMemo(
    () => ({
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
    }),
    [itemsInCart, costOrder]
  );

  return (
    <CartCardContext.Provider value={cartValue}>
      {children}
    </CartCardContext.Provider>
  );
};
