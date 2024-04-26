import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import { useUser } from "../../hooks/auth";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function UserFavouritesPage() {
  const { data: user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["favourite-meals", user.id],
    queryFn: () =>
      $axios
        .get(`/user/favourite-meal`)
        .then((res) => res.data.favMeals)
        .catch(() => null),
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-8">Your favourite meals</h1>

      {data.length == 0 && <p>No meals added to favourite yet.</p>}

      <div className="grid grid-cols-4 gap-8">
        {data.map((m) => (
          <MealEntry key={m} id={m.id} name={m.name} image={m.main_image} />
        ))}
      </div>
    </div>
  );
}

function MealEntry({ id, name, image }) {
  return (
    <Link to={`/meal/${id}`} className="hover:underline">
      <div className="flex h-[300px] w-[200px] flex-col" to={`/meals/${id}`}>
        <img src={image} className="h-[250px] w-[200px] object-cover" />
        <p className="my-4 text-center">{name}</p>
      </div>
    </Link>
  );
}
