import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css"; // Adjust path if your CSS is elsewhere

export default function AddProductButton() {
  const { data: session } = useSession(); // Check if user is signed in
  const router = useRouter(); // For navigation

  const handleClick = () => {
    if (session) {
      router.push("/add-book"); // Go to add-product page if signed in
    } else {
      router.push("/auth/signin"); // Go to sign-in page if not signed in
    }
  };

  return (
    <button onClick={handleClick} className={styles.addProductButton}>
      Add Product
    </button>
  );
}