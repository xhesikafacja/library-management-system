import { useEffect, useState } from "react";
import api from "../services/api";
import EditBook from "./EditBook";

function Books({ refresh }) {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [refresh]);

  const handleUpdated = () => {
    setEditingBook(null);
    fetchBooks();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/books/${id}`);

      alert("Book deleted successfully");

      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div>
      <h2>My Books</h2>

      {editingBook && (
        <EditBook
          book={editingBook}
          onBookUpdated={handleUpdated}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} - {book.author} - {book.genre} -{" "}
              {book.reading_status} - €{book.price}

              <button onClick={() => setEditingBook(book)}>
                Edit
              </button>

              <button onClick={() => handleDelete(book.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Books;