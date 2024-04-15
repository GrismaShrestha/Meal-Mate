import express from "express";
import { db } from "../db.js";
import { isUser } from "../guards/auth.js";
import otpGenerator from "otp-generator";

export const userRouter = express.Router();

const OTPs = {};

// Generate a meal plan
// --------------------

userRouter.post(
  "/user/meal-plan",
  // Allow only logged in users
  isUser,
  // The actual generation process
  async (req, res) => {
    try {
      // First check if the user already has a meal plan generated
      const doesUserAlreadyHaveAMealPlanGenerated = await db
        .query(
          "SELECT COUNT(*) AS count FROM user_meal_plan WHERE user_id = ?",
          [req.loggedInUser.id],
        )
        .then(([result]) => result[0].count > 0);
      if (doesUserAlreadyHaveAMealPlanGenerated) {
        return res
          .status(409)
          .json({ message: "Current user has already generated a meal plan" });
      }

      // Generation inputs
      const age = req.body.age;
      const gender = req.body.gender;
      const height = req.body.height;
      const weight = req.body.weight;
      const activitylevel = req.body["activity-level"];

      // Get carbs-fats-proteins distributions for goal
      const goalDistr = getDistributionsForGoal(req.body.goal);

      // Fetch the BMR from API
      const bmr = await fetch(
        "https://fitness-calculator.p.rapidapi.com/dailycalorie?" +
          new URLSearchParams({
            age,
            gender,
            height,
            weight,
            activitylevel,
          }),
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "781f5731a3msh7433ecc5281a33bp10dce2jsn9cbc00fe2ad2",
          },
        },
      )
        .then((res) => res.json())
        .then((res) => res.data.BMR);

      // Set the user settings
      const setUserSettingsRes = await fetch(
        "https://production.suggestic.com/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
            Authorization: "Token 618cfa9fb35baa83a37c67472e5f6b8047987b99",
            "sg-user": "cdf16aa0-42fe-4de9-a4f9-f2bcb57594f6",
          },
          body: JSON.stringify({
            query: `mutation updateMealPlanSettings {
                      updateMealPlanSettings(
                        overwrite: {
                          calories: ${Math.floor(bmr)},
                          carbs: ${goalDistr[0]},
                          fat: ${goalDistr[1]},
                          protein: ${goalDistr[2]},
                        }
                      ) {
                        success
                        message
                      }
                    }`,
          }),
        },
      )
        .then((res) => res.json())
        .then((res) => res.data);
      if (!setUserSettingsRes.updateMealPlanSettings.success) {
        console.log("[ERROR] Set the user settings:", setUserSettingsRes);
        return res.status(500).json({ message: "Something went wrong!" });
      }

      // Generate the meal plan
      const genMealPlanRes = await fetch(
        "https://production.suggestic.com/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
            Authorization: "Token 618cfa9fb35baa83a37c67472e5f6b8047987b99",
            "sg-user": "cdf16aa0-42fe-4de9-a4f9-f2bcb57594f6",
          },
          body: JSON.stringify({
            query: `mutation {
                      generateMealPlan(ignoreLock: true) {
                        success
                        message
                      }
                    }`,
          }),
        },
      )
        .then((res) => res.json())
        .then((res) => res.data);
      if (!genMealPlanRes.generateMealPlan.success) {
        console.log("[ERROR] Generate the meal plan:", genMealPlanRes);
        return res
          .status(500)
          .json({ message: genMealPlanRes.generateMealPlan.message });
      }

      // Get the generated meal plan
      const mealPlans = await fetch(
        "https://production.suggestic.com/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
            Authorization: "Token 618cfa9fb35baa83a37c67472e5f6b8047987b99",
            "sg-user": "cdf16aa0-42fe-4de9-a4f9-f2bcb57594f6",
          },
          body: JSON.stringify({
            query: `{
              mealPlan {
                day
                calories
                meals {
                  id
                  calories
                  meal
                  numOfServings
                  recipe {
                    totalTime
                    name
                    numberOfServings
                    ingredientLines
                    mainImage
                    weightInGrams
                    servingWeight
                    relativeCalories {
                      carbs
                      fat
                      protein
                      fat
                    }
                    instructions
                    nutrientsPerServing {
                      calories
                      protein
                      carbs
                      fat
                      sugar
                      fiber
                      saturatedFat
                      monounsaturatedFat
                      polyunsaturatedFat
                      transFat
                      cholesterol
                      sodium
                      potassium
                      vitaminA
                      vitaminC
                      calcium
                      iron
                    }
                  }
                }
              }
            }`,
          }),
        },
      )
        .then((res) => res.json())
        .then((res) => res.data);

      // Save the meal plan in the database
      try {
        for (const mealPlan of mealPlans.mealPlan) {
          const [result] = await db.query(
            "INSERT INTO user_meal_plan (user_id, day, calories) VALUES (?, ?, ?)",
            [req.loggedInUser.id, mealPlan.day, Math.floor(mealPlan.calories)],
          );
          const newInsertedId = result.insertId;
          for (const meal of mealPlan.meals) {
            await db.query(
              "INSERT INTO user_meal_plan_meal (user_meal_plan_id, meal, num_of_servings, total_time, name, main_image, weight_in_grams, serving_weight, ingredients, instructions, calories, protein, carbs, fat, sugar, fiber, saturated_fat, monounsaturated_fat, polyunsaturated_fat, trans_fat, cholesterol, sodium, potassium, vitamin_a, vitamin_c, calcium, iron) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                newInsertedId,
                meal.meal,
                meal.numOfServings,
                meal.recipe.totalTime,
                meal.recipe.name,
                meal.recipe.mainImage,
                meal.recipe.weightInGrams,
                meal.recipe.servingWeight,
                meal.recipe.ingredientLines.join("\n"),
                meal.recipe.instructions.join("\n"),
                meal.recipe.nutrientsPerServing.calories,
                meal.recipe.nutrientsPerServing.protein,
                meal.recipe.nutrientsPerServing.carbs,
                meal.recipe.nutrientsPerServing.fat,
                meal.recipe.nutrientsPerServing.sugar,
                meal.recipe.nutrientsPerServing.fiber,
                meal.recipe.nutrientsPerServing.saturatedFat,
                meal.recipe.nutrientsPerServing.monounsaturatedFat,
                meal.recipe.nutrientsPerServing.polyunsaturatedFat,
                meal.recipe.nutrientsPerServing.transFat,
                meal.recipe.nutrientsPerServing.cholesterol,
                meal.recipe.nutrientsPerServing.sodium,
                meal.recipe.nutrientsPerServing.potassium,
                meal.recipe.nutrientsPerServing.vitaminA,
                meal.recipe.nutrientsPerServing.vitaminC,
                meal.recipe.nutrientsPerServing.calcium,
                meal.recipe.nutrientsPerServing.iron,
              ],
            );
          }
        }
      } catch (err) {
        console.log("[ERROR] Save the meal plan in the database:", err);
        return res.status(500).json({ message: "Something went wrong!" });
      }

      return res.status(201).json({ success: true });
    } catch (error) {
      console.log("[ERROR]", error);
      return res.status(500).json({
        message: "Could not generate the meal plan! Please try again.",
      });
    }
  },
);

// Get the generated meal plan (if it exists)
// ------------------------------------------

userRouter.get(
  "/user/meal-plan",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    // First check if the user is verified
    const isUserVerified = await db
      .query("SELECT is_verified FROM user WHERE id = ?", [req.loggedInUser.id])
      .then(([result]) => result[0].is_verified);
    if (!isUserVerified) {
      return res
        .status(400)
        .json({ message: "Current user is not verified yet" });
    }

    // Check if the user has generated a meal plan
    const doesUserAlreadyHaveAMealPlanGenerated = await db
      .query("SELECT COUNT(*) AS count FROM user_meal_plan WHERE user_id = ?", [
        req.loggedInUser.id,
      ])
      .then(([result]) => result[0].count > 0);
    if (!doesUserAlreadyHaveAMealPlanGenerated) {
      return res
        .status(404)
        .json({ message: "Current user has not generated a meal plan yet" });
    }

    // Get all the meals of the plan
    const [meals] = await db.query(
      `SELECT ump.day, ump.calories as total_calories, umpm.*
       FROM user_meal_plan ump
       INNER JOIN user_meal_plan_meal umpm ON ump.id = umpm.user_meal_plan_id
       WHERE ump.user_id = ?`,
      [req.loggedInUser.id],
    );

    const retData = [];
    for (const meal of meals) {
      let {
        day,
        total_calories,
        user_meal_plan_id,
        meal: mealType,
        ...mealDetails
      } = meal;
      mealDetails["type"] = mealType;
      const dayEntryIdx = retData.findIndex((d) => d.day == day);
      if (dayEntryIdx == -1) {
        retData.push({
          id: user_meal_plan_id,
          day: day,
          calories: total_calories,
          meals: { [mealType]: mealDetails },
        });
      } else {
        retData[dayEntryIdx].meals[mealType] = mealDetails;
      }
    }

    return res.json({ plan: retData });
  },
);

// Is the user verified yet?
// -------------------------
userRouter.get(
  "/user/is-verified",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    // Check if the user is verified
    const isUserVerified = await db
      .query("SELECT is_verified FROM user WHERE id = ?", [req.loggedInUser.id])
      .then(([result]) => result[0].is_verified);
    return res.status(200).json({ is_verified: isUserVerified });
  },
);

// Send verification OTP
// ---------------------
userRouter.post(
  "/user/send-otp",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    // Check if the user is verified
    const isUserVerified = await db
      .query("SELECT is_verified FROM user WHERE id = ?", [req.loggedInUser.id])
      .then(([result]) => result[0].is_verified);
    if (isUserVerified) {
      return res.status(400).json({ message: "User is already verified!" });
    }
    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });
    OTPs[req.loggedInUser.id] = otp;

    const userPhone = await db
      .query("SELECT phone FROM user WHERE id = ?", [req.loggedInUser.id])
      .then(([result]) => result[0].phone);

    await fetch("https://api.sparrowsms.com/v2/sms/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "v2_JVEAq00nf1rJrOQNkySw0crF2Bw.adQJ",
        from: "TheAlert",
        to: userPhone,
        text: "Your verification OTP is: " + otp,
      }),
    });

    return res.status(200).json({ message: "OTP sent" });
  },
);

// Check if OTP is correct and verify the account
// ----------------------------------------------
userRouter.post(
  "/user/verify-account",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    // Check if the user is verified
    const isUserVerified = await db
      .query("SELECT is_verified FROM user WHERE id = ?", [req.loggedInUser.id])
      .then(([result]) => result[0].is_verified);
    if (isUserVerified) {
      return res.status(400).json({ message: "User is already verified!" });
    }

    if (OTPs[req.loggedInUser.id] == req.body.otp) {
      await db.query("UPDATE user SET is_verified = 1 WHERE id = ?", [
        req.loggedInUser.id,
      ]);
      return res.status(200).json({ message: "Account has been verified!" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  },
);

// Utils
// -----

function getDistributionsForGoal(goal) {
  switch (goal) {
    case "maintain-weight":
      return [50, 30, 20];
    case "mild-weight-loss":
      return [40, 30, 30];
    case "weight-loss":
      return [35, 30, 35];
    case "extreme-weight-loss":
      return [20, 30, 50];
    case "mild-weight-gain":
      return [55, 30, 15];
    case "weight-gain":
      return [60, 30, 10];
    case "extreme-weight-gain":
      return [70, 20, 10];
  }
}
