import express from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAdmin } from "../guards/auth.js";

export const authAdminRouter = express.Router();

// Register an admin
// ---------------

authAdminRouter.post("/admin/register", async (req, res) => {
  // Check if an admin with the given phone number already exist
  const doesAdminWithPhoneExist = await db
    .query("SELECT COUNT(*) AS count FROM admin WHERE phone = ?", [
      req.body.phone,
    ])
    .then(([result]) => result[0].count > 0);
  if (doesAdminWithPhoneExist) {
    return res
      .status(409)
      .json({ message: "Admin with given phone already exists" });
  }

  // Hash the password
  const passwordHashed = await bcrypt.hash(req.body.password, 10);

  // Add the admin to the database
  try {
    await db.query(
      "INSERT INTO admin (name, phone, password_hashed) VALUES (?, ?, ?)",
      [req.body.name, req.body.phone, passwordHashed],
    );
    return res.status(201).json({ success: true });
  } catch (error) {
    console.log("[ERROR]", error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

// Login an admin
// ------------

authAdminRouter.post("/admin/login", async (req, res) => {
  // Query the admin with the given phone number
  const [selectedAdmin] = await db.query(
    "SELECT * FROM admin WHERE phone = ?",
    [req.body.phone],
  );
  if (selectedAdmin.length == 0) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  // Check if the password matches
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    selectedAdmin[0].password_hashed,
  );
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign({ adminId: selectedAdmin[0].id }, "jwt-secret");

  return res.status(200).json({ token });
});

// Admin details
// -------------

authAdminRouter.get("/admin/details", isAdmin, async (req, res) => {
  return res.status(200).json(req.loggedInAdmin);
});
