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
      GROUP BY umpm.name
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

// Discover meals
// --------------

mealRouter.get(
  "/discover-meals",
  // The actual process
  async (_req, res) => {
    const [meals] = await db.query(
      `SELECT *
      FROM user_meal_plan_meal umpm
      ORDER BY rand()
      LIMIT 4;`,
    );
    return res.json({ meals });
  },
);

// Update meal details
// -------------------

mealRouter.post(
  "/meal/:mealId",
  // The actual process
  async (req, res) => {
    const mealId = req.params.mealId;

    const {
      name,
      num_of_servings,
      total_time,
      weight_in_grams,
      serving_weight,
      ingredients,
      instructions,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      fiber,
      saturated_fat,
      monounsaturated_fat,
      polyunsaturated_fat,
      trans_fat,
      cholesterol,
      sodium,
      potassium,
      vitamin_a,
      vitamin_c,
      calcium,
      iron,
    } = req.body;

    try {
      await db.query(
        `UPDATE user_meal_plan_meal umpm
      SET name = ?, num_of_servings = ?, total_time = ?, weight_in_grams = ?, serving_weight = ?, ingredients = ?, instructions = ?, calories = ?, protein = ?, carbs = ?, fat = ?, sugar = ?, fiber = ?, saturated_fat = ?, monounsaturated_fat = ?, polyunsaturated_fat = ?, trans_fat = ?, cholesterol = ?, sodium = ?, potassium = ?, vitamin_a = ?, vitamin_c = ?, calcium = ?, iron = ?
      WHERE umpm.id = ?;`,
        [
          name,
          num_of_servings,
          total_time + " minutes",
          weight_in_grams,
          serving_weight,
          ingredients,
          instructions,
          calories,
          protein,
          carbs,
          fat,
          sugar,
          fiber,
          saturated_fat,
          monounsaturated_fat,
          polyunsaturated_fat,
          trans_fat,
          cholesterol,
          sodium,
          potassium,
          vitamin_a,
          vitamin_c,
          calcium,
          iron,
          mealId,
        ],
      );
    } catch (error) {
      console.log("[ERROR]", error);
      return res.status(500).json({ success: false });
    }

    return res.json({ success: true });
  },
);
