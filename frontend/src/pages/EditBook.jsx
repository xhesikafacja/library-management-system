import { useState } from "react";
import api from "../services/api";

function EditBook({ book, onBookUpdated, onCancel }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre || "");
  const [readingStatus, setReadingStatus] = useState(book.reading_status);
  const [price, setPrice] = useState(book.price || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/books/${book.id}`, {
        title,
        author,
        genre,
        reading_status: readingStatus,
        price
      });

      alert("Book updated successfully");

      onBookUpdated();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div>
      <h3>Edit Book</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <select
          value={readingStatus}
          onChange={(e) => setReadingStatus(e.target.value)}
        >
          <option value="not_started">Not Started</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditBook;