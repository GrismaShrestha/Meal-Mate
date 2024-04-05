import express from "express";
import { db } from "../db.js";
import { isAdmin } from "../guards/auth.js";

export const adminRouter = express.Router();

// Get dashboard data
// ------------------

adminRouter.get("/admin/dashboard", isAdmin, async (_, res) => {
  const totalUsers = await db
    .query("SELECT COUNT(*) AS count FROM user")
    .then(([res]) => res[0].count);

  const responseData = {
    metrics: {
      totalUsers,
    },
  };
  return res.json(responseData);
});

// Get the list of all users
// -------------------------

adminRouter.get("/admin/dashboard/users", isAdmin, async (_, res) => {
  const [users] = await db.query(
    "SELECT id, name, phone, email, created_at FROM user",
  );

  const responseData = {
    users,
  };
  return res.json(responseData);
});

// Get details of a user
// ---------------------

adminRouter.get("/admin/user/:id", isAdmin, async (req, res) => {
  const [user] = await db.query(
    "SELECT id, name, phone, email FROM user WHERE id = ?",
    [req.params.id],
  );
  if (user.length == 0) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: user[0] });
});

// Edit a user
// -----------

adminRouter.patch("/admin/user/:id", isAdmin, async (req, res) => {
  await db.query(
    "UPDATE user SET name = ?, email = ?, phone = ? WHERE id = ?",
    [req.body.name, req.body.email, req.body.phone, req.params.id],
  );

  return res.json({ success: true });
});

// Delete a user
// -------------

adminRouter.delete("/admin/user/:id", isAdmin, async (req, res) => {
  await db.query("DELETE FROM user WHERE id = ?", [req.params.id]);

  return res.json({ success: true });
});
