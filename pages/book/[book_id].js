import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import styles from '../../styles/Home.module.css';

export default function BookDetail() {
  const router = useRouter();
  const { book_id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (book_id) {
      fetch(`/api/books?book_id=${book_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setBook(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Fetch error:', err.message);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [book_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className={styles.container}>
      {/* Header with clickable BookStore link */}
      <header className={styles.header}>
        <Link href="/" passHref>
          <h1 className={styles.title}>BookStore</h1>
        </Link>
        <a href="#cart" className={styles.cart}>
          Cart ({0}) {/* Replace with actual cart count if integrated */}
        </a>
      </header>

      {/* Detail Content */}
      <div className={styles.detailContainer}>
        <div className={styles.detailCard}>
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>150 x 200</div>
          )}
          <h2 className={styles.detailTitle}>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
          <p><strong>Price:</strong> ${parseFloat(book.price).toFixed(2)}</p>
          <p><strong>Stock:</strong> {book.stock}</p>
          <p><strong>Added:</strong> {new Date(book.created_at).toLocaleDateString()}</p>
          <button className={styles.addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}