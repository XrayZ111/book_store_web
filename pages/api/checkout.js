import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Import authOptions
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Log the request headers and cookies
  console.log('Request Headers:', req.headers);
  console.log('Cookies:', req.headers.cookie || 'No cookies found');

  // Use getServerSession instead of getSession
  const session = await getServerSession(req, res, authOptions);
  console.log('Session:', session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: No session found' });
  }

  if (!session.user || !session.user.id) {
    console.error('Session user or user ID missing:', session);
    return res.status(401).json({ error: 'Unauthorized: User ID not found in session' });
  }

  const { cart } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid cart' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const customerId = session.user.id;
    console.log('Customer ID from session:', customerId);

    const customerResult = await client.query(
      'SELECT customer_id FROM customers WHERE customer_id = $1',
      [customerId]
    );
    if (customerResult.rows.length === 0) {
      throw new Error(`Customer with ID ${customerId} not found in database`);
    }

    const bookIds = cart.map((item) => item.book_id);
    const stockResult = await client.query(
      'SELECT book_id, stock FROM books WHERE book_id = ANY($1)',
      [bookIds]
    );
    const books = stockResult.rows;

    for (const item of cart) {
      const book = books.find((b) => b.book_id === item.book_id);
      if (!book) {
        throw new Error(`Book with ID ${item.book_id} not found`);
      }
      if (book.stock < (item.quantity || 1)) {
        throw new Error(`Insufficient stock for book: ${item.title} (Available: ${book.stock}, Requested: ${item.quantity || 1})`);
      }
    }

    for (const item of cart) {
      await client.query(
        'INSERT INTO history_purchase (customer_id, book_id, quantity, purchased_at) VALUES ($1, $2, $3, $4)',
        [customerId, item.book_id, item.quantity || 1, new Date()]
      );
    }

    for (const item of cart) {
      const updateResult = await client.query(
        'UPDATE books SET stock = stock - $1 WHERE book_id = $2 AND stock >= $1 RETURNING stock',
        [item.quantity || 1, item.book_id]
      );
      if (updateResult.rowCount === 0) {
        throw new Error(`Failed to update stock for book: ${item.title}`);
      }
      console.log(`Updated stock for book ${item.title}: New stock = ${updateResult.rows[0].stock}`);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Checkout Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}