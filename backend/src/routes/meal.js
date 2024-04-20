import express from "express";
import { db } from "../db.js";

export const mealRouter = express.Router();

// All Meals
// ---------

mealRouter.get(
  "/meal",
  // The actual process
  async (_req, res) => {
    const [meals] = await db.query(
      `SELECT *
      FROM user_meal_plan_meal umpm
      ORDER BY id DESC;`,
    );
    return res.json({ meals });
  },
);

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
