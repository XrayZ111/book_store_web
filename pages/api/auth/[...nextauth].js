import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../lib/db";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        
        // Fetch user from database
        const res = await pool.query(
          "SELECT * FROM customers WHERE email = $1",
          [email]
        );
        const user = res.rows[0];

        if (!user) throw new Error("User not found");
        
        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) throw new Error("Invalid password");

        return { id: user.customer_id, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
});