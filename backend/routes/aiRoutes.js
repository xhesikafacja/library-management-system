const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "");
}

function includesAny(text, phrases) {
  return phrases.some((phrase) =>
    text.includes(phrase)
  );
}

router.post(
  "/query",
  authMiddleware,
  (req, res) => {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    const q = normalizeText(question);

    if (
      includesAny(q, [
        "most expensive",
        "expensive books",
        "cost the most",
        "highest price",
        "highest priced",
        "priciest books",
        "most expensiv",
        "expensiv books"
      ])
    ) {
      const sql = `
        SELECT
          title,
          author,
          price
        FROM books
        ORDER BY price DESC
        LIMIT 5
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "most_expensive_books",
          message:
            "Here are the five most expensive books.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "who owns the most books",
        "owns the most books",
        "most books",
        "who has the most books",
        "user with most books",
        "who own most books"
      ])
    ) {
      const sql = `
        SELECT
          users.id,
          users.name,
          users.email,
          COUNT(books.id) AS total_books
        FROM users
        LEFT JOIN books
          ON users.id = books.user_id
        GROUP BY
          users.id,
          users.name,
          users.email
        ORDER BY total_books DESC
        LIMIT 1
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "top_owner",
          message:
            "This user owns the most books.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "most popular genre",
        "popular genre",
        "top genre",
        "most read genre",
        "favourite genre",
        "favorite genre"
      ])
    ) {
      const sql = `
        SELECT
          genre,
          COUNT(*) AS total
        FROM books
        WHERE genre IS NOT NULL
          AND genre <> ''
        GROUP BY genre
        ORDER BY total DESC
        LIMIT 1
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "popular_genre",
          message:
            "This is the most popular genre.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "most popular book",
        "popular book",
        "most owned book",
        "book owned by most users",
        "top book"
      ])
    ) {
      const sql = `
        SELECT
          title,
          author,
          COUNT(DISTINCT user_id) AS owners_count
        FROM books
        GROUP BY
          title,
          author
        ORDER BY owners_count DESC
        LIMIT 1
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "popular_book",
          message:
            "This is the most popular book.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "completed books",
        "how many completed",
        "books completed",
        "finished books",
        "how many books are completed"
      ])
    ) {
      const sql = `
        SELECT
          COUNT(*) AS total_completed
        FROM books
        WHERE reading_status = 'completed'
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "completed_books",
          message:
            "Here is the number of completed books.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "currently reading",
        "books being read",
        "reading now",
        "how many are reading",
        "reading books"
      ])
    ) {
      const sql = `
        SELECT
          title,
          author,
          genre,
          reading_status
        FROM books
        WHERE reading_status = 'reading'
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "currently_reading",
          message:
            "These books are currently being read.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "how many books",
        "total books",
        "number of books",
        "book count"
      ])
    ) {
      const sql = `
        SELECT
          COUNT(*) AS total_books
        FROM books
      `;

      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err.message
          });
        }

        return res.json({
          type: "total_books",
          message:
            "Here is the total number of books.",
          results
        });
      });

      return;
    }

    if (
      includesAny(q, [
        "recommend books",
        "recommend me books",
        "suggest books",
        "book recommendation",
        "what should i read",
        "suggest reading"
      ])
    ) {
      const userId = req.user.id;

      const favoriteGenreSql = `
        SELECT
          genre,
          COUNT(*) AS total
        FROM books
        WHERE user_id = ?
          AND genre IS NOT NULL
          AND genre <> ''
        GROUP BY genre
        ORDER BY total DESC
        LIMIT 1
      `;

      db.query(
        favoriteGenreSql,
        [userId],
        (err, genreResults) => {
          if (err) {
            return res.status(500).json({
              message: "Database error",
              error: err.message
            });
          }

          if (genreResults.length === 0) {
            return res.json({
              type: "recommendations",
              message:
                "Add some books first so I can learn your preferred genres.",
              results: []
            });
          }

          const favoriteGenre =
            genreResults[0].genre;

          const recommendationSql = `
            SELECT
              title,
              author,
              genre,
              price
            FROM books
            WHERE genre = ?
              AND user_id <> ?
            LIMIT 5
          `;

          db.query(
            recommendationSql,
            [favoriteGenre, userId],
            (err, results) => {
              if (err) {
                return res.status(500).json({
                  message: "Database error",
                  error: err.message
                });
              }

              return res.json({
                type: "recommendations",
                message:
                  `Based on your reading history, you seem to like ${favoriteGenre}.`,
                favoriteGenre,
                results
              });
            }
          );
        }
      );

      return;
    }

    return res.status(400).json({
      type: "unknown_question",
      message:
        "I could not understand that question yet. Try asking about the most expensive books, popular genre, popular book, completed books, total books, recommendations, or who owns the most books."
    });
  }
);

module.exports = router;