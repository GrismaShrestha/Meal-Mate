import { IoCaretBackCircle } from "react-icons/io5";
import { IoCaretForwardCircle } from "react-icons/io5";
import dayjs from "dayjs";
import { useUser } from "../../hooks/auth";
import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useState } from "react";
import { Chart } from "react-google-charts";

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

  return (
    <div>
      <div className="relative left-0 top-0 h-[180px] w-full">
        <img
          src="/meals.jpg"
          className="h-full w-full object-cover brightness-[0.2]"
        />
        <div className="absolute left-0 top-0 z-20 h-full w-full bg-cyan-300 opacity-20" />
      </div>
      {isFetching ? (
        <div className="mt-24">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="relative -top-32 z-30 flex flex-col items-center justify-center gap-4">
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
        </div>
      )}
    </div>
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
        <img
          src={details.main_image}
          alt={details.name}
          className="h-[140px] w-full object-cover"
        />
        <p className="mt-1 text-center text-sm">
          {details.name} ({details.calories} cal)
        </p>
      </a>
    </div>
  );
}
