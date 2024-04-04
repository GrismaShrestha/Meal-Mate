import express from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isUser } from "../guards/auth.js";

export const authUserRouter = express.Router();

// Register a user
// ---------------

authUserRouter.post("/user/register", async (req, res) => {
  // Check if a user with the given email already exist
  const doesUserWithEmailExist = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE email = ?", [
      req.body.email,
    ])
    .then(([result]) => result[0].count > 0);
  if (doesUserWithEmailExist) {
    return res
      .status(409)
      .json({ message: "User with given email already exists" });
  }

  // Check if a user with the given phone number already exist
  const doesUserWithPhoneExist = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE phone = ?", [
      req.body.phone,
    ])
    .then(([result]) => result[0].count > 0);
  if (doesUserWithPhoneExist) {
    return res
      .status(409)
      .json({ message: "User with given phone already exists" });
  }

  // Hash the password
  const passwordHashed = await bcrypt.hash(req.body.password, 10);

  // Add the user to the database
  try {
    await db.query(
      "INSERT INTO user (name, email, phone, password_hashed) VALUES (?, ?, ?, ?)",
      [req.body.name, req.body.email, req.body.phone, passwordHashed],
    );
    return res.status(201).json({ success: true });
  } catch (error) {
    console.log("[ERROR]", error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

// Login a user
// ------------

authUserRouter.post("/user/login", async (req, res) => {
  // Query the user with the given phone number
  const [selectedUser] = await db.query("SELECT * FROM user WHERE phone = ?", [
    req.body.phone,
  ]);
  if (selectedUser.length == 0) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  // Check if the password matches
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    selectedUser[0].password_hashed,
  );
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign({ userId: selectedUser[0].id }, "jwt-secret");

  return res.status(200).json({ token });
});

// User details
// ------------

authUserRouter.get("/user/details", isUser, async (req, res) => {
  return res.status(200).json(req.loggedInUser);
});
