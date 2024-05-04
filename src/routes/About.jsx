export default function About() {
  return (
    <div className="container flex-grow py-5">
      <div className="flex items-center justify-between gap-12 py-8">
        <div className="text-justify">
          <h1 className="mb-6 text-5xl font-semibold text-primary-dark">
            About MealMate
          </h1>
          <p>
            The “Meal Mate- Your Personalized Meal Planner” project is aimed at
            promoting healthy eating habits of a user with their personalized
            meal plans. This system will allow people who can’t cook to eat
            delicious meals. This system will provide a step-by-step cooking
            method, list all the ingredients required, and also provides all the
            nutritional values of that particular meal.
          </p>
          <p className="mt-4">
            We now need contemporary technology geared at easier menu
            preparation and a healthier lifestyle in the context of our hectic
            way of life and changing dietary preferences. As more individuals’
            desire individualized nutrition, the merging of technology, cooking
            abilities, and community interaction for a digital platform becomes
            critical.
          </p>
        </div>
        <img
          src="/healthy-food.jpg"
          alt="Meal Mate"
          className="h-auto w-[500px] object-contain"
        />
      </div>
    </div>
  );
}
