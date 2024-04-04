import jwt from "jsonwebtoken";
import { db } from "../db.js";

export async function isUser(req, res, next) {
  // Extract token from headers
  const authorization = req.headers.authorization;
  const splittedValues = authorization?.split(" ");
  const token = splittedValues?.length == 2 ? splittedValues[1] : undefined;

  // If not token
  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  let payload;
  try {
    payload = jwt.verify(token, "jwt-secret");
  } catch (error) {
    {
      return res.status(401).json({ message: "User not logged in" });
    }
  }

  // Find user using userId from payload
  const [user] = await db.query(
    "SELECT id, name, phone, email FROM user WHERE id = ?",
    payload.userId,
  );

  // If no user, throw error
  if (user.length == 0) {
    return res.status(401).json({ message: "User not logged in" });
  }

  req.loggedInUser = user[0];

  // call next function
  next();
}
