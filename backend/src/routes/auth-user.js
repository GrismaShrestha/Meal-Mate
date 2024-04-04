import express from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";

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
      .send({ message: "User with given email already exists" });
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
      .send({ message: "User with given phone already exists" });
  }

  // Hash the password
  const passwordHashed = await bcrypt.hash(req.body.password, 10);

  // Add the user to the database
  try {
    await db.query(
      "INSERT INTO user (name, email, phone, password_hashed) VALUES (?, ?, ?, ?)",
      [req.body.name, req.body.email, req.body.phone, passwordHashed],
    );
    return res.status(201).send({ success: true });
  } catch (error) {
    console.log("[ERROR]", error);
    return res.status(400).send({ message: "Something went wrong" });
  }
});
