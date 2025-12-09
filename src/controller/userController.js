// import db from "../src/config/db.js";

import db from "../config/db.js";

export const createUser = (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email required" });
    }

    const query = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(query, [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: "User created",
            data: { id: result.insertId, name, email },
        });
    });
};

export const getUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json(results);
    });
};

export const getUserById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(results[0]);
  });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";

  db.query(query, [name, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated",
      data: { id, name, email },
    });
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  });
};