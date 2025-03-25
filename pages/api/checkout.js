import { getSession } from 'next-auth/react';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Log the request headers and cookies
  console.log('Request Headers:', req.headers);
  console.log('Cookies:', req.headers.cookie || 'No cookies found');

  const session = await getSession({ req });
  console.log('Session:', session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { cart } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid cart' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get the customer_id from the session
    const customerId = session.user.id;
    if (!customerId) {
      throw new Error('Customer ID not found in session');
    }

    // Verify the customer exists in the database
    const customerResult = await client.query(
      'SELECT customer_id FROM customers WHERE customer_id = $1',
      [customerId]
    );
    if (customerResult.rows.length === 0) {
      throw new Error('Customer not found in database');
    }

    // Get current stock for all books in cart
    const bookIds = cart.map((item) => item.book_id);
    const stockResult = await client.query(
      'SELECT book_id, stock FROM books WHERE book_id = ANY($1)',
      [bookIds]
    );
    const books = stockResult.rows;

    // Check if there’s enough stock
    for (const item of cart) {
      const book = books.find((b) => b.book_id === item.book_id);
      if (!book || book.stock < (item.quantity || 1)) {
        throw new Error(`Insufficient stock for book: ${item.title}`);
      }
    }

    // Insert purchase history into history_purchase
    for (const item of cart) {
      await client.query(
        'INSERT INTO history_purchase (customer_id, book_id, quantity, purchased_at) VALUES ($1, $2, $3, $4)',
        [customerId, item.book_id, item.quantity || 1, new Date()]
      );
    }

    // Update stock for each book
    for (const item of cart) {
      await client.query(
        'UPDATE books SET stock = stock - $1 WHERE book_id = $2',
        [item.quantity || 1, item.book_id]
      );
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