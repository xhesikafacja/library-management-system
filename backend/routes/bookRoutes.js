const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
  const { title, author, genre, reading_status, price } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required"
    });
  }

  const sql = `
    INSERT INTO books
    (title, author, genre, reading_status, price, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author,
      genre,
      reading_status || "not_started",
      price,
      req.user.id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      res.status(201).json({
        message: "Book added successfully",
        bookId: result.insertId
      });
    }
  );
});

router.get("/", authMiddleware, (req, res) => {
  const sql = "SELECT * FROM books WHERE user_id = ?";

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(results);
  });
});

router.put("/:id", authMiddleware, (req, res) => {
  const { title, author, genre, reading_status, price } = req.body;
  const bookId = req.params.id;

  const sql = `
    UPDATE books
    SET title = ?, author = ?, genre = ?, reading_status = ?, price = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      title,
      author,
      genre,
      reading_status,
      price,
      bookId,
      req.user.id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Book not found"
        });
      }

      res.json({
        message: "Book updated successfully"
      });
    }
  );
});

router.delete("/:id", authMiddleware, (req, res) => {
  const bookId = req.params.id;

  const sql = `
    DELETE FROM books
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [bookId, req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error"
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