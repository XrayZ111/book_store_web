export default function BookCard({ book, onAddToCart }) {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-64 object-contain rounded-md"
      />
      <h2 className="mt-2 text-lg font-semibold">{book.title}</h2>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-gray-900 mt-1">${book.price.toFixed(2)}</p>

      <button
        onClick={() => onAddToCart(book)}
        className="mt-2 py-1 px-4 bg-blue-500 text-white rounded-md"
      >
        Add to Cart
      </button>
    </div>
  );
}
