import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import TextInput from "../../components/TextInput";
import TextAreaInput from "../../components/TextAreaInput";
import Button from "../../components/Button";
import { toast } from "react-toastify";

export default function MealDetails() {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["meal-details", id],
    queryFn: () =>
      $axios
        .get(`/meal/${id}`)
        .then((res) => res.data.meal)
        .catch(() => null),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-meal"],
    mutationFn: (values) => $axios.post(`/meal/${id}`, values),
    onSuccess: () => {
      toast.success("Meal edited successfully!");
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "meals"],
      });
    },
    onError: () => {
      toast.error("Could not edit the meal!");
    },
  });

  if (!data) {
    return (
      <div className="flex-grow">
        <p>Given meal not found!</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();

        const name = e.target.elements.name.value;
        const num_of_servings = e.target.elements.num_of_servings.value;
        const total_time = e.target.elements.total_time.value;
        const weight_in_grams = e.target.elements.weight_in_grams.value;
        const serving_weight = e.target.elements.serving_weight.value;
        const ingredients = e.target.elements.ingredients.value;
        const instructions = e.target.elements.instructions.value;
        const calories = e.target.elements.calories.value;
        const protein = e.target.elements.protein.value;
        const carbs = e.target.elements.carbs.value;
        const fat = e.target.elements.fat.value;
        const sugar = e.target.elements.sugar.value;
        const fiber = e.target.elements.fiber.value;
        const saturated_fat = e.target.elements.saturated_fat.value;
        const monounsaturated_fat = e.target.elements.monounsaturated_fat.value;
        const polyunsaturated_fat = e.target.elements.polyunsaturated_fat.value;
        const trans_fat = e.target.elements.trans_fat.value;
        const cholesterol = e.target.elements.cholesterol.value;
        const sodium = e.target.elements.sodium.value;
        const potassium = e.target.elements.potassium.value;
        const vitamin_a = e.target.elements.vitamin_a.value;
        const vitamin_c = e.target.elements.vitamin_c.value;
        const calcium = e.target.elements.calcium.value;
        const iron = e.target.elements.iron.value;

        mutate({
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
        });
      }}
    >
      <h2 className="text-2xl font-semibold text-gray-600">
        Basic information
      </h2>

      <TextInput
        label="Meal name"
        placeholder="Name of the meal"
        defaultValue={data.name}
        id="name"
        required
      />
      <div className="grid grid-cols-4 gap-6">
        <TextInput
          label="Number of servings"
          placeholder="Number of servings"
          defaultValue={data.num_of_servings}
          id="num_of_servings"
          required
          type="number"
          min={1}
        />
        <TextInput
          label="Total time to create (in minutes)"
          placeholder="Total time to create (in minutes)"
          defaultValue={parseInt(data.total_time)}
          id="total_time"
          required
          type="number"
          min={1}
        />
        <TextInput
          label="Weight (in grams)"
          placeholder="Weight (in grams)"
          defaultValue={data.weight_in_grams}
          id="weight_in_grams"
          required
          type="number"
          min={1}
        />
        <TextInput
          label="Serving weight (in grams)"
          placeholder="Serving weight (in grams)"
          defaultValue={data.serving_weight}
          id="serving_weight"
          required
          type="number"
          min={1}
        />
      </div>
      <TextAreaInput
        label="Ingredients"
        placeholder="Ingredients of the meal"
        defaultValue={data.ingredients}
        id="ingredients"
        required
        rows={6}
      />
      <TextAreaInput
        label="Instructions"
        placeholder="Instructions of the meal"
        defaultValue={data.instructions}
        id="instructions"
        required
        rows={6}
      />

      <h2 className="mt-4 text-2xl font-semibold text-gray-600">
        Nutrition values
      </h2>

      <div className="grid grid-cols-4 items-center gap-6">
        <TextInput
          label="Calories"
          placeholder="Calories"
          defaultValue={data.calories}
          id="calories"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Protein (in grams)"
          placeholder="Protein (in grams)"
          defaultValue={data.protein}
          id="protein"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Carbs (in grams)"
          placeholder="Carbs (in grams)"
          defaultValue={data.carbs}
          id="carbs"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Fat (in grams)"
          placeholder="Fat (in grams)"
          defaultValue={data.fat}
          id="fat"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Sugar (in grams)"
          placeholder="Sugar (in grams)"
          defaultValue={data.sugar}
          id="sugar"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Fiber (in grams)"
          placeholder="Fiber (in grams)"
          defaultValue={data.fiber}
          id="fiber"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Saturated fat (in grams)"
          placeholder="Saturated fat (in grams)"
          defaultValue={data.saturated_fat}
          id="saturated_fat"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Monounsaturated fat (in grams)"
          placeholder="Monounsaturated fat (in grams)"
          defaultValue={data.monounsaturated_fat}
          id="monounsaturated_fat"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Polyunsaturated fat (in grams)"
          placeholder="Polyunsaturated fat (in grams)"
          defaultValue={data.polyunsaturated_fat}
          id="polyunsaturated_fat"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Trans fat (in grams)"
          placeholder="Trans fat (in grams)"
          defaultValue={data.trans_fat}
          id="trans_fat"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Cholesterol (in milligrams)"
          placeholder="Cholesterol (in milligrams)"
          defaultValue={data.cholesterol}
          id="cholesterol"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Sodium (in milligrams)"
          placeholder="Sodium (in milligrams)"
          defaultValue={data.sodium}
          id="sodium"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Potassium (in milligrams)"
          placeholder="Potassium (in milligrams)"
          defaultValue={data.potassium}
          id="potassium"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Vitamin A (in micrograms)"
          placeholder="Vitamin A (in micrograms)"
          defaultValue={data.vitamin_a}
          id="vitamin_a"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Vitamin C (in milligrams)"
          placeholder="Vitamin C (in milligrams)"
          defaultValue={data.vitamin_c}
          id="vitamin_c"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Calcium (in milligrams)"
          placeholder="Calcium (in milligrams)"
          defaultValue={data.calcium}
          id="calcium"
          required
          type="number"
          min={0}
        />
        <TextInput
          label="Iron (in milligrams)"
          placeholder="Iron (in milligrams)"
          defaultValue={data.iron}
          id="iron"
          required
          type="number"
          min={0}
        />
      </div>
      <Button className="mt-2 self-start" loading={isPending}>
        Save
      </Button>
    </form>
  );
}
