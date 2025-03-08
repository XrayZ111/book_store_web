import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import styles from "../../styles/Home.module.css"; // Corrected path
import { useSession } from "next-auth/react";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res.ok) window.location.href = "/";
    else alert("Invalid credentials");
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
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className={styles.formButton}>
            Sign In
          </button>
        </form>
        <p>
          Have no account?{" "}
          <Link href="/auth/signup" className={styles.formLink}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}