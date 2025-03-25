import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useSession, signIn, signOut } from "next-auth/react";
import AddProductButton from "../components/AddProductButton";
import { useCart } from '../context/CartContext';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [genres, setGenres] = useState([]);
  
  const { data: session } = useSession();
  const { cart, addToCart } = useCart(); // Use CartContext instead of local state

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
          const uniqueGenres = [...new Set(data.map((book) => book.genre).filter(genre => genre))];
          setGenres(uniqueGenres);
          console.log("Books fetched:", data);
        } else {
          console.error('API returned non-array data:', data);
          setBooks([]);
          setGenres([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setBooks([]);
        setGenres([]);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    if (!book) return false;
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || book.genre === genreFilter;
    const matchesAuthor = !authorFilter || book.author === authorFilter;
    return matchesSearch && matchesGenre && matchesAuthor;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" passHref>
          <h1 className={styles.title}>BookStore</h1>
        </Link>
        <div className={styles.rightSection}>
          {!session ? (
            <a href="#" onClick={() => signIn()} className={styles.signInLink}>
              Sign In
            </a>
          ) : (
            <>
              <span>{session.user.email}</span>
              <a href="#" onClick={() => signOut()} className={styles.signInLink}>
                Sign Out
              </a>
            </>
          )}
          <Link href="/cart" className={styles.cartLink}>
            Cart ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})
          </Link>
        </div>
      </header>

      {/* Add Product Button */}
      <AddProductButton />

      {/* Search and Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Select Author</option>
          {[...new Set(books.map((book) => book.author))].map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      {/* Book Grid */}
      <h2 className={styles.sectionTitle}>Book Store</h2>
      <div className={styles.grid}>
        {filteredBooks.map((book) => (
          <Link href={`/book/${book.book_id}`} key={book.book_id} passHref>
            <div className={styles.card}>
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} className={styles.image} />
              ) : (
                <div className={styles.placeholder}>150 x 200</div>
              )}
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <p>${parseFloat(book.price).toFixed(2)}</p>
              {book.stock > 0 ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(book);
                  }}
                  className={styles.addToCart}
                >
                  Add to Cart
                </button>
              ) : (
                <p className={styles.outOfStock}>Out of Stock</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Cart Preview */}
      {cart.length > 0 && (
        <div id="cart" className={styles.cartPreview}>
          <h3>Cart</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.book_id}>
                {item.title} - ${parseFloat(item.price).toFixed(2)} (x{item.quantity || 1})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}