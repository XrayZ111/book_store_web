"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  // ดึงข้อมูลจำนวนสินค้าในตะกร้าจาก localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);
  }, []);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          BookStore
        </Link>
        <div className="text-white">
          <Link href="/cart" className="flex items-center space-x-2">
            <span>Cart ({cartCount})</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
