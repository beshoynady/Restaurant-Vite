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

  // Remove item from cart
  const deleteItemFromCart = (id, sizeId) => {
    const updatedList = sizeId
      ? itemsInCart.filter((item) => item.sizeId !== sizeId)
      : itemsInCart.filter((item) => item.productId !== id);
    setItemsInCart(updatedList);
    setItemId(itemId.filter((i) => i !== (sizeId || id)));
    calculateOrderCost();
  };

  // Increment product quantity
  const incrementProductQuantity = (productId, sizeId) => {
    const updated = itemsInCart.map((item) => {
      if (item.productId === productId && (!sizeId || item.sizeId === sizeId)) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setItemsInCart(updated);
    setCount(count + 1);
    calculateOrderCost();
  };

  // Decrement product quantity
  const decrementProductQuantity = (productId, sizeId) => {
    const updated = itemsInCart.map((item) => {
      if (item.productId === productId && (!sizeId || item.sizeId === sizeId)) {
        const newQty = item.quantity > 1 ? item.quantity - 1 : 0;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter((item) => item.quantity > 0);
    setItemsInCart(updated);
    setCount(count - 1);
    calculateOrderCost();
  };

  // Calculate order total cost
  const calculateOrderCost = () => {
    let total = 0;
    itemsInCart.forEach((item) => {
      const basePrice = item.priceAfterDiscount > 0 ? item.priceAfterDiscount : item.price;
      const itemTotal = basePrice * item.quantity;
      const extrasTotal = item.extras?.reduce((sum, ex) => sum + (ex.price || 0), 0) || 0;
      item.totalprice = itemTotal + extrasTotal;
      total += item.totalprice;
    });
    setCostOrder(total);
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
