import express from "express";
import { db } from "../db.js";

export const mealRouter = express.Router();

// Meal details
// ------------

mealRouter.get(
  "/meal/:mealId",
  // The actual process
  async (req, res) => {
    const mealId = req.params.mealId;

    const [meal] = await db.query(
      `SELECT *
      FROM user_meal_plan_meal umpm
      WHERE umpm.id = ?;`,
      [mealId],
    );
    if (meal.length == 0) {
      return res.status(404).json({ message: "Meal not found" });
    }

    return res.json({ meal: meal[0] });
  },
);
