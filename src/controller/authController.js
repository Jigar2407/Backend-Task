import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "../utils/errorResponse.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return next(new ErrorResponse("All fields are required", 400));

    const [existing] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return next(new ErrorResponse("Email already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const [insert] = await db.promise().query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      userId: insert.insertId,
    });

  } catch (error) {
    next(error);
  }
};


export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0)
      return next(new ErrorResponse("User Not Found", 404));

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorResponse("Invalid Credentials", 401));

    const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,     
  { expiresIn: "7d" }
);


    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    next(error);
  }
};


export const getUsers = async (req, res, next) => {
  try {
    const [users] = await db.promise().query(
      "SELECT id, name, email FROM users"
    );

    res.status(200).json(users);

  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [profile] = await db.promise().query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId]
    );

    if (profile.length === 0)
      return next(new ErrorResponse("User not found", 404));

    res.status(200).json(profile[0]);

  } catch (error) {
    next(error);
  }
};

export const getUsersPaginated = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "", email = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let baseQuery = "SELECT id, name, email FROM users WHERE 1=1";
    let countQuery = "SELECT COUNT(*) AS total FROM users WHERE 1=1";
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

    const [count] = await db.promise().query(
      countQuery,
      params.slice(0, params.length - 2)
    );

    const [users] = await db.promise().query(baseQuery, params);

    res.status(200).json({
      page,
      limit,
      totalUsers: count[0].total,
      totalPages: Math.ceil(count[0].total / limit),
      users
    });

  } catch (error) {
    next(error);
  }
};

export const uploadProfile = async (req, res, next) => {
  try {
    if (!req.file)
      return next(new ErrorResponse("No file uploaded", 400));

    const userId = req.user.id;
    const filePath = req.file.filename;

    await db.promise().query(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [filePath, userId]
    );

    res.status(200).json({
      success: true,
      message: "Profile Uploaded Successfully",
      image: filePath,
    });

  } catch (error) {
    next(error);
  }
};
