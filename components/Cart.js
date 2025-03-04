"use client";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  // ดึงข้อมูลสินค้าในตะกร้าจาก localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // ฟังก์ชันลบสินค้าแต่ละชิ้น
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // ฟังก์ชันลบทั้งหมดจากตะกร้า
  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white py-2 px-4 rounded-md mb-4"
          >
            Clear All
          </button>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-20 h-30 object-cover"
                />
                <div className="flex-grow">
                  <h3 className="font-bold">{item.title}</h3>
                  <p>{item.author}</p>
                  <p>${item.price}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
v