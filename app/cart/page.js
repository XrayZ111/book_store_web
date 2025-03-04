"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  //โหลดตะกร้าจาก localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  //เพิ่มจำนวนหนังสือ
  const increaseQuantity = (id) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  //ลดจำนวนหนังสือ
  const decreaseQuantity = (id) => {
    updateCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  //ลบหนังสือ
  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  //คำนวณราคารวม
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex items-left justify-between p-4">
              <div className="flex items-left">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-24 object-cover rounded-md"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-600">by {item.author}</p>
                  <p className="text-gray-800 font-bold">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-left space-x-2">
                <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item.id)}>
                  -
                </Button>
                <span className="text-lg">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => increaseQuantity(item.id)}>
                  +
                </Button>
                <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* แสดงราคารวม */}
      {cart.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md flex justify-between items-center">
          <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Checkout
          </Button>
        </div>
      )}
    </main>
  );
}
