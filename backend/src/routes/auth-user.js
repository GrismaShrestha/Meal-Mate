import express from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isUser } from "../guards/auth.js";
import otpGenerator from "otp-generator";

export const authUserRouter = express.Router();

const OTPs = {};

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

// Forgot password request
// -----------------------

authUserRouter.post("/user/forgot-password/send-otp", async (req, res) => {
  const phone = req.body.phone;

  // First check if the phone number is registered
  const isRegistered = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE phone = ?", [phone])
    .then(([result]) => result[0].count > 0);
  if (!isRegistered) {
    return res.status(404).json({ message: "Phone number is not registered" });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });
  OTPs[phone] = otp;

  await fetch("https://api.sparrowsms.com/v2/sms/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: "v2_JVEAq00nf1rJrOQNkySw0crF2Bw.adQJ",
      from: "TheAlert",
      to: phone,
      text: "Your verification OTP is: " + otp,
    }),
  });

  return res.status(200).json({ message: "OTP sent" });
});

// Verify forgot password OTP
// --------------------------

authUserRouter.post("/user/forgot-password/verify", async (req, res) => {
  if (OTPs[req.body.phone] == req.body.otp) {
    return res.status(200).json({ message: "OTP is correct!" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

// Verify forgot password set new password
// ---------------------------------------

authUserRouter.post("/user/forgot-password/set", async (req, res) => {
  if (OTPs[req.body.phone] == req.body.otp) {
    // Create hash of the new password
    const passwordHashed = await bcrypt.hash(req.body.password, 10);

    try {
      await db.query("UPDATE user SET password_hashed = ? WHERE phone = ?", [
        passwordHashed,
        req.body.phone,
      ]);
      return res.status(201).json({ success: true });
    } catch (error) {
      console.log("[ERROR]", error);
      return res.status(400).json({ message: "Something went wrong" });
    }
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});
