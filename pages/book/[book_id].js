import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from '../../styles/Home.module.css';
import { useCart } from '../../context/CartContext';

export default function BookDetail() {
  const router = useRouter();
  const { book_id } = router.query; // Get the book_id from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart(); // Access addToCart and cart from CartContext
  const { data: session } = useSession(); // Get the session for user info

  useEffect(() => {
    if (!book_id) return; // Wait for book_id to be available

    // Fetch the book details
    fetch(`/api/books/${book_id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [book_id]);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent any parent Link navigation
    e.stopPropagation(); // Stop event propagation
    if (book && book.stock > 0) {
      console.log('Adding book to cart:', book); // Debug log
      addToCart(book);
      alert(`${book.title} has been added to your cart!`);
    } else {
      alert('This book is out of stock.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" passHref>
          <h1 className={styles.title}>BookStore</h1>
        </Link>
        <div className={styles.rightSection}>
          {session ? (
            <>
              <span>{session.user.email}</span>
              <a href="#" onClick={() => signOut()} className={styles.signInLink}>
                Sign Out
              </a>
            </>
          ) : (
            <Link href="/auth/signin" className={styles.signInLink}>
              Sign In
            </Link>
          )}
          <Link href="/cart" className={styles.cartLink}>
            Cart ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})
          </Link>
        </div>
      </header>

      {/* Book Details */}
      <div className={styles.bookDetail}>
        <h2>{book.title}</h2>
        <p>by {book.author}</p>
        {book.image_url ? (
          <img src={book.image_url} alt={book.title} className={styles.bookImage} />
        ) : (
          <div className={styles.placeholder}>No Image</div>
        )}
        <p>${parseFloat(book.price).toFixed(2)}</p>
        <p>Stock: {book.stock}</p>
        {book.stock > 0 ? (
          <button onClick={handleAddToCart} className={styles.addToCart}>
            Add to Cart
          </button>
        ) : (
          <p className={styles.outOfStock}>Out of Stock</p>
        )}
      </div>
    </div>
  );
}