import { IoCaretBackCircle } from "react-icons/io5";
import { IoCaretForwardCircle } from "react-icons/io5";
import dayjs from "dayjs";
import { useUser } from "../../hooks/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { Navigate, Link } from "react-router-dom";
import ProgressiveImage from "react-progressive-graceful-image";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import { CiSettings } from "react-icons/ci";
import { CiRedo } from "react-icons/ci";
import Modal from "react-modal";
import { toast } from "react-toastify";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function UserDashboard() {
  const { data, isFetching } = useUserMealPlan();

  const [day, setDay] = useState(dayjs().day() + 1);
  const dayEntry = data?.plan.find((d) => d.day == day);
  const totalProtein = Object.values(dayEntry?.meals || {}).reduce(
    (acc, cur) => acc + cur.protein,
    0,
  );
  const totalCarbs = Object.values(dayEntry?.meals || {}).reduce(
    (acc, cur) => acc + cur.carbs,
    0,
  );
  const totalFat = Object.values(dayEntry?.meals || {}).reduce(
    (acc, cur) => acc + cur.fat,
    0,
  );
  const proteinPercentage = Math.floor(
    (totalProtein / (totalProtein + totalCarbs + totalFat)) * 100,
  );
  const carbsPercentage = Math.floor(
    (totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100,
  );
  const fatPercentage = Math.floor(
    (totalFat / (totalProtein + totalCarbs + totalFat)) * 100,
  );

  // Plan regeneration
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["meal-plan-regeneration"],
    mutationFn: async () => {
      const currentMealPlan = await $axios
        .get("/user/meal-gen-settings")
        .then((res) => res.data);
      await $axios.post("/user/meal-plan", {
        gender: currentMealPlan.gender,
        age: currentMealPlan.age,
        height: currentMealPlan.height,
        weight: currentMealPlan.weight,
        "activity-level": currentMealPlan.activity_level,
        goal: currentMealPlan.goal,
      });
    },
    onSuccess: () => {
      toast.success("Your meal plan has been generated!");
      queryClient.refetchQueries({
        queryKey: ["user-meal-plan"],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  if (!isFetching && !data) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="relative">
        <div className="absolute left-0 top-0 h-[180px] w-full">
          <img
            src="/meals.jpg"
            className="h-full w-full object-cover brightness-[0.2]"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-cyan-300 opacity-20" />
        </div>
        {isFetching ? (
          <div className="mt-24">
            <LoadingIndicator />
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center gap-4 pt-12">
            <div>
              <div className="flex w-[370px] items-center justify-center text-white">
                <button
                  onClick={() =>
                    setDay((cur) => ((((cur - 1 - 1) % 7) + 7) % 7) + 1)
                  }
                >
                  <IoCaretBackCircle size={45} />
                </button>
                <p className="flex-grow text-center text-2xl font-bold">
                  {weekDays[day - 1]}
                </p>
                <button
                  onClick={() =>
                    setDay((cur) => ((((cur + 1 - 1) % 7) + 7) % 7) + 1)
                  }
                >
                  <IoCaretForwardCircle size={45} />
                </button>
              </div>
              <p className="mt-2 text-center text-white">
                {relativeMealDayText(day, dayjs().day() + 1)}
              </p>
              <div className="mt-4 w-full rounded-lg bg-white p-4 shadow-xl">
                <p className="text-xs font-black uppercase text-gray-500">
                  Total nutrition value
                </p>

                <div className="mb-3 mt-4 grid grid-cols-4 gap-3">
                  <div className="bg-[#F9F9FC] p-2 text-center">
                    <p>Calories</p>
                    <p className="font-bold">{dayEntry.calories}</p>
                  </div>
                  <div className="bg-[#F9F9FC] p-2 text-center">
                    <p>Protein</p>
                    <p className="font-bold">{totalProtein}g</p>
                    <p className="mt-1 bg-[#83BD27] text-xs text-white">
                      {proteinPercentage}%
                    </p>
                  </div>
                  <div className="bg-[#F9F9FC] p-2 text-center">
                    <p>Carbs</p>
                    <p className="font-bold">{totalCarbs}g</p>
                    <p className="mt-1 bg-[#F99D00] text-xs text-white">
                      {carbsPercentage}%
                    </p>
                  </div>
                  <div className="bg-[#F9F9FC] p-2 text-center">
                    <p>Fat</p>
                    <p className="font-bold">{totalFat}g</p>
                    <p className="mt-1 bg-[#B56BE8] text-xs text-white">
                      {fatPercentage}%
                    </p>
                  </div>
                </div>
                <Chart
                  chartType="PieChart"
                  data={[
                    ["Nutrition", "Percentage"],
                    ["Protein", proteinPercentage],
                    ["Carbs", carbsPercentage],
                    ["Fat", fatPercentage],
                  ]}
                  options={{
                    is3D: true,
                    width: 350,
                    height: 150,
                    legend: { position: "none" },
                    chartArea: { width: "100%", height: "100%" },
                    colors: ["#83BD27", "#F99D00", "#B56BE8"],
                    tooltip: { trigger: "none" },
                  }}
                />
              </div>
            </div>
            <div className="mt-12 grid grid-cols-4 gap-12 px-10">
              <MealPlanEntry details={dayEntry.meals["breakfast"]} />
              <MealPlanEntry details={dayEntry.meals["snack"]} />
              <MealPlanEntry details={dayEntry.meals["lunch"]} />
              <MealPlanEntry details={dayEntry.meals["dinner"]} />
            </div>

            <div className="mt-8 w-full bg-[#F99D00] bg-opacity-80 p-10 text-center">
              <p className="text-3xl font-bold text-white">
                Not satisfied with your current plan?
              </p>
              <div className="mt-8 flex w-full">
                <Link to="/user/meal-plan-form" className="w-1/2">
                  <Button
                    className="flex h-[180px] w-full flex-col justify-center gap-3 rounded-none border-r text-xl text-gray-700"
                    color="white"
                  >
                    <CiSettings size={56} />
                    Change your generation settings
                  </Button>
                </Link>
                <Button
                  className="flex h-[180px] w-1/2 flex-col justify-center gap-3 rounded-none text-xl text-gray-700"
                  color="white"
                  onClick={() => mutate()}
                >
                  <CiRedo size={52} />
                  Regenerate the plan using current settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Regenerate modal */}
      <Modal
        isOpen={isPending}
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
        contentLabel="Regenerate plan"
      >
        <div className="flex flex-col items-center justify-center p-5 text-center">
          <p className="mb-1 text-2xl font-semibold">Regenerating your plan</p>
          <p className="mb-3 text-sm">This may take some time...</p>
          <Spinner />
        </div>
      </Modal>
    </>
  );
}

function relativeMealDayText(target, cur) {
  switch (target - cur) {
    case 0:
      return "Today's meal plan";
    case 1:
      return "Tomorrow's meal plan";
    case -1:
      return "Yesterday's meal plan";
  }
}

function useUserMealPlan() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ["user-meal-plan", user?.id],
    queryFn: () =>
      $axios
        .get("/user/meal-plan")
        .then((res) => res.data)
        .catch(() => null),
  });
}

function MealPlanEntry({ details }) {
  return (
    <div>
      <p className="mb-1 text-xl font-medium capitalize">{details.type}</p>
      <a href={`/meal/${details.id}`} className="hover:underline">
        <ProgressiveImage src={details.main_image} placeholder="">
          {(src, loading) => {
            return loading ? (
              <div className="flex h-[140px] w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <img
                src={src}
                alt={details.name}
                className="h-[140px] w-full object-cover"
              />
            );
          }}
        </ProgressiveImage>
        <p className="mt-1 text-center text-sm">
          {details.name} ({details.calories} cal)
        </p>
      </a>
    </div>
  );
}
