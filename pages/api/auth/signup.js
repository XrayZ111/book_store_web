import pool from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      "INSERT INTO customers (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hash, phone]
    );

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
}