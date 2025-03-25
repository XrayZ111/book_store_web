import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.book_id === book.book_id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.book_id === book.book_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...book, quantity }];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);