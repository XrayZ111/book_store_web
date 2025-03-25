import pool from "../../lib/db"; // Adjust path to your database connection

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle existing GET requests (e.g., fetching books)
    const { book_id } = req.query;
    try {
      if (book_id) {
        const result = await pool.query("SELECT * FROM books WHERE book_id = $1", [book_id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Book not found" });
        }
        return res.status(200).json(result.rows[0]);
      } else {
        const result = await pool.query("SELECT * FROM books");
        return res.status(200).json(result.rows);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to add a new book
    const { title, author, genre, price, stock, image_url } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO books (title, author, genre, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, author, genre, price, stock, image_url]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add book" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}