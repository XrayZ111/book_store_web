import pool from "../../lib/db";

export default async function handler(req, res) {
  const { book_id } = req.query;

  try {
    if (req.method === 'GET') {
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
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}