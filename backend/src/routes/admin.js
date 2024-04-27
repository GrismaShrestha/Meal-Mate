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
  const totalAdmins = await db
    .query("SELECT COUNT(*) AS count FROM admin")
    .then(([res]) => res[0].count);
  const totalMeals = await db
    .query("SELECT COUNT(*) AS count FROM user_meal_plan_meal")
    .then(([res]) => res[0].count);
  const totalUsersWithReminder = await db
    .query("SELECT COUNT(*) AS count FROM reminder")
    .then(([res]) => res[0].count);

  // Users with a goal plan
  const usersWithGoalAsMaintainWeight = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE goal = 'maintain-weight'")
    .then(([res]) => res[0].count);
  const usersWithGoalAsMildWeightLoss = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE goal = 'mild-weight-loss'")
    .then(([res]) => res[0].count);
  const usersWithGoalAsWeightLoss = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE goal = 'weight-loss'")
    .then(([res]) => res[0].count);
  const usersWithGoalAsExtremeWeightLoss = await db
    .query(
      "SELECT COUNT(*) AS count FROM user WHERE goal = 'extreme-weight-loss'",
    )
    .then(([res]) => res[0].count);
  const usersWithGoalAsMildWeightGain = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE goal = 'mild-weight-gain'")
    .then(([res]) => res[0].count);
  const usersWithGoalAsWeightGain = await db
    .query("SELECT COUNT(*) AS count FROM user WHERE goal = 'weight-gain'")
    .then(([res]) => res[0].count);
  const usersWithGoalAsExtremeWeightGain = await db
    .query(
      "SELECT COUNT(*) AS count FROM user WHERE goal = 'extreme-weight-gain'",
    )
    .then(([res]) => res[0].count);

  // Latest meals
  const [latestMeals] = await db.query(
    "SELECT id, name, main_image FROM user_meal_plan_meal ORDER BY id DESC LIMIT 4",
  );

  const responseData = {
    metrics: {
      totalUsers,
      totalAdmins,
      totalUsersWithReminder,
      totalMeals,
    },
    userGoals: {
      "maintain-weight": usersWithGoalAsMaintainWeight,
      "mild-weight-loss": usersWithGoalAsMildWeightLoss,
      "weight-loss": usersWithGoalAsWeightLoss,
      "extreme-weight-loss": usersWithGoalAsExtremeWeightLoss,
      "mild-weight-gain": usersWithGoalAsMildWeightGain,
      "weight-gain": usersWithGoalAsWeightGain,
      "extreme-weight-gain": usersWithGoalAsExtremeWeightGain,
    },
    latestMeals,
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
