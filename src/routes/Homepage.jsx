import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useUser } from "../hooks/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import dayjs from "dayjs";
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

  const data = null;

  const { data: userMealPlan } = useUserMealPlan();
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
        <Link to="/user/meal-plan-form">
          <Button className="mx-auto mt-3">Create daily reminders</Button>
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
      <Link className="ml-auto block w-max" to="/user/reminders">
        <Button>
          <FaUserClock className="mr-3 inline" /> View all reminders
        </Button>
      </Link>
    </div>
  );
}

function DiscoverMeals() {
  return (
    <div className="container">
      <h1 className="mb-4 text-4xl font-semibold uppercase text-primary-dark">
        Discover Meals
      </h1>
      <div className="flex gap-5">
        <MealEntry
          id={1}
          name="Peanut Butter Smoothie"
          image="/temp/peanut_butter.jpg"
        />
        <MealEntry id={2} name="Spring Roll" image="/temp/spring_roll.jpeg" />
        <MealEntry
          id={3}
          name="Quinoa Salad"
          image="/temp/quenioa_salad.jpeg"
        />
        <MealEntry
          id={4}
          name="Asian Noodles"
          image="/temp/asian_noodles.PNG"
        />
      </div>
    </div>
  );
}

function MealEntry({ id, name, image }) {
  return (
    <Link className="flex h-[350px] w-[350px] flex-col" to={`/meals/${id}`}>
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
