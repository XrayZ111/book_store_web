import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function AddBook() {
  // State variables for form inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image_url, setImage_url] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!title || !author || !genre || !price || !stock || !image_url) {
      alert('All fields are required');
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      alert('Price must be a positive number');
      return;
    }
    if (isNaN(stock) || parseInt(stock) < 0) {
      alert('Stock must be a non-negative integer');
      return;
    }

    // Prepare data for API request
    const bookData = {
      title,
      author,
      genre,
      price: parseFloat(price), // Convert to float for decimal support
      stock: parseInt(stock),   // Convert to integer
      image_url,
    };

    // Send POST request to API
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    // Handle response
    if (response.ok) {
      alert('Book added successfully');
      // Clear form fields
      setTitle('');
      setAuthor('');
      setGenre('');
      setPrice('');
      setStock('');
      setImage_url('');
    } else {
      alert('Failed to add book');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <label className={styles.formLabel}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Genre:
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Price:
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Stock:
          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Image URL:
          <input
            type="text"
            value={image_url}
            onChange={(e) => setImage_url(e.target.value)}
            className={styles.formInput}
          />
        </label>
        <button type="submit" className={styles.formButton}>
          Add Book
        </button>
      </form>
    </div>
  );
}