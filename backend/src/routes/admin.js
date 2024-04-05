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
