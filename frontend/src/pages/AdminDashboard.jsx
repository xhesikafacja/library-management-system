import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import AddBook from "./AddBook";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchUsers = async () => {
    try {
      const response = await api.get(
        "/admin/users"
      );

      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error loading users:",
        error
      );
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get(
        "/admin/books"
      );

      setBooks(response.data);
    } catch (error) {
      console.error(
        "Error loading books:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, [refresh]);

  const refreshBooks = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/admin/users/${id}`
      );

      alert("User deleted successfully");

      fetchUsers();
      fetchBooks();
    } catch (error) {
      console.error(
        "Error deleting user:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Could not delete user"
      );
    }
  };

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/admin/books/${id}`
      );

      alert("Book deleted successfully");

      fetchBooks();
    } catch (error) {
      console.error(
        "Error deleting book:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Could not delete book"
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="dashboard-header">
          <div>
            <h2>Admin Dashboard</h2>

            {user && (
              <div className="user-info">
                <p>
                  Welcome, <strong>{user.name}</strong>
                </p>

                <p>{user.email}</p>

                <span className="badge">
                  Admin
                </span>
              </div>
            )}
          </div>

          <div className="nav-buttons">
            <Link to="/ai">
              <button className="ai-btn">
                AI Assistant
              </button>
            </Link>

            <button
              className="secondary-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <AddBook
          onBookAdded={refreshBooks}
        />
      </div>

      <div className="card">
        <h3>Users</h3>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <span>
                  <strong>{user.name}</strong>
                  {" — "}
                  {user.email}
                  {" — "}
                  {user.role}
                </span>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteUser(user.id)
                  }
                >
                  Delete User
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>All Books</h3>

        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <span>
                  <strong>{book.title}</strong>
                  {" — "}
                  {book.author}
                  {" — "}
                  Owner: {book.owner_name}
                </span>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteBook(book.id)
                  }
                >
                  Delete Book
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;