import { getSession } from 'next-auth/react';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
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

    // Get current stock for all books in cart
    const bookIds = cart.map((item) => item.book_id);
    const result = await client.query('SELECT book_id, stock FROM books WHERE book_id = ANY($1)', [bookIds]);
    const books = result.rows;

    // Check if there’s enough stock
    for (const item of cart) {
      const book = books.find((b) => b.book_id === item.book_id);
      if (!book || book.stock < (item.quantity || 1)) {
        throw new Error(`Insufficient stock for book: ${item.title}`);
      }
    }

    // Update stock for each book
    for (const item of cart) {
      await client.query('UPDATE books SET stock = stock - $1 WHERE book_id = $2', [(item.quantity || 1), item.book_id]);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}