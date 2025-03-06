import pool from '../../lib/db';

export default async function handler(req, res) {
  const { book_id } = req.query;

  try {
    if (book_id) {
      const result = await pool.query('SELECT * FROM books WHERE book_id = $1', [book_id]);
      if (result.rows.length > 0) {
        const book = result.rows[0];
        book.price = parseFloat(book.price); // Ensure price is a number
        res.status(200).json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } else {
      const result = await pool.query('SELECT * FROM books');
      const books = result.rows.map((book) => ({
        ...book,
        price: parseFloat(book.price), // Ensure price is a number
      }));
      res.status(200).json(books);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}