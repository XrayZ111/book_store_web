import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/Home.module.css"; // Corrected path
import { useSession } from "next-auth/react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) router.push("/auth/signin");
    else alert("Registration failed");
  };

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
              <a href="#" onClick={() => signIn()} className={styles.signInLink}>
                Sign Out
              </a>
            </>
          )}
          <Link href="/cart" className={styles.cartLink}>
            Cart (0)
          </Link>
        </div>
      </header>

      <div className={styles.formContainer}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className={styles.formInput}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className={styles.formInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className={styles.formInput}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={styles.formInput}
          />
          <button type="submit" className={styles.formButton}>
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link href="/auth/signin" className={styles.formLink}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}