import { useState } from "react";
import api from "../services/api";

function AddBook({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [readingStatus, setReadingStatus] = useState("not_started");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/books", {
        title,
        author,
        genre,
        reading_status: readingStatus,
        price
      });

      console.log(response.data);

      setTitle("");
      setAuthor("");
      setGenre("");
      setReadingStatus("not_started");
      setPrice("");

      alert("Book added successfully");

      onBookAdded();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div>
      <h2>Add Book</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Genre"
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
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;