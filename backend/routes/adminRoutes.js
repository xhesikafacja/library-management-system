const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// GET ALL USERS
router.get("/users", authMiddleware, adminMiddleware, (req, res) => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    res.json(results);
  });
});


// GET ALL BOOKS
router.get("/books", authMiddleware, adminMiddleware, (req, res) => {
  const sql = `
    SELECT
      books.*,
      users.name AS owner_name,
      users.email AS owner_email
    FROM books
    JOIN users ON books.user_id = users.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    res.json(results);
  });
});


// DELETE USER
router.delete("/users/:id", authMiddleware, adminMiddleware, (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully"
    });
  });
});


// DELETE BOOK
router.delete("/books/:id", authMiddleware, adminMiddleware, (req, res) => {
  const bookId = req.params.id;

  const sql = "DELETE FROM books WHERE id = ?";

  db.query(sql, [bookId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book deleted successfully"
    });
  });
});


module.exports = router;