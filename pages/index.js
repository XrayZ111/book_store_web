import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [books, setBooks] = useState([]); // Initialize as empty array
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data); // Only set if data is an array
        } else {
          console.error('API returned non-array data:', data);
          setBooks([]); // Default to empty array if invalid
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setBooks([]); // Default to empty array on error
        setLoading(false);
      });
  }, []);

  const addToCart = (book) => {
    setCart((prevCart) => [...prevCart, book]);
  };

  const filteredBooks = books.filter((book) => {
    if (!book) return false; // Safety check for undefined book
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
        <h1 className={styles.title}>BookStore</h1>
        <a href="#cart" className={styles.cart}>
          Cart ({cart.length})
        </a>
      </header>

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
          <option value="Fiction">Fiction</option>
          <option value="Dystopia">Dystopia</option>
          {/* Add more genres based on your data */}
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(book);
                }}
                className={styles.addToCart}
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Cart Preview (Simple for now) */}
      {cart.length > 0 && (
        <div id="cart" className={styles.cartPreview}>
          <h3>Cart</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.title} - ${parseFloat(item.price).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}