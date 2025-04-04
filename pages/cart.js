import { useCart } from '../context/CartContext';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Cart() {
  const { cart, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });
  
      console.log('Checkout Response Status:', response.status); // Log the status
      const data = await response.json(); // Attempt to parse JSON
      console.log('Checkout Response Data:', data); // Log the response data
  
      if (response.ok) {
        clearCart();
        alert('Checkout successful! Stock has been updated.');
        router.push('/'); // Redirect to homepage after checkout
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout Fetch Error:', error); // Log the fetch error
      alert(`An error occurred during checkout: ${error.message}`);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className={styles.container}>
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

      <h2 className={styles.sectionTitle}>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((item) => (
              <li key={item.book_id} className={styles.cartItem}>
                {item.title} - ${parseFloat(item.price).toFixed(2)} x {item.quantity || 1} = $
                {(item.price * (item.quantity || 1)).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</p>
          <button onClick={handleCheckout} className={styles.checkoutButton}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}