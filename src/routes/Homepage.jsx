import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useUser } from "../hooks/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { SlCalender } from "react-icons/sl";
import { FaUserClock } from "react-icons/fa6";
import { toast } from "react-toastify";
import TextInput from "../components/TextInput";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const weekDaysShort = ["sun", "mon", "tue", "wed", "thru", "fri", "sat"];

export default function Homepage() {
  return (
    <main>
      <UserMealPlan />
      <Reminders />
      <DiscoverMeals />
      <Poll />
      <OurServices />
    </main>
  );
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

function UserMealPlan() {
  const { data: user } = useUser();

  const { data, isFetching } = useUserMealPlan();

  const { data: isVerifiedData, isFetching: isVerifiedIsFetching } = useQuery({
    queryKey: ["user-is-verified", user?.id],
    queryFn: () =>
      $axios
        .get("/user/is-verified")
        .then((res) => res.data)
        .catch(() => null),
  });

  if (!user) {
    return null;
  }

  if (isFetching || isVerifiedIsFetching) {
    return <LoadingIndicator hideLabel />;
  }

  if (!isVerifiedData.is_verified) {
    return <PhoneVerification phone={user.phone} />;
  }

  if (!data) {
    return (
      <div className="mb-8 text-center">
        <p className="mb-1 text-3xl">
          You have not generated your meal plan yet!
        </p>
        <p>
          Tell us about yourself and your goal, layback and we will do the rest
          of the heavy lifting for you!
        </p>
        <Link to="/user/meal-plan-form">
          <Button className="mx-auto mt-3">Generate your own meal plan</Button>
        </Link>
      </div>
    );
  }

  const todayEntry = data.plan.find((d) => d.day == dayjs().day() + 1);

  return (
    <div className="container mb-5">
      <h1 className="text-4xl font-semibold uppercase text-primary-dark">
        Your today{`'`}s meal plan
      </h1>
      <div className="p-2 pb-0">
        <p className="text-gray-700">{weekDays[dayjs().day()]}</p>
        <p className="text-gray-700">Total calories: {todayEntry.calories}</p>
        <div className="mt-4 grid grid-cols-4 gap-8">
          <MealPlanEntry details={todayEntry.meals["breakfast"]} />
          <MealPlanEntry details={todayEntry.meals["snack"]} />
          <MealPlanEntry details={todayEntry.meals["lunch"]} />
          <MealPlanEntry details={todayEntry.meals["dinner"]} />
        </div>
      </div>
      <Link className="ml-auto mt-4 block w-max" to="/user">
        <Button>
          <SlCalender className="mr-3 inline" /> View all week plan
        </Button>
      </Link>
    </div>
  );
}

function PhoneVerification({ phone }) {
  const queryClient = useQueryClient();

  const {
    mutate: sendOTP,
    isPending: isSendingOTP,
    isSuccess: hasSentOTP,
  } = useMutation({
    mutationKey: ["send-otp", phone],
    mutationFn: () => $axios.post("/user/send-otp"),
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong!");
    },
  });
  const { mutate: verifyOTP, isPending: isVerifyingOTP } = useMutation({
    mutationKey: ["verify-otp", phone],
    mutationFn: (values) => $axios.post("/user/verify-account", values),
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong!");
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["user-is-verified"],
      });
      queryClient.refetchQueries({
        queryKey: ["user-meal-plan"],
      });
      toast.success("Your account has been verified!");
    },
  });

  return (
    <div className="mb-8 text-center">
      <p className="mb-1 text-3xl">You are not verified yet!</p>
      <p>
        Your mobile number should be verified before you can generate your meal
        plan and set reminders
      </p>
      {!hasSentOTP ? (
        <Button
          className="mx-auto mt-3"
          onClick={() => sendOTP()}
          loading={isSendingOTP}
        >
          Send a verification code to {phone}
        </Button>
      ) : (
        <form
          className="mt-4 flex flex-col items-center justify-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const otp = e.target.elements.otp.value;
            verifyOTP({ otp });
          }}
        >
          <TextInput
            id="otp"
            label="Enter the OTP you received"
            autoFocus
            className="w-[110px] text-center"
            rootClassName="justify-center items-center"
          />
          <Button loading={isVerifyingOTP}>Verify</Button>
        </form>
      )}
    </div>
  );
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

function Reminders() {
  const { data: user } = useUser();

  const { data } = useQuery({
    queryKey: ["user-reminders", user?.id],
    queryFn: () =>
      $axios
        .get("/user/reminders")
        .then((res) => res.data)
        .catch(() => null),
  });

  const { data: userMealPlan } = useUserMealPlan();

  const pendingReminders = useMemo(() => {
    if (!data) {
      return null;
    }

    const result = { water: [], workout: null };

    // Check if upcoming water reminders
    for (let i = 1; i <= 7; i++) {
      const waterEntry = data.reminders[`water_0${i}`];
      if (waterEntry != "" && dayjs().isBefore(dayjs(waterEntry, "hh:mm a"))) {
        result.water.push(waterEntry);
      }
    }

    // Check if workout reminder is yet to come
    const todayWorkoutTime =
      data.reminders[`workout_${weekDaysShort[dayjs().day()]}`];
    if (
      todayWorkoutTime != "" &&
      dayjs().isBefore(dayjs(todayWorkoutTime, "hh:mm a"))
    ) {
      result.workout = todayWorkoutTime;
    }

    return result;
  }, [data]);

  if (!userMealPlan) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (!data) {
    return (
      <div className="mb-16 mt-8 text-center">
        <p className="mb-1 text-3xl">
          You have not created your daily reminders yet!
        </p>
        <p>
          Keep Your Health & Wellness Goals in Check with Personalized
          Reminders! 🌟
        </p>
        <Link to="/user/reminders">
          <Button className="mx-auto mt-3">Create daily reminders</Button>
        </Link>
      </div>
    );
  }

  // const todayEntry = data.plan.find((d) => d.day == dayjs().day() + 1);

  return (
    <div className="container mb-5">
      <h1 className="mb-8 text-4xl font-semibold uppercase text-primary-dark">
        Your today{`'`}s reminders
      </h1>
      <div className="p-2 pb-0">
        {pendingReminders.water.length == 0 && !pendingReminders.workout && (
          <p className="my-5 text-center text-2xl">
            No reminders left for today!
          </p>
        )}
        <div className="flex justify-center gap-48">
          {/* Water reminders */}
          {pendingReminders.water.length > 0 && (
            <div className="flex flex-col justify-start gap-4">
              <p className="text-center text-5xl font-semibold text-primary">
                Water
              </p>
              <img
                src="/vector-graphics/water-glass.avif"
                className="h-[240px] w-auto object-contain"
              />
              <div className="flex flex-col gap-2">
                {pendingReminders.water.map((w) => (
                  <p
                    key={w}
                    className="text-center text-5xl font-bold text-primary"
                  >
                    {w}
                  </p>
                ))}
              </div>
            </div>
          )}
          {/* Workout reminder */}
          {pendingReminders.workout && (
            <div className="flex flex-col justify-start gap-4">
              <p className="text-center text-5xl font-semibold text-primary">
                Workout
              </p>
              <img
                src="/vector-graphics/workout.avif"
                className="h-[240px] w-auto object-contain"
              />
              <p className="text-center text-5xl font-bold text-primary">
                {pendingReminders.workout}
              </p>
            </div>
          )}
        </div>
      </div>
      <Link className="ml-auto mt-4 block w-max" to="/user/reminders">
        <Button>
          <FaUserClock className="mr-3 inline" /> View your reminders
        </Button>
      </Link>
    </div>
  );
}

function DiscoverMeals() {
  const { isLoading, data } = useQuery({
    queryKey: ["discover-meals"],
    queryFn: () => $axios.get("/discover-meals").then((res) => res.data.meals),
  });

  return (
    <div className="container">
      <h1 className="mb-4 text-4xl font-semibold uppercase text-primary-dark">
        Discover Meals
      </h1>
      {isLoading ? (
        <LoadingIndicator hideLabel />
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {data.map((d) => (
            <MealEntry
              key={d.id}
              id={d.id}
              name={d.name}
              image={d.main_image}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MealEntry({ id, name, image }) {
  return (
    <Link className="flex h-[350px] flex-col" to={`/meal/${id}`}>
      <img src={image} className="h-[100px] w-[350px] flex-grow object-cover" />
      <p className="my-4 text-center text-2xl">{name}</p>
      <Button className={"text-center text-white"}>Try now</Button>
    </Link>
  );
}

function Poll() {
  const [selectedHours, setSelectedHours] = useState(null);
  const [showPollResult, setShowPollResult] = useState(false);

  return (
    <div className="mt-16 flex h-[300px] w-full bg-primary">
      <img src="/poll-img.png" className="h-full max-w-[30%] object-cover" />
      <div className="relative flex flex-grow flex-col items-center justify-center gap-4 text-gray-100">
        <p className="text-6xl font-bold uppercase">Poll</p>
        <p className="text-center text-3xl font-bold">
          How many hours on average do you sleep a night?
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button
            color="white"
            className="text-xl font-semibold"
            onClick={() => {
              setShowPollResult(true);
              setSelectedHours(0);
            }}
          >
            4-6 hrs
          </Button>
          <Button
            color="white"
            className="text-xl font-semibold"
            onClick={() => {
              setShowPollResult(true);
              setSelectedHours(1);
            }}
          >
            6-8 hrs
          </Button>
          <Button
            color="white"
            className="text-xl font-semibold"
            onClick={() => {
              setShowPollResult(true);
              setSelectedHours(2);
            }}
          >
            8-10 hrs
          </Button>
        </div>

        {/* Poll result modal */}
        <div
          className={twMerge(
            "pointer-events-none absolute flex h-full w-full flex-col items-center justify-center gap-5 rounded-lg bg-[#A6CC98] bg-opacity-20 p-10 font-semibold opacity-0 backdrop-blur-md transition-opacity duration-300",
            showPollResult && "pointer-events-auto opacity-100",
          )}
        >
          <p
            className="text-4xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
"
          >
            {selectedHours == 0 && "You need to sleep more"}
            {selectedHours == 1 && "Your sleeping habit is good"}
            {selectedHours == 2 && "You are having best sleep"}
          </p>
          <Button color="white" onClick={() => setShowPollResult(false)}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

function OurServices() {
  return (
    <div className="container mt-8">
      <h1 className="mb-4 text-4xl font-semibold uppercase text-primary-dark">
        Our Services
      </h1>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <ServiceEntry
          image="/homepage/customizemeal.png"
          title="Customized Meals"
          description="Personalize your meal plans to fit your taste preferences, dietary restrictions, and nutritional goals."
        />
        <ServiceEntry
          image="/homepage/clock.png"
          title="Reminder System"
          description="Stay on track with your health and wellness goals using our built-in reminder system."
        />
        <ServiceEntry
          image="/homepage/recipes.png"
          title="Recipes Generation"
          description="Explore our extensive database of delicious and nutritious recipes tailored to your tastes and dietary needs."
        />
      </div>
      <FAQ />
    </div>
  );
}

function ServiceEntry({ image, title, description }) {
  return (
    <div className="border-b-[5px] border-b-transparent p-5 transition-all hover:border-b-primary hover:shadow-[1px_1px_5px_black]">
      <img
        src={image}
        className="mx-auto mb-8 h-[150px] w-auto object-contain"
      />
      <p className="mb-4 text-center text-3xl font-medium text-primary-dark">
        {title}
      </p>
      <p className="text-center text-2xl font-light text-primary-dark">
        {description}
      </p>
    </div>
  );
}

function FAQ() {
  useEffect(() => {
    function toggleAccordion() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }

    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", toggleAccordion);
    }

    return () => {
      for (let i = 0; i < acc.length; i++) {
        acc[i].removeEventListener("click", toggleAccordion);
      }
    };
  }, []);

  return (
    <div className="container py-7">
      <div>
        <h1 className="mb-6 text-4xl font-bold text-primary-dark">Frequently Asked Questions</h1>

        <button className="accordion">
          What are the requirements to generate my meal plan?
        </button>
        <div className="panel">
          <p>
            An account with registered mobile number is all you need to generate
            your meal plan.
          </p>
        </div>

        <button className="accordion">
          Why do you require the mobile number verification and can I avoid it?
        </button>
        <div className="panel">
          <p>
            We strictly require all our users to verify their identity with
            mobile number verification to avoid spams and unwanted loads to our
            server.
          </p>
          <p className="mt-2">
            No! You cannot avoid the mobile number verification.
          </p>
        </div>

        <button className="accordion">
          I have generated my meal plan but I do not like my current plan. What
          are my options?
        </button>
        <div className="panel">
          <p>
            Visit your profile page and go to the &quot;Meal Plan&quot; menu.
            Scroll to the bottom then you can either change your generation
            settings or regenerate the plan using your current settings.
          </p>
        </div>

        <button className="accordion">
          How does the reminders system work?
        </button>
        <div className="panel">
          <p>
            Visit your profile page and go to the &quot;Reminders&quot; menu.
            Here you can setup your reminder settings. You will be notified of
            the reminders through the SMS on your registered mobile number.
          </p>
        </div>

        <button className="accordion">
          Will I be billed for the reminders system?
        </button>
        <div className="panel">
          <p>No. For now our reminder system is free of cost.</p>
        </div>
      </div>
    </div>
  );
}
