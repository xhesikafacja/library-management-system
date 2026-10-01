import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post("/ai/query", {
        question
      });

      setResult(response.data);
    } catch (error) {
      console.error("AI error:", error);

      setResult(null);

      setError(
        error.response?.data?.message ||
        error.message ||
        "Could not process question"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Library Assistant</h2>

      <p>
        Ask questions about the library or request book recommendations.
      </p>

      <form onSubmit={handleAsk}>
        <input
          type="text"
          placeholder="Ask something about the library..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button type="submit">
          Ask
        </button>
      </form>

      {loading && (
        <p>Thinking...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {result && (
        <div>
          <h3>Answer</h3>

          {result.message && (
            <p>{result.message}</p>
          )}

          {result.type === "most_expensive_books" && (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {result.results.map((book, index) => (
                  <tr key={index}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>€{book.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {result.type === "top_owner" &&
            result.results.length > 0 && (
              <p>
                {result.results[0].name} owns the most books
                with {result.results[0].total_books} books.
              </p>
            )}

          {result.type === "popular_genre" &&
            result.results.length > 0 && (
              <p>
                The most popular genre is{" "}
                <strong>
                  {result.results[0].genre}
                </strong>{" "}
                with {result.results[0].total} books.
              </p>
            )}

          {result.type === "popular_book" &&
            result.results.length > 0 && (
              <p>
                The most popular book is{" "}
                <strong>
                  {result.results[0].title}
                </strong>{" "}
                by {result.results[0].author}.
                It is owned by{" "}
                {result.results[0].owners_count} user(s).
              </p>
            )}

          {result.type === "completed_books" &&
            result.results.length > 0 && (
              <p>
                Total completed books:{" "}
                <strong>
                  {result.results[0].total_completed}
                </strong>
              </p>
            )}

          {result.type === "total_books" &&
            result.results.length > 0 && (
              <p>
                Total books in the library:{" "}
                <strong>
                  {result.results[0].total_books}
                </strong>
              </p>
            )}

          {result.type === "currently_reading" && (
            <div>
              {result.results.length === 0 ? (
                <p>
                  No books are currently being read.
                </p>
              ) : (
                <ul>
                  {result.results.map((book, index) => (
                    <li key={index}>
                      {book.title} - {book.author} -{" "}
                      {book.genre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {result.type === "recommendations" && (
            <div>
              {result.favoriteGenre && (
                <p>
                  Favorite genre:{" "}
                  <strong>
                    {result.favoriteGenre}
                  </strong>
                </p>
              )}

              {result.results.length === 0 ? (
                <p>
                  No matching recommendations were found
                  from other users yet.
                </p>
              ) : (
                <div>
                  <h4>Recommended Books</h4>

                  <ul>
                    {result.results.map((book, index) => (
                      <li key={index}>
                        <strong>
                          {book.title}
                        </strong>{" "}
                        - {book.author} - {book.genre} - €
                        {book.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <hr />

      <h4>Example Questions</h4>

      <p>Who owns the most books?</p>
      <p>Which books cost the most?</p>
      <p>What is the most popular genre?</p>
      <p>How many books are completed?</p>
      <p>What books are being read now?</p>
      <p>How many books are there?</p>
      <p>Recommend me books</p>

      <br />

      <Link to="/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default AIAssistant;