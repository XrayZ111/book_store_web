import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { useSession, signIn, signOut } from "next-auth/react";

export default function BookDetail() {
  const router = useRouter();
  const { book_id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

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
            <a href="#" onClick={() => signIn()} className={styles.signInLink}>
              Sign In
            </a>
          )}
          <Link href="/cart" className={styles.cartLink}>
            Cart ({/* Replace with dynamic cart count if implemented */}0)
          </Link>
        </div>
      </header>

      <div className={styles.detailContainer}>
        <div className={styles.detailCard}>
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>150 x 200</div>
          )}
          <h2 className={styles.detailTitle}>{book.title}</h2>
          <p>by {book.author}</p>
          <p>Genre: {book.genre || 'N/A'}</p>
          <p>${parseFloat(book.price).toFixed(2)}</p>
          <p>Stock: {book.stock}</p>
          <button className={styles.addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}