import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All Fields required" });

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          return res.status(201).json({
            message: "User Registered Successfully",
            userId: result.insertId,
          });
        }
      );
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0)
      return res.status(404).json({ message: "User Not Found" });

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
};

export const getUsers = (req, res) => {
  db.query(
    "SELECT id, name, email FROM users",
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(200).json(result);
    }
  );
};

export const getMyProfile = (req, res) => {
  const userId = req.user.id;

  db.query("SELECT id, name, email FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(result[0]);
  });
};

export const getUsersPaginated = (req, res) => {
  let { page = 1, limit = 10, search = "", email = "" } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  
  const offset = (page - 1) * limit;

  let baseQuery = "SELECT id, name, email FROM users WHERE 1 = 1";
  let countQuery = "SELECT COUNT(*) AS total FROM users WHERE 1 = 1";
  let params = [];

  if (search) {
    baseQuery += " AND name LIKE ?";
    countQuery += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  if (email) {
    baseQuery += " AND email = ?";
    countQuery += " AND email = ?";
    params.push(email);
  }

  baseQuery += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(countQuery, params.slice(0, params.length - 2), (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const totalUsers = countResult[0].total;

    db.query(baseQuery, params, (err, users) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(200).json({
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        users
      });
    });
  });
};
