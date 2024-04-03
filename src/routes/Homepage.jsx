import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Homepage() {
  return (
    <main>
      <DiscoverMeals />
      <Poll />
      <OurServices />
    </main>
  );
}

function DiscoverMeals() {
  return (
    <div className="container">
      <h1 className="mb-4 text-4xl font-semibold uppercase text-primary-dark">
        Discover Meals
      </h1>
      <MealEntry
        id={1}
        title="Peanut Butter Smoothie"
        image="http://localhost:8001/assets/image/peanut_butter.jpg"
      />
    </div>
  );
}

function MealEntry({ id, name, image }) {
  return (
    <Link className="flex h-[300px] w-[250px] flex-col" to={`/meals/${id}`}>
      <img src={image} className="w-full flex-grow object-contain" />
      <p className="mb-2 text-center text-2xl">{name}</p>
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
