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
      const [userMeals] = await db.query(
        "SELECT id FROM user_meal_plan WHERE user_id = ?",
        [req.loggedInUser.id],
      );
      // If already created, delete them
      if (userMeals.length > 0) {
        await db.query("DELETE FROM user_meal_plan WHERE id IN (?)", [
          userMeals.reduce((acc, cur) => [...acc, cur.id], []),
        ]);
      }

      // Generation inputs
      const age = req.body.age;
      const gender = req.body.gender;
      const height = req.body.height;
      const weight = req.body.weight;
      const activitylevel = req.body["activity-level"];
      const goal = req.body.goal;

      // Get carbs-fats-proteins distributions for goal
      const goalDistr = getDistributionsForGoal(goal);

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

      // Save the meal gen settings
      await db.query(
        "UPDATE user SET age = ?, gender = ?, height = ?, weight = ?, activity_level = ?, goal = ?",
        [age, gender, height, weight, activitylevel, goal],
      );

      return res.status(201).json({ success: true });
    } catch (error) {
      console.log("[ERROR]", error);
      return res.status(500).json({
        message: "Could not generate the meal plan! Please try again.",
      });
    }
  },
);

// Get the user meal generation settings
// -------------------------------------

userRouter.get(
  "/user/meal-gen-settings",
  // Allow only logged in users
  isUser,
  // The actual generation process
  async (req, res) => {
    // Get the meal settings
    const [result] = await db.query(
      "SELECT gender, age, height, weight, activity_level, goal FROM user WHERE id = ?",
      [req.loggedInUser.id],
    );

    return res.json(result[0]);
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

// Update user profile
// -------------------
userRouter.patch(
  "/user/profile",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    try {
      if (name) {
        await db.query("UPDATE user SET name = ? WHERE id = ?", [
          name,
          req.loggedInUser.id,
        ]);
      }
      if (email) {
        await db.query("UPDATE user SET email = ? WHERE id = ?", [
          email,
          req.loggedInUser.id,
        ]);
      }
    } catch (error) {
      console.log("[ERROR]", error);
      return res.status(500).json({ message: "Something went wrong" });
    }

    return res.status(200).json({ message: "Profile updated successfully!" });
  },
);

// Get reminders of a user
// -----------------------
userRouter.get(
  "/user/reminders",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    // Check if the user has reminders
    const doesUserHaveReminders = await db
      .query("SELECT COUNT(*) AS count FROM reminder WHERE user_id = ?", [
        req.loggedInUser.id,
      ])
      .then(([result]) => result[0].count > 0);
    if (!doesUserHaveReminders) {
      return res
        .status(404)
        .json({ message: "Current user has no reminders yet" });
    }

    // Get all reminders of the user
    const [reminders] = await db.query(
      `SELECT *
       FROM reminder r
       WHERE r.user_id = ?`,
      [req.loggedInUser.id],
    );

    return res.json({ reminders: reminders[0] });
  },
);

// Save reminders of a user
// ------------------------
userRouter.post(
  "/user/reminders",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    // Delete previous reminders of the user (if it exists)
    await db.query("DELETE FROM reminder WHERE user_id = ?", [
      req.loggedInUser.id,
    ]);

    // Inputs
    const water_01 = req.body.water_01;
    const water_02 = req.body.water_02;
    const water_03 = req.body.water_03;
    const water_04 = req.body.water_04;
    const water_05 = req.body.water_05;
    const water_06 = req.body.water_06;
    const water_07 = req.body.water_07;
    const workout_sun = req.body.workout_sun;
    const workout_mon = req.body.workout_mon;
    const workout_tue = req.body.workout_tue;
    const workout_wed = req.body.workout_wed;
    const workout_thru = req.body.workout_thru;
    const workout_fri = req.body.workout_fri;
    const workout_sat = req.body.workout_sat;

    // Save the reminders
    try {
      await db.query(
        "INSERT INTO reminder (user_id, water_01, water_02, water_03, water_04, water_05, water_06, water_07, workout_sun, workout_mon, workout_tue, workout_wed, workout_thru, workout_fri, workout_sat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.loggedInUser.id,
          water_01,
          water_02,
          water_03,
          water_04,
          water_05,
          water_06,
          water_07,
          workout_sun,
          workout_mon,
          workout_tue,
          workout_wed,
          workout_thru,
          workout_fri,
          workout_sat,
        ],
      );
    } catch (error) {
      console.log("[ERROR]", error);
      return res.status(500).json({ message: "Something went wrong" });
    }

    return res.status(201).json({ success: true });
  },
);

// Favourite meals list
// --------------------

userRouter.get("/user/favourite-meal", isUser, async (req, res) => {
  const [favMeals] = await db.query(
    "SELECT meal_id FROM user_favourite_meal WHERE user_id = ?",
    [req.loggedInUser.id],
  );

  return res.json({
    meal_ids: favMeals.map((m) => m.meal_id),
  });
});

// Favourite a meal
// ----------------

userRouter.post(
  "/user/favourite-meal",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    const mealId = req.body.mealId;

    // First check if the meal is already favourite of the current user
    const [favMeals] = await db.query(
      "SELECT * FROM user_favourite_meal WHERE user_id = ? AND meal_id = ?",
      [req.loggedInUser.id, mealId],
    );
    if (favMeals.length > 0) {
      return res.status(409).json({
        message: "The given meal is already the favourite of user",
      });
    }

    // Add the meal to favourite
    try {
      await db.query(
        "INSERT INTO user_favourite_meal (user_id, meal_id) VALUES (?, ?)",
        [req.loggedInUser.id, mealId],
      );
    } catch (error) {
      console.log("[ERROR]", error);
      return res
        .status(500)
        .json({ message: "Could not add the meal to favourites" });
    }

    return res
      .status(201)
      .json({ message: "Meal added to favourite successfully!" });
  },
);

// Unfavourite a meal
// ----------------

userRouter.post(
  "/user/unfavourite-meal",
  // Allow only logged in users
  isUser,
  // The actual process
  async (req, res) => {
    const mealId = req.body.mealId;

    // Remove the meal from favourites
    try {
      await db.query(
        "DELETE FROM user_favourite_meal WHERE user_id = ? AND meal_id = ?",
        [req.loggedInUser.id, mealId],
      );
    } catch (error) {
      console.log("[ERROR]", error);
      return res
        .status(500)
        .json({ message: "Could not remove the meal from favourites" });
    }

    return res
      .status(201)
      .json({ message: "Meal removed from favourites successfully!" });
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
