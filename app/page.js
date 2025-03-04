"use client";
import { useState } from "react";
import BookCard from "@/components/BookCard";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      price: 10.99,
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Classic",
      price: 12.99,
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg"
    },
    {
      id: 3,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Classic",
      price: 8.99,
      coverImage: "https://placehold.co/150x200"
    },
    {
      id: 4,
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      price: 9.99,
      coverImage: "https://placehold.co/150x200"
    },
    {
      id: 5,
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian",
      price: 11.99,
      coverImage: "https://placehold.co/150x200"
    }
  ]);

  //กรองข้อมูลหนังสือ
  const filteredBooks = books.filter((book) => {
    return (
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (genre ? book.genre === genre : true) &&
      (author ? book.author === author : true)
    );
  });

  //เพิ่มสินค้าในตะกร้า
  const handleAddToCart = (book) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const index = existingCart.findIndex((item) => item.id === book.id);
  
    if (index !== -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...book, quantity: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(existingCart));
  };

  return (
    <main className="container mx-auto p-5">
      <h1 className="text-2xl font-bold">Book Store</h1>

      {/* ช่องค้นหา */}
      <div className="flex space-x-4 mt-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        {/* เลือก Genre */}
        <Select value={genre} onChange={setGenre}>
          <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Classic">Classic</SelectItem>
            <SelectItem value="Dystopian">Dystopian</SelectItem>
          </SelectContent>
        </Select>

        {/* เลือก Author */}
        <Select value={author} onChange={setAuthor}>
          <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Select Author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="F. Scott Fitzgerald">F. Scott Fitzgerald</SelectItem>
            <SelectItem value="Harper Lee">Harper Lee</SelectItem>
            <SelectItem value="J.D. Salinger">J.D. Salinger</SelectItem>
            <SelectItem value="George Orwell">George Orwell</SelectItem>
            <SelectItem value="Aldous Huxley">Aldous Huxley</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* แสดงผลหนังสือ */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {filteredBooks.map((book) => (
          <div key={book.id}>
            <BookCard book={book} onAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
    </main>
  );
}
