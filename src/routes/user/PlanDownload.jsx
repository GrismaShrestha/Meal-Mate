import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useUser } from "../../hooks/auth";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function useUserMealPlan() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ["user-meal-plan", user?.id],
    queryFn: () =>
      $axios
        .get("/user/meal-plan")
        .then((res) => res.data.plan)
        .catch(() => null),
  });
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export default function DownloadPlan() {
  const { data, isLoading } = useUserMealPlan();

  useEffect(() => {
    waitForElm("#output").then(() => {
      window.print();
    });
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div
      className="m-8 flex flex-col items-center justify-center gap-8"
      id="output"
    >
      <div className="text-center">
        <p className="text-center text-4xl font-bold">Your Weekly Meal Plan</p>
        <img
          src="/site-logo-2.png"
          alt="Meal Mate"
          className="mx-auto h-auto w-[150px] object-contain"
        />
        <p>Generated on {dayjs().format("YYYY/MM/DD")}</p>
      </div>
      <table className="bg-white shadow-lg">
        <tr>
          <th className="border px-8 py-4 text-left">Day</th>
          <th className="border px-8 py-4 text-left">Meal</th>
        </tr>
        {weekDays.map((d, i) => (
          <tr key={d}>
            <td className="border px-8 py-4 font-bold">{d}</td>
            <td className="flex flex-col gap-4 border px-8 py-4">
              {Object.entries(data.filter((d) => d.day == i + 1)[0].meals).map(
                ([meal, details]) => (
                  <div key={meal}>
                    <p className="font-semibold capitalize">{meal}</p>
                    <ul>
                      <li>{details.name}</li>
                    </ul>
                  </div>
                ),
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
