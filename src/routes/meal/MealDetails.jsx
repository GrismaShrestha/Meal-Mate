import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import { MdAccessTimeFilled } from "react-icons/md";
import Modal from "react-modal";
import { useState } from "react";
import Button from "../../components/Button";
import { FaStar } from "react-icons/fa";
import { FaWeight } from "react-icons/fa";
import { useUser } from "../../hooks/auth";
import { toast } from "react-toastify";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function MealDetails() {
  const params = useParams();
  const mealId = params.mealId;

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["meal-details", mealId],
    queryFn: () =>
      $axios
        .get(`/meal/${mealId}`)
        .then((res) => res.data.meal)
        .catch(() => null),
  });

  // Favourite meals list
  const { data: user } = useUser();
  const { data: favouriteMeals, isLoading: isLoadingFavouriteMeals } = useQuery(
    {
      queryKey: ["favourite-meals", user.id],
      queryFn: () =>
        $axios
          .get(`/user/favourite-meal`)
          .then((res) => res.data.favMeals)
          .catch(() => null),
    },
  );

  // Add to favourite
  const queryClient = useQueryClient();
  const { mutate: addToFavourite, isPending: isAddingToFavourite } =
    useMutation({
      mutationKey: ["add-to-favourite", data?.id],
      mutationFn: () =>
        $axios.post("/user/favourite-meal", { mealId: data.id }),
      onSuccess: () => {
        toast.success("Meal added to favourites successfully!");
        queryClient.refetchQueries({
          queryKey: ["favourite-meals"],
        });
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });

  // Remove from favourites
  const { mutate: removeFromFavourites, isPending: isRemovingFromFavourites } =
    useMutation({
      mutationKey: ["remove-from-favourites", data?.id],
      mutationFn: () =>
        $axios.post("/user/unfavourite-meal", { mealId: data.id }),
      onSuccess: () => {
        toast.success("Meal removed from favourites successfully!");
        queryClient.refetchQueries({
          queryKey: ["favourite-meals"],
        });
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });

  const [showDetailedNutritions, setShowDetailedNutritions] = useState(false);

  if (!data) {
    return (
      <div className="flex-grow">
        <p>Given meal not found!</p>
      </div>
    );
  }

  return (
    <div className="container flex-grow py-6">
      <button
        className="flex items-center gap-2 hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaAngleLeft className="inline" /> <p>Go back</p>
      </button>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold">{data.name}</h1>
        <p className="font-medium capitalize">{data.meal}</p>
      </div>

      {/* Basic info */}
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <img
          src={data.main_image}
          className="h-auto w-[250px] rounded-lg object-cover"
        />
        <div className="flex flex-col gap-3">
          <p>
            <span className="ml-8">
              <MdAccessTimeFilled
                color="#A1A3B4"
                size={22}
                className="mr-2 inline"
              />
              {data.total_time}
            </span>
            <span className="ml-8">
              <FaWeight color="#A1A3B4" size={18} className="mr-2 inline" />
              {data.weight_in_grams}gm
            </span>
          </p>
          <div className="flex gap-6 rounded-lg bg-gray-100 px-4 py-2">
            <div className="flex flex-col items-center">
              <p>Calories</p>
              <p className="text-xl font-semibold">{data.calories}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Protein</p>
              <p className="text-xl font-semibold text-[#34B018]">
                {data.protein}g
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p>Carbs</p>
              <p className="text-xl font-semibold text-[#F46708]">
                {data.carbs}g
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p>Fat</p>
              <p className="text-xl font-semibold text-[#B76AE9]">
                {data.fat}g
              </p>
            </div>
          </div>
          <button
            className="self-center border-b border-b-[#F37520] text-sm font-semibold text-[#F37520]"
            onClick={() => setShowDetailedNutritions(true)}
          >
            Show detailed nutritions
          </button>
          {!isLoadingFavouriteMeals &&
            (favouriteMeals.map((m) => m.meal_id).includes(data.id) ? (
              <Button
                className="mt-1 self-center"
                onClick={() => removeFromFavourites()}
                loading={isRemovingFromFavourites}
                color="white"
              >
                <FaStar className="mr-2 inline" size={18} /> Remove from
                favourites
              </Button>
            ) : (
              <Button
                className="mt-1 self-center"
                onClick={() => addToFavourite()}
                loading={isAddingToFavourite}
              >
                <FaStar className="mr-2 inline" size={18} /> Favourite
              </Button>
            ))}
        </div>
      </div>

      <div className="mt-12 flex w-full gap-32">
        {/* Ingredients */}
        <div className="basis-[40%]">
          <h2 className="text-2xl font-semibold">Ingredients</h2>
          <ol className="mt-2 list-inside list-disc">
            {data.ingredients.split("\n").map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ol>
        </div>
        {/* Instructions */}
        <div>
          <h2 className="text-2xl font-semibold">Instructions</h2>
          <ol className="mt-2 list-disc">
            {data.instructions.split("\n").map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Detailed nutritions modal */}
      <Modal
        isOpen={showDetailedNutritions}
        onRequestClose={() => setShowDetailedNutritions(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        contentLabel="Detailed nutritions"
      >
        <p className="mb-3 text-xl font-semibold">Nutrition values</p>
        <div className="grid grid-cols-2 gap-x-8">
          <p>Calories</p>
          <p>{data.calories}</p>
          <p>Protein</p>
          <p>{data.protein}g</p>
          <p>Carbs</p>
          <p>{data.carbs}g</p>
          <p>Fat</p>
          <p>{data.fat}g</p>
          <p>Sugar</p>
          <p>{data.sugar}g</p>
          <p>Fiber</p>
          <p>{data.fiber}g</p>
          <p>Saturated fat</p>
          <p>{data.saturated_fat}g</p>
          <p>Monounsaturated fat</p>
          <p>{data.monounsaturated_fat}g</p>
          <p>Polyunsaturated fat</p>
          <p>{data.polyunsaturated_fat}g</p>
          <p>Trans fat</p>
          <p>{data.trans_fat}g</p>
          <p>Cholesterol</p>
          <p>{data.cholesterol}mg</p>
          <p>Sodium</p>
          <p>{data.sodium}mg</p>
          <p>Potassium</p>
          <p>{data.potassium}mg</p>
          <p>Vitamin A</p>
          <p>{data.vitamin_a}mcg</p>
          <p>Vitamin C</p>
          <p>{data.vitamin_c}mg</p>
          <p>Calcium</p>
          <p>{data.calcium}mg</p>
          <p>Iron</p>
          <p>{data.iron}mg</p>
        </div>
      </Modal>
    </div>
  );
}
